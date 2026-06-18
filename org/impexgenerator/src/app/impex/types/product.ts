import { impexBlock } from '../builder';
import { ImpexTypeDescriptor } from '../field.types';
import { languageOptions, textValue } from './shared';

export const productDescriptor: ImpexTypeDescriptor = {
  id: 'product',
  label: 'Product',
  category: 'Catalog',
  description: 'Create or update a product with core catalog fields.',
  fields: [
    { kind: 'text', id: 'productCatalog', label: 'Product catalog', required: true },
    { kind: 'text', id: 'catalogVersion', label: 'Catalog version', required: true, default: 'Staged' },
    { kind: 'lang', id: 'lang', label: 'Language', required: true, default: 'en' },
    { kind: 'text', id: 'code', label: 'Product code', required: true },
    { kind: 'text', id: 'name', label: 'Name', required: true },
    { kind: 'textarea', id: 'description', label: 'Description' },
    { kind: 'text', id: 'unit', label: 'Unit', required: true, default: 'pieces' },
    { kind: 'text', id: 'approvalStatus', label: 'Approval status', required: true, default: 'approved' },
    { kind: 'text', id: 'supercategories', label: 'Supercategories (comma separated)' },
  ],
  generate(values) {
    const lang = textValue(values, 'lang', 'en');

    return impexBlock(
      'INSERT_UPDATE Product',
      [
        'code[unique=true]',
        'catalogVersion(catalog(id),version)[unique=true]',
        `name[lang=${lang}]`,
        `description[lang=${lang}]`,
        'unit(code)',
        'approvalStatus(code)',
        'supercategories(code)',
      ],
      [
        [
          textValue(values, 'code'),
          `${textValue(values, 'productCatalog')}:${textValue(values, 'catalogVersion', 'Staged')}`,
          textValue(values, 'name'),
          textValue(values, 'description'),
          textValue(values, 'unit', 'pieces'),
          textValue(values, 'approvalStatus', 'approved'),
          textValue(values, 'supercategories'),
        ],
      ]
    );
  },
};
