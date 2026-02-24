<?php
// api/auth/logout.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../core/Auth.php';

$auth = new Auth();
$result = $auth->logout();

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully'
]);
?>
