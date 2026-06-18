import { ImpexOption } from '../field.types';

export const catalogVersionOptions: ImpexOption[] = [
  { value: 'Staged', label: 'Staged' },
  { value: 'Online', label: 'Online' },
];

export const languageOptions: ImpexOption[] = [
  { value: 'en', label: 'English (en)' },
  { value: 'pt', label: 'Portuguese (pt)' },
  { value: 'de', label: 'German (de)' },
  { value: 'es', label: 'Spanish (es)' },
  { value: 'fr', label: 'French (fr)' },
  { value: 'it', label: 'Italian (it)' },
];

export function textValue(values: Record<string, unknown>, key: string, fallback = ''): string {
  const value = values[key];
  return value === undefined || value === null ? fallback : String(value);
}
