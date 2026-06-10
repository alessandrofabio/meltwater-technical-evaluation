import * as http from 'node:http';
import { Buffer } from 'node:buffer';

export function getRequestBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";

    req.setEncoding('utf8');

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      resolve(body);
    });

    req.on('error', (e) => {
      reject(e);
    });
  });
}

export function parseKeywords(keywords: string): string[] {
  return Array.from(
    keywords.matchAll(/"([^"]*)"|'([^']*)'|[^\s,]+/g), 
    (match) => match[1] ?? match[2] ?? match[0]
  );
}

export function redact(parsedKeywords: string[], text: string): { redactedText: string, key: string } {
  const escapedParsedKeywords = parsedKeywords
    .sort((a, b) => b.length - a.length)
    .map(RegExp.escape);
  const keywordsToMatch = new RegExp(escapedParsedKeywords.join('|'), 'gi');

  const indexedRedactedKeywords: { at: number, keyword: string }[] = [];
  const redactedText = text.replace(keywordsToMatch, (match, at: number) => {
    indexedRedactedKeywords.push({ at, keyword: match });
    return match.replace(/\S/g, 'X')
  });

  const key = Buffer.from(JSON.stringify(indexedRedactedKeywords)).toString('base64');

  return { redactedText, key };
}

export function unredact(key: string, text: string) {
  const indexedRedactedKeywords: { at: number, keyword: string }[] = JSON.parse(Buffer.from(key, 'base64').toString('utf8'));

  let originalText = text;

  for (const { at, keyword } of indexedRedactedKeywords) {
    originalText = originalText.slice(0, at) + keyword + originalText.slice(at + keyword.length);
  }

  return originalText;
}
