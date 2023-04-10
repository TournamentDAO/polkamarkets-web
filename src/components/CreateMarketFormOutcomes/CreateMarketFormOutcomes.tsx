import { useCallback, useState, Fragment, useMemo, useEffect } from 'react';
import uuid from 'react-uuid';

import cn from 'classnames';
import { useFormikContext, getIn } from 'formik';
import { almost, roundNumber } from 'helpers/math';
import sum from 'lodash/sum';

import { usePrevious } from 'hooks';

import { Button } from '../Button';
import ButtonGroup from '../ButtonGroup';
import Icon from '../Icon';
import { InputErrorMessage, OutcomeInput, ProbabilityInput } from '../Input';
import CreateMarketFormOutcomesClasses from './CreateMarketFormOutcomes.module.scss';
import {
  OutcomeType,
  ProbabilityDistribution
} from './CreateMarketFormOutcomes.type';

function CreateMarketFormOutcomes() {
  const [outcomeType, setOutcomeType] = useState<OutcomeType>('binary');
  const { current: previousOutcomeType } = usePrevious(outcomeType);

  const [probabilityDistribution, setProbabilityDistribution] =
    useState<ProbabilityDistribution>('uniform');

  const { values, setFieldValue } = useFormikContext();
  const outcomes = getIn(values, 'outcomes');

  useEffect(() => {
    if (
      outcomeType === 'binary' &&
      previousOutcomeType === 'multiple' &&
      outcomes.length > 2
    ) {
      setProbabilityDistribution('uniform');
      setFieldValue('outcomes', [
        { id: uuid(), name: 'Yes', probability: 50 },
        { id: uuid(), name: 'No', probability: 50 }
      ]);
    }
  }, [outcomeType, outcomes, previousOutcomeType, setFieldValue]);

  const validProbabilities = useMemo(() => {
    const probabilities = outcomes.map(outcome => outcome.probability);
    const sumOfProbabilities = sum(probabilities);
    return almost(sumOfProbabilities, 100);
  }, [outcomes]);

  const toggleProbabilityDistribution = useCallback(() => {
    if (probabilityDistribution === 'uniform') {
      setProbabilityDistribution('manual');
    } else {
      setProbabilityDistribution('uniform');

      const probability = roundNumber(100 / outcomes.length, 2);

      outcomes.forEach((_outcome, outcomeIndex) => {
        outcomes[outcomeIndex].probability = probability;
      });

      setFieldValue('outcomes', outcomes);
    }
  }, [outcomes, probabilityDistribution, setFieldValue]);

  const handleAddOutcome = useCallback(() => {
    if (probabilityDistribution === 'manual') {
      const newOutcomes = [
        ...outcomes,
        { id: uuid(), name: '', probability: 0.1 }
      ];
      setFieldValue('outcomes', newOutcomes);
    } else {
      const probability = roundNumber(100 / (outcomes.length + 1), 2);

      outcomes.forEach((_outcome, outcomeIndex) => {
        outcomes[outcomeIndex].probability = probability;
      });

      const newOutcomes = [...outcomes, { id: uuid(), name: '', probability }];
      setFieldValue('outcomes', newOutcomes);
    }
  }, [outcomes, probabilityDistribution, setFieldValue]);

  const handleRemoveOutcome = useCallback(
    (outcomeId: number) => {
      const index = outcomes.indexOf(
        outcomes.find(outcome => outcome.id === outcomeId)
      );

      outcomes.splice(index, 1);

      if (probabilityDistribution === 'uniform') {
        const probability = roundNumber(100 / outcomes.length, 2);

        outcomes.forEach((_outcome, outcomeIndex) => {
          outcomes[outcomeIndex].probability = probability;
        });
      }

      const newOutcomes = [...outcomes];

      setFieldValue('outcomes', newOutcomes);
    },
    [outcomes, probabilityDistribution, setFieldValue]
  );

  const hasMoreThanTwoOutcomes = outcomes.length > 2;

  return (
    <div className={CreateMarketFormOutcomesClasses.root}>
      <div className="pm-c-input__group">
        <span className="pm-c-input__label--default">Answer type</span>
        <ButtonGroup
          className={{
            group: CreateMarketFormOutcomesClasses.answerTypeSelector,
            button: CreateMarketFormOutcomesClasses.answerTypeSelectorButton
          }}
          defaultActiveId="binary"
          buttons={[
            { id: 'binary', name: 'Yes / No', color: 'primary' },
            { id: 'multiple', name: 'Multi Choice', color: 'primary' }
          ]}
          onChange={type => setOutcomeType(type as OutcomeType)}
        />
      </div>
      <div>
        <div className={CreateMarketFormOutcomesClasses.header}>
          <span className="pm-c-input__label--default">Outcome</span>
          <span className="pm-c-input__label--default">Probability</span>
          {outcomeType === 'multiple' ? (
            <button
              type="button"
              className={cn(
                CreateMarketFormOutcomesClasses.action,
                CreateMarketFormOutcomesClasses.distribuitionTypeSelector,
                'caption',
                'semibold'
              )}
              onClick={toggleProbabilityDistribution}
            >
              {probabilityDistribution === 'uniform'
                ? 'Set manually'
                : 'Set uniformly'}
            </button>
          ) : null}
        </div>
        <div className={CreateMarketFormOutcomesClasses.outcomes}>
          {outcomes.map(outcome => (
            <Fragment key={outcome.id}>
              <OutcomeInput
                key={`${outcome.id}[0]`}
                outcomeId={outcome.id}
                placeholder="Outcome"
              />
              <ProbabilityInput
                key={`${outcome.id}[1]`}
                outcomeId={outcome.id}
                disabled={probabilityDistribution === 'uniform'}
              />
              <Button
                key={`${outcome.id}[2]`}
                variant="outline"
                color="default"
                size="xs"
                onClick={() => handleRemoveOutcome(outcome.id)}
                disabled={!hasMoreThanTwoOutcomes}
              >
                -
              </Button>
            </Fragment>
          ))}
        </div>
        <div className={CreateMarketFormOutcomesClasses.error}>
          {!validProbabilities ? (
            <InputErrorMessage message="Sum of probabilities must be 100%" />
          ) : null}
        </div>
        {outcomeType === 'multiple' ? (
          <Button
            fullwidth
            variant="subtle"
            color="primary"
            size="sm"
            onClick={handleAddOutcome}
          >
            <Icon name="Plus" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default CreateMarketFormOutcomes;
