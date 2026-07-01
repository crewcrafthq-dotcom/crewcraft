import { redirect } from 'next/navigation';

import { AppLineup } from '@/components/marketing/AppLineup';
import { DemoStrip } from '@/components/marketing/DemoStrip';
import { Faq } from '@/components/marketing/Faq';
import { FinalCta } from '@/components/marketing/FinalCta';
import { Hero } from '@/components/marketing/Hero';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { OutputShowcase } from '@/components/marketing/OutputShowcase';
import { Pain } from '@/components/marketing/Pain';
import { Pricing } from '@/components/marketing/Pricing';
import { Reveal } from '@/components/marketing/Reveal';
import { SiteFooter } from '@/components/marketing/SiteFooter';
import { SocialProof } from '@/components/marketing/SocialProof';
import { Stats } from '@/components/marketing/Stats';
import { StickyCtaBar } from '@/components/marketing/StickyCtaBar';
import { TradeSelector } from '@/components/marketing/TradeSelector';
import { WhyToolbelt } from '@/components/marketing/WhyToolbelt';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Structured data so Google understands this is a SaaS product with pricing.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://crewcraftapp.com/#org',
      name: 'Crewcraft',
      url: 'https://crewcraftapp.com',
      logo: 'https://crewcraftapp.com/og.png',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Toolbelt by Crewcraft',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://crewcraftapp.com',
      description:
        'Type the job in plain English and send a branded estimate in under a minute. Built for HVAC, plumbing, electrical & roofing contractors.',
      publisher: { '@id': 'https://crewcraftapp.com/#org' },
      offers: [
        { '@type': 'Offer', name: 'Founding', price: '19', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Pro Monthly', price: '29', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Pro Annual', price: '288', priceCurrency: 'USD' },
      ],
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
        <Reveal><DemoStrip /></Reveal>
        <Reveal><Pain /></Reveal>
        <Reveal><HowItWorks /></Reveal>
        <WhyToolbelt />
        <Reveal><TradeSelector /></Reveal>
        <Reveal><OutputShowcase /></Reveal>
        <Reveal><SocialProof /></Reveal>
        <Reveal><AppLineup /></Reveal>
        <Reveal><Pricing /></Reveal>
        <Reveal><Faq /></Reveal>
        <Reveal><FinalCta /></Reveal>
        <SiteFooter />
      </div>
      <StickyCtaBar />
    </>
  );
}
