import { catalogVersionHeader, impexBlock } from '../builder';
import { ImpexTypeDescriptor } from '../field.types';
import { catalogVersionOptions, languageOptions, textValue } from './shared';

export const pageDescriptor: ImpexTypeDescriptor = {
  id: 'page',
  label: 'Page',
  category: 'CMS',
  description: 'Create a ContentPage with localized title and label.',
  fields: [
    { kind: 'select', id: 'env', label: 'Catalog version', options: catalogVersionOptions, required: true, default: 'Staged' },
    { kind: 'text', id: 'contentCatalog', label: 'Content catalog', required: true },
    { kind: 'lang', id: 'lang', label: 'Language', required: true, default: 'en' },
    { kind: 'text', id: 'uid', label: 'Page UID', required: true },
    { kind: 'text', id: 'name', label: 'Name', required: true },
    { kind: 'text', id: 'label', label: 'URL label', required: true, placeholder: '/my-page' },
    { kind: 'text', id: 'title', label: 'Title', required: true },
    { kind: 'text', id: 'masterTemplate', label: 'Master template', required: true, default: 'ContentPage1Template' },
    { kind: 'boolean', id: 'defaultPage', label: 'Default page', default: true },
    { kind: 'boolean', id: 'approvalStatus', label: 'Approved', default: true },
  ],
  generate(values) {
    const catalog = textValue(values, 'contentCatalog');
    const version = textValue(values, 'env', 'Staged');
    const lang = textValue(values, 'lang', 'en');

    return impexBlock(
      'INSERT_UPDATE ContentPage',
      [
        `${catalogVersionHeader(catalog, version)}[unique=true]`,
        'uid[unique=true]',
        'name',
        'label',
        `title[lang=${lang}]`,
        'masterTemplate(uid, catalogVersion)',
        'defaultPage',
        'approvalStatus(code)',
      ],
      [
        [
          '',
          textValue(values, 'uid'),
          textValue(values, 'name'),
          textValue(values, 'label'),
          textValue(values, 'title'),
          `${textValue(values, 'masterTemplate')}:${catalog}:${version}`,
          values['defaultPage'] === true ? 'true' : 'false',
          values['approvalStatus'] === true ? 'approved' : 'check',
        ],
      ]
    );
  },
};
