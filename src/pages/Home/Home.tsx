import { Tabs, MarketList } from 'components';

import HomeCategories from './HomeCategories';
import HomeMobileInfo from './HomeMobileInfo';

function Home() {
  return (
    <div className="pm-home">
      <div className="pm-home__content">
        <HomeMobileInfo />
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
            <MarketList />
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
