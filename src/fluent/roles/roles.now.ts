import '@servicenow/sdk/global';
import { Role } from '@servicenow/sdk/core';

// Base viewer role - can view prompts and related records
export const prompt_viewer = Role({
  name: 'x_snc_prompt_galle.prompt_viewer',
  description: 'Can view Prompts, Prompt Versions, Tags, Engagements, and Prompt Usage records',
  can_delegate: false,
  grantable: true
});

// Editor role - can create and edit prompts
export const prompt_editor = Role({
  name: 'x_snc_prompt_galle.prompt_editor',
  description: 'Can create and edit Prompts, Prompt Versions, and Prompt Usage records',
  contains_roles: [prompt_viewer],
  can_delegate: false,
  grantable: true
});

// Admin role - full access to all features
export const prompt_admin = Role({
  name: 'x_snc_prompt_galle.prompt_admin',
  description: 'Full administrative access to Prompt Gallery including Tags and configuration',
  contains_roles: [prompt_editor],
  can_delegate: true,
  grantable: true,
  scoped_admin: true
});