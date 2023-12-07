import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames';
import { ui } from 'config';
import { Tournament } from 'types/tournament';
import { Avatar, Container, Hero } from 'ui';

import { Button, ButtonText, Icon, Share } from 'components';

import { useTruncatedText } from 'hooks';

import styles from './TournamentHero.module.scss';

type TournamentHeroProps = {
  landName?: string;
  landSlug?: string;
  landImageUrl?: string | null;
  landBannerUrl?: string | null;
  tournamentName?: string;
  tournamentDescription?: string;
  tournamentSlug?: string;
  tournamentImageUrl?: string | null;
  topUsers?: ReactNode;
  questions: number;
  members?: number;
  rewards?: Tournament['rewards'];
  criteria?: 'Won predictions' | 'Earnings';
  rules?: Tournament['rules'];
};

export default function TournamentHero({
  landName,
  landSlug,
  landImageUrl,
  landBannerUrl,
  tournamentName,
  tournamentDescription,
  tournamentSlug,
  tournamentImageUrl,
  topUsers,
  questions,
  members,
  rewards,
  criteria,
  rules
}: TournamentHeroProps) {
  const {
    text: truncatedTournamentDescription,
    truncated,
    setTruncated
  } = useTruncatedText(tournamentDescription || '', 156);

  return (
    <Container className={styles.wrapper}>
      <div className={styles.root}>
        <div className={styles.rootHeader}>
          <div className={styles.rootHeaderNavigation}>
            <Link to={landSlug ? `/lands/${landSlug}` : '/tournaments'}>
              <Button className={styles.rootHeaderNavigationButton}>
                <Icon name="Arrow" title="Back to land" />
              </Button>
            </Link>
            {landName ? (
              <h4 className={styles.rootHeaderNavigationText}>{landName}</h4>
            ) : null}
          </div>
          <div className={styles.rootHeaderActions}>
            {tournamentSlug ? (
              <Share
                id={tournamentSlug}
                className={styles.rootHeaderActionsButton}
              />
            ) : null}
          </div>
        </div>
        <Hero
          $rounded
          $image={landBannerUrl || ui.hero.image}
          className={`pm-p-home__hero ${styles.rootHero}`}
        >
          {tournamentImageUrl ? (
            <Avatar
              $radius="md"
              src={tournamentImageUrl}
              alt={tournamentName}
              className={styles.rootHeroAvatar}
            />
          ) : null}
          <div className={styles.rootHeroContent}>
            <div>
              <div className={styles.rootHeroContentLand}>
                {landImageUrl ? (
                  <Avatar
                    $radius="lg"
                    src={landImageUrl}
                    alt={landName}
                    className={styles.rootHeroContentLandAvatar}
                  />
                ) : null}
                {landName ? (
                  <h4 className={styles.rootHeroContentLandName}>{landName}</h4>
                ) : null}
              </div>
              {tournamentName ? (
                <h2 className={styles.rootHeroContentName}>{tournamentName}</h2>
              ) : null}
              {tournamentDescription ? (
                <p className={styles.rootHeroContentDescription}>
                  {truncatedTournamentDescription}
                </p>
              ) : null}
              {truncated ? (
                <ButtonText
                  size="sm"
                  color="primary"
                  onClick={() => setTruncated(false)}
                >
                  View more
                </ButtonText>
              ) : null}
            </div>
            {topUsers || null}
          </div>
        </Hero>
        <div className={styles.rootFooter}>
          <div className={styles.rootFooterStats}>
            <span className={styles.rootFooterStatsItem}>
              Questions: <strong>{questions}</strong>
            </span>
            {members ? (
              <>
                <span
                  className={classNames(
                    'pm-c-divider--circle',
                    styles.rootFooterStatsDivider
                  )}
                />
                <span className={styles.rootFooterStatsItem}>
                  Members: <strong>{members}</strong>
                </span>
              </>
            ) : null}
            {rewards ? (
              <>
                <span
                  className={classNames(
                    'pm-c-divider--circle',
                    styles.rootFooterStatsDivider
                  )}
                />
                <span className={styles.rootFooterStatsItem}>
                  Rewards: <strong>{rewards}</strong>
                </span>
              </>
            ) : null}
          </div>
          <div className={styles.rootFooterStats}>
            {criteria ? (
              <span className={styles.rootFooterStatsItem}>
                Criteria: <strong>{criteria}</strong>
              </span>
            ) : null}
            {rules ? (
              <>
                <span
                  className={classNames(
                    'pm-c-divider--circle',
                    styles.rootFooterStatsDivider
                  )}
                />
                <a href={rules} target="_blank" rel="noreferrer">
                  <span className={styles.rootFooterStatsItem}>
                    <Icon
                      name="Todo"
                      className={styles.rootFooterStatsItemIcon}
                    />{' '}
                    <strong>Rules</strong>
                  </span>
                </a>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Container>
  );
}
