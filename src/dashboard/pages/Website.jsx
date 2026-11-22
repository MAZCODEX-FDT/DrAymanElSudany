import { useMemo, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ImagePlus, X, Stethoscope, HelpCircle, MapPin, UserRound, Images, Quote, ExternalLink } from 'lucide-react';
import { useLang } from '@/i18n';
import * as api from '@/lib/api';
import { imgSrc } from '@/lib/content';
import { MEDIA_SLOTS, ABOUT_KINDS } from '@/data/seed';
import { STOCK_SLOTS, STOCK_GALLERY, STOCK_NOTE } from '@/data/stock';
import { ProcedureIcon } from '@/components/ui/ProcedureIcon';
import { cn, withBase } from '@/lib/cn';
import { useResource } from '../useResource';
import { useD, Card, Drawer, DField, DInput, DTextarea, DSelect, DToggle, Btn, Empty, Segment } from '../ui';

// Website editor: every block of the public site that the clinic can add, edit, hide, reorder or delete.

const ICONS = ['diagnostic', 'carotid', 'aneurysm', 'avm', 'stroke', 'subdural', 'intracranial', 'vertebral', 'fistula', 'embolization', 'venous', 'spinal', 'vasospasm'];

// ---------- value helpers ----------
const getIn = (o, path) => path.split('.').reduce((v, k) => (v == null ? undefined : v[k]), o);
function setIn(o, path, value) {
  const [k, ...rest] = path.split('.');
  const base = o && typeof o === 'object' ? o : {};
  return { ...base, [k]: rest.length ? setIn(base[k], rest.join('.'), value) : value };
}
/** Bilingual fields: `name` → name_ar / name_en columns; `content.title` → content.title.ar / .en. */
const biPath = (key, lang) => (key.includes('.') ? `${key}.${lang}` : `${key}_${lang}`);

// ---------- field editors ----------
function ImageField({ value, onChange }) {
  const d = useD();
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      onChange(await api.upload(file));
    } catch (x) {
      setErr(x?.message || d('uploadFailed'));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-deep/10 bg-white">
          <img src={imgSrc(value)} alt="" className="aspect-[16/9] w-full object-cover" />
          <button type="button" onClick={() => onChange('')} className="absolute end-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#9a3b1e] shadow" aria-label={d('removeImage')}>
            <X size={16} />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-deep/20 bg-white text-sm text-slate hover:border-calm hover:text-deep">
          <ImagePlus size={22} />
          {busy ? d('uploading') : d('uploadImage')}
        </button>
      )}
      <div className="flex gap-2">
        <Btn type="button" variant="outline" disabled={busy} onClick={() => input.current?.click()} className="shrink-0">
          <ImagePlus size={15} /> {value ? d('replaceImage') : d('uploadImage')}
        </Btn>
        <DInput dir="ltr" placeholder={d('orImageLink')} value={value && !value.startsWith('data:') ? value : ''} onChange={(e) => onChange(e.target.value.trim())} />
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={pick} data-testid="image-input" />
      {err && <p className="text-xs text-[#9a3b1e]">{err}</p>}
    </div>
  );
}

function QaField({ value, onChange }) {
  const d = useD();
  const items = Array.isArray(value) ? value : [];
  const set = (i, path, v) => onChange(items.map((x, j) => (j === i ? setIn(x, path, v) : x)));
  return (
    <div className="space-y-3">
      {items.map((x, i) => (
        <div key={i} className="space-y-2 rounded-2xl border border-deep/10 bg-white p-3">
          <div className="flex items-center justify-between text-xs text-slate">
            <span>#{i + 1}</span>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="rounded-lg p-1 text-[#9a3b1e] hover:bg-[#9a3b1e]/10" aria-label={d('delete')}>
              <Trash2 size={14} />
            </button>
          </div>
          <DInput dir="rtl" placeholder={d('qAr')} value={x.q?.ar || ''} onChange={(e) => set(i, 'q.ar', e.target.value)} />
          <DTextarea rows={2} dir="rtl" placeholder={d('aAr')} value={x.a?.ar || ''} onChange={(e) => set(i, 'a.ar', e.target.value)} />
          <DInput dir="ltr" placeholder={d('qEn')} value={x.q?.en || ''} onChange={(e) => set(i, 'q.en', e.target.value)} />
          <DTextarea rows={2} dir="ltr" placeholder={d('aEn')} value={x.a?.en || ''} onChange={(e) => set(i, 'a.en', e.target.value)} />
        </div>
      ))}
      <Btn type="button" variant="outline" onClick={() => onChange([...items, { q: { ar: '', en: '' }, a: { ar: '', en: '' } }])}>
        <Plus size={15} /> {d('addQuestion')}
      </Btn>
    </div>
  );
}

