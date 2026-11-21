// Demo data so the site and dashboard work without the PHP API (local preview, design review).
// Names are fictional.

const KEY = 'aes-demo-v2';

function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const first = ['أحمد', 'محمد', 'محمود', 'مصطفى', 'هبة', 'منى', 'سامية', 'عادل', 'خالد', 'نادية', 'إبراهيم', 'فاطمة', 'سعيد', 'رانيا', 'حسن', 'ليلى', 'طارق', 'عبير', 'شريف', 'ياسمين'];
const last = ['عبد الرحمن', 'السيد', 'فوزي', 'الشناوي', 'عبد الله', 'منصور', 'حسنين', 'رشاد', 'الجمال', 'عطية', 'زكي', 'سليمان'];
const cities = ['العبور', 'الشروق', 'بدر', 'العاشر من رمضان', 'الزقازيق', 'بنها', 'مدينة نصر'];
const reasons = ['كشف واستشارة', 'رأي تاني في قسطرة', 'متابعة بعد قسطرة', 'أعراض جلطة سابقة', 'صداع أو دوخة مستمرة'];
const procs = ['diagnostic-cerebral-angiography', 'carotid-stenting', 'brain-aneurysm', 'avm', 'acute-stroke', 'chronic-subdural-hematoma'];
const docs = [
  { name: 'د. وائل عبد الحميد', specialty: 'مخ وأعصاب', city: 'العبور' },
  { name: 'د. سحر الدسوقي', specialty: 'باطنة', city: 'الزقازيق' },
  { name: 'د. ممدوح فرج', specialty: 'مخ وأعصاب', city: 'بنها' },
  { name: 'د. إيمان رفعت', specialty: 'قلب', city: 'الشروق' },
  { name: 'د. هشام البنا', specialty: 'مخ وأعصاب', city: 'العاشر من رمضان' },
];

