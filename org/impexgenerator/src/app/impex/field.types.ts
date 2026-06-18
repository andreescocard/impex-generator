export type ImpexScalarValue = string | number | boolean | null | undefined;

export type ImpexValue =
  | ImpexScalarValue
  | Record<string, ImpexScalarValue>
  | Array<Record<string, ImpexScalarValue>>;

export interface ImpexOption {
  value: string;
  label: string;
}

export type ImpexField =
  | {
      kind: 'text' | 'textarea' | 'number';
      id: string;
      label: string;
      required?: boolean;
      default?: string | number;
      placeholder?: string;
    }
  | {
      kind: 'select';
      id: string;
      label: string;
      options: ImpexOption[];
      required?: boolean;
      default?: string;
    }
  | {
      kind: 'boolean';
      id: string;
      label: string;
      default?: boolean;
    }
  | {
      kind: 'lang';
      id: string;
      label: string;
      required?: boolean;
      default?: string;
    }
  | {
      kind: 'group';
      id: string;
      label: string;
      fields: ImpexField[];
      repeatable: true;
      required?: boolean;
    };

export interface ImpexTypeDescriptor {
  id: string;
  label: string;
  category: 'CMS' | 'Catalog' | 'System';
  description: string;
  fields: ImpexField[];
  generate(values: Record<string, ImpexValue>): string;
}
