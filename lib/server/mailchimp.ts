export type NewsletterAudienceStats = {
  totalSubscribers: number;
  unsubscribed: number;
  cleaned: number;
  openRate: number;
  clickRate: number;
  campaignCount: number;
  lastSubDate: string | null;
};

export type NewsletterCampaign = {
  id: string;
  title: string;
  subjectLine: string;
  sentAt: string | null;
  emailsSent: number;
  openRate: number;
  clickRate: number;
  uniqueOpens: number;
  clicks: number;
};

export type NewsletterGrowthMonth = {
  month: string;
  subscribed: number;
  unsubscribed: number;
  net: number;
};

export type NewsletterAnalytics = {
  configured: boolean;
  audience: NewsletterAudienceStats | null;
  recentCampaigns: NewsletterCampaign[];
  growthHistory: NewsletterGrowthMonth[];
  error: string | null;
};

async function mailchimpGet(path: string, apiKey: string): Promise<unknown> {
  const dc = apiKey.split('-')[1] ?? 'us22';
  const response = await fetch(`https://${dc}.api.mailchimp.com/3.0${path}`, {
    headers: {
      Authorization: `Basic ${btoa(`anystring:${apiKey}`)}`,
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Mailchimp ${path} returned ${response.status}`);
  }

  return response.json();
}

export async function getNewsletterAnalytics(): Promise<NewsletterAnalytics> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    return { configured: false, audience: null, recentCampaigns: [], growthHistory: [], error: null };
  }

  try {
    const listFields = 'stats,campaign_defaults';
    const campaignFields = [
      'campaigns.id',
      'campaigns.settings.subject_line',
      'campaigns.settings.title',
      'campaigns.send_time',
      'campaigns.emails_sent',
      'campaigns.report_summary',
    ].join(',');

    const [listRaw, campaignsRaw, growthRaw] = await Promise.all([
      mailchimpGet(`/lists/${audienceId}?fields=${listFields}`, apiKey),
      mailchimpGet(
        `/campaigns?list_id=${audienceId}&status=sent&count=5&sort_field=send_time&sort_dir=DESC&fields=${campaignFields}`,
        apiKey,
      ),
      mailchimpGet(`/lists/${audienceId}/growth-history?count=6&sort_field=month&sort_dir=DESC`, apiKey),
    ]);

    const list = listRaw as {
      stats?: {
        member_count?: number;
        unsubscribe_count?: number;
        cleaned_count?: number;
        open_rate?: number;
        click_rate?: number;
        campaign_count?: number;
        last_sub_date?: string;
      };
    };

    const stats = list.stats ?? {};

    const audience: NewsletterAudienceStats = {
      totalSubscribers: stats.member_count ?? 0,
      unsubscribed: stats.unsubscribe_count ?? 0,
      cleaned: stats.cleaned_count ?? 0,
      openRate: stats.open_rate ?? 0,
      clickRate: stats.click_rate ?? 0,
      campaignCount: stats.campaign_count ?? 0,
      lastSubDate: stats.last_sub_date ?? null,
    };

    const campaigns = (campaignsRaw as { campaigns?: unknown[] }).campaigns ?? [];
    const recentCampaigns: NewsletterCampaign[] = campaigns.map((c) => {
      const campaign = c as {
        id?: string;
        settings?: { subject_line?: string; title?: string };
        send_time?: string;
        emails_sent?: number;
        report_summary?: {
          open_rate?: number;
          click_rate?: number;
          unique_opens?: number;
          clicks?: number;
        };
      };
      const summary = campaign.report_summary ?? {};
      return {
        id: campaign.id ?? '',
        title: campaign.settings?.title ?? campaign.settings?.subject_line ?? '(no title)',
        subjectLine: campaign.settings?.subject_line ?? '',
        sentAt: campaign.send_time ?? null,
        emailsSent: campaign.emails_sent ?? 0,
        openRate: summary.open_rate ?? 0,
        clickRate: summary.click_rate ?? 0,
        uniqueOpens: summary.unique_opens ?? 0,
        clicks: summary.clicks ?? 0,
      };
    });

    const growthMonths = (growthRaw as { history?: unknown[] }).history ?? [];
    const growthHistory: NewsletterGrowthMonth[] = growthMonths.map((m) => {
      const month = m as {
        month?: string;
        subscribed?: number;
        unsubscribed?: number;
        optins?: number;
      };
      const subscribed = (month.subscribed ?? 0) + (month.optins ?? 0);
      const unsubscribed = month.unsubscribed ?? 0;
      return {
        month: month.month ?? '',
        subscribed,
        unsubscribed,
        net: subscribed - unsubscribed,
      };
    });

    return { configured: true, audience, recentCampaigns, growthHistory, error: null };
  } catch (error) {
    console.error('Mailchimp analytics error:', error);
    return {
      configured: true,
      audience: null,
      recentCampaigns: [],
      growthHistory: [],
      error: 'Unable to load Mailchimp data. Check that MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID are set correctly.',
    };
  }
}