const pad = (n) => String(n).padStart(2, '0');
export const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function seed() {
  const r = rng(42);
  const pick = (a) => a[Math.floor(r() * a.length)];
  const name = () => `${pick(first)} ${pick(last)}`;
  const phone = () => `01${pick(['0', '1', '2', '5'])}${Math.floor(10000000 + r() * 89999999)}`;
  const now = new Date();
  const day = (offset) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    return d;
  };
  let id = 1;

  const appointments = [];
  for (let off = -30; off <= 7; off++) {
    const d = day(off);
    if (d.getDay() === 5) continue; // Friday off
    const count = 3 + Math.floor(r() * 7);
    for (let i = 0; i < count; i++) {
      const hour = 17 + Math.floor(i / 2);
      const status = off < 0 ? (r() < 0.08 ? 'no_show' : 'completed') : off === 0 ? pick(['confirmed', 'arrived', 'completed', 'confirmed']) : pick(['requested', 'confirmed', 'confirmed']);
      appointments.push({
        id: id++,
        patient_name: name(),
        phone: phone(),
        date: isoDate(d),
        time: `${pad(hour)}:${i % 2 ? '30' : '00'}`,
        reason: pick(reasons),
        status,
        source: pick(['website', 'whatsapp', 'whatsapp', 'phone', 'referral', 'vezeeta']),
        notes: '',
        created_at: day(off - 2).toISOString(),
      });
    }
  }

  const leads = [];
  for (let i = 0; i < 22; i++) {
    const created = new Date(now.getTime() - r() * 9 * 864e5);
    const type = pick(['booking', 'booking', 'booking', 'referral', 'contact']);
    const responded = r() < 0.75 ? new Date(created.getTime() + (3 + r() * 40) * 6e4).toISOString() : null;
    leads.push({
      id: id++,
      type,
      name: type === 'referral' ? pick(docs).name : name(),
      phone: phone(),
      payload: type === 'referral' ? { patient: name(), summary: 'ضيق في الشريان السباتي الأيمن 70% بالدوبلكس', urgency: pick(['routine', 'soon', 'urgent']) } : { reason: pick(reasons), relation: pick(['self', 'parent', 'other']), hasScans: r() < 0.6 },
      label: type === 'referral' ? 'referring_doctor' : pick(['new', 'booking', 'cath_candidate', 'follow_up']),
      status: responded ? 'handled' : 'open',
      created_at: created.toISOString(),
      responded_at: responded,
    });
  }
  leads.sort((a, b) => b.created_at.localeCompare(a.created_at));

  const stages = ['candidate', 'explained', 'deciding', 'scheduled', 'done', 'follow_up'];
  const cases = [];
  for (let i = 0; i < 14; i++) {
    cases.push({
      id: id++,
      patient_name: name(),
      phone: phone(),
      procedure: pick(procs),
      stage: stages[Math.min(5, Math.floor(r() * 6))],
      referring_doctor: r() < 0.5 ? pick(docs).name : '',
      next_follow_up: isoDate(day(Math.floor(r() * 14) - 3)),
      notes: 'الأهل محتاجين شرح تاني للخطوات.',
      created_at: day(-Math.floor(r() * 40)).toISOString(),
    });
  }

  const referrers = docs.map((d, i) => ({
    id: id++,
    ...d,
    phone: phone(),
    cases_count: 1 + Math.floor(r() * 6),
    last_referral: isoDate(day(-Math.floor(r() * 30))),
    report_sent: i % 3 !== 0,
  }));

  const patients = [];
  for (let i = 0; i < 18; i++) {
    patients.push({
      id: id++,
      name: name(),
      phone: phone(),
      age: 38 + Math.floor(r() * 35),
      city: pick(cities),
      condition: pick(['ضيق الشريان السباتي', 'تمدد شريان بالمخ', 'جلطة سابقة', 'صداع مزمن', 'تشوه شرياني وريدي', 'نزيف مزمن تحت الأم الجافية']),
      summary: 'تمت مراجعة الأشعة. محتاج قسطرة تشخيصية لتحديد الخطوة الجاية. تم شرح الحالة للمريض وابنه.',
      last_visit: isoDate(day(-Math.floor(r() * 60))),
    });
  }

  const events = [];
  for (let off = -29; off <= 0; off++) {
    const d = day(off);
    const n = 6 + Math.floor(r() * 18) + (off + 30) / 3;
    for (let i = 0; i < n; i++) {
      d.setHours(9 + Math.floor(r() * 13), Math.floor(r() * 60));
      events.push({ id: id++, type: pick(['whatsapp', 'whatsapp', 'whatsapp', 'call', 'map', 'form']), page: pick(['/', '/procedures/carotid-stenting', '/book', '/faq', '/procedures/acute-stroke']), created_at: d.toISOString() });
    }
  }

  return {
    appointments,
    leads,
    cases,
    referrers,
    patients,
    events,
    testimonials: [],
    faqs: [],
    settings: {
      phone: '',
      whatsapp: '',
      address_ar: 'مدينة العبور، [العنوان المعتمد]',
      address_en: 'Obour City, [approved address]',
      map_url: 'https://maps.google.com/?q=Obour+City',
      hours_ar: 'السبت إلى الخميس، 5 مساءً إلى 10 مساءً',
      hours_en: 'Saturday to Thursday, 5 PM to 10 PM',
      review_url: '',
      facebook: '',
      instagram: '',
      youtube: '',
      tiktok: '',
      google_reviews: 4,
      google_reviews_goal: 35,
    },
    _id: id,
  };
}

let cache = null;
export function db() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? JSON.parse(raw) : seed();
  } catch {
    cache = seed();
  }
  return cache;
}
export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* storage unavailable: keep in memory */
  }
}
export function resetDemo() {
  cache = seed();
  save();
}
export function nextId() {
  const d = db();
  d._id = (d._id || 1000) + 1;
  return d._id;
}