function Field({ f, item, setItem, suggestions = {} }) {
  const d = useD();
  const { lang } = useLang();
  const label = d(f.label);
  if (f.type === 'image') return <DField label={label}><ImageField value={getIn(item, f.key) || ''} onChange={(v) => setItem(setIn(item, f.key, v))} /></DField>;
  if (f.type === 'qa') return <div><p className="mb-1.5 text-[13px] font-medium text-deep/75">{label}</p><QaField value={getIn(item, f.key)} onChange={(v) => setItem(setIn(item, f.key, v))} /></div>;
  if (f.type === 'select') {
    return (
      <DField label={label}>
        <DSelect value={getIn(item, f.key) ?? ''} onChange={(e) => setItem(setIn(item, f.key, e.target.value))}>
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label[lang] ?? o.label}
            </option>
          ))}
        </DSelect>
        {f.hint && <span className="mt-1.5 block text-xs text-slate">{typeof f.hint === 'function' ? f.hint(getIn(item, f.key)) : d(f.hint)}</span>}
      </DField>
    );
  }
  const langs = f.bi ? ['ar', 'en'] : [null];
  return (
    <>
      {langs.map((l) => {
        const path = l ? biPath(f.key, l) : f.key;
        const dir = l ? (l === 'ar' ? 'rtl' : 'ltr') : f.dir;
        const lbl = l ? `${label} (${l === 'ar' ? d('arabic') : d('english')})` : label;
        const raw = getIn(item, path);
        if (f.type === 'lines') {
          return (
            <DField key={path} label={`${lbl} · ${d('onePerLine')}`}>
              <DTextarea rows={4} dir={dir} value={Array.isArray(raw) ? raw.join('\n') : ''} onChange={(e) => setItem(setIn(item, path, e.target.value.split('\n')))} />
            </DField>
          );
        }
        if (f.type === 'area') {
          return (
            <DField key={path} label={lbl}>
              <DTextarea rows={f.rows || 4} dir={dir} value={raw ?? ''} onChange={(e) => setItem(setIn(item, path, e.target.value))} />
            </DField>
          );
        }
        const opts = suggestions[path] || [];
        const listId = opts.length ? `sg-${path.replace(/\W/g, '-')}` : undefined;
        return (
          <DField key={path} label={lbl}>
            <DInput dir={dir} list={listId} value={raw ?? ''} onChange={(e) => setItem(setIn(item, path, e.target.value))} />
            {listId && (
              <datalist id={listId}>
                {opts.map((o) => (
                  <option key={o} value={o} />
                ))}
              </datalist>
            )}
            {f.hint && l !== 'en' && <span className="mt-1.5 block text-xs text-slate">{d(f.hint)}</span>}
          </DField>
        );
      })}
    </>
  );
}

/** Lines are typed freely; empty lines are dropped only when saving. */
const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
function tidy(item, fields) {
  let out = item;
  // Same rule as the server: lowercase latin letters, digits and dashes.
  if ('slug' in out) out = { ...out, slug: slugify(out.slug) || slugify(out.content?.title?.en) || `page-${Date.now().toString(36)}` };
  for (const f of fields) {
    if (f.type !== 'lines') continue;
    for (const l of f.bi ? ['ar', 'en'] : [null]) {
      const path = l ? biPath(f.key, l) : f.key;
      const v = getIn(out, path);
      if (Array.isArray(v)) out = setIn(out, path, v.map((s) => s.trim()).filter(Boolean));
    }
  }
  return out;
}

