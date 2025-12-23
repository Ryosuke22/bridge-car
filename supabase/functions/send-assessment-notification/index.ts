import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// HTML escape function to prevent XSS attacks
function escapeHtml(unsafe: string | undefined | null): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface AssessmentRequest {
  vehicleType: string;
  modelName: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  displacement?: string;
  fuelType?: string;
  transmission?: string;
  handlePosition?: string;
  year?: string;
  mileage?: string;
  touchPenMarks?: boolean;
  accidentHistory?: boolean;
  hasCustom?: boolean;
  customDetails?: string;
  engineStatus?: string;
  inspectionRemaining?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-assessment-notification function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: AssessmentRequest = await req.json();
    console.log("Received assessment data for model:", escapeHtml(data.modelName));

    const vehicleTypeLabel = data.vehicleType === "car" ? "車" : "バイク";

    // Escape all user-provided data before inserting into HTML
    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safePhone = escapeHtml(data.phone);
    const safeNotes = escapeHtml(data.notes);
    const safeModelName = escapeHtml(data.modelName);
    const safeDisplacement = escapeHtml(data.displacement);
    const safeFuelType = escapeHtml(data.fuelType);
    const safeTransmission = escapeHtml(data.transmission);
    const safeHandlePosition = escapeHtml(data.handlePosition);
    const safeYear = escapeHtml(data.year);
    const safeMileage = escapeHtml(data.mileage);
    const safeEngineStatus = escapeHtml(data.engineStatus);
    const safeInspectionRemaining = escapeHtml(data.inspectionRemaining);
    const safeCustomDetails = escapeHtml(data.customDetails);

    const emailHtml = `
      <h1>新しい査定申込がありました</h1>
      <h2>車両情報</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>車両タイプ</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${vehicleTypeLabel}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>モデル名</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeModelName}</td>
        </tr>
        ${safeDisplacement ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>排気量</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeDisplacement}cc</td>
        </tr>
        ` : ''}
        ${safeFuelType ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>燃料タイプ</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeFuelType}</td>
        </tr>
        ` : ''}
        ${safeTransmission ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>トランスミッション</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeTransmission}</td>
        </tr>
        ` : ''}
        ${safeHandlePosition ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>ハンドル位置</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeHandlePosition}</td>
        </tr>
        ` : ''}
        ${safeYear ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>年式</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeYear}年</td>
        </tr>
        ` : ''}
        ${safeMileage ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>走行距離</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeMileage}km</td>
        </tr>
        ` : ''}
        ${safeEngineStatus ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>エンジン状態</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeEngineStatus}</td>
        </tr>
        ` : ''}
        ${safeInspectionRemaining ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>車検残り</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeInspectionRemaining}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>タッチペン跡</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.touchPenMarks ? 'あり' : 'なし'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>事故歴</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.accidentHistory ? 'あり' : 'なし'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>カスタム</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.hasCustom ? 'あり' : 'なし'}</td>
        </tr>
        ${safeCustomDetails ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>カスタム詳細</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeCustomDetails}</td>
        </tr>
        ` : ''}
      </table>

      <h2>お客様情報</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>お名前</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>メールアドレス</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeEmail}</td>
        </tr>
        ${safePhone ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>電話番号</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safePhone}</td>
        </tr>
        ` : ''}
        ${safeNotes ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>備考</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeNotes}</td>
        </tr>
        ` : ''}
      </table>

      <p style="margin-top: 20px; color: #666;">このメールは Bridge Car 査定フォームから自動送信されました。</p>
    `;

    // 1. 管理者への通知メール
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Bridge Car <onboarding@resend.dev>",
        to: ["info@bridge-car.com"],
        subject: `【新規査定申込】${safeModelName} - ${safeName}様`,
        html: emailHtml,
      }),
    });

    const adminEmailResult = await adminEmailResponse.json();
    console.log("Admin email sent successfully:", adminEmailResult);

    // 2. お客様への確認メール
    const customerEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">査定申込を受け付けました</h1>
        <p>${safeName} 様</p>
        <p>この度は Bridge Car の査定サービスをご利用いただき、誠にありがとうございます。</p>
        <p>以下の内容で査定申込を受け付けました。</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">お申込み内容</h3>
          <p><strong>車両タイプ:</strong> ${vehicleTypeLabel}</p>
          <p><strong>モデル名:</strong> ${safeModelName}</p>
          ${safeYear ? `<p><strong>年式:</strong> ${safeYear}年</p>` : ''}
          ${safeMileage ? `<p><strong>走行距離:</strong> ${safeMileage}km</p>` : ''}
        </div>
        
        <p>担当者より2営業日以内にご連絡させていただきます。</p>
        <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          Bridge Car<br>
          メール: info@bridge-car.com
        </p>
      </div>
    `;

    const customerEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Bridge Car <onboarding@resend.dev>",
        to: [data.email],
        subject: "【Bridge Car】査定申込を受け付けました",
        html: customerEmailHtml,
      }),
    });

    const customerEmailResult = await customerEmailResponse.json();
    console.log("Customer confirmation email sent successfully:", customerEmailResult);

    return new Response(JSON.stringify({ success: true, adminEmailResult, customerEmailResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-assessment-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
