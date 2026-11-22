import { Seo } from '@/site/Seo';
import { Hero } from '@/site/home/Hero';
import { DoctorIntro } from '@/site/home/DoctorIntro';
import { Proof } from '@/site/home/Proof';
import { Manifesto } from '@/site/home/Manifesto';
import { Procedures } from '@/site/home/Procedures';
import { Journey } from '@/site/home/Journey';
import { Personas } from '@/site/home/Personas';
import { Voices } from '@/site/home/Voices';
import { Cost } from '@/site/home/Cost';
import { FaqPreview } from '@/site/home/FaqPreview';
import { DoctorsBand, ClosingCta } from '@/site/home/ClosingCta';
import { ScanReview, ClinicGallery } from '@/site/home/Extras';
import { BranchSection } from '@/site/BranchCards';

export default function Home() {
  return (
    <>
      <Seo />
      <Hero />
      <DoctorIntro />
      <Proof />
      <Manifesto />
      <Procedures />
      <Journey />
      <Personas />
      <ScanReview />
      <Voices />
      <ClinicGallery />
      <Cost />
      <FaqPreview />
      <BranchSection />
      <DoctorsBand />
      <ClosingCta />
    </>
  );
}
