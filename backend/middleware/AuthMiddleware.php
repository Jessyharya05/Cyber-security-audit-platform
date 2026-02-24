<?php
// middleware/AuthMiddleware.php

require_once __DIR__ . '/../core/Auth.php';

class AuthMiddleware {
    private $auth;
    
    public function __construct() {
        $this->auth = new Auth();
    }
    
    public function handle() {
        if (!$this->auth->check()) {
            header('HTTP/1.0 401 Unauthorized');
            echo json_encode(['error' => 'Unauthorized. Please login.']);
            exit();
        }
    }
}
?>
