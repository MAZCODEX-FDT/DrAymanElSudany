// Stock photos (Unsplash licence) for previewing the site before the clinic's own photos exist.
// They are NOT Dr. Ayman or his clinic: replace every one from Dashboard > Website > Images.
const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

export const STOCK_NOTE = { ar: 'صورة استوك للمعاينة، استبدلها بصورة حقيقية', en: 'Stock photo for preview, replace with a real one' };

/** One photo per fixed slot. */
export const STOCK_SLOTS = {
  // hero_doctor: none, the banner uses the real cut-out in public/images.
  // home_doctor / about_doctor: none, the site uses the real photos in public/images.
  for_doctors: u('1551076805-e1869033e561'),
  book: u('1631217868264-e5b90bb7e133'),
};

/** Clinic gallery (About page + home). */
export const STOCK_GALLERY = [
  u('1538108149393-fbbd81895907'),
  u('1519494026892-80bbd2d6fd0d'),
  u('1530497610245-94d3c16cda28'),
  u('1576091160399-112ba8d25d1d'),
  u('1579684385127-1ef15d508118'),
  u('1559757175-5700dde675bc'),
];

export const STOCK_BRANCH = u('1538108149393-fbbd81895907');
