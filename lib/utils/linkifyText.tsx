import { Fragment, type ReactNode } from 'react';

const URL_PATTERN =
  /\bhttps?:\/\/[^\s<>"')]+|\b(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:com|org|net|nyc|co|io|info|biz|us|app)(?:\/[^\s<>"')]*)?/gi;

const stripTrailingPunctuation = (raw: string): [string, string] => {
  const match = raw.match(/[.,;:!?)\]]+$/);
  if (!match) return [raw, ''];
  return [raw.slice(0, -match[0].length), match[0]];
};

const toHref = (raw: string) =>
  /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

export const linkifyText = (
  text: string,
  className = 'text-blue-600 hover:text-blue-800 underline underline-offset-2 break-words',
): ReactNode => {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index ?? 0;
    const [url, trailing] = stripTrailingPunctuation(match[0]);
    if (start > lastIndex) nodes.push(<Fragment key={key++}>{text.slice(lastIndex, start)}</Fragment>);
    nodes.push(
      <a
        key={key++}
        href={toHref(url)}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {url}
      </a>,
    );
    if (trailing) nodes.push(<Fragment key={key++}>{trailing}</Fragment>);
    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length) nodes.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  return nodes.length ? nodes : text;
};
