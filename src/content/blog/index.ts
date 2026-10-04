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
import * as best_estimate_software_for_contractors from './best-estimate-software-for-contractors';
import * as hvac_estimate_software from './hvac-estimate-software';
import * as plumbing_estimate_software from './plumbing-estimate-software';
import * as electrical_estimate_software from './electrical-estimate-software';
import * as roofing_estimate_software from './roofing-estimate-software';
import * as ai_estimation_software_for_trades from './ai-estimation-software-for-trades';
import * as how_to_write_a_plumbing_estimate from './how-to-write-a-plumbing-estimate';
import * as how_to_write_an_hvac_estimate from './how-to-write-an-hvac-estimate';
import * as how_to_write_a_roofing_estimate from './how-to-write-a-roofing-estimate';
import * as how_to_write_an_electrical_estimate from './how-to-write-an-electrical-estimate';
import * as free_estimate_template_for_contractors from './free-estimate-template-for-contractors';
import * as send_estimates_from_the_field from './send-estimates-from-the-field';
import * as estimates_from_the_truck from './estimates-from-the-truck';
import * as stop_doing_estimates_after_hours from './stop-doing-estimates-after-hours';
import * as estimate_software_vs_excel_for_contractors from './estimate-software-vs-excel-for-contractors';
import * as fastest_way_to_send_plumbing_estimates from './fastest-way-to-send-plumbing-estimates';

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
  best_estimate_software_for_contractors,
  hvac_estimate_software,
  plumbing_estimate_software,
  electrical_estimate_software,
  roofing_estimate_software,
  ai_estimation_software_for_trades,
  how_to_write_a_plumbing_estimate,
  how_to_write_an_hvac_estimate,
  how_to_write_a_roofing_estimate,
  how_to_write_an_electrical_estimate,
  free_estimate_template_for_contractors,
  send_estimates_from_the_field,
  estimates_from_the_truck,
  stop_doing_estimates_after_hours,
  estimate_software_vs_excel_for_contractors,
  fastest_way_to_send_plumbing_estimates,
].sort((a, b) => (a.meta.published < b.meta.published ? 1 : -1));

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.meta.slug === slug);
}
