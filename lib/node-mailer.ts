import nodemailer from "nodemailer";

const mailClient = process.env.MAIL!;
const mailPassword = process.env.MAIL_PASSWORD!;

export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: mailClient,
		pass: mailPassword
	}
});

export const mailOptions = {
	from: mailClient,
}