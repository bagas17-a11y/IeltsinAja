import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function DiagnosticTest() {
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test: string, passed: boolean, details: any) => {
    setResults(prev => [...prev, { test, passed, details, timestamp: new Date().toISOString() }]);
  };

  const runDiagnostics = async () => {
    setResults([]);
    setIsRunning(true);

    try {
      // Test 1: Check session exists
      addResult("Fetching session", true, "Starting...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        addResult("Session Check", false, { error: sessionError?.message || "No session" });
        setIsRunning(false);
        return;
      }

      addResult("Session Check", true, {
        userId: session.user.id,
        email: session.user.email,
        emailConfirmed: session.user.email_confirmed_at,
        expiresAt: new Date(session.expires_at! * 1000).toLocaleString()
      });

      // Test 2: Refresh session
      addResult("Refreshing session", true, "Starting...");
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        addResult("Session Refresh", false, { error: refreshError.message });
      } else {
        addResult("Session Refresh", true, { refreshed: !!refreshedSession });
      }

      const activeSession = refreshedSession || session;

      // Test 3: Call generate-reading with explicit headers
      addResult("Calling generate-reading function", true, "Starting...");

      const startTime = Date.now();
      const response = await supabase.functions.invoke("generate-reading", {
        body: { difficulty: "medium" },
        headers: {
          Authorization: `Bearer ${activeSession.access_token}`,
        },
      });

      const duration = Date.now() - startTime;

      if (response.error) {
        addResult("Generate Reading Call", false, {
          error: response.error.message,
          context: response.error.context,
          status: response.error.status,
          duration: `${duration}ms`
        });
      } else {
        addResult("Generate Reading Call", true, {
          hasData: !!response.data,
          duration: `${duration}ms`,
          dataType: typeof response.data
        });
      }

      // Test 4: Check function response structure
      if (response.data) {
        const hasRequiredFields =
          response.data.passage &&
          response.data.questions &&
          response.data.difficulty;

        addResult("Response Structure", hasRequiredFields, {
          hasPassage: !!response.data.passage,
          hasQuestions: !!response.data.questions,
          hasDifficulty: !!response.data.difficulty,
          hasId: !!response.data.id
        });
      }

    } catch (error: any) {
      addResult("Unexpected Error", false, {
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3)
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Reading Module Diagnostic Test</CardTitle>
            <p className="text-sm text-muted-foreground">
              This will test your authentication and the generate-reading function
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={runDiagnostics}
              disabled={isRunning}
              size="lg"
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Diagnostics...
                </>
              ) : (
                "Run Diagnostic Test"
              )}
            </Button>

            {results.length > 0 && (
              <div className="space-y-3 mt-6">
                <h3 className="font-semibold">Test Results:</h3>
                {results.map((result, idx) => (
                  <Card key={idx} className={result.passed ? "border-green-500/50" : "border-red-500/50"}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {result.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium">{result.test}</h4>
                          <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                          <p className="text-xs text-muted-foreground mt-1">
                            {result.timestamp}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">What to check:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Session Check should pass with valid email confirmation</li>
                <li>Session Refresh should succeed</li>
                <li>Generate Reading Call should return data (not error)</li>
                <li>If any test fails, copy the error details</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
