// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: any) {
    const defaults = [
      { name: 'Technology', slug: 'technology' },
      { name: 'Movies', slug: 'movies' },
      { name: 'News / Political opinion', slug: 'news' },
      { name: 'Cooking / recipes', slug: 'cooking' },
    ];
    try {
      const existing = await strapi.entityService.findMany('api::category.category', {
        fields: ['id'],
        limit: 1,
      });
      if (!existing || (Array.isArray(existing) && existing.length === 0)) {
        for (const c of defaults) {
          await strapi.entityService.create('api::category.category', {
            data: { name: c.name, slug: c.slug, publishedAt: new Date() },
          });
        }
        strapi.log.info('Seeded default categories.');
      }
    } catch (e) {
      strapi.log.warn(`Category seeding skipped: ${String(e)}`);
    }
  },
};
