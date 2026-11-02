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
import * as markup_vs_margin_for_contractors from './markup-vs-margin-for-contractors';
import * as how_much_should_a_contractor_charge_per_hour from './how-much-should-a-contractor-charge-per-hour';
import * as how_to_build_a_contractor_price_book from './how-to-build-a-contractor-price-book';
import * as how_to_follow_up_on_an_estimate from './how-to-follow-up-on-an-estimate';
import * as hvac_fall_tune_up_season from './hvac-fall-tune-up-season';
import * as how_to_invoice_as_a_contractor from './how-to-invoice-as-a-contractor';
import * as contractor_invoice_template from './contractor-invoice-template';
import * as roofing_supplements_after_a_storm from './roofing-supplements-after-a-storm';
import * as contractor_payment_terms from './contractor-payment-terms';
import * as how_to_get_paid_faster_as_a_contractor from './how-to-get-paid-faster-as-a-contractor';
import * as what_to_do_when_a_customer_wont_pay from './what-to-do-when-a-customer-wont-pay';
import * as change_order_template_for_contractors from './change-order-template-for-contractors';
import * as hvac_maintenance_plans_recurring_revenue from './hvac-maintenance-plans-recurring-revenue';
import * as how_to_get_more_google_reviews_as_a_contractor from './how-to-get-more-google-reviews-as-a-contractor';
import * as google_business_profile_for_contractors from './google-business-profile-for-contractors';
import * as winter_plumbing_and_frozen_pipe_season from './winter-plumbing-and-frozen-pipe-season';
import * as quoting_standby_generator_installs from './quoting-standby-generator-installs';
import * as job_site_photo_documentation from './job-site-photo-documentation';
import * as scheduling_software_for_contractors from './scheduling-software-for-contractors';
import * as permit_tracking_for_contractors from './permit-tracking-for-contractors';
import * as how_to_price_a_service_call from './how-to-price-a-service-call';
import * as good_better_best_pricing_for_contractors from './good-better-best-pricing-for-contractors';
import * as how_to_get_more_contractor_leads from './how-to-get-more-contractor-leads';
import * as contractor_insurance_explained from './contractor-insurance-explained';
import * as job_costing_for_contractors from './job-costing-for-contractors';
import * as contractor_website_essentials from './contractor-website-essentials';
import * as roof_inspection_checklist from './roof-inspection-checklist';
import * as material_price_increases_and_quoting from './material-price-increases-and-quoting';
import * as contractor_warranty_terms from './contractor-warranty-terms';
import * as how_to_respond_to_a_bad_review from './how-to-respond-to-a-bad-review';
import * as hiring_your_first_employee_in_the_trades from './hiring-your-first-employee-in-the-trades';
import * as quoting_ev_charger_installs from './quoting-ev-charger-installs';

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
  markup_vs_margin_for_contractors,
  how_much_should_a_contractor_charge_per_hour,
  how_to_build_a_contractor_price_book,
  how_to_follow_up_on_an_estimate,
  hvac_fall_tune_up_season,
  how_to_invoice_as_a_contractor,
  contractor_invoice_template,
  roofing_supplements_after_a_storm,
  contractor_payment_terms,
  how_to_get_paid_faster_as_a_contractor,
  what_to_do_when_a_customer_wont_pay,
  change_order_template_for_contractors,
  hvac_maintenance_plans_recurring_revenue,
  how_to_get_more_google_reviews_as_a_contractor,
  google_business_profile_for_contractors,
  winter_plumbing_and_frozen_pipe_season,
  quoting_standby_generator_installs,
  job_site_photo_documentation,
  scheduling_software_for_contractors,
  permit_tracking_for_contractors,
  how_to_price_a_service_call,
  good_better_best_pricing_for_contractors,
  how_to_get_more_contractor_leads,
  contractor_insurance_explained,
  job_costing_for_contractors,
  contractor_website_essentials,
  roof_inspection_checklist,
  material_price_increases_and_quoting,
  contractor_warranty_terms,
  how_to_respond_to_a_bad_review,
  hiring_your_first_employee_in_the_trades,
  quoting_ev_charger_installs,
].sort((a, b) => (a.meta.published < b.meta.published ? 1 : -1));

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.meta.slug === slug);
}
