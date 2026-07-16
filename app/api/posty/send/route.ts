import { NextRequest, NextResponse } from "next/server";
import { buildPostcardCardImage } from "@/lib/posty-card";

type SendPayload = {
  photo?: unknown;
  location?: unknown;
  date?: unknown;
  sender?: unknown;
  recipients?: unknown;
  message?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeEmailHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!,
  );

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.POSTCARD_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return NextResponse.json(
      {
        error: "Email delivery is not configured yet.",
        code: "EMAIL_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  let body: SendPayload;
  try {
    body = (await request.json()) as SendPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const recipients = Array.isArray(body.recipients)
    ? body.recipients
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
    : [];
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const sender =
    typeof body.sender === "string" && body.sender.trim()
      ? body.sender.trim().slice(0, 100)
      : "A friend";
  const location =
    typeof body.location === "string"
      ? body.location.trim().slice(0, 160)
      : "";
  const date =
    typeof body.date === "string" ? body.date.trim().slice(0, 40) : "";
  const photo = typeof body.photo === "string" ? body.photo : "";
  const words = message ? message.split(/\s+/).length : 0;

  if (
    !recipients.length ||
    recipients.length > 20 ||
    recipients.some((email) => !emailPattern.test(email))
  ) {
    return NextResponse.json(
      {
        error: "Add between 1 and 20 valid recipient email addresses.",
      },
      { status: 400 },
    );
  }
  if (words > 150) {
    return NextResponse.json(
      { error: "The message must be 150 words or fewer." },
      { status: 400 },
    );
  }

  const photoMatch =
    /^data:(image\/(?:jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(photo);
  if (!photoMatch) {
    return NextResponse.json(
      { error: "A captured JPEG or PNG postcard photo is required." },
      { status: 400 },
    );
  }
  if (photoMatch[2].length > 4_000_000) {
    return NextResponse.json(
      { error: "The postcard photo is too large to send." },
      { status: 413 },
    );
  }

  let cardBase64: string;
  try {
    const cardBuffer = await buildPostcardCardImage({
      photoBase64: photoMatch[2],
      message,
      sender,
      location,
      date,
    });
    cardBase64 = cardBuffer.toString("base64");
  } catch {
    return NextResponse.json(
      { error: "The postcard image could not be prepared." },
      { status: 500 },
    );
  }

  // Dev: send immediately so you can verify the delivered email.
  // Prod: schedule via Resend for a random day between 7 and 14 days out.
  const sendImmediately = process.env.NODE_ENV === "development";
  const delayDays = sendImmediately
    ? 0
    : 7 + Math.floor(Math.random() * 8); // 7–14 inclusive
  const scheduledAt = sendImmediately
    ? null
    : new Date(Date.now() + delayDays * 24 * 60 * 60 * 1000).toISOString();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://gracejli.com");
  const postyUrl = `${siteUrl}/posty`;

  const html = `<main style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;padding:24px 16px;background:#f5f3ee;color:#1d1d1d">
  <img src="cid:postcard" alt="Postcard" style="display:block;width:100%;max-width:640px;height:auto;border:0" />
  <p style="margin:20px 0 8px;font-size:15px;line-height:1.4;color:rgba(29,29,29,0.7)">${
    sendImmediately
      ? "Sent just now (dev mode)."
      : "They sent this sometime 7–14 days ago."
  }</p>
  <p style="margin:0;font-size:15px;line-height:1.4;color:rgba(29,29,29,0.7)">Sent with <a href="${escapeEmailHtml(postyUrl)}" style="color:#1d1d1d;text-decoration:underline">posty</a>.</p>
</main>`;

  const payload: Record<string, unknown> = {
    from: fromEmail,
    to: recipients,
    subject: `A postcard from ${sender}`,
    html,
    attachments: [
      {
        filename: `postcard-${Date.now()}.jpg`,
        content: cardBase64,
        content_id: "postcard",
        content_type: "image/jpeg",
      },
    ],
    tags: [{ name: "type", value: "postcard" }],
  };
  if (scheduledAt) {
    payload.scheduled_at = scheduledAt;
  }

  const upstream = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await upstream.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
  };

  if (!upstream.ok) {
    return NextResponse.json(
      {
        error:
          result.message || "The email provider could not send this postcard.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    sent: true,
    id: result.id ?? null,
    recipients: recipients.length,
    immediate: sendImmediately,
    delayDays: sendImmediately ? null : delayDays,
    scheduledAt,
  });
}
