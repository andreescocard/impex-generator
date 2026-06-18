import { impexBlock } from '../builder';
import { ImpexTypeDescriptor } from '../field.types';
import { impexBool } from '../escape';
import { textValue } from './shared';

export const featureFlagDescriptor: ImpexTypeDescriptor = {
  id: 'featureFlag',
  label: 'Feature Flag',
  category: 'System',
  description: 'Create or update a SAP Commerce FeatureFlag row.',
  fields: [
    {
      kind: 'text',
      id: 'key',
      label: 'Feature flag key',
      required: true,
      placeholder: 'newFeatureFlag',
    },
    {
      kind: 'boolean',
      id: 'status',
      label: 'Enabled',
      default: true,
    },
  ],
  generate(values) {
    return impexBlock('INSERT_UPDATE FeatureFlag', ['key[unique=true]', 'status[default=true]'], [
      [textValue(values, 'key'), impexBool(values['status'])],
    ]);
  },
};
