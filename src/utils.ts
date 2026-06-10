export function parseCensored(content: string): string[] {
  return Array.from(
    content.matchAll(/"([^"]*)"|'([^']*)'|[^\s,]+/g), 
    (match) => match[1] ?? match[2] ?? match[0]
  );
}

export function redact(censored: string[], text: string): string {
  const escapedCensored = censored
    .toSorted((a, b) => b.length - a.length)
    .map((term) => RegExp.escape(term));
  const censorRegExp = new RegExp(escapedCensored.join('|'), 'gi');
  const redacted = text.replace(censorRegExp, (match: string) => match.replace(/\S/g, 'X'));

  return redacted;
}
