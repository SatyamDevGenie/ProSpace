import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

export async function sendBookingApprovedEmail(to: string, userName: string, deskNumber: string, date: string): Promise<void> {
    const subject = "ProSpace – Your desk booking has been approved";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
            <h2 style="color: #0f172a;">Booking Approved</h2>
            <p>Hi ${userName},</p>
            <p>Your desk booking has been <strong>approved</strong> by the admin.</p>
            <p><strong>Details:</strong></p>
            <ul>
                <li>Desk: ${deskNumber}</li>
                <li>Date: ${date}</li>
            </ul>
            <p>You can view your bookings in the ProSpace app.</p>
            <p style="color: #64748b; font-size: 12px; margin-top: 24px;">– ProSpace Team</p>
        </div>
    `;
    await transporter.sendMail({
        from: `"ProSpace" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html
    });
}

export async function sendBookingRejectedEmail(to: string, userName: string, deskNumber: string, date: string, reason: string): Promise<void> {
    const subject = "ProSpace – Your desk booking was rejected";
    const reasonText = reason?.trim() || "No reason provided.";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
            <h2 style="color: #0f172a;">Booking Rejected</h2>
            <p>Hi ${userName},</p>
            <p>Your desk booking has been <strong>rejected</strong> by the admin.</p>
            <p><strong>Details:</strong></p>
            <ul>
                <li>Desk: ${deskNumber}</li>
                <li>Date: ${date}</li>
            </ul>
            <p><strong>Reason:</strong> ${reasonText}</p>
            <p>You can book another desk from the ProSpace app.</p>
            <p style="color: #64748b; font-size: 12px; margin-top: 24px;">– ProSpace Team</p>
        </div>
    `;
    await transporter.sendMail({
        from: `"ProSpace" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html
    });
}

export async function sendAdminCancelledEmail(to: string, userName: string, deskNumber: string, date: string, reason: string): Promise<void> {
    const subject = "ProSpace – Your desk booking was cancelled by admin";
    const reasonText = reason?.trim() || "No reason provided.";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
            <h2 style="color: #0f172a;">Booking Cancelled by Admin</h2>
            <p>Hi ${userName},</p>
            <p>Your desk booking has been <strong>cancelled</strong> by the admin.</p>
            <p><strong>Details:</strong></p>
            <ul>
                <li>Desk: ${deskNumber}</li>
                <li>Date: ${date}</li>
            </ul>
            <p><strong>Reason:</strong> ${reasonText}</p>
            <p>You can book another desk from the ProSpace app.</p>
            <p style="color: #64748b; font-size: 12px; margin-top: 24px;">– ProSpace Team</p>
        </div>
    `;
    await transporter.sendMail({
        from: `"ProSpace" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html
    });
}

export async function sendUserCancelledToAdminEmail(adminEmail: string, userName: string, userEmail: string, deskNumber: string, date: string, reason: string): Promise<void> {
    const subject = "ProSpace – User cancelled a booking";
    const reasonText = reason?.trim() || "No reason provided.";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
            <h2 style="color: #0f172a;">User Cancelled Booking</h2>
            <p>A user has cancelled their desk booking.</p>
            <p><strong>Details:</strong></p>
            <ul>
                <li>User: ${userName} (${userEmail})</li>
                <li>Desk: ${deskNumber}</li>
                <li>Date: ${date}</li>
            </ul>
            <p><strong>Reason:</strong> ${reasonText}</p>
            <p style="color: #64748b; font-size: 12px; margin-top: 24px;">– ProSpace System</p>
        </div>
    `;
    await transporter.sendMail({
        from: `"ProSpace" <${process.env.GMAIL_USER}>`,
        to: adminEmail,
        subject,
        html
    });
}
