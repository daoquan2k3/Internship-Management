package pka.edu.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendResetPasswordEmail(String toEmail, String username, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("trung8d2005@gmail.com", "Internship System");
            helper.setTo(toEmail);
            helper.setSubject("Yêu cầu đặt lại mật khẩu - Internship System");

            String htmlContent = buildHtmlEmailTemplate(username, resetLink);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi hệ thống trong quá trình xử lý email.");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildHtmlEmailTemplate(String username, String resetLink) {
        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "  <style>"
                + "    body { font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }"
                + "    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }"
                + "    .header { background-color: #0f172a; padding: 30px 40px; text-align: center; }"
                + "    .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }"
                + "    .header span { color: #38bdf8; }"
                + "    .content { padding: 40px; color: #334155; line-height: 1.6; font-size: 16px; }"
                + "    .content p { margin: 0 0 20px 0; }"
                + "    .button-container { text-align: center; margin: 35px 0; }"
                + "    .btn { display: inline-block; padding: 14px 32px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; }"
                + "    .warning-box { background-color: #f8fafc; border-left: 4px solid #94a3b8; padding: 16px 20px; border-radius: 0 8px 8px 0; font-size: 14px; color: #64748b; margin-top: 30px; }"
                + "    .footer { padding: 25px 40px; background-color: #f8fafc; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }"
                + "  </style>"
                + "</head>"
                + "<body>"
                + "  <div class=\"container\">"
                + "    <div class=\"header\">"
                + "      <h1>Internship<span>System</span></h1>"
                + "    </div>"
                + "    <div class=\"content\">"
                + "      <p>Kính gửi <strong>" + username + "</strong>,</p>"
                + "      <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với địa chỉ email này trên hệ thống quản lý thực tập.</p>"
                + "      <p>Để đảm bảo tính bảo mật và cấp lại quyền truy cập, vui lòng nhấp vào biểu tượng dưới đây để tiến hành thiết lập mật khẩu mới.</p>"
                + "      <div class=\"button-container\">"
                + "        <a href=\"" + resetLink + "\" class=\"btn\">Thiết lập lại mật khẩu</a>"
                + "      </div>"
                + "      <div class=\"warning-box\">"
                + "        <strong>Lưu ý bảo mật:</strong> Liên kết này chỉ có hiệu lực duy nhất một lần và sẽ tự động hết hạn sau <strong>60 phút</strong>. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email. Tài khoản của bạn vẫn được bảo vệ an toàn."
                + "      </div>"
                + "    </div>"
                + "    <div class=\"footer\">"
                + "      © " + java.time.Year.now().getValue() + " Internship Management System. All rights reserved.<br/>"
                + "      Đây là email tự động, vui lòng không phản hồi."
                + "    </div>"
                + "  </div>"
                + "</body>"
                + "</html>";
    }
}
