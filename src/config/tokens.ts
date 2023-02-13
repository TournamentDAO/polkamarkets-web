import type { Token } from 'types/token';

const USDT: Token = {
  name: 'Tether',
  ticker: 'USDT',
  symbol: 'USDT',
  iconName: 'Tether',
  addresses: {
    Moonriver: '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
    Moonbeam: '0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73',
    Goerli: '0xe802376580c10fe23f027e1e19ed9d54d4c9311e',
    Polygon: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
  }
};

const USDC: Token = {
  name: 'USD Coin',
  ticker: 'USDC',
  symbol: 'USDC',
  iconName: 'USDCoin',
  addresses: {
    Moonriver: '0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d',
    Moonbeam: '0x8f552a71efe5eefc207bf75485b356a0b3f01ec9',
    Goerli: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    Polygon: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
  }
};

const POLK: Token = {
  name: 'Polkamarkets',
  ticker: 'POLK',
  symbol: 'POLK',
  iconName: 'Polk',
  addresses: {
    Moonriver: '0x8b29344f368b5fa35595325903fe0eaab70c8e1f',
    Moonbeam: '0x8b29344f368b5fa35595325903fe0eaab70c8e1f',
    Goerli: '0xd9983addca0e51400c50cba7658847ac3a42f026'
  }
};

export default { USDT, USDC, POLK };
