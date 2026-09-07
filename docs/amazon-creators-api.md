# Amazon Creators API Runbook

TMBC uses Amazon Creators API as a server-only cache refresh path. Public pages
read `AmazonProductCache`; they do not call Amazon during normal rendering.
The cache also retains each original Amazon URL so resolved `amzn.to` links can
find their ASIN-backed cache row during later page renders.

## Required Environment Variables

Set these privately in local shell config and Heroku config. Do not paste real
values into chat and do not commit secrets.

```bash
AMAZON_CREATORS_CLIENT_ID=
AMAZON_CREATORS_CLIENT_SECRET=
AMAZON_CREATORS_CREDENTIAL_VERSION=v3.1
AMAZON_CREATORS_MARKETPLACE=www.amazon.com
AMAZON_CREATORS_PARTNER_TAG=taylormadebab-20
```

## Commands

Dry run all known TMBC product surfaces:

```bash
npm run amazon:sync-dry
```

Refresh all known TMBC product surfaces:

```bash
npm run amazon:sync
```

Dry run Journal / Blog products only:

```bash
npm run amazon:sync-blog-dry
```

Refresh Journal / Blog products only:

```bash
npm run amazon:sync-blog
```

Controlled SearchItems lookup for admin/backfill only:

```bash
npm run amazon:search -- --search="Cybex Gazelle S stroller"
```

Use SearchItems only to inspect candidates for an existing TMBC product that
lacks an ASIN. Do not use it to create new editorial recommendations
automatically.

## Verification

After a refresh, every usable Amazon URL should still include the TMBC tag:

```bash
npm run amazon:sync-dry -- --no-resolve-short-links
```

The sync refuses to use an Amazon-returned `detailPageURL` unless it includes:

```text
tag=taylormadebab-20
```

Returned Amazon URLs are stored exactly as Amazon sends them. Do not rewrite,
strip, shorten, or append parameters to those URLs.

## Cache Rules

- Access tokens are reused until near expiry. Amazon tokens expire after 1 hour.
- Offers, prices, availability, and deal details expire after 1 hour.
- Images, title, byline, features, product info, parent ASIN, and detail URL
  expire after 1 day.
- If Amazon data is missing, expired, rate-limited, or unavailable, public pages
  keep using existing TMBC titles, images, prices, and affiliate links.

## Amazon Account Notes

Amazon may return `AssociateNotEligible` while credentials are under review or
not eligible for Creators API access. The sync marks those cache rows as
`ASSOCIATE_NOT_ELIGIBLE` and suppresses normal retry until forced, so public
pages keep working from TMBC fallbacks.

For new Associates/API access, allow for Amazon's review window. Amazon also
commonly requires 10 qualifying sales in the past 30 days for API access.
