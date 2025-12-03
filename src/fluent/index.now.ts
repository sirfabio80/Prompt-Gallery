import '@servicenow/sdk/global';

// Export all tables
export * from './tables/category.now.ts';
export * from './tables/prompt.now.ts';
export * from './tables/prompt-version.now.ts';
export * from './tables/tag.now.ts';
export * from './tables/prompt-tag.now.ts';
export * from './tables/engagement.now.ts';
export * from './tables/prompt-usage.now.ts';

// Export roles and ACLs
export * from './roles/roles.now.ts';
export * from './acls/table-acls.now.ts';

// Export business rules
export * from './business-rules/prompt-version-management.now.ts';

// Export Script Includes
export * from './script-includes/prompt-gallery-api.now.ts';

// Export UI pages
export * from './ui-pages/prompt-gallery.now.ts';

// Export Service Portal components
export * from './service-portal/page-and-layout.now.ts';
export * from './service-portal/widget.now.ts';
export * from './service-portal/widgets/prompt-gallery-search.now.ts';
export * from './service-portal/widgets/prompt-gallery-main.now.ts';
export * from './service-portal/widgets/prompt-gallery-detail.now.ts';
export * from './service-portal/headers/prompt-gallery-header.now.ts';
export * from './service-portal/css/prompt-gallery-css.now.ts';

// Export sample data
export * from './sample-data/categories.now.ts';
export * from './sample-data/tags-and-engagements.now.ts';
export * from './sample-data/sample-prompts.now.ts';
export * from './sample-data/sample-prompt-versions.now.ts';