// ---------- generic list editor ----------
function Collection({ resource, flag = 'enabled', sortable = true, blank, fields, title, hint, row, thumb, addLabel, publicLink, tools }) {
  const d = useD();
  const { lang } = useLang();
  const { items, loading, create, update, remove, reload } = useResource(resource);
  const [edit, setEdit] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [saving, setSaving] = useState(false);
  const suggestions = useMemo(() => {
    const out = {};
    for (const f of fields.filter((x) => x.suggest)) {
      for (const l of f.bi ? ['ar', 'en'] : [null]) {
        const path = l ? biPath(f.key, l) : f.key;
        out[path] = [...new Set(items.map((it) => getIn(it, path)).filter(Boolean))];
      }
    }
    return out;
  }, [items, fields]);
  const sorted = useMemo(() => (sortable ? [...items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0) || a.id - b.id) : items), [items, sortable]);

  const save = async () => {
    setSaving(true);
    try {
      const clean = tidy(edit, fields);
      if (clean.id) await update(clean.id, clean);
      else {
        await create({ ...clean, ...(sortable ? { sort: Math.max(0, ...items.map((x) => x.sort || 0)) + 1 } : {}) });
        if (sortable) await reload();
      }
      setEdit(null);
    } finally {
      setSaving(false);
    }
  };
  const move = async (i, dir) => {
    const next = [...sorted];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    await Promise.all(next.map((x, k) => (x.sort !== k + 1 ? update(x.id, { sort: k + 1 }) : null)));
  };
  const del = async (id) => {
    await remove(id);
    setConfirmDel(null);
    setEdit(null);
  };

  return (
    <Card
      title={title}
      action={
        <div className="flex gap-2">
          {tools?.({ items, create, update, reload })}
          {publicLink && (
            <a href={withBase(publicLink)} target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm text-deep hover:bg-deep/5">
              <ExternalLink size={15} /> <span className="hidden sm:inline">{d('viewOnSite')}</span>
            </a>
          )}
          <Btn onClick={() => setEdit(typeof blank === 'function' ? blank() : { ...blank })}>
            <Plus size={15} /> {d(addLabel || 'add')}
          </Btn>
        </div>
      }
    >
      {hint && <p className="-mt-2 mb-5 text-sm leading-relaxed text-slate">{hint}</p>}
      {loading && !items.length ? (
        <Empty>…</Empty>
      ) : sorted.length === 0 ? (
        <Empty>{d('empty')}</Empty>
      ) : (
        <ul className="space-y-2" data-testid={`list-${resource}`}>
          {sorted.map((it, i) => {
            const on = !!it[flag];
            const r = row(it, lang);
            const th = thumb?.(it);
            return (
              <li key={it.id} className={cn('flex items-center gap-3 rounded-2xl bg-[#f7f4ee] p-3 transition-opacity', !on && 'opacity-60')}>
                {sortable && (
                  <div className="flex flex-col">
                    <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-0.5 text-slate hover:text-deep disabled:opacity-25" aria-label={d('moveUp')}>
                      <ArrowUp size={14} />
                    </button>
                    <button onClick={() => move(i, 1)} disabled={i === sorted.length - 1} className="rounded p-0.5 text-slate hover:text-deep disabled:opacity-25" aria-label={d('moveDown')}>
                      <ArrowDown size={14} />
                    </button>
                  </div>
                )}
                {th !== undefined && (
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-white text-calm">
                    {typeof th === 'string' ? th ? <img src={imgSrc(th)} alt="" className="h-full w-full object-cover" /> : <ImagePlus size={18} className="text-slate/50" /> : th}
                  </div>
                )}
                <button onClick={() => setEdit(structuredClone(it))} className="min-w-0 flex-1 text-start">
                  <p className="truncate text-sm font-medium text-deep">{r.title || '—'}</p>
                  {r.sub && <p className="mt-0.5 truncate text-xs text-slate">{r.sub}</p>}
                </button>
                <DToggle checked={on} onChange={(v) => update(it.id, { [flag]: v })} label={<span className="hidden text-xs md:inline">{on ? d(flag === 'enabled' ? 'shown' : flag) : d('hidden')}</span>} />
                <button onClick={() => setEdit(structuredClone(it))} className="rounded-lg p-2 text-slate hover:bg-deep/5" aria-label={d('edit')}>
                  <Pencil size={15} />
                </button>
                {confirmDel === it.id ? (
                  <span className="flex items-center gap-1">
                    <Btn variant="danger" className="h-8 px-2.5 text-xs" onClick={() => del(it.id)}>
                      {d('confirmDelete')}
                    </Btn>
                    <button onClick={() => setConfirmDel(null)} className="rounded-lg p-1.5 text-slate hover:bg-deep/5" aria-label={d('cancel')}>
                      <X size={14} />
                    </button>
                  </span>
                ) : (
                  <button onClick={() => setConfirmDel(it.id)} className="rounded-lg p-2 text-[#9a3b1e]/70 hover:bg-[#9a3b1e]/10 hover:text-[#9a3b1e]" aria-label={d('delete')}>
                    <Trash2 size={15} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <Drawer
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? d('edit') : d(addLabel || 'add')}
        footer={
          <>
            <Btn onClick={save} disabled={saving}>
              {d('save')}
            </Btn>
            <Btn variant="ghost" onClick={() => setEdit(null)}>
              {d('cancel')}
            </Btn>
            {edit?.id &&
              (confirmDel === edit.id ? (
                <Btn variant="danger" className="ms-auto" onClick={() => del(edit.id)}>
                  {d('confirmDelete')}
                </Btn>
              ) : (
                <Btn variant="danger" className="ms-auto" onClick={() => setConfirmDel(edit.id)}>
                  {d('delete')}
                </Btn>
              ))}
          </>
        }
      >
        {edit && (
          <>
            {fields.map((f) => (
              <Field key={f.key} f={f} item={edit} setItem={setEdit} suggestions={suggestions} />
            ))}
            <DToggle checked={!!edit[flag]} onChange={(v) => setEdit({ ...edit, [flag]: v })} label={d(flag === 'enabled' ? 'showOnSite' : flag)} />
          </>
        )}
      </Drawer>
    </Card>
  );
}

/** Fills empty image places with stock photos so the site can be previewed before real photos exist. */
function StockButton({ items, create, update, reload }) {
  const d = useD();
  const [busy, setBusy] = useState(false);
  const empty = MEDIA_SLOTS.filter((s) => !items.some((m) => m.slot === s.slot && m.url));
  const noGallery = !items.some((m) => m.slot === 'gallery' && m.url);
  if (!empty.length && !noGallery) return null;
  const fill = async () => {
    setBusy(true);
    try {
      const alt = { alt_ar: STOCK_NOTE.ar, alt_en: STOCK_NOTE.en };
      for (const s of empty) {
        const row = items.find((m) => m.slot === s.slot);
        if (row) await update(row.id, { url: STOCK_SLOTS[s.slot], ...alt });
        else await create({ slot: s.slot, url: STOCK_SLOTS[s.slot], ...alt, enabled: true, sort: 1 });
      }
      if (noGallery) for (const [i, url] of STOCK_GALLERY.entries()) await create({ slot: 'gallery', url, ...alt, enabled: true, sort: 20 + i });
      await reload();
    } finally {
      setBusy(false);
    }
  };
  return (
    <Btn variant="outline" onClick={fill} disabled={busy} title={d('stockHint')}>
      <Images size={15} /> {busy ? d('uploading') : d('useStock')}
    </Btn>
  );
}

// ---------- tabs ----------
const bi = (ar = '', en = '') => ({ ar, en });
const kindLabel = { intro: bi('مقدمة', 'Intro'), statement: bi('جملة مميزة', 'Statement'), highlight: bi('رقم / إنجاز', 'Highlight'), section: bi('فقرة', 'Section'), step: bi('خطوة فى الكشف', 'Visit step'), credential: bi('شهادة / مؤهل', 'Credential') };
const slotLabel = (slot, lang) => (slot === 'gallery' ? (lang === 'en' ? 'Clinic gallery' : 'معرض صور العيادة') : MEDIA_SLOTS.find((s) => s.slot === slot)?.[lang] || slot);

function useTabs() {
  const d = useD();
  return {
    procedures: {
      resource: 'procedures',
      title: d('w_procedures'),
      hint: d('w_proceduresHint'),
      addLabel: 'addProcedure',
      publicLink: '/procedures',
      blank: () => ({ slug: '', icon: 'diagnostic', image: '', enabled: true, content: { title: bi(), short: bi(), whatIs: bi(), whoFor: { ar: [], en: [] }, steps: { before: bi(), during: bi(), after: bi() }, risky: bi(), costFactors: { ar: [], en: [] }, faqs: [] } }),
      thumb: (p) => (p.image ? p.image : <ProcedureIcon name={p.icon} className="h-7 w-7" />),
      row: (p, lang) => ({ title: p.content?.title?.[lang] || p.slug, sub: `/procedures/${p.slug}` }),
      fields: [
        { key: 'content.title', label: 'f_title', bi: true },
        { key: 'slug', label: 'f_slug', dir: 'ltr' },
        { key: 'icon', label: 'f_icon', type: 'select', options: ICONS.map((i) => ({ value: i, label: i })) },
        { key: 'image', label: 'f_image', type: 'image' },
        { key: 'content.short', label: 'f_short', type: 'area', rows: 2, bi: true },
        { key: 'content.whatIs', label: 'f_whatIs', type: 'area', bi: true },
        { key: 'content.whoFor', label: 'f_whoFor', type: 'lines', bi: true },
        { key: 'content.steps.before', label: 'f_before', type: 'area', rows: 2, bi: true },
        { key: 'content.steps.during', label: 'f_during', type: 'area', rows: 2, bi: true },
        { key: 'content.steps.after', label: 'f_after', type: 'area', rows: 2, bi: true },
        { key: 'content.risky', label: 'f_risky', type: 'area', rows: 3, bi: true },
        { key: 'content.costFactors', label: 'f_costFactors', type: 'lines', bi: true },
        { key: 'content.faqs', label: 'f_procFaqs', type: 'qa' },
      ],
    },
    faqs: {
      resource: 'faqs',
      flag: 'published',
      title: d('faqs'),
      hint: d('w_faqsHint'),
      addLabel: 'addQuestion',
      publicLink: '/faq',
      blank: { category_ar: '', category_en: '', q_ar: '', a_ar: '', q_en: '', a_en: '', published: true },
      row: (f, lang) => ({ title: f[`q_${lang}`] || f.q_ar, sub: [f[`category_${lang}`] || f.category_ar, f[`a_${lang}`] || f.a_ar].filter(Boolean).join(' · ') }),
      fields: [
        { key: 'category', label: 'f_category', bi: true, suggest: true, hint: 'f_categoryHint' },
        { key: 'q', label: 'f_question', bi: true },
        { key: 'a', label: 'f_answer', type: 'area', bi: true },
      ],
    },
    branches: {
      resource: 'branches',
      title: d('w_branches'),
      hint: d('w_branchesHint'),
      addLabel: 'addBranch',
      publicLink: '/about',
      blank: { name_ar: '', name_en: '', address_ar: '', address_en: '', hours_ar: '', hours_en: '', phone: '', whatsapp: '', map_url: '', lat: '', lng: '', image: '', enabled: true },
      thumb: (b) => b.image || <MapPin size={18} />,
      row: (b, lang) => ({ title: b[`name_${lang}`] || b.name_ar, sub: b[`address_${lang}`] || b.address_ar }),
      fields: [
        { key: 'name', label: 'f_name', bi: true },
        { key: 'address', label: 'f_address', type: 'area', rows: 2, bi: true },
        { key: 'hours', label: 'f_hours', bi: true },
        { key: 'phone', label: 's_phone', dir: 'ltr' },
        { key: 'whatsapp', label: 's_whatsapp', dir: 'ltr' },
        { key: 'map_url', label: 's_map_url', dir: 'ltr' },
        { key: 'lat', label: 'f_lat', dir: 'ltr', hint: 'f_latHint' },
        { key: 'lng', label: 'f_lng', dir: 'ltr' },
        { key: 'image', label: 'f_image', type: 'image' },
      ],
    },
    about: {
      resource: 'about',
      title: d('w_about'),
      hint: d('w_aboutHint'),
      addLabel: 'addBlock',
      publicLink: '/about',
      blank: { kind: 'section', title_ar: '', title_en: '', body_ar: '', body_en: '', image: '', enabled: true },
      thumb: (a) => a.image || <UserRound size={18} />,
      row: (a, lang) => ({ title: `${kindLabel[a.kind]?.[lang] || a.kind} · ${a[`title_${lang}`] || a.title_ar || (a[`body_${lang}`] || a.body_ar || '').slice(0, 60)}`, sub: a[`body_${lang}`] || a.body_ar }),
      fields: [
        { key: 'kind', label: 'f_kind', type: 'select', options: ABOUT_KINDS.map((k) => ({ value: k, label: kindLabel[k] })), hint: (k) => d(`kind_${k}`) },
        { key: 'title', label: 'f_title', bi: true },
        { key: 'body', label: 'f_body', type: 'area', rows: 5, bi: true },
        { key: 'image', label: 'f_image', type: 'image' },
      ],
    },
    media: {
      resource: 'media',
      title: d('w_images'),
      hint: d('w_imagesHint'),
      addLabel: 'addImage',
      blank: { slot: 'gallery', url: '', alt_ar: '', alt_en: '', enabled: true },
      thumb: (m) => m.url || '',
      tools: (api) => <StockButton {...api} />,
      row: (m, lang) => ({ title: slotLabel(m.slot, lang), sub: m.url ? m[`alt_${lang}`] || m.alt_ar : d('noImageYet') }),
      fields: [
        { key: 'slot', label: 'f_slot', type: 'select', options: [...MEDIA_SLOTS.map((s) => ({ value: s.slot, label: { ar: s.ar, en: s.en } })), { value: 'gallery', label: bi('معرض صور العيادة (صفحة «عن الدكتور»)', 'Clinic gallery (About page)') }] },
        { key: 'url', label: 'f_image', type: 'image' },
        { key: 'alt', label: 'f_alt', bi: true },
      ],
    },
    testimonials: {
      resource: 'testimonials',
      flag: 'approved',
      sortable: false,
      title: d('testimonials'),
      hint: d('testimonialsHint'),
      blank: { quote_ar: '', quote_en: '', author: '', source: 'Vezeeta', rating: 5, approved: false },
      row: (t, lang) => ({ title: `«${t[`quote_${lang}`] || t.quote_ar}»`, sub: ['★'.repeat(Number(t.rating) || 5), t.author, t.source].filter(Boolean).join(' · ') }),
      fields: [
        { key: 'quote', label: 'f_quote', type: 'area', bi: true },
        { key: 'author', label: 'author' },
        { key: 'source', label: 'source' },
        { key: 'rating', label: 'f_rating', type: 'select', options: [5, 4, 3, 2, 1].map((n) => ({ value: n, label: '★'.repeat(n) })) },
      ],
    },
  };
}

const TAB_ICONS = { procedures: Stethoscope, faqs: HelpCircle, branches: MapPin, about: UserRound, media: Images, testimonials: Quote };

export default function Website() {
  const d = useD();
  const tabs = useTabs();
  const [tab, setTab] = useState(() => sessionStorage.getItem('aes-website-tab') || 'procedures');
  const choose = (t) => {
    setTab(t);
    try {
      sessionStorage.setItem('aes-website-tab', t);
    } catch {
      /* optional */
    }
  };
  const cfg = tabs[tab] || tabs.procedures;
  const Icon = TAB_ICONS[tab] || Stethoscope;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-deep">{d('content')}</h1>
        <p className="mt-1 text-sm text-slate">{d('w_intro')}</p>
      </div>
      <div className="scroll-thin -mx-1 overflow-x-auto px-1 pb-1">
        <Segment value={tab} onChange={choose} options={Object.keys(tabs).map((k) => [k, tabs[k].title])} />
      </div>
      {api.isDemo() && <p className="rounded-2xl bg-amber/10 px-4 py-3 text-sm text-[#8a5a1e]">{d('w_demoNote')}</p>}
      <Collection
        key={tab}
        {...cfg}
        title={
          <span className="inline-flex items-center gap-2">
            <Icon size={18} className="text-calm" /> {cfg.title}
          </span>
        }
      />
    </div>
  );
}
