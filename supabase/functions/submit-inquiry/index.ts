import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const buildEmailBody = (payload: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  inquiry_type?: string | null;
  tour_name?: string | null;
  message?: string | null;
}) => {
  const lines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "N/A"}`,
    `Inquiry Type: ${payload.inquiry_type || "General"}`,
    `Tour: ${payload.tour_name || "Custom"}`,
    "",
    payload.message || "",
  ];
  return lines.join("\n");
};

const buildEmailHtml = (payload: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  inquiry_type?: string | null;
  tour_name?: string | null;
  message?: string | null;
}) => {
  const logoUrl =
    "https://cqjvoofsjblatltqalxp.supabase.co/storage/v1/object/public/assets/logoo.png";
  const safe = (value?: string | null) => (value && value.trim() ? value : "N/A");

  return `
<!doctype html>
<html>
  <body style="margin:0;background:#f6fbf7;font-family:Arial,Helvetica,sans-serif;color:#111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6fbf7;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
            <tr>
              <td style="background:#064e3b;padding:20px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${logoUrl}" alt="Busiva Tour & Travel" style="height:48px;display:block;" />
                    </td>
                    <td style="text-align:right;font-weight:bold;color:#ffffff;">
                      New Inquiry
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <h2 style="margin:0 0 12px;font-size:20px;color:#111;">Inquiry Details</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #fbbf24;border-radius:12px;overflow:hidden;">
                  <tr>
                    <td style="background:#fbbf24;padding:12px 16px;font-weight:bold;width:160px;">Name</td>
                    <td style="padding:12px 16px;">${safe(payload.name)}</td>
                  </tr>
                  <tr>
                    <td style="background:#fbbf24;padding:12px 16px;font-weight:bold;">Email</td>
                    <td style="padding:12px 16px;">${safe(payload.email)}</td>
                  </tr>
                  <tr>
                    <td style="background:#fbbf24;padding:12px 16px;font-weight:bold;">Phone</td>
                    <td style="padding:12px 16px;">${safe(payload.phone)}</td>
                  </tr>
                  <tr>
                    <td style="background:#fbbf24;padding:12px 16px;font-weight:bold;">Inquiry Type</td>
                    <td style="padding:12px 16px;">${safe(payload.inquiry_type)}</td>
                  </tr>
                  <tr>
                    <td style="background:#fbbf24;padding:12px 16px;font-weight:bold;">Tour</td>
                    <td style="padding:12px 16px;">${safe(payload.tour_name)}</td>
                  </tr>
                  <tr>
                    <td style="background:#fbbf24;padding:12px 16px;font-weight:bold;">Subject</td>
                    <td style="padding:12px 16px;">${safe(payload.subject)}</td>
                  </tr>
                </table>
                <div style="margin-top:20px;padding:16px;border-radius:12px;background:#ecfdf3;border:1px solid #064e3b;">
                  <div style="font-weight:bold;margin-bottom:8px;">Message</div>
                  <div style="white-space:pre-wrap;">${safe(payload.message)}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#064e3b;color:#fff;padding:14px 24px;text-align:center;font-size:12px;">
                Busiva Tour & Travel - Automated Notification
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SB_URL");
    const supabaseServiceKey = Deno.env.get("SB_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const emailFrom = Deno.env.get("EMAIL_FROM");
    const emailTo = Deno.env.get("EMAIL_TO");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing SB_URL or SB_SERVICE_ROLE_KEY.");
      return new Response(
        JSON.stringify({ error: "Missing Supabase service credentials." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!resendApiKey || !emailFrom || !emailTo) {
      console.error("Missing email configuration.", {
        hasResendKey: Boolean(resendApiKey),
        emailFrom,
        emailTo,
      });
      return new Response(
        JSON.stringify({ error: "Missing email notification configuration." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload = await req.json();

    const name = String(payload?.name || "").trim();
    const email = String(payload?.email || "").trim();
    const phone = payload?.phone ? String(payload.phone).trim() : null;
    const subject = payload?.subject ? String(payload.subject).trim() : null;
    const inquiryType = payload?.inquiry_type ? String(payload.inquiry_type).trim() : "tour";
    const tourName = payload?.tour_name ? String(payload.tour_name).trim() : null;
    const message = payload?.message ? String(payload.message).trim() : "";

    if (!name || !email) {
      console.error("Validation failed: name or email missing.");
      return new Response(
        JSON.stringify({ error: "Name and email are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: insertError } = await supabase.from("inquiries").insert({
      name,
      email,
      phone,
      inquiry_type: inquiryType,
      tour_name: tourName,
      message,
      status: "new",
    });

    if (insertError) {
      console.error("Database insert failed.", insertError);
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailSubject = subject || `New ${inquiryType} inquiry`;
    const textBody = buildEmailBody({
      name,
      email,
      phone,
      subject,
      inquiry_type: inquiryType,
      tour_name: tourName,
      message,
    });
    const htmlBody = buildEmailHtml({
      name,
      email,
      phone,
      subject,
      inquiry_type: inquiryType,
      tour_name: tourName,
      message,
    });

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [emailTo],
        subject: emailSubject,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error.", errorText);
      return new Response(
        JSON.stringify({ error: "Email notification failed.", details: errorText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
