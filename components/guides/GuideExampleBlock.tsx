import PostContent from '@/components/blog/PostContent';
import Comparison from '@/components/content-widgets/Comparison';
import GuideProductExampleCard from '@/components/guides/GuideProductExampleCard';
import { chunkArray } from '@/lib/chunkArray';
import type { ParsedStyledBlock } from '@/lib/blog/styledBlocks';
import { filterRenderableGuideProductBlocks } from '@/lib/guides/renderableProductExamples';

export type GuideExampleBlockCard = {
  id: string;
  eyebrow: string;
  title: string;
  content: string;
};

type ProductExample = Extract<ParsedStyledBlock, { type: 'product' }>;
type ComparisonExample = Extract<ParsedStyledBlock, { type: 'comparison' }>;

function NarrativeCard({
  id,
  eyebrow,
  title,
  content,
  postId,
}: GuideExampleBlockCard & {
  postId: string;
}) {
  return (
    <article
      id={id}
      className="scroll-mt-28 rounded-[1.45rem] border border-stone-200/70 bg-[#fcfaf7] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.03)] sm:rounded-[1.6rem] sm:p-5"
    >
      <div className="space-y-2">
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
        <h4 className="font-serif text-[1.35rem] leading-[1.08] tracking-[-0.03em] text-neutral-900 sm:text-[1.5rem]">{title}</h4>
      </div>

      <div className="mt-4">
        <PostContent
          postId={postId}
          content={content}
          className="guide-post-content guide-hub-card-content"
          variant="plain"
          highlightBrandWordmark={true}
        />
      </div>
    </article>
  );
}

export default function GuideExampleBlock({
  topicId,
  narrative,
  products,
  comparisons,
  cards = [],
}: {
  topicId: string;
  narrative?: string;
  products: ProductExample[];
  comparisons: ComparisonExample[];
  cards?: GuideExampleBlockCard[];
}) {
  const renderableProducts = filterRenderableGuideProductBlocks(products);

  return (
    <div className="space-y-5">
      {narrative ? (
        <NarrativeCard
          id={`${topicId}-overview-card`}
          eyebrow="Section brief"
          title="How to compare these examples"
          content={narrative}
          postId={`planner-${topicId}-overview`}
        />
      ) : null}

      {comparisons.length > 0 ? (
        <div className="space-y-4 [&_.content-widget]:my-0">
          {comparisons.map((comparison, index) => (
            <Comparison key={`${topicId}-comparison-${index}`} title={comparison.title} rows={comparison.rows} />
          ))}
        </div>
      ) : null}

      {renderableProducts.length > 0 ? (
        <div className="space-y-5">
          {chunkArray(renderableProducts, 3).map((productChunk, chunkIndex) => (
            <div key={`${topicId}-product-chunk-${chunkIndex}`} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {productChunk.map((product, index) => {
                const position = chunkIndex * 3 + index + 1;

                return (
                  <div key={`${topicId}-product-${product.brand}-${product.productName}-${position}`}>
                    <GuideProductExampleCard
                      name={product.productName}
                      brand={product.brand}
                      productName={product.productName}
                      imageSrc={product.imageUrl}
                      imageAlt={product.imageAlt}
                      affiliateUrl={product.affiliateLinks[0]?.url ?? null}
                      typeLabel={product.typeLabel}
                      whyItMatters={product.shortReview}
                      bestFor={product.bestFor}
                      standout={product.standout}
                      specGroups={product.specGroups}
                      notes={product.notes}
                      pros={product.pros}
                      category={product.typeLabel ?? 'Product example'}
                      position={position}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}

      {cards.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <NarrativeCard
              key={`${topicId}-${card.id}`}
              id={`${topicId}-${card.id}`}
              eyebrow={card.eyebrow}
              title={card.title}
              content={card.content}
              postId={`planner-${topicId}-${card.id}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
