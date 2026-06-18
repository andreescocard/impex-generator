export function impexCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const text = String(value);
  const needsQuotes = /[;"\r\n]/.test(text) || text !== text.trim();

  if (!needsQuotes) {
    return text;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export function impexBool(value: unknown): string {
  return value === true || value === 'true' ? 'true' : 'false';
}
