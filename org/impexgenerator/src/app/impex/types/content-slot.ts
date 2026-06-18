import { asRows, catalogVersionHeader, impexBlock } from '../builder';
import { ImpexTypeDescriptor } from '../field.types';
import { catalogVersionOptions, textValue } from './shared';

export const contentSlotDescriptor: ImpexTypeDescriptor = {
  id: 'contentSlot',
  label: 'Content Slot',
  category: 'CMS',
  description: 'Create a ContentSlot and assign components to it.',
  fields: [
    { kind: 'select', id: 'env', label: 'Catalog version', options: catalogVersionOptions, required: true, default: 'Staged' },
    { kind: 'text', id: 'contentCatalog', label: 'Content catalog', required: true },
    { kind: 'text', id: 'uid', label: 'Slot UID', required: true },
    { kind: 'text', id: 'name', label: 'Name', required: true },
    { kind: 'boolean', id: 'active', label: 'Active', default: true },
    {
      kind: 'group',
      id: 'components',
      label: 'Components',
      repeatable: true,
      fields: [{ kind: 'text', id: 'uid', label: 'Component UID', required: true }],
    },
  ],
  generate(values) {
    const catalog = textValue(values, 'contentCatalog');
    const version = textValue(values, 'env', 'Staged');
    const components = asRows(values['components']).map((component) => component['uid']).join(',');

    return impexBlock(
      'INSERT_UPDATE ContentSlot',
      [`${catalogVersionHeader(catalog, version)}[unique=true]`, 'uid[unique=true]', 'name', 'active', 'cmsComponents(uid, catalogVersion)'],
      [['', textValue(values, 'uid'), textValue(values, 'name'), values['active'] === false ? 'false' : 'true', components]]
    );
  },
};
