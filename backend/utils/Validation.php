<?php
// utils/Validation.php

class Validation {
    public function validate($data, $rules) {
        $errors = [];
        
        foreach ($rules as $field => $rule) {
            $rulesList = explode('|', $rule);
            
            foreach ($rulesList as $singleRule) {
                if ($singleRule === 'required' && empty($data[$field])) {
                    $errors[$field][] = "$field is required";
                }
                
                if (strpos($singleRule, 'min:') === 0) {
                    $min = explode(':', $singleRule)[1];
                    if (strlen($data[$field]) < $min) {
                        $errors[$field][] = "$field must be at least $min characters";
                    }
                }
                
                if ($singleRule === 'email' && !filter_var($data[$field], FILTER_VALIDATE_EMAIL)) {
                    $errors[$field][] = "$field must be a valid email";
                }
                
                if (strpos($singleRule, 'matches:') === 0) {
                    $matchField = explode(':', $singleRule)[1];
                    if ($data[$field] !== $data[$matchField]) {
                        $errors[$field][] = "$field does not match $matchField";
                    }
                }
                
                if (strpos($singleRule, 'in:') === 0) {
                    $allowed = explode(',', explode(':', $singleRule)[1]);
                    if (!in_array($data[$field], $allowed)) {
                        $errors[$field][] = "$field must be one of: " . implode(', ', $allowed);
                    }
                }
            }
        }
        
        return $errors;
    }
}
?>
