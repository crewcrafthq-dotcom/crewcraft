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
import { SiteFooter } from '@/components/marketing/SiteFooter';
import { SocialProof } from '@/components/marketing/SocialProof';
import { StickyCtaBar } from '@/components/marketing/StickyCtaBar';
import { TradeSelector } from '@/components/marketing/TradeSelector';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const { user, business } = await getSession();
  if (user) redirect(business ? '/dashboard' : '/onboarding');

  return (
    <>
      {/* room for the sticky mobile CTA so it never covers the footer */}
      <div className="overflow-x-hidden pb-20 lg:pb-0">
        <Hero />
        <DemoStrip />
        <Pain />
        <HowItWorks />
        <TradeSelector />
        <OutputShowcase />
        <SocialProof />
        <AppLineup />
        <Pricing />
        <Faq />
        <FinalCta />
        <SiteFooter />
      </div>
      <StickyCtaBar />
    </>
  );
}
