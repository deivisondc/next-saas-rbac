import { defineAbilityFor, projectSchema } from '@saas/auth';

const ability = defineAbilityFor({ role: 'MEMBER', id: 'user-123' });

const project = projectSchema.parse({
  id: 'project-456',
  ownerId: 'user-123'
});

console.log('test: ', ability.can('delete', project))