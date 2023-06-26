import { cloneDeep, has } from 'lodash/fp';
import { hooks } from '@strapi/utils';
import type { Permission, PermissionEngineHooks } from '../types';

import domain from '../domain';

// Create a hook map used by the permission Engine
const createEngineHooks = (): PermissionEngineHooks => ({
  'before-format::validate.permission': hooks.createAsyncBailHook(),
  'format.permission': hooks.createAsyncSeriesWaterfallHook(),
  'after-format::validate.permission': hooks.createAsyncBailHook(),
  'before-evaluate.permission': hooks.createAsyncSeriesHook(),
  'before-register.permission': hooks.createAsyncSeriesHook(),
});

/**
 * Create a context from a domain {@link Permission} used by the validate hooks
 */
const createValidateContext = (permission: Permission) => ({
  get permission(): Permission {
    return cloneDeep(permission);
  },
});

/**
 * Create a context from a domain {@link Permission} used by the before valuate hook
 */
const createBeforeEvaluateContext = (permission: Permission) => ({
  get permission(): Permission {
    return cloneDeep(permission);
  },

  addCondition(condition: string) {
    Object.assign(permission, domain.permission.addCondition(condition, permission));

    return this;
  },
});

/**
 * Create a context from a casl Permission & some options
 * @param caslPermission
 * @param {object} options
 * @param {Permission} options.permission
 * @param {object} options.user
 */
const createWillRegisterContext = ({ permission, options }) => ({
  ...options,

  get permission() {
    return cloneDeep(permission);
  },

  condition: {
    and(rawConditionObject) {
      if (!permission.condition) {
        Object.assign(permission, { condition: { $and: [] } });
      }

      permission.condition.$and.push(rawConditionObject);

      return this;
    },

    or(rawConditionObject) {
      if (!permission.condition) {
        Object.assign(permission, { condition: { $and: [] } });
      }

      const orClause = permission.condition.$and.find(has('$or'));

      if (orClause) {
        orClause.$or.push(rawConditionObject);
      } else {
        permission.condition.$and.push({ $or: [rawConditionObject] });
      }

      return this;
    },
  },
});

export {
  createEngineHooks,
  createValidateContext,
  createBeforeEvaluateContext,
  createWillRegisterContext,
};
