import { useMemo, useState } from 'react';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

import { features } from 'config';
import { roundNumber } from 'helpers/math';
import sortOutcomes from 'helpers/sortOutcomes';
import maxBy from 'lodash/maxBy';
import remove from 'lodash/remove';
import { useTheme } from 'ui';

import { ChartHeader, LineChart, Text } from 'components';

import { useAppSelector } from 'hooks';

const intervals = [
  { id: '24h', name: '24H', value: 24 },
  { id: '7d', name: '7D', value: 168 },
  { id: '30d', name: '30D', value: 720 },
  { id: 'all', name: 'ALL', value: 1440 }
];

function MarketOverview() {
  const outcomes = useAppSelector(state => state.market.market.outcomes);
  const ticker = useAppSelector(state => state.market.market.token.ticker);

  const [currentInterval, setCurrentInterval] = useState(
    intervals[intervals.length - 1]
  );

  const [highOutcome, ...restOutcomes] = useMemo(() => {
    const sortedOutcomes = sortOutcomes({
      outcomes,
      timeframe: currentInterval.id
    });

    const highestPriceOutcome = maxBy(sortedOutcomes, 'price');

    if (highestPriceOutcome) {
      remove(sortedOutcomes, item => item === highestPriceOutcome);

      sortedOutcomes.unshift(highestPriceOutcome);
    }

    return sortedOutcomes;
  }, [outcomes, currentInterval]);

  return (
    <>
      <div className="market-chart__header">
        <div>
          <Text
            scale="body"
            fontWeight="semibold"
            className="market-chart__view-title"
          >
            {highOutcome.title.toUpperCase()}
          </Text>
          <Text
            color="light-gray"
            scale="heading"
            fontWeight="semibold"
            className="notranslate"
          >
            {features.fantasy.enabled ? (
              <>{roundNumber(highOutcome.price * 100, 3)}%</>
            ) : (
              <>
                {highOutcome.price} {ticker}
              </>
            )}
          </Text>
          <Text
            as="span"
            scale="tiny-uppercase"
            color={highOutcome.isPriceUp ? 'success' : 'danger'}
            fontWeight="semibold"
            className="notranslate"
          >
            {features.fantasy.enabled ? (
              <>{highOutcome.pricesDiff.pct}</>
            ) : (
              <>
                {highOutcome.pricesDiff.value} {ticker} (
                {highOutcome.pricesDiff.pct})
              </>
            )}
          </Text>{' '}
          <Text as="span" scale="tiny" color="gray" fontWeight="semibold">
            Since Market Creation
          </Text>
        </div>
        <div className="market-chart__header-actions">
          <ChartHeader
            intervals={intervals}
            currentInterval={currentInterval}
            onChangeInterval={setCurrentInterval}
          />
        </div>
      </div>
      <LineChart
        series={[highOutcome, ...restOutcomes]}
        ticker={ticker}
        height={332}
      />
    </>
  );
}
export default function MarketChart() {
  const theme = useTheme();
  const chartViewType = useAppSelector(state => state.market.chartViewType);
  const tradingViewSymbol = useAppSelector(
    state => state.market.market.tradingViewSymbol
  );

  return (
    <div className="market-chart__view">
      {
        {
          marketOverview: <MarketOverview />,
          tradingView: tradingViewSymbol ? (
            <TradingViewWidget
              theme={Themes[theme.device.mode.toUpperCase()]}
              width="100%"
              height={454}
              symbol={tradingViewSymbol}
            />
          ) : null
        }[chartViewType]
      }
    </div>
  );
}
