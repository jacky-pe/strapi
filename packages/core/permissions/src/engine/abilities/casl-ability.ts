import sift, { createQueryTester } from 'sift';
import { AbilityBuilder, Ability } from '@casl/ability';
import { pick, isNil, isObject } from 'lodash/fp';
import { CanPermission } from '../../types';

const allowedOperations = [
  '$or',
  '$and',
  '$eq',
  '$ne',
  '$in',
  '$nin',
  '$lt',
  '$lte',
  '$gt',
  '$gte',
  '$exists',
  '$elemMatch',
] as const;

const operations = pick(allowedOperations, sift);

const conditionsMatcher = (conditions: unknown) => {
  return createQueryTester(conditions, { operations });
};

/**
 * Casl Ability Builder.
 */
const caslAbilityBuilder = () => {
  const { can, build, ...rest } = new AbilityBuilder(Ability);

  return {
    can(permission: CanPermission) {
      const { action, subject, properties = {}, condition } = permission;
      const { fields } = properties;

      return can(
        action,
        isNil(subject) ? 'all' : subject,
        fields,
        isObject(condition) ? condition : undefined
      );
    },

    build() {
      return build({ conditionsMatcher });
    },

    ...rest,
  };
};

export default caslAbilityBuilder;
