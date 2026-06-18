import { impexBlock } from '../builder';
import { ImpexTypeDescriptor } from '../field.types';
import { textValue } from './shared';

export const priceRowDescriptor: ImpexTypeDescriptor = {
  id: 'priceRow',
  label: 'Price Row',
  category: 'Catalog',
  description: 'Create a PriceRow for a product.',
  fields: [
    { kind: 'text', id: 'productCatalog', label: 'Product catalog', required: true },
    { kind: 'text', id: 'catalogVersion', label: 'Catalog version', required: true, default: 'Staged' },
    { kind: 'text', id: 'productCode', label: 'Product code', required: true },
    { kind: 'text', id: 'currency', label: 'Currency', required: true, default: 'USD' },
    { kind: 'number', id: 'price', label: 'Price', required: true, default: 0 },
    { kind: 'text', id: 'unit', label: 'Unit', required: true, default: 'pieces' },
    { kind: 'number', id: 'minqtd', label: 'Minimum quantity', default: 1 },
  ],
  generate(values) {
    return impexBlock(
      'INSERT_UPDATE PriceRow',
      ['product(code,catalogVersion(catalog(id),version))[unique=true]', 'currency(isocode)[unique=true]', 'price', 'unit(code)', 'minqtd'],
      [
        [
          `${textValue(values, 'productCode')}:${textValue(values, 'productCatalog')}:${textValue(values, 'catalogVersion', 'Staged')}`,
          textValue(values, 'currency', 'USD'),
          textValue(values, 'price', '0'),
          textValue(values, 'unit', 'pieces'),
          textValue(values, 'minqtd', '1'),
        ],
      ]
    );
  },
};
