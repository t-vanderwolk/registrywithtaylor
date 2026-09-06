-- Add Amazon product images and current Amazon prices for Veer adapter rows
-- that already use the site-owner supplied Amazon affiliate links.

WITH amazon_adapter_metadata(adapter_url, adapter_image, adapter_price) AS (
  VALUES
    (
      'https://amzn.to/4hdEYM0',
      'https://m.media-amazon.com/images/I/61SHi1ONP3L._SL1500_.jpg',
      79.00
    ),
    (
      'https://amzn.to/4r6mLDB',
      'https://m.media-amazon.com/images/I/81ETtG064zL._SL1500_.jpg',
      79.00
    ),
    (
      'https://amzn.to/4gMMI6j',
      'https://m.media-amazon.com/images/I/61aBeIAeLyL._SL1500_.jpg',
      79.00
    ),
    (
      'https://amzn.to/4qW9QUF',
      'https://m.media-amazon.com/images/I/61JFvYmgy-L._SL1500_.jpg',
      79.00
    ),
    (
      'https://amzn.to/4hcqjRl',
      'https://m.media-amazon.com/images/I/61CRvVOH35L._SL1500_.jpg',
      79.00
    ),
    (
      'https://amzn.to/3Szm4WK',
      'https://m.media-amazon.com/images/I/61f0WSxwv5L._SL1500_.jpg',
      79.00
    ),
    (
      'https://amzn.to/4hcqoo7',
      'https://m.media-amazon.com/images/I/81HRUEPPwdL._SL1500_.jpg',
      79.00
    ),
    (
      'https://amzn.to/4xf0JAb',
      'https://m.media-amazon.com/images/I/61j8+aGFl1L._SL1500_.jpg',
      79.00
    ),
    (
      'https://amzn.to/4gBaeoa',
      'https://m.media-amazon.com/images/I/61ye8N-TxxL._SL1500_.jpg',
      79.00
    )
)
UPDATE "Compatibility" compat
SET
  "adapterImage" = metadata.adapter_image,
  "adapterPrice" = metadata.adapter_price,
  "adapterUpdatedAt" = CURRENT_TIMESTAMP,
  "updatedAt" = CURRENT_TIMESTAMP
FROM amazon_adapter_metadata metadata
WHERE compat."adapterBabylistUrl" = metadata.adapter_url;
