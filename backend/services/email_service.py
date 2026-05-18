import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from core.config import settings


def send_reset_code_email(to_email: str, code: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Mã xác nhận đặt lại mật khẩu - StudyWithMe"
    msg["From"] = settings.SMTP_FROM_EMAIL
    msg["To"] = to_email

    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #4A90D9;">Đặt lại mật khẩu</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản <strong>StudyWithMe</strong>.</p>
        <p>Mã xác nhận của bạn là:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px;
                    padding: 16px; background: #f0f4ff; border-radius: 8px;
                    text-align: center; color: #4A90D9;">
            {code}
        </div>
        <p style="margin-top: 16px; color: #666;">
            Mã này có hiệu lực trong <strong>10 phút</strong>.
            Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
        </p>
    </body>
    </html>
    """

    msg.attach(MIMEText(html, "html"))

    context = ssl.create_default_context()
    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls(context=context)
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_FROM_EMAIL, to_email, msg.as_string())
