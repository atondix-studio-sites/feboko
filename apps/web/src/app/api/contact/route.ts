import { NextResponse } from "next/server";
import { contactFormSchema } from "@feboko/shared";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactFormSchema.parse(body);
    if (data.website) {
      return NextResponse.json({ ok: true });
    }

    await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
        language: data.language ?? "de",
      },
    });

    const to = process.env.CONTACT_TO_EMAIL || "info@feboko.com";
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "FeBoKo Website <onboarding@resend.dev>",
        to,
        subject: `Contact form: ${data.name}`,
        text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
