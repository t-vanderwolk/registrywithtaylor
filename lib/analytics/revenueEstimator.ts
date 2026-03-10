type RevenueProgram = {
  averageOrderValue?: number | null;
  commissionRate?: number | null;
};

export function estimateRevenuePerClick(program?: RevenueProgram | null) {
  if (!program?.averageOrderValue || !program?.commissionRate) {
    return 0;
  }

  return program.averageOrderValue * program.commissionRate;
}

export function estimateRevenueForClicks(clicks: number, program?: RevenueProgram | null) {
  if (clicks <= 0) {
    return 0;
  }

  return clicks * estimateRevenuePerClick(program);
}

export function calculateRevenuePerThousandViews(estimatedRevenue: number, views: number) {
  if (views <= 0 || estimatedRevenue <= 0) {
    return 0;
  }

  return (estimatedRevenue / views) * 1000;
}
