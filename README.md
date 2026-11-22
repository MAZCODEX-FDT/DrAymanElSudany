# Dr. Ayman El Sudany — Website & Dashboard

Bilingual (Arabic RTL first, English under `/en`) website and clinic dashboard for
**Dr. Ayman Hassan El Sudany**, neurology and brain catheterization (neuro-intervention), Obour City.
Built by MAZCODEX.

- **Public site:** home, about the doctor, six procedure pages, for referring doctors, FAQ, booking.
- **Dashboard** (`/dashboard`): overview KPIs and charts, appointments with entry times, cath-case pipeline (kanban),
  inbox for website requests (WhatsApp Business labels, response-time tracking), referring doctors,
  patients with a printable written case summary, testimonials and FAQ editing, click analytics, clinic settings.

Content rules from the strategy plan are built in: no prices anywhere ("what determines the cost" instead),
no promise of results, no surgery imagery, sticky WhatsApp button with click tracking on every page,
Physician / MedicalProcedure / FAQPage schema. **All medical copy in `src/data/` is a draft for the doctor to approve.**

## Stack

| Layer | Tech |
| --- | --- |
| UI | React 18, Vite 8, Tailwind CSS 4 |
| Motion | GSAP 3 + ScrollTrigger (`@gsap/react`), Lenis smooth scroll (driven by GSAP's ticker) |
| Components | React Bits (copied into `src/components/reactbits/`: Threads, BlurText, ShinyText, GradientText, CountUp, SpotlightCard, Magnet, AnimatedContent, ScrollReveal) and shadcn / 21st.dev-style primitives in `src/components/ui/` |
| Charts | Recharts (dashboard only, lazy-loaded) |
| API | Plain PHP 8.1+ with PDO + MySQL/MariaDB in `public/api/` (runs on Bluehost shared hosting) |

Brand tokens (colours, fonts) live in one place: the `@theme` block in `src/index.css`.
They follow brand guide v2 (Neuro Blue `#1B2D8F`, Signal Blue `#2E7BEF`, Pulse Orange `#F26A2E`, flat colours only; Outfit for English, Cairo/Tajawal for Arabic)
and are pending the doctor's approval.

## Local development

```bash
npm install
npm run dev:demo        # site + dashboard with demo data, no PHP needed (dashboard login: any email, password "demo")
```

With the real API:

```bash
cp public/api/config.sample.php public/api/config.php   # fill in a local MySQL database
php -S localhost:8000 -t public                         # serves /api
npm run dev                                             # Vite proxies /api to :8000
# then open http://localhost:8000/api/setup.php?token=<setup_token> once to create tables + the admin user
```

If the API is unreachable the app falls back to demo data automatically and the dashboard shows a "Demo data" badge.

## Deploy to Bluehost (shared hosting)

1. **Build:** `SITE_URL=https://<domain> npm run build`. The whole site is in `dist/` (including `.htaccess` and `api/`).
   GitHub Actions also builds every push and attaches `dist` as the `site-dist` artifact (set the repo variable `SITE_URL`).
2. **Database:** cPanel → MySQL Databases: create a database and user, give the user all privileges.
3. **Upload** the contents of `dist/` to the domain's document root (usually `public_html/`), including the hidden `.htaccess` files.
4. **Config:** on the server, copy `api/config.sample.php` to `api/config.php` and fill in the database details,
   a long random `setup_token`, and optionally `notify_email` for new booking/referral emails.
5. **Setup:** open `https://<domain>/api/setup.php?token=<setup_token>`, create the admin account (password 10+ characters),
   then **delete `api/setup.php`** from the server.
6. Sign in at `https://<domain>/dashboard`, open **Settings**, and enter the phone, WhatsApp number, address, hours and map link
   exactly as they appear on the Google Business profile. The WhatsApp buttons go live once the number is set.
7. Submit `https://<domain>/sitemap.xml` in Google Search Console.

`api/.htaccess` blocks web access to `config.php`, `lib.php` and `schema.sql`. Admin sessions use an HttpOnly,
SameSite=Strict cookie; writes must be JSON from the same origin; login and public forms are rate-limited per IP.

## Before launch (waiting on the clinic)

- Approved address (three versions exist online), phone and WhatsApp number → dashboard Settings.
- Doctor's photo from the shoot day → `public/images/dr-ayman.webp` (the hero shows the brand mark until then).
- Approved CV, certificates and academic title → `src/data/content.js` (`about.credentials`).
- Doctor's review of every medical text in `src/data/procedures.js`, `src/data/faqs.js`, `src/data/content.js`.
- Domain, and final colour approval in the brand guide.

## Project map

```
src/
  i18n/            language context + UI strings (ar / en)
  data/            procedures, FAQ, content blocks (drafts for doctor approval)
  lib/             api client (+ demo fallback), Lenis/GSAP setup, settings
  components/      reactbits/ and ui/ primitives
  site/            layout, navbar, footer, WhatsApp button, home sections
  pages/           public pages
  dashboard/       dashboard shell, pages, strings
public/
  api/             PHP API, schema, one-time setup
  .htaccess        SPA routing, HTTPS, caching
scripts/seo-files.mjs   sitemap.xml + robots.txt after build
```
