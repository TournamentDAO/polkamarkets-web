import DayjsUtils from '@date-io/dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Routes from 'routes';

import { SEO } from 'components';

import FavoriteMarketsProvider from 'contexts/favoriteMarkets';

import { usePrevious, useTheme } from 'hooks';

const POLKAMARKETS_DEFAULT_BANNER = `${process.env.PUBLIC_URL}/polkamarkets_meta.jpg`;

const App = () => {
  const { theme } = useTheme();
  const themeCn = `theme--${theme}`;
  const { current: themeCnPrev } = usePrevious(themeCn);

  document.documentElement.dataset.theme = theme;
  if (themeCnPrev && themeCn !== themeCnPrev) {
    document.documentElement.classList.replace(themeCnPrev, themeCn);
  } else {
    document.documentElement.classList.add(themeCn);
  }

  return (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <FavoriteMarketsProvider>
        <SEO
          title="Polkamarkets - Autonomous Prediction Market Protocol"
          description="Polkamarkets is a DeFi-Powered Prediction Market built for cross-chain information exchange, based on Polkadot."
          imageUrl={POLKAMARKETS_DEFAULT_BANNER}
        />
        <Routes />
      </FavoriteMarketsProvider>
    </MuiPickersUtilsProvider>
  );
};

export default App;
