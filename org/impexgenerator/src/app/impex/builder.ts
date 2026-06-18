import { impexCell } from './escape';

export interface ImpexColumn {
  header: string;
  value?: unknown;
}

export function impexBlock(command: string, headers: string[], rows: unknown[][]): string {
  const header = [command, ...headers].join('; ');
  const body = rows.map((row) => ['', ...row.map(impexCell)].join('; '));

  return [header, ...body].join('\n');
}

export function catalogVersionHeader(catalog: string, version: string): string {
  return `catalogVersion(CatalogVersion.catalog(Catalog.id[default=${impexCell(
    catalog
  )}]), CatalogVersion.version[default=${impexCell(version)}])[default=${impexCell(
    `${catalog}:${version}`
  )}]`;
}

export function asRows(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object');
}
