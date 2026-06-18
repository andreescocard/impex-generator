import { impexCell } from './escape';

describe('impexCell', () => {
  it('leaves simple values unquoted', () => {
    expect(impexCell('simple-value')).toBe('simple-value');
    expect(impexCell(42)).toBe('42');
  });

  it('returns empty cells for nullish values', () => {
    expect(impexCell(null)).toBe('');
    expect(impexCell(undefined)).toBe('');
  });

  it('quotes semicolons, quotes, newlines, and surrounding whitespace', () => {
    expect(impexCell('value;with;semicolons')).toBe('"value;with;semicolons"');
    expect(impexCell('say "hello"')).toBe('"say ""hello"""');
    expect(impexCell('line one\nline two')).toBe('"line one\nline two"');
    expect(impexCell(' padded ')).toBe('" padded "');
  });
});
