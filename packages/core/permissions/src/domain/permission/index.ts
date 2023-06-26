import _ from 'lodash/fp';
import { Permission } from '../../types';

const PERMISSION_FIELDS = ['action', 'subject', 'properties', 'conditions'];

const sanitizePermissionFields = _.pick(PERMISSION_FIELDS);

type DefaultPermission = Pick<Permission, 'conditions' | 'properties' | 'subject'>;

const getDefaultPermission = (): DefaultPermission => ({
  conditions: [],
  properties: {},
  subject: null,
});

const pickPermissionFields = _.pick(PERMISSION_FIELDS);
const mergeWithDefaultPermission = _.merge(getDefaultPermission());

/**
 * Create a new permission based on given attributes
 */
const create = _.pipe(pickPermissionFields, mergeWithDefaultPermission);

/**
 * Add a condition to a permission
 */
const addCondition = _.curry((condition: string, permission: Permission): Permission => {
  const { conditions } = permission;

  const newConditions = Array.isArray(conditions)
    ? _.uniq(conditions.concat(condition))
    : [condition];

  return _.set('conditions', newConditions, permission);
});

/**
 * Gets a property or a part of a property from a permission.
 */
const getProperty = _.curry((property: string, permission: Permission) =>
  _.get(`properties.${property}`, permission)
);

export default {
  create,
  sanitizePermissionFields,
  addCondition,
  getProperty,
};
