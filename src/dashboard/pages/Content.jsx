import { useState } from 'react';
import { Plus, Pencil, Quote, HelpCircle } from 'lucide-react';
import { useResource } from '../useResource';
import { useD, Card, Drawer, DField, DInput, DTextarea, DToggle, Btn, Empty, Pill } from '../ui';

function Section({ resource, title, hint, icon: Icon, blank, fields, renderItem, flag }) {
  const d = useD();
  const { items, create, update, remove } = useResource(resource);
  const [edit, setEdit] = useState(null);
  const save = async () => {
    if (edit.id) await update(edit.id, edit);
    else await create(edit);
    setEdit(null);
  };
  return (
    <Card
      title={
        <span className="inline-flex items-center gap-2">
          <Icon size={18} className="text-calm" /> {title}
        </span>
      }
      action={
        <Btn variant="outline" onClick={() => setEdit({ ...blank })}>
          <Plus size={15} /> {d('add')}
        </Btn>
      }
    >
      <p className="-mt-2 mb-5 text-sm text-slate">{hint}</p>
      {items.length === 0 ? (
        <Empty>{d('empty')}</Empty>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.id} className="flex items-start gap-3 rounded-2xl bg-[#F6F6F8] p-4">
              <div className="flex-1">{renderItem(it)}</div>
              <Pill tone={it[flag] ? 'handled' : 'cancelled'}>{d(flag)}</Pill>
              <button onClick={() => setEdit({ ...it })} className="rounded-lg p-1.5 text-slate hover:bg-deep/5" aria-label={d('edit')}>
                <Pencil size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Drawer
        open={!!edit}
        onClose={() => setEdit(null)}
        title={title}
        footer={
          <>
            <Btn onClick={save}>{d('save')}</Btn>
            <Btn variant="ghost" onClick={() => setEdit(null)}>
              {d('cancel')}
            </Btn>
            {edit?.id && (
              <Btn variant="danger" className="ms-auto" onClick={async () => (await remove(edit.id), setEdit(null))}>
                {d('delete')}
              </Btn>
            )}
          </>
        }
      >
        {edit && (
          <>
            {fields.map(([k, label, type, dir]) => (
              <DField key={k} label={d(label)}>
                {type === 'area' ? (
                  <DTextarea dir={dir} value={edit[k] || ''} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} />
                ) : (
                  <DInput dir={dir} value={edit[k] || ''} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} />
                )}
              </DField>
            ))}
            <DToggle checked={!!edit[flag]} onChange={(v) => setEdit({ ...edit, [flag]: v })} label={d(flag)} />
          </>
        )}
      </Drawer>
    </Card>
  );
}

export default function Content() {
  const d = useD();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-deep">{d('content')}</h1>
      <div className="grid gap-6 xl:grid-cols-2">
        <Section
          resource="testimonials"
          title={d('testimonials')}
          hint={d('testimonialsHint')}
          icon={Quote}
          flag="approved"
          blank={{ quote_ar: '', quote_en: '', author: '', source: 'Vezeeta', approved: false }}
          fields={[
            ['quote_ar', 'quoteAr', 'area', 'rtl'],
            ['quote_en', 'quoteEn', 'area', 'ltr'],
            ['author', 'author'],
            ['source', 'source'],
          ]}
          renderItem={(t) => (
            <>
              <p className="text-sm text-ink">«{t.quote_ar}»</p>
              <p className="mt-1 text-xs text-slate">
                {t.author} · {t.source}
              </p>
            </>
          )}
        />
        <Section
          resource="faqs"
          title={d('faqs')}
          hint={d('faqsHint')}
          icon={HelpCircle}
          flag="published"
          blank={{ q_ar: '', a_ar: '', q_en: '', a_en: '', published: true }}
          fields={[
            ['q_ar', 'qAr', 'text', 'rtl'],
            ['a_ar', 'aAr', 'area', 'rtl'],
            ['q_en', 'qEn', 'text', 'ltr'],
            ['a_en', 'aEn', 'area', 'ltr'],
          ]}
          renderItem={(f) => (
            <>
              <p className="text-sm font-medium text-deep">{f.q_ar}</p>
              <p className="mt-1 line-clamp-2 text-xs text-slate">{f.a_ar}</p>
            </>
          )}
        />
      </div>
    </div>
  );
}
