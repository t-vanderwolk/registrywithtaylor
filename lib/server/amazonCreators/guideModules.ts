import 'server-only';

import type { GuideAffiliateModule } from '@/lib/guides/types';
import {
  bestAmazonImage,
  bestAmazonUrl,
  getAmazonCacheMapForUrls,
} from '@/lib/server/amazonCreators/cache';
import { isAmazonUrl } from '@/lib/server/amazonCreators/url';

export async function enrichGuideAffiliateModulesWithAmazonCache(
  modules: GuideAffiliateModule[],
): Promise<GuideAffiliateModule[]> {
  const amazonUrls = modules.flatMap((module) => (isAmazonUrl(module.destinationUrl) ? [module.destinationUrl] : []));
  if (amazonUrls.length === 0) return modules;

  const cacheMap = await getAmazonCacheMapForUrls(amazonUrls);
  return modules.map((module) => {
    if (!isAmazonUrl(module.destinationUrl)) return module;
    const product = cacheMap.get(module.destinationUrl);
    if (!product) return module;

    return {
      ...module,
      destinationUrl: bestAmazonUrl(module.destinationUrl, product) ?? module.destinationUrl,
      imageUrl: bestAmazonImage(module.imageUrl, product),
    };
  });
}
