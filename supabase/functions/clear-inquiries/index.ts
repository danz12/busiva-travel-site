import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SB_URL");
    const supabaseServiceKey = Deno.env.get("SB_SERVICE_ROLE_KEY");
    const authHeader = req.headers.get("Authorization") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing SB_URL or SB_SERVICE_ROLE_KEY.");
      return new Response(
        JSON.stringify({ error: "Missing Supabase service credentials." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      console.error("Unauthorized clear attempt.", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: deleteError } = await supabase
      .from("inquiries")
      .delete()
      .neq("id", "");
    if (deleteError) {
      console.error("Delete failed.", deleteError);
      return new Response(
        JSON.stringify({ error: deleteError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unhandled function error.", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
