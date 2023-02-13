import { Fragment } from 'react';

import { Container, Hero, useMedia } from 'ui';
import Avatar from 'ui/Avatar';

import { VerifiedIcon } from 'assets/icons';

import { Breadcrumb, Text } from 'components';
import MarketFooter from 'components/Market/MarketFooter';
import MarketFooterActions from 'components/Market/MarketFooterActions';

import { useAppSelector } from 'hooks';

import marketClasses from './Market.module.scss';

function MarketHeadWrapper(
  props: React.PropsWithChildren<Record<string, unknown>>
) {
  const imageUrl = useAppSelector(state => state.market.market.imageUrl);
  const avatarColor = useAppSelector(state => state.ui.market.avatar.color);

  return (
    <Hero
      className={marketClasses.hero}
      $image={imageUrl}
      style={{
        // @ts-expect-error No need to assert React.CSSProperties here
        '--linear-gradient':
          avatarColor || localStorage.getItem('MARKET_AVATAR_COLOR')
      }}
      {...props}
    />
  );
}
export default function MarketHead() {
  const market = useAppSelector(state => state.market.market);
  const isDesktop = useMedia('(min-width: 1024px)');
  const MarketHeadWrapperComponent = isDesktop ? MarketHeadWrapper : Fragment;

  return (
    <MarketHeadWrapperComponent>
      <Container $enableGutters={!isDesktop} className={marketClasses.heroInfo}>
        <Avatar
          $size={isDesktop ? 'lg' : 'md'}
          $radius="lg"
          alt="Market"
          src={market.imageUrl}
        />
        <div>
          <div className={marketClasses.heroInfoBreadcrumb}>
            <Breadcrumb>
              <Breadcrumb.Item>{market.category}</Breadcrumb.Item>
              <Breadcrumb.Item>{market.subcategory}</Breadcrumb.Item>
            </Breadcrumb>
            {market.verified && (
              <div className={marketClasses.heroInfoVerified}>
                <VerifiedIcon size="sm" />
                <Text as="span" scale="tiny-uppercase" fontWeight="semibold">
                  Verified
                </Text>
              </div>
            )}
          </div>
          <Text
            as="h2"
            fontWeight={isDesktop ? 'bold' : 'medium'}
            scale={isDesktop ? 'heading-large' : 'body'}
            className={marketClasses.heroInfoTitle}
          >
            {market.title}
          </Text>
        </div>
        {isDesktop && (
          <div className={marketClasses.heroInfoActions}>
            <MarketFooterActions $variant="filled" market={market} />
          </div>
        )}
      </Container>
      {isDesktop && (
        <Container className={marketClasses.heroStats}>
          <MarketFooter market={market} />
        </Container>
      )}
    </MarketHeadWrapperComponent>
  );
}
