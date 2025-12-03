import '@servicenow/sdk/global';
import { BusinessRule } from '@servicenow/sdk/core';
import { managePromptVersions } from '../../server/prompt-version-logic.js';

// Business rule to maintain version integrity and computed fields
export const prompt_version_management = BusinessRule({
  $id: Now.ID['prompt_version_br'],
  name: 'Prompt Version Management',
  table: 'x_snc_prompt_galle_prompt_version',
  when: 'after',
  action: ['insert', 'update'],
  script: managePromptVersions,
  order: 100,
  active: true,
  description: 'Manages version numbering, recommended status, and computed fields'
});