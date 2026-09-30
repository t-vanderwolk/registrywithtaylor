type RevenueProgram = {
  averageOrderValue?: number | null;
  commissionRate?: number | null;
  conversionRate?: number | null;
};

export function estimateRevenuePerClick(program?: RevenueProgram | null) {
  if (!program || !Number.isFinite(program.averageOrderValue) || !Number.isFinite(program.commissionRate) || !Number.isFinite(program.conversionRate) ||
      program.averageOrderValue! <= 0 || program.commissionRate! < 0 || program.commissionRate! > 1 ||
      program.conversionRate! < 0 || program.conversionRate! > 1) return null;
  return program.averageOrderValue! * program.commissionRate! * program.conversionRate!;
}

export function estimateRevenueForClicks(clicks: number, program?: RevenueProgram | null) {
  if (clicks <= 0) {
    return 0;
  }

  const perClick = estimateRevenuePerClick(program);
  return perClick === null ? null : clicks * perClick;
}

export function calculateRevenuePerThousandViews(estimatedRevenue: number, views: number) {
  if (views <= 0 || estimatedRevenue <= 0) {
    return 0;
  }

  return (estimatedRevenue / views) * 1000;
}
