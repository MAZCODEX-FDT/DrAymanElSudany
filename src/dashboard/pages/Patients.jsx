import { useMemo, useState } from 'react';
import { Plus, Search, Printer } from 'lucide-react';
import { useLang } from '@/i18n';
import { useSettings } from '@/lib/settings';
import { useResource } from '../useResource';
import { useD, Card, Drawer, DField, DInput, DTextarea, Btn, Empty, fmtDate, todayIso } from '../ui';

const blank = { name: '', phone: '', age: '', city: '', condition: '', summary: '', last_visit: todayIso() };

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Printable "case summary" sheet the patient and family leave with (plan DE5). */
function printSummary(p, settings) {
  const w = window.open('', '_blank', 'width=800,height=1000');
  if (!w) return;
  w.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>ملخص الحالة - ${esc(p.name)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@700&family=Tajawal:wght@400;500&display=swap" rel="stylesheet">
  <style>body{font-family:Tajawal,sans-serif;color:#121521;margin:0;padding:48px;background:#fff}h1{font-family:Cairo;color:#1B2D8F;margin:0;font-size:26px}
  .top{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #1B2D8F;padding-bottom:18px}.dot{width:12px;height:12px;border-radius:50%;background:#F26A2E;display:inline-block;margin-inline-start:8px}
  .muted{color:#5B6275;font-size:13px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:28px 0}.box{background:#FFFFFF;border-radius:12px;padding:12px 14px}
  h2{font-family:Cairo;color:#1B2D8F;font-size:18px;margin:28px 0 10px}.lines{border:1px solid #DCE5FA;border-radius:12px;padding:16px;min-height:120px;line-height:2}
  footer{margin-top:40px;border-top:1px solid #DCE5FA;padding-top:14px;display:flex;justify-content:space-between}@media print{body{padding:24px}}</style></head><body>
  <div class="top"><div><h1>د. أيمن حسن السودانى<span class="dot"></span></h1><div class="muted">مخ وأعصاب · قسطرة المخ</div></div><div class="muted">ملخص الحالة<br>${esc(fmtDate(todayIso(), 'ar'))}</div></div>
  <div class="grid"><div class="box"><div class="muted">الاسم</div>${esc(p.name)}</div><div class="box"><div class="muted">السن</div>${esc(p.age)}</div><div class="box"><div class="muted">المدينة</div>${esc(p.city)}</div></div>
  <h2>الحالة</h2><div class="lines">${esc(p.condition)}</div>
  <h2>هل محتاجة قسطرة؟ والخطوات</h2><div class="lines">${esc(p.summary).replace(/\n/g, '<br>')}</div>
  <h2>ميعاد المتابعة</h2><div class="lines" style="min-height:40px"></div>
  <footer><span class="muted">واتساب العيادة: <b dir="ltr">${esc(settings.whatsapp || '')}</b></span><span class="muted">${esc(settings.address_ar || '')}</span></footer>
  <script>setTimeout(()=>print(),600)</script></body></html>`);
  w.document.close();
}

export default function Patients() {
  const d = useD();
  const { lang } = useLang();
  const settings = useSettings();
  const { items, create, update, remove } = useResource('patients');
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null);
  const rows = useMemo(() => items.filter((p) => !q || `${p.name} ${p.phone} ${p.condition}`.includes(q)), [items, q]);
  const set = (k) => (e) => setEdit({ ...edit, [k]: e.target.value });
  const save = async () => {
    if (edit.id) await update(edit.id, edit);
    else await create(edit);
    setEdit(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-deep">{d('patients')}</h1>
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate" />
            <DInput value={q} onChange={(e) => setQ(e.target.value)} placeholder={d('search')} className="ps-9" />
          </div>
          <Btn onClick={() => setEdit({ ...blank })}>
            <Plus size={16} /> {d('add')}
          </Btn>
        </div>
      </div>
      {rows.length === 0 ? (
        <Empty>{d('empty')}</Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((p) => (
            <button key={p.id} onClick={() => setEdit({ ...p })} className="text-start">
              <Card className="h-full transition-all hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg text-deep">{p.name}</p>
                    <p className="text-sm text-slate">
                      {p.age} · {p.city}
                    </p>
                  </div>
                  <span className="text-xs text-slate">{fmtDate(p.last_visit, lang)}</span>
                </div>
                <p className="mt-4 inline-block rounded-full bg-mist/70 px-3 py-1 text-xs text-deep">{p.condition}</p>
                <p className="mt-3 line-clamp-2 text-sm text-ink/65">{p.summary}</p>
              </Card>
            </button>
          ))}
        </div>
      )}
      <Drawer
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? edit.name : d('add')}
        footer={
          <>
            <Btn onClick={save}>{d('save')}</Btn>
            {edit?.id && (
              <Btn variant="outline" onClick={() => printSummary(edit, settings)}>
                <Printer size={16} /> {d('printSummary')}
              </Btn>
            )}
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
            <div className="grid grid-cols-3 gap-4">
              <DField label={d('phone')}>
                <DInput value={edit.phone} onChange={set('phone')} dir="ltr" />
              </DField>
              <DField label={d('age')}>
                <DInput type="number" value={edit.age} onChange={set('age')} />
              </DField>
              <DField label={d('city')}>
                <DInput value={edit.city} onChange={set('city')} />
              </DField>
            </div>
            <DField label={d('condition')}>
              <DInput value={edit.condition} onChange={set('condition')} />
            </DField>
            <DField label={d('summary')}>
              <DTextarea rows={7} value={edit.summary} onChange={set('summary')} />
            </DField>
            <DField label={d('lastVisit')}>
              <DInput type="date" value={edit.last_visit || ''} onChange={set('last_visit')} />
            </DField>
          </>
        )}
      </Drawer>
    </div>
  );
}
