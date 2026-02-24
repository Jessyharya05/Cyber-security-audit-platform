<?php
// api/auth/register.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../core/Auth.php';
require_once __DIR__ . '/../../utils/Validation.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate input
$validation = new Validation();
$rules = [
    'fullName' => 'required',
    'email' => 'required|email',
    'password' => 'required|min:8',
    'confirmPassword' => 'required|matches:password',
    'role' => 'required|in:admin,auditor,auditee'
];

$errors = $validation->validate($input, $rules);

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['errors' => $errors]);
    exit();
}

$auth = new Auth();
$result = $auth->register($input, $input['role']);

if ($result['success']) {
    echo json_encode([
        'success' => true,
        'message' => 'Registration successful',
        'user' => $result['user']
    ]);
} else {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $result['message']
    ]);
}
?>
