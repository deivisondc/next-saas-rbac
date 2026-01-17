import { createMongoAbility, CreateAbility, MongoAbility, AbilityBuilder } from '@casl/ability';
import { User } from './models/user';
import { permissions } from './permissions';
import { projectSubject,  } from './subjects/project';
import { userSubject } from './subjects/user';
import { z } from 'zod';
import { organizationSubject } from './subjects/organization';
import { inviteSubject } from './subjects/invite';
import { billingSubject } from './subjects/billing';

export * from './models/user';
export * from './models/project';
export * from './models/organization';

const AppAbilities = z.union([
  projectSubject,
  userSubject,
  organizationSubject,
  inviteSubject,
  billingSubject,
  z.tuple([z.literal('manage'), z.literal('all')])
]);

type AppAbilities = z.infer<typeof AppAbilities>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>; 

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder<AppAbility>(createAppAbility);

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`No permissions defined for role: ${user.role}`);
  }
  
  permissions[user.role](user, builder);

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename;
    },
  });

  return ability;
};