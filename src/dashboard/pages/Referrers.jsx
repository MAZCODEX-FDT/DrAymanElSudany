import { useState } from 'react';
import { Plus, Pencil, FileCheck2 } from 'lucide-react';
import { useLang } from '@/i18n';
import { useResource } from '../useResource';
import { useD, Card, Drawer, DField, DInput, DToggle, Btn, Empty, fmtDate, todayIso } from '../ui';

const blank = { name: '', specialty: '', city: '', phone: '', cases_count: 0, last_referral: todayIso(), report_sent: false };

/** Referral network: the promise is "your patient returns to you with a full report". */
export default function Referrers() {
  const d = useD();
  const { lang } = useLang();
  const { items, create, update, remove } = useResource('referrers');
  const [edit, setEdit] = useState(null);
  const set = (k) => (e) => setEdit({ ...edit, [k]: e.target.value });
  const save = async () => {
    const v = { ...edit, cases_count: Number(edit.cases_count) || 0 };
    if (v.id) await update(v.id, v);
    else await create(v);
    setEdit(null);
  };
  const total = items.reduce((s, r) => s + Number(r.cases_count || 0), 0);
  const pending = items.filter((r) => !r.report_sent).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-deep">{d('referrers')}</h1>
        <Btn onClick={() => setEdit({ ...blank })}>
          <Plus size={16} /> {d('add')}
        </Btn>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate">{d('referrers')}</p>
          <p className="font-display mt-2 text-3xl text-deep">{items.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate">{d('casesCount')}</p>
          <p className="font-display mt-2 text-3xl text-deep">{total}</p>
        </Card>
        <Card className={pending ? 'border-amber/40' : ''}>
          <p className="text-sm text-slate">{lang === 'en' ? 'Reports still owed' : 'تقارير لسه متبعتتش'}</p>
          <p className="font-display mt-2 text-3xl text-deep">{pending}</p>
        </Card>
      </div>
      {items.length === 0 ? (
        <Empty>{d('empty')}</Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((r) => (
            <Card key={r.id} className="group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg text-deep">{r.name}</p>
                  <p className="text-sm text-slate">
                    {r.specialty} · {r.city}
                  </p>
                </div>
                <button onClick={() => setEdit({ ...r })} className="rounded-lg p-2 text-slate hover:bg-deep/5" aria-label={d('edit')}>
                  <Pencil size={15} />
                </button>
              </div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-slate">
                  {d('casesCount')}: <b className="text-deep">{r.cases_count}</b>
                </span>
                <span className="text-slate">
                  {d('lastReferral')}: {fmtDate(r.last_referral, lang)}
                </span>
              </div>
              <div className="mt-4 border-t border-deep/[.07] pt-4">
                <DToggle checked={!!r.report_sent} onChange={(v) => update(r.id, { report_sent: v })} label={<span className="inline-flex items-center gap-1.5"><FileCheck2 size={15} className="text-calm" /> {d('reportSent')}</span>} />
              </div>
            </Card>
          ))}
        </div>
      )}
      <Drawer
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? d('edit') : d('add')}
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
            <DField label={d('name')}>
              <DInput value={edit.name} onChange={set('name')} />
            </DField>
            <div className="grid grid-cols-2 gap-4">
              <DField label={d('specialty')}>
                <DInput value={edit.specialty} onChange={set('specialty')} />
              </DField>
              <DField label={d('city')}>
                <DInput value={edit.city} onChange={set('city')} />
              </DField>
            </div>
            <DField label={d('phone')}>
              <DInput value={edit.phone} onChange={set('phone')} dir="ltr" />
            </DField>
            <div className="grid grid-cols-2 gap-4">
              <DField label={d('casesCount')}>
                <DInput type="number" min="0" value={edit.cases_count} onChange={set('cases_count')} />
              </DField>
              <DField label={d('lastReferral')}>
                <DInput type="date" value={edit.last_referral || ''} onChange={set('last_referral')} />
              </DField>
            </div>
            <DToggle checked={!!edit.report_sent} onChange={(v) => setEdit({ ...edit, report_sent: v })} label={d('reportSent')} />
          </>
        )}
      </Drawer>
    </div>
  );
}
