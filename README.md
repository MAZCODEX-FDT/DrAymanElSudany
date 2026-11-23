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
| API | Laravel 13 (PHP 8.3+) + MySQL/MariaDB in `backend/` (runs on Bluehost shared hosting) |

Brand tokens (colours, fonts) live in one place: the `@theme` block in `src/index.css`.
They follow brand guide v2 (Neuro Blue `#1B2D8F`, Signal Blue `#2E7BEF`, Pulse Orange `#F26A2E`, flat colours only; Outfit for English, Cairo/Tajawal for Arabic)
and are pending the doctor's approval.

## Local development

```bash
npm install
npm run dev:demo        # site + dashboard with demo data, no PHP needed (dashboard login: any email, password "demo")
```

With the real API (PHP 8.3+, Composer, MySQL or SQLite):

```bash
npm run build                       # also writes backend/database/data/seed.json (default website content)
cd backend
composer install
cp .env.example .env                # local: DB_CONNECTION=sqlite (delete the DB_* lines), APP_DEBUG=true, SESSION_SECURE_COOKIE=false
php artisan key:generate
php artisan migrate --seed          # tables + default website content
php artisan clinic:admin you@example.com   # dashboard admin (asks for a 10+ character password)
php artisan serve                   # API on :8000
cd .. && npm run dev                # Vite proxies /api, /sitemap.xml and /setup to :8000
cd backend && php artisan test      # API tests
```

If the API is unreachable the app falls back to demo data automatically and the dashboard shows a "Demo data" badge.

## Deploy to Bluehost (shared hosting)

Bluehost needs **PHP 8.3 or newer** (cPanel → MultiPHP Manager → set the domain to PHP 8.3).
The site goes in two folders: the built React site in `public_html`, and the Laravel app next to it in your home folder
(`~/drayman-app`), out of reach of the web. `public_html/index.php` loads the app from `../drayman-app`.

1. **Build:** `SITE_URL=https://<domain> bash scripts/package-bluehost.sh` (needs Node, PHP 8.3 and Composer). It writes
   `build/bluehost/public_html.zip` and `build/bluehost/drayman-app.zip`. GitHub Actions builds the same two zips on every push
   as the `bluehost-upload` artifact (set the repo variable `SITE_URL`), so you can download them instead of building locally.
2. **Database:** cPanel → MySQL Databases: create a database and user, give the user all privileges.
3. **Upload:** in cPanel File Manager, upload `drayman-app.zip` to your home folder (the one that *contains* `public_html`) and extract it.
   Upload `public_html.zip` to the home folder and extract it over `public_html` (turn on "Show hidden files" to see `.htaccess`).
4. **Config:** in `drayman-app`, copy `.env.example` to `.env` and fill in `APP_URL`, the `DB_*` details, a long random
   `CLINIC_SETUP_TOKEN` (20+ characters), and optionally `CLINIC_NOTIFY_EMAIL` with the `MAIL_*` settings of a cPanel email account.
5. **Setup:** open `https://<domain>/setup?token=<CLINIC_SETUP_TOKEN>`. It creates the app key, the tables and the default website
   content, then asks for the admin account (password 10+ characters). Afterwards **empty `CLINIC_SETUP_TOKEN` in `.env`**.
   With SSH instead: `php artisan key:generate && php artisan migrate --seed --force && php artisan clinic:admin you@example.com`.
   **Updates:** upload both zips again (keep `drayman-app/.env` and `public_html/uploads`), then run `/setup` again (or `php artisan migrate --force`).
6. Sign in at `https://<domain>/dashboard`, open **Settings**, and enter the phone, WhatsApp number, address, hours and map link
   exactly as they appear on the Google Business profile. The WhatsApp buttons go live once the number is set.
7. **Google Search Console:** add the domain as a URL-prefix property, choose "HTML file", and paste only the file name
   (e.g. `google1a2b3c.html`) into dashboard Settings → Google and analytics. The site answers that file itself.
   Then submit `https://<domain>/sitemap.xml`. On Bluehost it is generated live from the database (procedures and articles included).
8. **Google reviews (optional):** create a Google Cloud API key with *Places API (New)* enabled, restrict it to that API,
   put it in `drayman-app/.env` as `GOOGLE_PLACES_KEY`, and paste the clinic's Place ID into Settings. Rating and the latest
   4–5 star reviews refresh once a week (or press "Refresh Google reviews now").
9. **Analytics (optional):** paste the GA4 Measurement ID (`G-…`) and/or Meta Pixel ID into Settings. Page views, WhatsApp/call taps
   (`click_whatsapp`, `click_call`, Pixel `Contact`) and bookings (`generate_lead`, Pixel `Lead`) are sent with the procedure slug and the
   first page of the visit; no patient details are sent. Bookings also store landing page and source, shown in dashboard Analytics.
10. **Bookings to the clinic WhatsApp:** after sending the form the visitor gets a "send on WhatsApp" button with the booking
   summary. For automatic delivery without the visitor, fill the `WHATSAPP_CLOUD_*` lines in `.env` (WhatsApp Business Cloud API
   token, phone number ID, the clinic number, and an approved template with 5 body parameters: type, name, phone, reason, preferred day).

The Laravel app and `.env` sit outside `public_html`, so the web can't read them. Admin sessions use an HttpOnly,
SameSite=Strict cookie; writes must be JSON from the same origin; login and public forms are rate-limited per IP;
uploads are checked to be real images and `uploads/.htaccess` blocks scripts there.

## Before launch (waiting on the clinic)

- Approved address (three versions exist online), phone and WhatsApp number → dashboard Settings.
- Doctor's photo from the shoot day → `public/images/dr-ayman.webp` (the hero shows the brand mark until then).
- Approved CV, certificates and academic title → `src/data/content.js` (`about.credentials`).
- Doctor's review of every medical text in `src/data/procedures.js`, `src/data/faqs.js`, `src/data/content.js`.
- Domain, and final colour approval in the brand guide.
- Doctor's review of `src/data/visitGuide.js` (before-your-visit guide, fasting times) and `src/data/articles.js`.

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
  index.php        Bluehost entry point that loads the Laravel app from ../drayman-app
  .htaccess        HTTPS, /api → Laravel, everything else → React, caching
backend/           Laravel API: routes/web.php, app/Http/Controllers/Api, config/clinic.php (tables and columns
                   the dashboard may edit), database/migrations, tests/Feature/ApiTest.php
scripts/seo-files.mjs        sitemap.xml + robots.txt after build
scripts/package-bluehost.sh  the two zips to upload
```
