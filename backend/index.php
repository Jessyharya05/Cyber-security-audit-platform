<?php
// index.php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$request = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Simple routing
if (strpos($request, '/api/auth/login') !== false) {
    require_once 'api/auth/login.php';
} else if (strpos($request, '/api/auth/register') !== false) {
    require_once 'api/auth/register.php';
} else if (strpos($request, '/api/auth/logout') !== false) {
    require_once 'api/auth/logout.php';
} else if (strpos($request, '/api/auditee/profile') !== false) {
    require_once 'api/auditee/profile.php';
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}
?>
