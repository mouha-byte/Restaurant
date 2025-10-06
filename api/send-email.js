import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, subject, text } = req.body;

  try {
    // 🔑 Configure le transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // ton email
        pass: process.env.EMAIL_PASS  // mot de passe app Gmail
      }
    });

    // Envoi du mail
    let info = await transporter.sendMail({
      from: `"Mon App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    res.status(200).json({ success: true, info });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
