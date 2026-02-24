<?php
// api/auth/login.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../core/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password required']);
    exit();
}

$auth = new Auth();
$result = $auth->login($input['email'], $input['password']);

if ($result['success']) {
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => $result['user']
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $result['message']
    ]);
}
?>
