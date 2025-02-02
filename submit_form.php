<?php
session_start();
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: /contact");
    exit;
}

// Sanitize inputs
$name = filter_var($_POST['name'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$message = filter_var($_POST['message'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);

// Validate inputs
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

if (empty($message)) {
    $errors[] = 'Message is required';
}

if (!empty($errors)) {
    $_SESSION['form_errors'] = $errors;
    $_SESSION['old_input'] = [
        'name' => $name,
        'email' => $email,
        'message' => $message
    ];
    header("Location: /contact#contact");
    exit;
}

try {
    $mail = new PHPMailer(true);

    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';  // SMTP server (change for your provider)
    $mail->SMTPAuth = true;
    $mail->Username = '0033mab@gmail.com';  // SMTP username
    $mail->Password = 'm.WELL@2025';  // SMTP app password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Recipients
    $mail->setFrom('noreply@gmail.com', 'Website Contact Form');
    $mail->addAddress('maxwellantwibosiako@gmail.com');
    $mail->addReplyTo($email, $name);

    // Content
    $mail->Subject = "New Contact Form Submission from $name";
    $mail->Body = "You have received a new message:\n\n"
                . "Name: $name\n"
                . "Email: $email\n\n"
                . "Message:\n$message";

    $mail->send();
    $_SESSION['form_success'] = 'Your message has been sent successfully!';
    
} catch (Exception $e) {
    $_SESSION['form_errors'] = ["Message could not be sent. Error: {$mail->ErrorInfo}"];
    $_SESSION['old_input'] = [
        'name' => $name,
        'email' => $email,
        'message' => $message
    ];
}

header("Location: /contact#contact");
exit;
?>