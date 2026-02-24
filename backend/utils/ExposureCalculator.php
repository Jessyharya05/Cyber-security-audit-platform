<?php
// utils/ExposureCalculator.php (TIDAK BERUBAH, karena logic PHP murni)

class ExposureCalculator {
    public function calculate($data) {
        $score = 0;
        
        $highRiskSectors = ['Finance', 'Healthcare', 'Government'];
        if (in_array($data['sector'], $highRiskSectors)) {
            $score += 3;
        } else if ($data['sector'] === 'Technology') {
            $score += 2;
        } else {
            $score += 1;
        }
        
        if ($data['employees'] > 1000) {
            $score += 3;
        } else if ($data['employees'] > 100) {
            $score += 2;
        } else {
            $score += 1;
        }
        
        if (strpos(strtolower($data['systemType']), 'cloud') !== false) {
            $score += 3;
        } else {
            $score += 1;
        }
        
        if ($score >= 8) return 'High';
        if ($score >= 5) return 'Medium';
        return 'Low';
    }
}
?>
