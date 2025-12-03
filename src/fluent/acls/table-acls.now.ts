import '@servicenow/sdk/global';
import { Acl } from '@servicenow/sdk/core';
import { prompt_viewer, prompt_editor, prompt_admin } from '../roles/roles.now.ts';

// Prompt table Acls
export const prompt_read = Acl({
  $id: Now.ID['prompt_read_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt',
  operation: 'read',
  roles: [prompt_viewer],
  active: true,
  description: 'Allow prompt_viewer role to read prompt records'
});

export const prompt_write = Acl({
  $id: Now.ID['prompt_write_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt',
  operation: 'write',
  roles: [prompt_editor],
  active: true,
  description: 'Allow prompt_editor role to write prompt records'
});

export const prompt_create = Acl({
  $id: Now.ID['prompt_create_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt',
  operation: 'create',
  roles: [prompt_editor],
  active: true,
  description: 'Allow prompt_editor role to create prompt records'
});

export const prompt_delete = Acl({
  $id: Now.ID['prompt_delete_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt',
  operation: 'delete',
  roles: [prompt_admin],
  active: true,
  description: 'Allow prompt_admin role to delete prompt records'
});

// Prompt Version Acls
export const prompt_version_read = Acl({
  $id: Now.ID['prompt_version_read_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt_version',
  operation: 'read',
  roles: [prompt_viewer],
  active: true,
  description: 'Allow prompt_viewer role to read prompt version records'
});

export const prompt_version_write = Acl({
  $id: Now.ID['prompt_version_write_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt_version',
  operation: 'write',
  roles: [prompt_editor],
  active: true,
  description: 'Allow prompt_editor role to write prompt version records'
});

export const prompt_version_create = Acl({
  $id: Now.ID['prompt_version_create_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt_version',
  operation: 'create',
  roles: [prompt_editor],
  active: true,
  description: 'Allow prompt_editor role to create prompt version records'
});

export const prompt_version_delete = Acl({
  $id: Now.ID['prompt_version_delete_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt_version',
  operation: 'delete',
  roles: [prompt_admin],
  active: true,
  description: 'Allow prompt_admin role to delete prompt version records'
});

// Tag Acls
export const tag_read = Acl({
  $id: Now.ID['tag_read_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_tag',
  operation: 'read',
  roles: [prompt_viewer],
  active: true,
  description: 'Allow prompt_viewer role to read tag records'
});

export const tag_write = Acl({
  $id: Now.ID['tag_write_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_tag',
  operation: 'write',
  roles: [prompt_admin],
  active: true,
  description: 'Allow prompt_admin role to write tag records'
});

export const tag_create = Acl({
  $id: Now.ID['tag_create_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_tag',
  operation: 'create',
  roles: [prompt_admin],
  active: true,
  description: 'Allow prompt_admin role to create tag records'
});

export const tag_delete = Acl({
  $id: Now.ID['tag_delete_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_tag',
  operation: 'delete',
  roles: [prompt_admin],
  active: true,
  description: 'Allow prompt_admin role to delete tag records'
});

// Prompt Tag relationship Acls
export const prompt_tag_read = Acl({
  $id: Now.ID['prompt_tag_read_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt_tag',
  operation: 'read',
  roles: [prompt_viewer],
  active: true,
  description: 'Allow prompt_viewer role to read prompt tag relationships'
});

export const prompt_tag_write = Acl({
  $id: Now.ID['prompt_tag_write_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt_tag',
  operation: 'write',
  roles: [prompt_editor],
  active: true,
  description: 'Allow prompt_editor role to write prompt tag relationships'
});

export const prompt_tag_create = Acl({
  $id: Now.ID['prompt_tag_create_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt_tag',
  operation: 'create',
  roles: [prompt_editor],
  active: true,
  description: 'Allow prompt_editor role to create prompt tag relationships'
});

export const prompt_tag_delete = Acl({
  $id: Now.ID['prompt_tag_delete_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt_tag',
  operation: 'delete',
  roles: [prompt_editor],
  active: true,
  description: 'Allow prompt_editor role to delete prompt tag relationships'
});

// Engagement Acls
export const engagement_read = Acl({
  $id: Now.ID['engagement_read_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_engagement',
  operation: 'read',
  roles: [prompt_viewer],
  active: true,
  description: 'Allow prompt_viewer role to read engagement records'
});

export const engagement_write = Acl({
  $id: Now.ID['engagement_write_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_engagement',
  operation: 'write',
  roles: [prompt_editor],
  active: true,
  description: 'Allow prompt_editor role to write engagement records'
});

export const engagement_create = Acl({
  $id: Now.ID['engagement_create_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_engagement',
  operation: 'create',
  roles: [prompt_editor],
  active: true,
  description: 'Allow prompt_editor role to create engagement records'
});

export const engagement_delete = Acl({
  $id: Now.ID['engagement_delete_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_engagement',
  operation: 'delete',
  roles: [prompt_admin],
  active: true,
  description: 'Allow prompt_admin role to delete engagement records'
});

// Prompt Usage Acls
export const prompt_usage_read = Acl({
  $id: Now.ID['prompt_usage_read_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt_usage',
  operation: 'read',
  roles: [prompt_viewer],
  active: true,
  description: 'Allow prompt_viewer role to read prompt usage records'
});

export const prompt_usage_write = Acl({
  $id: Now.ID['prompt_usage_write_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt_usage',
  operation: 'write',
  roles: [prompt_editor],
  active: true,
  description: 'Allow prompt_editor role to write prompt usage records'
});

export const prompt_usage_create = Acl({
  $id: Now.ID['prompt_usage_create_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt_usage',
  operation: 'create',
  roles: [prompt_editor],
  active: true,
  description: 'Allow prompt_editor role to create prompt usage records'
});

export const prompt_usage_delete = Acl({
  $id: Now.ID['prompt_usage_delete_acl'],
  type: 'record',
  table: 'x_snc_prompt_galle_prompt_usage',
  operation: 'delete',
  roles: [prompt_admin],
  active: true,
  description: 'Allow prompt_admin role to delete prompt usage records'
});