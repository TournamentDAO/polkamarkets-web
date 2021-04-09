import { useState, useEffect } from 'react';

import { Tabs, MarketList } from 'components';

import {
  PolkamarketsApiService,
  PolkamarketsApiMappingService
} from '../../services';
import HomeCategories from './HomeCategories';

function Home() {
  const [markets = [], setMarkets] = useState<any[]>();

  const loadMarkets = async () => {
    let apiMarkets = await new PolkamarketsApiService().getMarkets();
    apiMarkets = apiMarkets.map(apiMarket => {
      return PolkamarketsApiMappingService.mapMarket(apiMarket);
    });
    setMarkets(apiMarkets);
  };

  useEffect(() => {
    loadMarkets();
  }, []);

  return (
    <div className="home">
      <div className="home__content">
        <HomeCategories />

        {/* <div className="navigation">
          <div className="filters">
            <Select label="Sort by:" name="Sort by" disabled>
              <option value="Most traded">Most traded</option>
            </Select>
          </div>
        </div> */}

        <Tabs defaultActiveId="open">
          <Tabs.TabPane tab="Open" id="open">
            <MarketList markets={markets} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Favorites" id="favorites" />
          <Tabs.TabPane tab="In-Reporting" id="in-reporting" />
          <Tabs.TabPane tab="Resolved" id="resolved" />
        </Tabs>
      </div>
    </div>
  );
}

Home.displayName = 'Home';

export default Home;
