<?php
// middleware/RoleMiddleware.php

require_once __DIR__ . '/../core/Auth.php';

class RoleMiddleware {
    private $auth;
    private $allowedRoles;
    
    public function __construct($allowedRoles = []) {
        $this->auth = new Auth();
        $this->allowedRoles = $allowedRoles;
    }
    
    public function handle() {
        $user = $this->auth->user();
        
        if (!$user) {
            header('HTTP/1.0 401 Unauthorized');
            echo json_encode(['error' => 'Unauthorized']);
            exit();
        }
        
        if (!empty($this->allowedRoles) && !in_array($user['role'], $this->allowedRoles)) {
            header('HTTP/1.0 403 Forbidden');
            echo json_encode(['error' => 'Access denied for this role']);
            exit();
        }
    }
}
?>
