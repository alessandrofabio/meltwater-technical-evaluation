export function parseKeywords(keywords: string): string[] {
  return Array.from(
    keywords.matchAll(/"([^"]*)"|'([^']*)'|[^\s,]+/g), 
    (match) => match[1] ?? match[2] ?? match[0]
  );
}

export function redact(parsedKeywords: string[], text: string): string {
  const escapedParsedKeywords = parsedKeywords
    .sort((a, b) => b.length - a.length)
    .map(RegExp.escape);
  const keywordsToMatch = new RegExp(escapedParsedKeywords.join('|'), 'gi');
  const redactedText = text.replace(keywordsToMatch, (match) => match.replace(/\S/g, 'X'));

  return redactedText;
}
