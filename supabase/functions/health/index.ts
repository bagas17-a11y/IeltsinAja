/**
 * Health Check Endpoint
 * Monitors system health and component availability
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../shared/cors.ts';

interface HealthCheck {
  healthy: boolean;
  latency?: number;
  error?: string;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, HealthCheck>;
  timestamp: string;
  version: string;
  uptime?: number;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  const startTime = Date.now();
  const checks: Record<string, HealthCheck> = {};

  try {
    // 1. Database Health Check
    const dbStart = Date.now();
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !supabaseServiceKey) {
        checks.database = {
          healthy: false,
          error: 'Missing credentials'
        };
      } else {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { error } = await supabase.from('profiles').select('id').limit(1);

        checks.database = {
          healthy: !error,
          latency: Date.now() - dbStart,
          error: error?.message
        };
      }
    } catch (error) {
      checks.database = {
        healthy: false,
        latency: Date.now() - dbStart,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // 2. AI Service Health Check
    const aiStart = Date.now();
    try {
      const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');

      if (!anthropicKey) {
        checks.ai_service = {
          healthy: false,
          error: 'API key not configured'
        };
      } else {
        // Test with minimal request to Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Hi' }]
          })
        });

        checks.ai_service = {
          healthy: response.ok || response.status === 429, // 429 means service is up but rate limited
          latency: Date.now() - aiStart,
          error: response.ok ? undefined : `Status ${response.status}`
        };
      }
    } catch (error) {
      checks.ai_service = {
        healthy: false,
        latency: Date.now() - aiStart,
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }

    // 3. Storage Health Check
    const storageStart = Date.now();
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !supabaseServiceKey) {
        checks.storage = {
          healthy: false,
          error: 'Missing credentials'
        };
      } else {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { error } = await supabase.storage.listBuckets();

        checks.storage = {
          healthy: !error,
          latency: Date.now() - storageStart,
          error: error?.message
        };
      }
    } catch (error) {
      checks.storage = {
        healthy: false,
        latency: Date.now() - storageStart,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // 4. Email Service Health Check
    const emailStart = Date.now();
    try {
      const resendKey = Deno.env.get('RESEND_API_KEY');

      checks.email_service = {
        healthy: !!resendKey,
        latency: Date.now() - emailStart,
        error: resendKey ? undefined : 'API key not configured'
      };
    } catch (error) {
      checks.email_service = {
        healthy: false,
        latency: Date.now() - emailStart,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Determine overall status
    const allHealthy = Object.values(checks).every(c => c.healthy);
    const anyUnhealthy = Object.values(checks).some(c => !c.healthy);

    const status: HealthStatus = {
      status: allHealthy ? 'healthy' : anyUnhealthy ? 'degraded' : 'unhealthy',
      checks,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: Date.now() - startTime
    };

    const httpStatus = allHealthy ? 200 : anyUnhealthy ? 503 : 200;

    return new Response(
      JSON.stringify(status, null, 2),
      {
        status: httpStatus,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );

  } catch (error) {
    console.error('Health check error:', error);

    const errorStatus: HealthStatus = {
      status: 'unhealthy',
      checks: {
        system: {
          healthy: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    return new Response(
      JSON.stringify(errorStatus, null, 2),
      {
        status: 503,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
