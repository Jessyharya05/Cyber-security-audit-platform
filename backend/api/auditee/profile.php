<?php
// api/auditee/profile.php - PostgreSQL version

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../middleware/RoleMiddleware.php';
require_once __DIR__ . '/../../config/database.php';

$auth = new AuthMiddleware();
$auth->handle();

$roleCheck = new RoleMiddleware(['auditee']);
$roleCheck->handle();

$user = (new Auth())->user();
$database = new Database();
$db = $database->connect();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // PostgreSQL query (sama, karena pakai prepared statement)
    $query = "SELECT * FROM companies WHERE user_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $user['id']);
    $stmt->execute();
    
    $company = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($company) {
        echo json_encode($company);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Company profile not found']);
    }
    
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    require_once __DIR__ . '/../../utils/ExposureCalculator.php';
    $calculator = new ExposureCalculator();
    $exposureLevel = $calculator->calculate($input);
    
    $query = "UPDATE companies SET 
              name = :name,
              sector = :sector,
              employees = :employees,
              system_type = :system_type,
              exposure_level = :exposure_level
              WHERE user_id = :user_id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $input['name']);
    $stmt->bindParam(':sector', $input['sector']);
    $stmt->bindParam(':employees', $input['employees']);
    $stmt->bindParam(':system_type', $input['systemType']);
    $stmt->bindParam(':exposure_level', $exposureLevel);
    $stmt->bindParam(':user_id', $user['id']);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Profile updated']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update profile']);
    }
}
?>
