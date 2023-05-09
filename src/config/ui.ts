import intersection from 'lodash/intersection';

import {
  leaderboardColumns,
  defaultLeaderboardColumns
} from 'pages/Leaderboard/Leaderboard.util';

import environment from './environment';
import features from './features';

const ui = {
  layout: {
    header: {
      networkSelector: {
        enabled: features.regular.enabled
      }
    },
    disclaimer: {
      enabled: features.regular.enabled
    }
  },
  hero: {
    enabled: [
      environment.UI_HERO_IMAGE,
      environment.UI_HERO_HEADER,
      environment.UI_HERO_TITLE,
      environment.UI_HERO_ACTION_TITLE,
      environment.UI_HERO_ACTION_URL
    ].every(Boolean),
    image: environment.UI_HERO_IMAGE,
    header: environment.UI_HERO_HEADER,
    title: environment.UI_HERO_TITLE,
    action: {
      title: environment.UI_HERO_ACTION_TITLE,
      url: environment.UI_HERO_ACTION_URL
    }
  },
  tradeForm: {
    liquidity: {
      enabled: features.regular.enabled
    }
  },
  reportForm: {
    enabled: features.regular.enabled
  },
  leaderboard: {
    columns: intersection(
      environment.UI_LEADERBOARD_COLUMNS?.split(',') ||
        defaultLeaderboardColumns,
      leaderboardColumns
    )
  },
  clubs: {
    enabled: features.fantasy.enabled
  },
  profile: {
    summary: {
      liquidityProvided: {
        enabled: features.regular.enabled
      }
    }
  },
  portfolio: {
    analytics: {
      liquidityProvided: {
        enabled: features.regular.enabled
      },
      liquidityFeesEarned: {
        enabled: features.regular.enabled
      }
    },
    tabs: {
      liquidityPositions: {
        enabled: features.regular.enabled
      },
      reportPositions: {
        enabled: features.regular.enabled
      }
    }
  }
} as const;

export default ui;
