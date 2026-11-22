import { Fragment } from 'react';

/**
 * The small text format used by articles in the dashboard:
 * a blank line starts a new paragraph, "## " is a heading, "- " is a bullet. Nothing else, so nothing can break the page.
 */
export function RichText({ text = '', className }) {
  const blocks = [];
  let list = null;
  for (const raw of text.replace(/\r/g, '').split('\n')) {
    const line = raw.trim();
    if (line.startsWith('- ')) {
      if (!list) blocks.push((list = { type: 'ul', items: [] }));
      list.items.push(line.slice(2));
      continue;
    }
    list = null;
    if (!line) blocks.push({ type: 'gap' });
    else if (line.startsWith('## ')) blocks.push({ type: 'h2', text: line.slice(3) });
    else {
      const last = blocks[blocks.length - 1];
      if (last?.type === 'p') last.text += ` ${line}`;
      else blocks.push({ type: 'p', text: line });
    }
  }
  return (
    <div className={className}>
      {blocks.map((b, i) => (
        <Fragment key={i}>
          {b.type === 'h2' && <h2 className="font-display mt-10 text-2xl text-deep sm:text-3xl">{b.text}</h2>}
          {b.type === 'p' && <p className="mt-5 text-lg leading-loose text-ink/80">{b.text}</p>}
          {b.type === 'ul' && (
            <ul className="mt-5 space-y-3">
              {b.items.map((it, j) => (
                <li key={j} className="flex gap-3 text-lg leading-relaxed text-ink/80">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" /> {it}
                </li>
              ))}
            </ul>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export const plainText = (text = '') => text.replace(/^## |^- /gm, '').replace(/\s+/g, ' ').trim();
