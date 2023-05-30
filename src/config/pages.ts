import { lazy } from 'react';

import ui from './ui';

const Leaderboard = lazy(() => import('pages/Leaderboard'));
const pages = {
  profile: {
    pathname: '/user/:address',
    Component: lazy(() => import('pages/Profile')),
    exact: false,
    navigation: false,
    name: '',
    meta: null,
    enabled: true
  },
  club: {
    pathname: '/clubs/:slug',
    Component: Leaderboard,
    exact: false,
    navigation: false,
    name: '',
    meta: null,
    enabled: ui.clubs.enabled
  },
  clubs: {
    pathname: '/clubs',
    Component: lazy(() => import('pages/Clubs')),
    exact: true,
    navigation: true,
    name: 'Clubs',
    meta: null,
    enabled: ui.clubs.enabled
  },
  leaderboard: {
    pathname: '/leaderboard',
    Component: Leaderboard,
    exact: false,
    navigation: true,
    name: 'Leaderboard',
    meta: null,
    enabled: true
  },
  achievements: {
    pathname: '/achievements',
    Component: lazy(() => import('pages/Achievements')),
    exact: false,
    navigation: true,
    name: 'Achievements',
    meta: null,
    enabled: ui.achievements.enabled
  },
  portfolio: {
    pathname: '/portfolio',
    Component: lazy(() => import('pages/Portfolio')),
    exact: false,
    navigation: true,
    name: 'Portfolio',
    meta: null,
    enabled: true
  },
  home: {
    pathname: '/',
    Component: lazy(() => import('pages/Home')),
    exact: false,
    navigation: true,
    name: 'Markets',
    meta: null,
    enabled: true,
    pages: {
      create: {
        pathname: '/markets/create',
        Component: lazy(() => import('pages/CreateMarket')),
        exact: false,
        navigation: false,
        name: '',
        meta: null,
        enabled: true
      },
      market: {
        pathname: '/markets/:marketId',
        Component: lazy(() => import('pages/Market')),
        exact: false,
        navigation: false,
        name: '',
        meta: null,
        enabled: true
      }
    }
  }
} as const;

export default pages;
