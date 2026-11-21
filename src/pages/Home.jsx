import { Seo } from '@/site/Seo';
import { Hero } from '@/site/home/Hero';
import { Proof } from '@/site/home/Proof';
import { Manifesto } from '@/site/home/Manifesto';
import { Procedures } from '@/site/home/Procedures';
import { Journey } from '@/site/home/Journey';
import { Personas } from '@/site/home/Personas';
import { Voices } from '@/site/home/Voices';
import { Cost } from '@/site/home/Cost';
import { FaqPreview } from '@/site/home/FaqPreview';
import { DoctorsBand, ClosingCta } from '@/site/home/ClosingCta';

export default function Home() {
  return (
    <>
      <Seo />
      <Hero />
      <Proof />
      <Manifesto />
      <Procedures />
      <Journey />
      <Personas />
      <Voices />
      <Cost />
      <FaqPreview />
      <DoctorsBand />
      <ClosingCta />
    </>
  );
}
