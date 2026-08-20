import type { PostMeta } from './types';

import * as hvacEstimate from './hvac-estimate-includes';
import * as waterHeater from './water-heater-pricing';
import * as roofing from './roofing-estimate-wins';
import * as panel from './panel-upgrade-estimate';
import * as ghosted from './why-estimates-get-ghosted';
import * as deposits from './contractor-deposits-guide';

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
].sort((a, b) => (a.meta.published < b.meta.published ? 1 : -1));

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.meta.slug === slug);
}
