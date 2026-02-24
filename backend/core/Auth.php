<?php
// core/Auth.php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/Session.php';

class Auth {
    private $db;
    private $session;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->connect();
        $this->session = new Session();
    }
    
    // LOGIN FUNCTION
    public function login($email, $password) {
        try {
            $query = "SELECT * FROM users WHERE email = :email LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password'])) {
                // Set session
                $this->session->set('user_id', $user['id']);
                $this->session->set('user_name', $user['fullName']);
                $this->session->set('user_email', $user['email']);
                $this->session->set('user_role', $user['role']);
                
                // Update last login
                $this->updateLastLogin($user['id']);
                
                return [
                    'success' => true,
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['fullName'],
                        'email' => $user['email'],
                        'role' => $user['role']
                    ]
                ];
            }
            
            return ['success' => false, 'message' => 'Invalid email or password'];
            
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Login failed'];
        }
    }
    
    // REGISTER FUNCTION
    public function register($data, $role) {
        try {
            // Check if email exists
            $checkQuery = "SELECT id FROM users WHERE email = :email";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->bindParam(':email', $data['email']);
            $checkStmt->execute();
            
            if ($checkStmt->rowCount() > 0) {
                return ['success' => false, 'message' => 'Email already exists'];
            }
            
            // Hash password
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
            
            // Insert new user
            $query = "INSERT INTO users (fullName, email, password, role) 
                      VALUES (:fullName, :email, :password, :role)";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':fullName', $data['fullName']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':password', $hashedPassword);
            $stmt->bindParam(':role', $role);
            
            if ($stmt->execute()) {
                $userId = $this->db->lastInsertId();
                
                // If role is auditee, create company profile
                if ($role === 'auditee') {
                    $this->createCompanyProfile($userId, $data);
                }
                
                // Auto login after register
                return $this->login($data['email'], $data['password']);
            }
            
            return ['success' => false, 'message' => 'Registration failed'];
            
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Registration failed'];
        }
    }
    
    // LOGOUT FUNCTION
    public function logout() {
        $this->session->destroy();
        return ['success' => true];
    }
    
    // CHECK IF USER IS LOGGED IN
    public function check() {
        return $this->session->has('user_id');
    }
    
    // GET CURRENT USER
    public function user() {
        if (!$this->check()) {
            return null;
        }
        
        return [
            'id' => $this->session->get('user_id'),
            'name' => $this->session->get('user_name'),
            'email' => $this->session->get('user_email'),
            'role' => $this->session->get('user_role')
        ];
    }
    
    private function updateLastLogin($userId) {
        $query = "UPDATE users SET last_login = NOW() WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $userId);
        $stmt->execute();
    }
    
    private function createCompanyProfile($userId, $data) {
        // Calculate exposure level
        $exposureLevel = $this->calculateExposureLevel($data);
        
        $query = "INSERT INTO companies (user_id, name, sector, employees, system_type, exposure_level) 
                  VALUES (:user_id, :name, :sector, :employees, :system_type, :exposure_level)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':name', $data['companyName']);
        $stmt->bindParam(':sector', $data['sector']);
        $stmt->bindParam(':employees', $data['employees']);
        $stmt->bindParam(':system_type', $data['systemType']);
        $stmt->bindParam(':exposure_level', $exposureLevel);
        $stmt->execute();
    }
    
    private function calculateExposureLevel($data) {
        $score = 0;
        
        // Sector risk
        $highRiskSectors = ['Finance', 'Healthcare', 'Government'];
        if (in_array($data['sector'], $highRiskSectors)) $score += 3;
        else if ($data['sector'] === 'Technology') $score += 2;
        else $score += 1;
        
        // Employee count
        if ($data['employees'] > 1000) $score += 3;
        else if ($data['employees'] > 100) $score += 2;
        else $score += 1;
        
        // System type
        if (strpos(strtolower($data['systemType']), 'cloud') !== false) $score += 3;
        else $score += 1;
        
        if ($score >= 8) return 'High';
        if ($score >= 5) return 'Medium';
        return 'Low';
    }
}
?>