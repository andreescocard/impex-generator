import { catalogVersionHeader, impexBlock } from '../builder';
import { ImpexTypeDescriptor } from '../field.types';
import { catalogVersionOptions, languageOptions, textValue } from './shared';

export const cmsLinkComponentDescriptor: ImpexTypeDescriptor = {
  id: 'cmsLinkComponent',
  label: 'CMS Link Component',
  category: 'CMS',
  description: 'Create a CMSLinkComponent for a URL, content page, category, or product.',
  fields: [
    { kind: 'select', id: 'env', label: 'Catalog version', options: catalogVersionOptions, required: true, default: 'Staged' },
    { kind: 'text', id: 'contentCatalog', label: 'Content catalog', required: true },
    { kind: 'lang', id: 'lang', label: 'Language', required: true, default: 'en' },
    { kind: 'text', id: 'uid', label: 'UID', required: true },
    { kind: 'text', id: 'name', label: 'Name', required: true },
    { kind: 'text', id: 'linkName', label: 'Link name', required: true },
    { kind: 'text', id: 'url', label: 'URL' },
    { kind: 'text', id: 'target', label: 'Target', default: 'sameWindow' },
  ],
  generate(values) {
    const catalog = textValue(values, 'contentCatalog');
    const version = textValue(values, 'env', 'Staged');
    const lang = textValue(values, 'lang', 'en');

    return impexBlock(
      'INSERT_UPDATE CMSLinkComponent',
      [
        `${catalogVersionHeader(catalog, version)}[unique=true]`,
        'uid[unique=true]',
        'name',
        `linkName[lang=${lang}]`,
        'url',
        'target(code)',
        '&componentRef',
      ],
      [
        [
          '',
          textValue(values, 'uid'),
          textValue(values, 'name'),
          textValue(values, 'linkName'),
          textValue(values, 'url'),
          textValue(values, 'target', 'sameWindow'),
          textValue(values, 'uid'),
        ],
      ]
    );
  },
};
