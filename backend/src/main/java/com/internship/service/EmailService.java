package com.internship.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPassword(String toEmail, String fullName, String username, String password, String role) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Tài khoản hệ thống Quản lý Thực tập");

            String emailContent = String.format(
                    "Xin chào %s,\n\n" +
                            "Tài khoản của bạn đã được tạo thành công trong Hệ thống Quản lý Thực tập.\n\n" +
                            "Thông tin đăng nhập:\n" +
                            "- Tên đăng nhập: %s\n" +
                            "- Mật khẩu: %s\n" +
                            "- Vai trò: %s\n\n" +
                            "Vui lòng đăng nhập hệ thống tại: https://intern.oceanmind.id.vn/\n" +
                            "Lưu ý: Hãy đổi mật khẩu sau lần đăng nhập đầu tiên để bảo mật tài khoản.\n\n" +
                            "Trân trọng,\n" +
                            "Hệ thống Quản lý Thực tập",
                    fullName, username, password, getRoleDisplayName(role));

            message.setText(emailContent);
            message.setFrom("h5studiogl@gmail.com");

            mailSender.send(message);

            System.out.println("Email sent successfully to: " + toEmail);

        } catch (Exception e) {
            System.err.println("Error sending email to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    private String getRoleDisplayName(String role) {
        switch (role.toUpperCase()) {
            case "DEPARTMENT":
                return "Phòng ban";
            case "TEACHER":
                return "Giảng viên";
            case "STUDENT":
                return "Sinh viên";
            case "MENTOR":
                return "Mentor";
            default:
                return role;
        }
    }
}