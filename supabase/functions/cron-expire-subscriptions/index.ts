/**
 * Cron Job: Expire Subscriptions
 * Automatically downgrades Pro subscriptions when they expire
 * Run daily via pg_cron or external scheduler
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../shared/errors.ts';

interface ExpiredUser {
  id: string;
  email: string;
  subscription_end_date: string;
}

Deno.serve(async (req) => {
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
      console.error('Unauthorized cron job attempt');
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

    console.log('Starting subscription expiration job...');
    const now = new Date().toISOString();

    // Find all expired Pro subscriptions
    const { data: expiredUsers, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, subscription_end_date')
      .eq('subscription_tier', 'pro')
      .lt('subscription_end_date', now);

    if (fetchError) {
      console.error('Error fetching expired users:', fetchError);
      throw fetchError;
    }

    if (!expiredUsers || expiredUsers.length === 0) {
      console.log('No expired subscriptions found');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No expired subscriptions',
          downgraded: 0,
          timestamp: now
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Found ${expiredUsers.length} expired subscriptions`);

    // Downgrade to free tier
    const userIds = expiredUsers.map((u: ExpiredUser) => u.id);
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_tier: 'free',
        subscription_end_date: null,
      })
      .in('id', userIds);

    if (updateError) {
      console.error('Error downgrading users:', updateError);
      throw updateError;
    }

    // Log the downgrades
    console.log(`Successfully downgraded ${expiredUsers.length} users to free tier`);
    expiredUsers.forEach((user: ExpiredUser) => {
      console.log(`- ${user.email} (expired: ${user.subscription_end_date})`);
    });

    return new Response(
      JSON.stringify({
        success: true,
        downgraded: expiredUsers.length,
        users: expiredUsers.map((u: ExpiredUser) => ({
          email: u.email,
          expired_date: u.subscription_end_date
        })),
        timestamp: now
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Subscription expiration job error:', error);

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
