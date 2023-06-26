import type { Ability, Subject, MongoQuery } from '@casl/ability';
import { hooks, providerFactory } from '@strapi/utils';

export interface Permission {
  action: string;
  subject?: string | object | null;
  properties?: object;
  conditions?: string[];
}

export interface CanPermission {
  action: string;
  subject?: Subject;
  properties?: {
    fields?: string[];
    [key: string]: unknown;
  };
  condition: MongoQuery;
}

export type Provider = ReturnType<typeof providerFactory>;

export interface BaseAction {
  actionId: string;
}

export interface BaseCondition {
  name: string;
  handler(...params: unknown[]): boolean | object;
}

export interface ActionProvider<T extends BaseAction = BaseAction> extends Provider {}
export interface ConditionProvider<T extends BaseCondition = BaseCondition> extends Provider {}

export interface PermissionEngineHooks {
  'before-format::validate.permission': ReturnType<typeof hooks.createAsyncBailHook>;
  'format.permission': ReturnType<typeof hooks.createAsyncSeriesWaterfallHook>;
  'after-format::validate.permission': ReturnType<typeof hooks.createAsyncBailHook>;
  'before-evaluate.permission': ReturnType<typeof hooks.createAsyncSeriesHook>;
  'before-register.permission': ReturnType<typeof hooks.createAsyncSeriesHook>;
}

type PermissionEngineHookName = keyof PermissionEngineHooks;

export interface PermissionEngine {
  hooks: object;

  on(hook: PermissionEngineHookName, handler: (...args: any[]) => any): PermissionEngine;
  generateAbility(permissions: Permission[], options?: object): Ability;
  createRegisterFunction(can: (...args: any[]) => any, options: object): (...args: any[]) => any;
}

interface BaseAbility {
  can: (...args: any[]) => any;
}

interface AbilityBuilder {
  can(permission: Permission): void | Promise<void>;
  build(): Ability | Promise<Ability>;
}

export interface PermissionEngineParams {
  providers: { action: ActionProvider; condition: ConditionProvider };
  abilityBuilderFactory(): AbilityBuilder;
}
