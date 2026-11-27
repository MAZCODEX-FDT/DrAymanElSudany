import { useEffect } from 'react';
import { useLang } from '@/i18n';

const DEFAULTS = {
  ar: { title: 'د. أيمن السودانى | استشارى مخ وأعصاب وقسطرة المخ', desc: 'د. أيمن حسن السودانى، استشارى مخ وأعصاب وقسطرة المخ. دكتور بيسمعك، بيشرح لأهلك بلغة بسيطة، وبيرد عليك بسرعة.' },
  en: { title: 'Dr. Ayman El Sudany | Neurology & Brain Catheterization', desc: 'Dr. Ayman Hassan El Sudany, consultant in neurology and brain catheterization. A doctor who listens, explains simply to your family, and replies fast.' },
};

function setMeta(name, content, attr = 'name') {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Per-page title, description and optional JSON-LD (MedicalProcedure, FAQPage). */
export function Seo({ title, description, jsonLd }) {
  const { lang } = useLang();
  useEffect(() => {
    const d = DEFAULTS[lang];
    document.title = title ? `${title} | ${lang === 'en' ? 'Dr. Ayman El Sudany' : 'د. أيمن السودانى'}` : d.title;
    setMeta('description', description || d.desc);
    setMeta('og:title', document.title, 'property');
    setMeta('og:description', description || d.desc, 'property');
    let script;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.page = '1';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => script?.remove();
  }, [title, description, jsonLd, lang]);
  return null;
}
