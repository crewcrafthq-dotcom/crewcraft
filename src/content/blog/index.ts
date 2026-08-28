import type { PostMeta } from './types';

import * as hvacEstimate from './hvac-estimate-includes';
import * as waterHeater from './water-heater-pricing';
import * as roofing from './roofing-estimate-wins';
import * as panel from './panel-upgrade-estimate';
import * as ghosted from './why-estimates-get-ghosted';
import * as deposits from './contractor-deposits-guide';
import * as best_estimating_software_for_small_contractors from './best-estimating-software-for-small-contractors';
import * as essential_features_in_estimating_software from './essential-features-in-estimating-software';
import * as how_to_choose_estimating_software from './how-to-choose-estimating-software';
import * as does_digital_estimating_improve_bid_accuracy from './does-digital-estimating-improve-bid-accuracy';
import * as roi_of_estimating_software from './roi-of-estimating-software';
import * as estimating_software_pricing_guide from './estimating-software-pricing-guide';
import * as free_trials_and_demos_estimating_software from './free-trials-and-demos-estimating-software';
import * as integrating_estimating_with_other_tools from './integrating-estimating-with-other-tools';
import * as software_support_and_adoption_pitfalls from './software-support-and-adoption-pitfalls';
import * as how_to_read_contractor_software_reviews from './how-to-read-contractor-software-reviews';

export interface BlogPost {
  meta: PostMeta;
  Body: () => JSX.Element;
}

/** All Field Guide posts, newest first. Add new posts at the top. */
export const BLOG_POSTS: BlogPost[] = [
  hvacEstimate,
  waterHeater,
  roofing,
  panel,
  ghosted,
  deposits,
  best_estimating_software_for_small_contractors,
  essential_features_in_estimating_software,
  how_to_choose_estimating_software,
  does_digital_estimating_improve_bid_accuracy,
  roi_of_estimating_software,
  estimating_software_pricing_guide,
  free_trials_and_demos_estimating_software,
  integrating_estimating_with_other_tools,
  software_support_and_adoption_pitfalls,
  how_to_read_contractor_software_reviews,
].sort((a, b) => (a.meta.published < b.meta.published ? 1 : -1));

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.meta.slug === slug);
}
