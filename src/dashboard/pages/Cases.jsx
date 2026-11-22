import { useState } from 'react';
import { Plus, CalendarClock, Stethoscope, GripVertical } from 'lucide-react';
import { useLang } from '@/i18n';
import { useProcedures } from '../useResource';
import { useResource } from '../useResource';
import { useD, Drawer, DField, DInput, DSelect, DTextarea, Btn, fmtDate, todayIso } from '../ui';
import { cn } from '@/lib/cn';

export const STAGES = ['candidate', 'explained', 'deciding', 'scheduled', 'done', 'follow_up'];
const stageTone = { candidate: 'bg-amber', explained: 'bg-calm', deciding: 'bg-[#9DBBF7]', scheduled: 'bg-deep', done: 'bg-[#4f8f69]', follow_up: 'bg-slate' };
const blank = { patient_name: '', phone: '', procedure: 'diagnostic-cerebral-angiography', stage: 'candidate', referring_doctor: '', next_follow_up: todayIso(), notes: '' };

/** Cath pipeline: every candidate case is tracked by name with a follow-up date (strategy p.8). */
export default function Cases() {
  const d = useD();
  const { list: procedures, get: getProcedure } = useProcedures();
  const { lang, L } = useLang();
  const { items, create, update, remove } = useResource('cases');
  const [edit, setEdit] = useState(null);
  const [over, setOver] = useState(null);
  const today = todayIso();

  const set = (k) => (e) => setEdit({ ...edit, [k]: e.target.value });
  const save = async () => {
    if (edit.id) await update(edit.id, edit);
    else await create(edit);
    setEdit(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-deep">{d('cases')}</h1>
          <p className="mt-1 text-sm text-slate">{lang === 'en' ? 'Drag a case to move it to the next stage.' : 'اسحب الحالة لنقلها للمرحلة الجاية.'}</p>
        </div>
        <Btn onClick={() => setEdit({ ...blank })}>
          <Plus size={16} /> {d('add')}
        </Btn>
      </div>
      <div className="scroll-thin -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8">
        {STAGES.map((s) => {
          const col = items.filter((c) => c.stage === s);
          return (
            <div
              key={s}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(s);
              }}
              onDragLeave={() => setOver(null)}
              onDrop={(e) => {
                const id = Number(e.dataTransfer.getData('text/plain'));
                setOver(null);
                if (id) update(id, { stage: s });
              }}
              className={cn('flex w-72 shrink-0 flex-col rounded-3xl bg-white/60 p-3 transition-all', over === s && 'bg-mist/70 ring-2 ring-calm/30')}
            >
              <div className="flex items-center gap-2 px-2 pb-3 pt-1">
                <span className={cn('h-2.5 w-2.5 rounded-full', stageTone[s])} />
                <span className="font-display text-[15px] text-deep">{d(`sg_${s}`)}</span>
                <span className="ms-auto rounded-full bg-deep/5 px-2 py-0.5 font-mono text-xs text-slate">{col.length}</span>
              </div>
              <div className="flex min-h-24 flex-col gap-2.5">
                {col.map((c) => {
                  const due = c.next_follow_up && c.next_follow_up <= today && s !== 'done';
                  return (
                    <article
                      key={c.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', String(c.id))}
                      onClick={() => setEdit({ ...c })}
                      className="group cursor-grab rounded-2xl border border-deep/[.07] bg-white p-4 shadow-[0_10px_30px_-24px_rgba(15,59,87,.6)] transition-all hover:-translate-y-0.5 active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-deep">{c.patient_name}</p>
                        <GripVertical size={15} className="text-slate/40" />
                      </div>
                      <p className="mt-1 text-xs text-calm">{L(getProcedure(c.procedure)?.title) || c.procedure}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                        {c.next_follow_up && (
                          <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5', due ? 'bg-amber/15 text-[#B8461A]' : 'bg-deep/5 text-slate')}>
                            <CalendarClock size={11} /> {fmtDate(c.next_follow_up, lang)}
                          </span>
                        )}
                        {c.referring_doctor && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-mist/70 px-2 py-0.5 text-deep">
                            <Stethoscope size={11} /> {c.referring_doctor}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <Drawer
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? edit.patient_name : d('add')}
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
              <DInput value={edit.patient_name} onChange={set('patient_name')} />
            </DField>
            <DField label={d('phone')}>
              <DInput value={edit.phone} onChange={set('phone')} dir="ltr" />
            </DField>
            <DField label={d('procedure')}>
              <DSelect value={edit.procedure} onChange={set('procedure')}>
                {procedures.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {L(p.title)}
                  </option>
                ))}
              </DSelect>
            </DField>
            <div className="grid grid-cols-2 gap-4">
              <DField label={d('status')}>
                <DSelect value={edit.stage} onChange={set('stage')}>
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {d(`sg_${s}`)}
                    </option>
                  ))}
                </DSelect>
              </DField>
              <DField label={d('nextFollowUp')}>
                <DInput type="date" value={edit.next_follow_up || ''} onChange={set('next_follow_up')} />
              </DField>
            </div>
            <DField label={d('referringDoctor')}>
              <DInput value={edit.referring_doctor} onChange={set('referring_doctor')} />
            </DField>
            <DField label={d('notes')}>
              <DTextarea value={edit.notes} onChange={set('notes')} />
            </DField>
          </>
        )}
      </Drawer>
    </div>
  );
}
