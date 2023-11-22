import { useEffect, useState } from 'react';

import { features, ui } from 'config';
import { changeOutcomeData, changeData } from 'redux/ducks/market';
import { changeMarketOutcomeData, changeMarketData } from 'redux/ducks/markets';
import { login, fetchAditionalData } from 'redux/ducks/polkamarkets';
import { PolkamarketsService, PolkamarketsApiService } from 'services';

import TWarningIcon from 'assets/icons/TWarningIcon';

import { AlertMinimal } from 'components/Alert';
import ProfileSignin from 'components/ProfileSignin';

import {
  useAppDispatch,
  useAppSelector,
  useERC20Balance,
  useFantasyTokenTicker,
  useNetwork,
  usePolkamarketsService,
  useTrade
} from 'hooks';

import ApproveToken from '../ApproveToken';
import { ButtonLoading } from '../Button';
import NetworkSwitch from '../Networks/NetworkSwitch';
import Text from '../Text';

type TradeActionsProps = {
  onTradeFinished: () => void;
};

function TradeActions({ onTradeFinished }: TradeActionsProps) {
  // Helpers
  const dispatch = useAppDispatch();
  const { network, networkConfig } = useNetwork();
  const polkamarketsService = usePolkamarketsService();
  const fantasyTokenTicker = useFantasyTokenTicker();
  const { status, set: setTrade, reset: resetTrade } = useTrade();

  // Market selectors
  const type = useAppSelector(state => state.trade.type);
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const wrapped = useAppSelector(state => state.trade.wrapped);
  const marketId = useAppSelector(state => state.trade.selectedMarketId);
  const marketNetworkId = useAppSelector(
    state => state.market.market.networkId
  );
  const marketSlug = useAppSelector(state => state.market.market.slug);
  const predictionId = useAppSelector(state => state.trade.selectedOutcomeId);
  const { amount, shares, totalStake, fee } = useAppSelector(
    state => state.trade
  );
  const maxAmount = useAppSelector(state => state.trade.maxAmount);
  const ethAddress = useAppSelector(state => state.polkamarkets.ethAddress);
  const token = useAppSelector(state => state.market.market.token);
  const { wrapped: tokenWrapped, address } = token;

  const { balance: erc20Balance } = useERC20Balance(address);
  const ethBalance = useAppSelector(state => state.polkamarkets.ethBalance);

  const balance = wrapped || !tokenWrapped ? erc20Balance : ethBalance;

  // Derivated state
  const isWrongNetwork =
    !ui.socialLogin.enabled && network.id !== `${marketNetworkId}`;

  // Local state
  const [isLoading, setIsLoading] = useState(false);

  const [needsPricesRefresh, setNeedsPricesRefresh] = useState(false);
  const { refreshBalance } = useERC20Balance(address);

  async function reloadMarketPrices() {
    const marketData = await new PolkamarketsService(
      networkConfig
    ).getMarketData(marketId);

    marketData.outcomes.forEach((outcomeData, outcomeId) => {
      const data = { price: outcomeData.price, shares: outcomeData.shares };

      // updating both market/markets redux
      dispatch(changeMarketOutcomeData({ marketId, outcomeId, data }));
      dispatch(changeOutcomeData({ outcomeId, data }));
      dispatch(
        changeMarketData({
          marketId,
          data: { liquidity: marketData.liquidity }
        })
      );
      dispatch(changeData({ data: { liquidity: marketData.liquidity } }));
    });
  }

  useEffect(() => {
    setNeedsPricesRefresh(false);
  }, [type]);

  async function handlePricesRefresh() {
    setIsLoading(true);
    await reloadMarketPrices();
    setIsLoading(false);
    setNeedsPricesRefresh(false);
  }

  async function updateWallet() {
    await dispatch(login(polkamarketsService));
    await dispatch(fetchAditionalData(polkamarketsService));
  }

  async function handleBuy() {
    setTrade({
      type: 'buy',
      status: 'pending',
      trade: {
        market: marketId,
        outcome: predictionId,
        network: marketNetworkId,
        location: window.location.pathname
      }
    });
    setIsLoading(true);
    setNeedsPricesRefresh(false);

    try {
      // adding a 1% slippage due to js floating numbers rounding
      const minShares = shares * 0.999;

      // calculating shares amount from smart contract
      const sharesToBuy = await polkamarketsService.calcBuyAmount(
        marketId,
        predictionId,
        amount
      );

      // will refresh form if there's a slippage > 1%
      if (Math.abs(sharesToBuy - minShares) / sharesToBuy > 0.01) {
        setIsLoading(false);
        setNeedsPricesRefresh(true);

        return false;
      }

      setTimeout(() => {
        if (!needsPricesRefresh) {
          // Dispatch data to Redux

          setIsLoading(false);
          onTradeFinished();
          setTrade({ status: 'success' });
        }
      }, 300);

      // performing buy action on smart contract
      await polkamarketsService.buy(
        marketId,
        predictionId,
        amount,
        minShares,
        tokenWrapped && !wrapped
      );

      // triggering market prices redux update
      reloadMarketPrices();

      // triggering cache reload action on api
      new PolkamarketsApiService().reloadMarket(marketSlug);
      new PolkamarketsApiService().reloadPortfolio(ethAddress, network.id);

      // updating wallet
      await updateWallet();
      await refreshBalance();
      resetTrade();
    } catch (error) {
      // setIsLoading(false);
    }

    return true;
  }

  async function handleSell() {
    setTrade({
      type: 'sell',
      status: 'pending',
      trade: {
        market: marketId,
        outcome: predictionId,
        network: marketNetworkId,
        location: window.location.pathname
      }
    });
    setIsLoading(true);
    setNeedsPricesRefresh(false);

    try {
      // adding a 1% slippage due to js floating numbers rounding
      const ethAmount = totalStake - fee;
      const minShares = shares * 1.001;

      // calculating shares amount from smart contract
      const sharesToSell = await polkamarketsService.calcSellAmount(
        marketId,
        predictionId,
        ethAmount
      );

      // will refresh form if there's a slippage > 2%
      if (Math.abs(sharesToSell - minShares) / sharesToSell > 0.01) {
        setIsLoading(false);
        setNeedsPricesRefresh(true);

        return false;
      }

      setTimeout(() => {
        if (!needsPricesRefresh) {
          // Dispatch data to Redux

          setIsLoading(false);
          onTradeFinished();
          setTrade({ status: 'success' });
        }
      }, 300);

      // performing sell action on smart contract
      await polkamarketsService.sell(
        marketId,
        predictionId,
        ethAmount,
        minShares,
        tokenWrapped && !wrapped
      );

      // triggering market prices redux update
      reloadMarketPrices();

      // triggering cache reload action on api
      new PolkamarketsApiService().reloadMarket(marketSlug);
      new PolkamarketsApiService().reloadPortfolio(ethAddress, network.id);

      // updating wallet
      await updateWallet();
      await refreshBalance();
      resetTrade();
    } catch (error) {
      // setIsLoading(false);
    }

    return true;
  }

  async function handleLoginToPredict() {
    try {
      const persistIds = {
        market: marketId,
        network: marketNetworkId,
        outcome: predictionId
      };

      localStorage.setItem('SELECTED_OUTCOME', JSON.stringify(persistIds));
    } catch (error) {
      // unsupported
    }
  }

  const isValidAmount = amount > 0 && amount <= maxAmount;

  const preventBankruptcy = features.fantasy.enabled && ui.socialLogin.enabled;

  const amountOverHalfBalance = amount >= balance / 2;

  return (
    <div className="pm-c-trade-form-actions__group--column">
      <div className="pm-c-trade-form-actions">
        {isWrongNetwork ? <NetworkSwitch /> : null}
        {needsPricesRefresh && !isWrongNetwork ? (
          <div className="pm-c-trade-form-actions__group--column">
            <ButtonLoading
              color="default"
              fullwidth
              onClick={handlePricesRefresh}
              disabled={!isValidAmount || isLoading}
              loading={isLoading}
            >
              Refresh Prices
            </ButtonLoading>
            <Text
              as="small"
              scale="caption"
              fontWeight="semibold"
              style={{
                display: 'inline-flex',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
              color="gray"
            >
              <TWarningIcon
                style={{
                  height: '1.6rem',
                  width: '1.6rem',
                  marginRight: '0.5rem'
                }}
              />
              Price has updated
            </Text>
          </div>
        ) : null}
        <div className="flex-column gap-4 width-full">
          {status === 'error' ? (
            <AlertMinimal
              variant="danger"
              description="Something went wrong. Please try again."
            />
          ) : null}
          {type === 'buy' && !needsPricesRefresh && !isWrongNetwork ? (
            <div className="flex-column gap-6 width-full">
              {isValidAmount && preventBankruptcy && amountOverHalfBalance ? (
                <AlertMinimal
                  variant="warning"
                  description={`Do you really want to place all this ${fantasyTokenTicker} in this prediction? Distribute your ${fantasyTokenTicker} by other questions in order to minimize bankruptcy risk.`}
                />
              ) : null}
              {!features.fantasy.enabled || isLoggedIn ? (
                <ApproveToken
                  fullwidth
                  address={token.address}
                  ticker={token.ticker}
                  wrapped={token.wrapped && !wrapped}
                >
                  <ButtonLoading
                    color="primary"
                    fullwidth
                    onClick={handleBuy}
                    disabled={!isValidAmount || isLoading}
                    loading={isLoading}
                  >
                    Predict
                  </ButtonLoading>
                </ApproveToken>
              ) : (
                <ProfileSignin
                  fullwidth
                  size="normal"
                  color="primary"
                  onClick={handleLoginToPredict}
                >
                  Login to Predict
                </ProfileSignin>
              )}
            </div>
          ) : null}
          {type === 'sell' && !needsPricesRefresh && !isWrongNetwork ? (
            <ButtonLoading
              color="danger"
              fullwidth
              onClick={handleSell}
              disabled={!isValidAmount || isLoading}
              loading={isLoading}
            >
              Sell
            </ButtonLoading>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TradeActions;
