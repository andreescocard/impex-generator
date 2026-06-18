import { asRows, impexBlock } from '../builder';
import { ImpexTypeDescriptor } from '../field.types';
import { textValue } from './shared';

export const productImagesDescriptor: ImpexTypeDescriptor = {
  id: 'productImages',
  label: 'Product Images',
  category: 'Catalog',
  description: 'Attach one or more media gallery images to a product.',
  fields: [
    { kind: 'text', id: 'productCatalog', label: 'Product catalog', required: true },
    { kind: 'text', id: 'catalogVersion', label: 'Catalog version', required: true, default: 'Staged' },
    { kind: 'text', id: 'productCode', label: 'Product code', required: true },
    {
      kind: 'group',
      id: 'images',
      label: 'Images',
      repeatable: true,
      fields: [
        { kind: 'text', id: 'qualifier', label: 'Media qualifier', required: true },
        { kind: 'text', id: 'realFileName', label: 'File name', required: true },
        { kind: 'text', id: 'mime', label: 'MIME type', required: true, default: 'image/jpeg' },
        { kind: 'text', id: 'folder', label: 'Media folder', required: true, default: 'images' },
      ],
    },
  ],
  generate(values) {
    const catalog = textValue(values, 'productCatalog');
    const version = textValue(values, 'catalogVersion', 'Staged');
    const productCode = textValue(values, 'productCode');
    const images = asRows(values['images']);
    const media = impexBlock(
      'INSERT_UPDATE Media',
      ['code[unique=true]', 'realfilename', 'mime', 'folder(qualifier)', '@media[translator=de.hybris.platform.impex.jalo.media.MediaDataTranslator]'],
      images.map((image) => [image['qualifier'], image['realFileName'], image['mime'], image['folder'], image['realFileName']])
    );
    const gallery = impexBlock(
      'INSERT_UPDATE Product',
      ['code[unique=true]', 'catalogVersion(catalog(id),version)[unique=true]', 'galleryImages(code)'],
      [[productCode, `${catalog}:${version}`, images.map((image) => image['qualifier']).join(',')]]
    );

    return `${media}\n\n${gallery}`;
  },
};
