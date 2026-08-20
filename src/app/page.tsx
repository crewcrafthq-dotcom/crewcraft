import { redirect } from 'next/navigation';

import { AppLineup } from '@/components/marketing/AppLineup';
import { DemoModal } from '@/components/marketing/DemoModal';
import { Faq } from '@/components/marketing/Faq';
import { FinalCta } from '@/components/marketing/FinalCta';
import { Hero } from '@/components/marketing/Hero';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { OutputShowcase } from '@/components/marketing/OutputShowcase';
import { Pain } from '@/components/marketing/Pain';
import { Pricing } from '@/components/marketing/Pricing';
import { Reveal } from '@/components/marketing/Reveal';
import { ScrollDepth } from '@/components/marketing/ScrollDepth';
import { SiteFooter } from '@/components/marketing/SiteFooter';
import { SocialProof } from '@/components/marketing/SocialProof';
import { Stats } from '@/components/marketing/Stats';
import { StickyCtaBar } from '@/components/marketing/StickyCtaBar';
import { TradeSections } from '@/components/marketing/TradeSections';
import { TradeSelector } from '@/components/marketing/TradeSelector';
import { TryItDemo } from '@/components/marketing/TryItDemo';
import { WhyToolbelt } from '@/components/marketing/WhyToolbelt';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Structured data: Organization + WebSite. Google requires an aggregateRating
// or review on SoftwareApplication for it to validate — we refuse to fake one,
// so that block stays out until real ratings exist (Capterra/Trustpilot). When
// they do, reintroduce SoftwareApplication with the real aggregateRating.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://crewcraftapp.com/#org',
      name: 'Crewcraft',
      url: 'https://crewcraftapp.com',
      logo: 'https://crewcraftapp.com/icon-512.png',
      email: 'support@crewcraftapp.com',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://crewcraftapp.com/#website',
      name: 'Toolbelt by Crewcraft',
      url: 'https://crewcraftapp.com',
      description:
        'AI estimate software for HVAC, plumbing, electrical & roofing contractors — estimates, e-sign, invoices, online payments and follow-ups at one flat price.',
      publisher: { '@id': 'https://crewcraftapp.com/#org' },
    },
  ],
};

export default async function LandingPage() {
  const { user, business } = await getSession();
  if (user) redirect(business ? '/dashboard' : '/onboarding');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {/* room for the sticky mobile CTA so it never covers the footer */}
      <div className="overflow-x-hidden pb-20 lg:pb-0">
        <Hero />
        <Stats />
        <Reveal><TryItDemo /></Reveal>
        <Reveal><Pain /></Reveal>
        <Reveal><HowItWorks /></Reveal>
        <WhyToolbelt />
        <Reveal><TradeSelector /></Reveal>
        <TradeSections />
        <Reveal><OutputShowcase /></Reveal>
        <Reveal><SocialProof /></Reveal>
        <Reveal><AppLineup /></Reveal>
        <Reveal><Pricing /></Reveal>
        <Reveal><Faq /></Reveal>
        <Reveal><FinalCta /></Reveal>
        <SiteFooter />
      </div>
      <DemoModal />
      <StickyCtaBar />
      <ScrollDepth />
    </>
  );
}
