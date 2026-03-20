import nodemailer from "nodemailer"
import env from "#/config/environment.config.js";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS
  }
})

const sendEmail = async(data) => {
  const baseUrl = env.SERVER_URL.replace(/\/$/, "");
  const verifyUrl = `${baseUrl}/api/auth/verify-email?userId=${encodeURIComponent(
    data.userId
  )}&verifyToken=${encodeURIComponent(data.verifyToken)}`;

  await transporter.sendMail({
    from: env.EMAIL_USER,
    to: data.email,
    subject: 'Register verify email',
    text: `Dear ${data.displayName}!`,
    html: `
      <div>
        <h3>Hello ${data.displayName}</h3>
        <p>Please click the link below to verify your email:</p>
        <a href="${verifyUrl}">Verify Email</a>
      </div>
    `,
  })
}

export const nodemailerProvider = {
  sendEmail
}
