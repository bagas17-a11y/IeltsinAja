/**
 * Cron Job: Renewal Reminders
 * Sends email reminders to Pro users whose subscriptions expire soon
 * Run daily via pg_cron or external scheduler
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../shared/errors.ts';
import { createLogger } from '../shared/logger.ts';

interface ExpiringUser {
  id: string;
  email: string;
  subscription_end_date: string;
  days_until_expiry: number;
}

Deno.serve(async (req) => {
  const logger = createLogger(req, { endpoint: 'cron-renewal-reminders' });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Verify cron secret (security measure)
    const authHeader = req.headers.get('Authorization');
    const cronSecret = Deno.env.get('CRON_SECRET');

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      logger.warn('Unauthorized cron job attempt');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized'
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    logger.info('Starting renewal reminders job');

    // Find Pro users expiring in 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const eightDaysFromNow = new Date();
    eightDaysFromNow.setDate(eightDaysFromNow.getDate() + 8);

    const { data: expiringUsers, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, subscription_end_date')
      .eq('subscription_tier', 'pro')
      .gte('subscription_end_date', sevenDaysFromNow.toISOString())
      .lt('subscription_end_date', eightDaysFromNow.toISOString());

    if (fetchError) {
      logger.error('Error fetching expiring users', fetchError);
      throw fetchError;
    }

    if (!expiringUsers || expiringUsers.length === 0) {
      logger.info('No subscriptions expiring in 7 days');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No subscriptions expiring soon',
          remindersSent: 0,
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    logger.info(`Found ${expiringUsers.length} subscriptions expiring soon`);

    // Send reminder emails
    const remindersSent: string[] = [];
    const remindersFailed: string[] = [];

    for (const user of expiringUsers) {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/send-verification-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: user.email,
            subject: 'Your IELTSinAja Pro subscription expires soon',
            userName: user.email.split('@')[0],
            planName: 'Pro',
          }),
        });

        if (response.ok) {
          remindersSent.push(user.email);
          logger.info('Reminder sent', { email: user.email });
        } else {
          remindersFailed.push(user.email);
          logger.warn('Failed to send reminder', {
            email: user.email,
            status: response.status
          });
        }
      } catch (error) {
        remindersFailed.push(user.email);
        logger.error('Exception sending reminder', error, { email: user.email });
      }
    }

    const result = {
      success: true,
      remindersSent: remindersSent.length,
      remindersFailed: remindersFailed.length,
      users: remindersSent.map((email, index) => ({
        email,
        expiresAt: expiringUsers[index]?.subscription_end_date
      })),
      timestamp: new Date().toISOString()
    };

    logger.info('Renewal reminders job complete', {
      sent: remindersSent.length,
      failed: remindersFailed.length
    });

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    logger.error('Renewal reminders job error', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
