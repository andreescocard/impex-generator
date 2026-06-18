import { impexBlock } from '../builder';
import { ImpexTypeDescriptor } from '../field.types';
import { textValue } from './shared';

export const categoryDescriptor: ImpexTypeDescriptor = {
  id: 'category',
  label: 'Category',
  category: 'Catalog',
  description: 'Create or update a catalog category.',
  fields: [
    { kind: 'text', id: 'productCatalog', label: 'Product catalog', required: true },
    { kind: 'text', id: 'catalogVersion', label: 'Catalog version', required: true, default: 'Staged' },
    { kind: 'lang', id: 'lang', label: 'Language', required: true, default: 'en' },
    { kind: 'text', id: 'code', label: 'Category code', required: true },
    { kind: 'text', id: 'name', label: 'Name', required: true },
    { kind: 'text', id: 'supercategories', label: 'Parent categories (comma separated)' },
  ],
  generate(values) {
    const lang = textValue(values, 'lang', 'en');

    return impexBlock(
      'INSERT_UPDATE Category',
      ['code[unique=true]', 'catalogVersion(catalog(id),version)[unique=true]', `name[lang=${lang}]`, 'supercategories(code)'],
      [
        [
          textValue(values, 'code'),
          `${textValue(values, 'productCatalog')}:${textValue(values, 'catalogVersion', 'Staged')}`,
          textValue(values, 'name'),
          textValue(values, 'supercategories'),
        ],
      ]
    );
  },
};
