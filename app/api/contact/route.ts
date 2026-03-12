import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, E-Mail und Nachricht sind Pflichtfelder.' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Nordwerk Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'a.knoth@k-k-solutions.de',
      replyTo: email,
      subject: `Neue Anfrage von ${name}`,
      html: `
        <h2>Neue Kontaktanfrage über nordwerk-workwear.de</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || 'Nicht angegeben'}</p>
        <hr />
        <p><strong>Nachricht:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Kontaktformular-Fehler:', error);
    return NextResponse.json(
      { error: 'Beim Senden ist ein Fehler aufgetreten.' },
      { status: 500 }
    );
  }
}
