import dotenv from "dotenv";
dotenv.config();

import https from "https";

type SendMailOptions = {
  from?: string;
  to: string;
  subject: string;
  html: string;
};

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const postResendEmail = (payload: object): Promise<any> => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);

    const req = https.request(
      {
        hostname: "api.resend.com",
        path: "/emails",
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          let parsedBody: any = null;

          try {
            parsedBody = body ? JSON.parse(body) : null;
          } catch {
            parsedBody = body;
          }

          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedBody);
          } else {
            reject({
              statusCode: res.statusCode,
              body: parsedBody,
            });
          }
        });
      }
    );

    req.on("error", reject);

    req.write(data);
    req.end();
  });
};

// Mantiene la misma lógica anterior: transporter.sendMail(...)
export const transporter = {
  async sendMail(options: SendMailOptions) {
    if (!RESEND_API_KEY) {
      throw new Error("Falta configurar RESEND_API_KEY");
    }

    return postResendEmail({
      from: options.from || "ComparAR <onboarding@resend.dev>",
      to: [options.to],
      subject: options.subject,
      html: options.html,
    });
  },
};