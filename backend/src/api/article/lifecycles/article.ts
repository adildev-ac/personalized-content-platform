
const stripText = (content: unknown): string => {
  if (!content) return '';
  try {
    if (Array.isArray(content)) {
      const texts: string[] = [];
      for (const block of content) {
        if (block && typeof block === 'object' && 'type' in block) {
          const b: any = block as any;
          if (b.type === 'paragraph' && Array.isArray(b.children)) {
            texts.push(b.children.map((n: any) => (typeof n?.text === 'string' ? n.text : '')).join(''));
          }
        }
      }
      return texts.join(' ').trim();
    }
    if (typeof content === 'string') return content;
    return '';
  } catch {
    return '';
  }
};

const summarize = (text: string, len = 180) => text.replace(/\s+/g, ' ').trim().slice(0, len);

const lifecycles = {
  async beforeCreate(event) {
    const data: any = event.params.data || {};
    if (!data.publication_date) data.publication_date = new Date();
    if (!data.excerpt) {
      const text = stripText(data.content);
      data.excerpt = summarize(text);
    }
    // Default category assignment if none selected
    try {
      if (!data.category) {
        const slug = 'technology';
        // find category by slug
        const found = await (strapi as any).entityService.findMany('api::category.category', {
          filters: { slug },
          fields: ['id'],
          limit: 1,
        });
        const cat = Array.isArray(found) ? found[0] : found;
        if (cat?.id) {
          data.category = cat.id;
        }
      }
    } catch (e) {
      // ignore if default category cannot be set
    }
  },
  async beforeUpdate(event) {
    const data: any = event.params.data || {};
    if (data.content && !data.excerpt) {
      const text = stripText(data.content);
      data.excerpt = summarize(text);
    }
  },
} satisfies Record<string, (event: { params: any; }) => Promise<void>>;

export default lifecycles;
