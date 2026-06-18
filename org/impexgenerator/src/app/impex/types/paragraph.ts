import { asRows, catalogVersionHeader, impexBlock } from '../builder';
import { ImpexTypeDescriptor } from '../field.types';
import { catalogVersionOptions, languageOptions, textValue } from './shared';

export const paragraphDescriptor: ImpexTypeDescriptor = {
  id: 'paragraph',
  label: 'Paragraph',
  category: 'CMS',
  description: 'Generate one or more CMSParagraphComponent rows.',
  fields: [
    {
      kind: 'select',
      id: 'env',
      label: 'Catalog version',
      options: catalogVersionOptions,
      required: true,
      default: 'Staged',
    },
    {
      kind: 'text',
      id: 'contentCatalog',
      label: 'Content catalog',
      required: true,
      placeholder: 'electronicsContentCatalog',
    },
    {
      kind: 'lang',
      id: 'lang',
      label: 'Language',
      required: true,
      default: 'pt',
    },
    {
      kind: 'group',
      id: 'paragraphs',
      label: 'Paragraphs',
      repeatable: true,
      fields: [
        { kind: 'text', id: 'uid', label: 'UID', required: true },
        { kind: 'text', id: 'name', label: 'Name', required: true },
        { kind: 'text', id: 'componentRef', label: 'Component reference' },
        { kind: 'textarea', id: 'content', label: 'Content', required: true },
      ],
    },
  ],
  generate(values) {
    const catalog = textValue(values, 'contentCatalog');
    const version = textValue(values, 'env', 'Staged');
    const lang = textValue(values, 'lang', 'pt');
    const headers = [
      `${catalogVersionHeader(catalog, version)}[unique=true]`,
      'uid[unique=true]',
      'name',
      '&componentRef',
      `content[lang=${lang}]`,
    ];

    return impexBlock(
      'INSERT_UPDATE CMSParagraphComponent',
      headers,
      asRows(values['paragraphs']).map((paragraph) => [
        '',
        paragraph['uid'],
        paragraph['name'],
        paragraph['componentRef'],
        paragraph['content'],
      ])
    );
  },
};
