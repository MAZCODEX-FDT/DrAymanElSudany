import { defaultArticles } from './articles.js';
// Default website content in database shape. Used to fill the demo data and, through
// scripts/seed-content.mjs → api/seed.json, the MySQL tables the first time setup.php runs.
// After that everything here is edited from the dashboard (Website section).
import { procedures } from './procedures.js';
import { defaultFaqs } from './faqs.js';
import { about } from './content.js';

/** Fixed image places on the site. `gallery` rows are free to add. */
export const MEDIA_SLOTS = [
  { slot: 'hero_doctor', ar: 'صورة الدكتور فى البانر', en: 'Doctor photo in the banner' },
  { slot: 'home_doctor', ar: 'صورة الدكتور فى قسم «عن الدكتور» بالرئيسية', en: 'Doctor photo in the home “About the doctor” section' },
  { slot: 'about_doctor', ar: 'صورة صفحة «عن الدكتور»', en: 'About page photo' },
  { slot: 'for_doctors', ar: 'صورة صفحة «للأطباء»', en: 'For Doctors page photo' },
  { slot: 'book', ar: 'صورة صفحة الحجز', en: 'Booking page photo' },
];

export const ABOUT_KINDS = ['intro', 'statement', 'highlight', 'section', 'step', 'credential'];

export function seedContent() {
  const procs = procedures.map((p, i) => ({
    slug: p.slug,
    icon: p.icon,
    image: '',
    content: { title: p.title, short: p.short, whatIs: p.whatIs, whoFor: p.whoFor, steps: p.steps, risky: p.risky, costFactors: p.costFactors, faqs: p.faqs || [] },
    enabled: true,
    sort: i + 1,
  }));

  const faqs = defaultFaqs.map((f, i) => ({ category_ar: f.category?.ar || '', category_en: f.category?.en || '', q_ar: f.q.ar, a_ar: f.a.ar, q_en: f.q.en, a_en: f.a.en, published: true, sort: i + 1 }));

  const branches = [
    {
      name_ar: 'العيادة الرئيسية',
      name_en: 'Main clinic',
      address_ar: 'مدينة العبور، [العنوان المعتمد]',
      address_en: 'Obour City, [approved address]',
      hours_ar: 'السبت إلى الخميس، 5 مساءً إلى 10 مساءً',
      hours_en: 'Saturday to Thursday, 5 PM to 10 PM',
      phone: '',
      whatsapp: '',
      map_url: 'https://maps.google.com/?q=Obour+City',
      image: '',
      enabled: true,
      sort: 1,
    },
  ];

  const row = (kind, sort, title, body) => ({ kind, title_ar: title.ar, title_en: title.en, body_ar: body.ar, body_en: body.en, image: '', enabled: true, sort });
  const none = { ar: '', en: '' };
  const aboutRows = [
    row('intro', 1, { ar: 'عن الدكتور', en: 'About the doctor' }, about.intro),
    row('statement', 2, none, about.philosophy),
    row('highlight', 3, { ar: '715+', en: '715+' }, { ar: 'تقييم من المرضى على فيزيتا، بمتوسط 4.5', en: 'patient reviews on Vezeeta, averaging 4.5' }),
    row('highlight', 4, { ar: '58', en: '58' }, { ar: 'مرة اتكتب عنه «مستمع جيد»', en: 'reviews call him “a good listener”' }),
    row('highlight', 5, { ar: 'الأول', en: 'First' }, { ar: 'أول قسطرة مخية فى الشرقية، أكتوبر 2026', en: 'brain catheterization performed in Sharqia, October 2026' }),
    ...about.sections.map((x, i) => row('section', 10 + i, x.title, x.body)),
    ...about.steps.map((x, i) => row('step', 20 + i, x.title, x.body)),
    ...about.credentials.map((c, i) => row('credential', 30 + i, c, none)),
  ];

  const media = MEDIA_SLOTS.map((m, i) => ({ slot: m.slot, url: '', alt_ar: 'د. أيمن حسن السودانى', alt_en: 'Dr. Ayman Hassan El Sudany', enabled: true, sort: i + 1 }));

  return { procedures: procs, faqs, branches, about: aboutRows, media, articles: defaultArticles };
}
