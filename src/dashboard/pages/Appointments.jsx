import { useMemo, useState } from 'react';
import { Plus, Search, Pencil } from 'lucide-react';
import { useLang } from '@/i18n';
import { useResource } from '../useResource';
import { useD, Card, pillTones, Drawer, DField, DInput, DSelect, DTextarea, Btn, Segment, Empty, fmtDate, todayIso } from '../ui';

export const STATUSES = ['requested', 'confirmed', 'arrived', 'completed', 'no_show', 'cancelled'];
export const SOURCES = ['website', 'whatsapp', 'phone', 'referral', 'vezeeta'];
const blank = { patient_name: '', phone: '', date: todayIso(), time: '17:00', reason: '', status: 'confirmed', source: 'phone', notes: '' };

export function AppointmentForm({ value, onChange }) {
  const d = useD();
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });
  return (
    <>
      <DField label={d('name')}>
        <DInput value={value.patient_name} onChange={set('patient_name')} required />
      </DField>
      <DField label={d('phone')}>
        <DInput value={value.phone} onChange={set('phone')} dir="ltr" />
      </DField>
      <div className="grid grid-cols-2 gap-4">
        <DField label={d('date')}>
          <DInput type="date" value={value.date} onChange={set('date')} />
        </DField>
        <DField label={d('time')}>
          <DInput type="time" step="900" value={value.time} onChange={set('time')} />
        </DField>
      </div>
      <DField label={d('reason')}>
        <DInput value={value.reason} onChange={set('reason')} />
      </DField>
      <div className="grid grid-cols-2 gap-4">
        <DField label={d('status')}>
          <DSelect value={value.status} onChange={set('status')}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {d(`st_${s}`)}
              </option>
            ))}
          </DSelect>
        </DField>
        <DField label={d('source')}>
          <DSelect value={value.source} onChange={set('source')}>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {d(`src_${s}`)}
              </option>
            ))}
          </DSelect>
        </DField>
      </div>
      <DField label={d('notes')}>
        <DTextarea value={value.notes} onChange={set('notes')} />
      </DField>
    </>
  );
}

export default function Appointments() {
  const d = useD();
  const { lang } = useLang();
  const { items, create, update, remove } = useResource('appointments');
  const [range, setRange] = useState('today');
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null);
  const today = todayIso();

  const rows = useMemo(() => {
    let r = items;
    if (range === 'today') r = r.filter((a) => a.date === today);
    if (range === 'upcoming') r = r.filter((a) => a.date > today);
    if (range === 'past') r = r.filter((a) => a.date < today);
    if (status) r = r.filter((a) => a.status === status);
    if (q) r = r.filter((a) => `${a.patient_name} ${a.phone}`.includes(q));
    return [...r].sort((a, b) => (range === 'past' ? -1 : 1) * `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  }, [items, range, status, q, today]);

  const save = async () => {
    if (edit.id) await update(edit.id, edit);
    else await create(edit);
    setEdit(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-deep">{d('appointments')}</h1>
        <Btn onClick={() => setEdit({ ...blank })}>
          <Plus size={16} /> {d('add')}
        </Btn>
      </div>
      <Card>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Segment value={range} onChange={setRange} options={[['today', d('today')], ['upcoming', d('upcoming')], ['past', d('past')], ['all', d('all')]]} />
          <DSelect value={status} onChange={(e) => setStatus(e.target.value)} className="!w-auto">
            <option value="">{d('status')}: {d('all')}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {d(`st_${s}`)}
              </option>
            ))}
          </DSelect>
          <div className="relative ms-auto w-full sm:w-64">
            <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate" />
            <DInput value={q} onChange={(e) => setQ(e.target.value)} placeholder={d('search')} className="ps-9" />
          </div>
        </div>
        {rows.length === 0 ? (
          <Empty>{d('empty')}</Empty>
        ) : (
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-start text-xs text-slate">
                  {['date', 'time', 'name', 'phone', 'reason', 'source', 'status', ''].map((h) => (
                    <th key={h} className="border-b border-deep/[.07] px-3 pb-3 text-start font-medium">
                      {h && d(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id} className="group border-b border-deep/[.05] transition-colors hover:bg-[#f7f4ee]">
                    <td className="px-3 py-3 text-slate">{fmtDate(a.date, lang)}</td>
                    <td className="px-3 py-3 font-mono text-deep" dir="ltr">
                      {a.time}
                    </td>
                    <td className="px-3 py-3 font-medium text-deep">{a.patient_name}</td>
                    <td className="px-3 py-3 text-slate" dir="ltr">
                      <a href={`tel:${a.phone}`} className="hover:text-calm">
                        {a.phone}
                      </a>
                    </td>
                    <td className="max-w-[180px] truncate px-3 py-3 text-ink/70">{a.reason}</td>
                    <td className="px-3 py-3 text-slate">{d(`src_${a.source}`)}</td>
                    <td className="px-3 py-3">
                      <select value={a.status} onChange={(e) => update(a.id, { status: e.target.value })} className={`cursor-pointer appearance-none rounded-full px-3 py-1 text-xs font-medium outline-none ${pillTones[a.status]}`} aria-label={d('status')}>
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {d(`st_${s}`)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3 text-end">
                      <button onClick={() => setEdit({ ...a })} className="rounded-lg p-2 text-slate opacity-60 transition hover:bg-deep/5 hover:text-deep group-hover:opacity-100" aria-label={d('edit')}>
                        <Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
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
              <Btn
                variant="danger"
                className="ms-auto"
                onClick={async () => {
                  await remove(edit.id);
                  setEdit(null);
                }}
              >
                {d('delete')}
              </Btn>
            )}
          </>
        }
      >
        {edit && <AppointmentForm value={edit} onChange={setEdit} />}
      </Drawer>
    </div>
  );
}
