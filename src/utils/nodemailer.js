import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export default async function(target) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "thelapssql@gmail.com",
                pass: process.env.PASSWORD,
            },
        });
        
        const details = {
            from: "thelapssql@gmail.com",
            to: `${target}`,
            subject: "열쩡",
            text: "열쩡",
            attachments: [
                {
                    filename: "first.pdf",
                    path: `./${target}.pdf`,
                    contentType: "application/pdf",
                }
            ]
        };

        const result = await transporter.sendMail(details);

        if (result) return true;
    } catch (err) {
        console.error(err);
    }
}
