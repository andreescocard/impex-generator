import { IMPEX_TYPES } from './registry';

describe('IMPEX_TYPES', () => {
  it('contains the v1 batch of generator types', () => {
    expect(IMPEX_TYPES.map((type) => type.id)).toEqual([
      'featureFlag',
      'paragraph',
      'page',
      'productImages',
      'product',
      'category',
      'cmsLinkComponent',
      'contentSlot',
      'priceRow',
    ]);
  });

  it('escapes generated FeatureFlag values', () => {
    const descriptor = IMPEX_TYPES.find((type) => type.id === 'featureFlag');

    expect(descriptor?.generate({ key: 'flag;"quoted"', status: true })).toContain('; "flag;""quoted"""; true');
  });

  it('generates repeatable paragraph rows with escaped content', () => {
    const descriptor = IMPEX_TYPES.find((type) => type.id === 'paragraph');
    const output = descriptor?.generate({
      env: 'Staged',
      contentCatalog: 'electronicsContentCatalog',
      lang: 'en',
      paragraphs: [
        { uid: 'first', name: 'First', componentRef: 'firstRef', content: 'safe' },
        { uid: 'second', name: 'Second', componentRef: 'secondRef', content: 'copy with ; separator' },
      ],
    });

    expect(output).toContain('content[lang=en]');
    expect(output).toContain('; ; first; First; firstRef; safe');
    expect(output).toContain('; ; second; Second; secondRef; "copy with ; separator"');
  });
});
