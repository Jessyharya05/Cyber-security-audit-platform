// src/components/auditor/AuditorAIAssistant.js
// VERSION FOKUS PADA CONTROL RECOMMENDATION

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaRobot, FaPaperPlane, FaCopy, FaThumbsUp, 
  FaThumbsDown, FaClipboardCheck, FaShieldAlt,
  FaExclamationTriangle, FaLock, FaBug
} from 'react-icons/fa';
import './Auditor.css';

const AuditorAIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "🤖 **AI Control Recommendation Assistant**\n\nSaya akan membantu Anda memberikan **rekomendasi kontrol keamanan** berdasarkan NIST CSF.\n\n**Contoh pertanyaan:**\n• \"How to fix SQL Injection?\"\n• \"What controls for weak passwords?\"\n• \"Recommendations for missing MFA\"\n• \"How to implement account lockout?\"\n• \"Mitigation steps for XSS\"\n\n**Apa yang ingin Anda tanyakan?**",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // ===== KNOWLEDGE BASE FOKUS PADA CONTROL RECOMMENDATIONS =====
  const controlRecommendations = [
    {
      vulnerability: 'sql injection',
      nistFunction: 'Protect',
      severity: 'Critical',
      recommendations: [
        '**Use Parameterized Queries / Prepared Statements**',
        '```python\n# Example: Python with parameterized query\ncursor.execute("SELECT * FROM users WHERE email = %s", (email,))\n```',
        '**Implement Input Validation** - Validate all user inputs against whitelist',
        '**Use Stored Procedures** - Encapsulate database logic',
        '**Apply Least Privilege** - Database accounts should have minimal permissions',
        '**Deploy WAF** - Web Application Firewall with SQL injection rules',
        '**Regular Security Testing** - Use SQLMap, OWASP ZAP for scanning'
      ],
      auditChecklist: [
        'Verify parameterized queries in code',
        'Check input validation implementation',
        'Review database permissions',
        'Test WAF rules',
        'Conduct penetration testing'
      ]
    },
    {
      vulnerability: 'xss cross site scripting',
      nistFunction: 'Protect',
      severity: 'High',
      recommendations: [
        '**Implement Content Security Policy (CSP)**',
        '```http\nContent-Security-Policy: default-src \'self\'; script-src \'self\' https://trusted.cdn.com\n```',
        '**Use Output Encoding**',
        '```javascript\n// Encode user input before displaying\nconst encoded = encodeURIComponent(userInput)\n```',
        '**Input Sanitization** - Use libraries like DOMPurify',
        '**Set HttpOnly and Secure Flags for Cookies**',
        '```http\nSet-Cookie: sessionid=123; HttpOnly; Secure; SameSite=Strict\n```',
        '**Enable X-XSS-Protection Header**',
        '```http\nX-XSS-Protection: 1; mode=block\n```'
      ],
      auditChecklist: [
        'Check CSP headers',
        'Verify output encoding',
        'Test XSS payloads',
        'Review cookie configuration'
      ]
    },
    {
      vulnerability: 'weak password password policy',
      nistFunction: 'Protect',
      severity: 'High',
      recommendations: [
        '**Enforce Strong Password Policy**',
        '• Minimum 12 characters',
        '• Require complexity (uppercase, lowercase, numbers, special)',
        '• Prevent password reuse (last 10 passwords)',
        '**Implement Account Lockout**',
        '• Lock after 5 failed attempts',
        '• Lockout duration: 30 minutes',
        '**Enable Multi-Factor Authentication (MFA)**',
        '• Use TOTP (Google/Microsoft Authenticator)',
        '• Provide backup codes',
        '**Check Against Breached Passwords**',
        '• Integrate with HaveIBeenPwned API',
        '• Maintain password blacklist'
      ],
      auditChecklist: [
        'Verify password policy configuration',
        'Test account lockout',
        'Check MFA implementation',
        'Validate password history',
        'Test breached password detection'
      ]
    },
    {
      vulnerability: 'mfa multi factor authentication missing no mfa',
      nistFunction: 'Protect',
      severity: 'Critical',
      recommendations: [
        '**Enable MFA for All Users**',
        '• Start with administrative accounts',
        '• Roll out to all users gradually',
        '**Choose MFA Methods**',
        '• TOTP (Google/Microsoft Authenticator) - Recommended',
        '• SMS/Email OTP - Less secure, use as backup',
        '• Hardware tokens (YubiKey) - For high security',
        '• Biometric - Fingerprint, face recognition',
        '**Configure MFA Policies**',
        '• Require MFA for sensitive actions',
        '• Implement remember device feature',
        '• Provide backup codes',
        '**Account Lockout Configuration**',
        '• Lock after 5 failed attempts',
        '• Implement progressive delays'
      ],
      auditChecklist: [
        'Verify MFA is enabled',
        'Test MFA functionality',
        'Check backup codes',
        'Validate account lockout',
        'Review MFA policies'
      ]
    },
    {
      vulnerability: 'account lockout brute force',
      nistFunction: 'Protect',
      severity: 'Medium',
      recommendations: [
        '**Implement Account Lockout Policy**',
        '```javascript\n// Account lockout logic\nlet loginAttempts = 0;\nconst MAX_ATTEMPTS = 5;\nconst LOCKOUT_TIME = 30 * 60 * 1000; // 30 minutes\n\nfunction handleFailedLogin() {\n  loginAttempts++;\n  if (loginAttempts >= MAX_ATTEMPTS) {\n    lockAccount(LOCKOUT_TIME);\n  }\n}\n```',
        '**Configure Progressive Delays**',
        '• 1st failure: no delay',
        '• 2nd failure: 2 second delay',
        '• 3rd failure: 5 second delay',
        '• 4th failure: 10 second delay',
        '• 5th failure: lock account',
        '**Implement CAPTCHA After Failed Attempts**',
        '• Show CAPTCHA after 3 failures',
        '• Prevent automated attacks',
        '**Monitor Failed Login Attempts**',
        '• Alert on multiple failures',
        '• Investigate brute force patterns'
      ],
      auditChecklist: [
        'Test account lockout',
        'Verify lockout duration',
        'Check CAPTCHA implementation',
        'Review monitoring alerts',
        'Validate log entries'
      ]
    },
    {
      vulnerability: 'encryption missing no https tls',
      nistFunction: 'Protect',
      severity: 'Critical',
      recommendations: [
        '**Enable HTTPS Everywhere**',
        '```nginx\n# Nginx configuration\nserver {\n    listen 80;\n    server_name example.com;\n    return 301 https://$server_name$request_uri;\n}\n\nserver {\n    listen 443 ssl;\n    ssl_certificate /path/to/cert.pem;\n    ssl_certificate_key /path/to/key.pem;\n    ssl_protocols TLSv1.2 TLSv1.3;\n    ssl_ciphers HIGH:!aNULL:!MD5;\n}\n```',
        '**Use Strong TLS Configuration**',
        '• TLS 1.2 or higher only',
        '• Disable SSLv2, SSLv3, TLSv1.0, TLSv1.1',
        '• Use strong cipher suites',
        '**Implement HSTS**',
        '```http\nStrict-Transport-Security: max-age=31536000; includeSubDomains\n```',
        '**Encrypt Data at Rest**',
        '• Database encryption',
        '• File system encryption',
        '• Backup encryption',
        '**Certificate Management**',
        '• Use trusted CA',
        '• Automate renewal',
        '• Monitor expiration'
      ],
      auditChecklist: [
        'Check HTTPS enforcement',
        'Verify TLS version',
        'Test HSTS header',
        'Review certificate validity',
        'Check encryption at rest'
      ]
    },
    {
      vulnerability: 'default credentials default password',
      nistFunction: 'Protect',
      severity: 'Critical',
      recommendations: [
        '**Change All Default Credentials**',
        '• Change during installation',
        '• Never leave default passwords',
        '**Remove Default Accounts**',
        '• Delete unused accounts',
        '• Disable default users',
        '**Implement Secure Password Policy**',
        '• Strong passwords required',
        '• Regular password rotation',
        '**Scan for Default Credentials**',
        '• Use vulnerability scanners',
        '• Check against default password lists',
        '**Document Credential Requirements**',
        '• Maintain inventory',
        '• Regular audits'
      ],
      auditChecklist: [
        'Scan for default credentials',
        'Check vendor documentation',
        'Verify password changes',
        'Review account inventory',
        'Test default password removal'
      ]
    },
    {
      vulnerability: 'backup missing no backup',
      nistFunction: 'Recover',
      severity: 'Critical',
      recommendations: [
        '**Implement 3-2-1 Backup Rule**',
        '• 3 copies of data',
        '• 2 different media types',
        '• 1 offsite copy',
        '**Automate Backups**',
        '```bash\n# Example backup script\n#!/bin/bash\nmysqldump -u root database > backup.sql\ntar -czf backup.tar.gz /data\naws s3 cp backup.tar.gz s3://bucket/\n```',
        '**Test Restoration Regularly**',
        '• Monthly restoration tests',
        '• Document recovery time',
        '• Verify data integrity',
        '**Encrypt Backups**',
        '• Use encryption at rest',
        '• Secure backup keys',
        '**Monitor Backup Success**',
        '• Automated alerts on failure',
        '• Regular backup reports'
      ],
      auditChecklist: [
        'Check backup configuration',
        'Test restoration process',
        'Verify backup encryption',
        'Review backup logs',
        'Validate offsite storage'
      ]
    },
    {
      vulnerability: 'logging no logs audit logging',
      nistFunction: 'Detect',
      severity: 'Medium',
      recommendations: [
        '**Enable Comprehensive Logging**',
        '• Authentication events',
        '• Access attempts (success/failure)',
        '• Privileged operations',
        '• System changes',
        '• Error events',
        '**Implement Centralized Logging**',
        '```yaml\n# ELK Stack configuration\nfilebeat.inputs:\n- type: log\n  paths:\n    - /var/log/*.log\n  fields:\n    app: myapp\n\noutput.elasticsearch:\n  hosts: ["localhost:9200"]\n```',
        '**Protect Log Integrity**',
        '• Use write-once storage',
        '• Digital signatures',
        '• Access controls',
        '**Set Up Monitoring and Alerts**',
        '• SIEM implementation',
        '• Real-time alerting',
        '• Incident response triggers',
        '**Define Log Retention**',
        '• Compliance requirements',
        '• Storage capacity',
        '• Regular archiving'
      ],
      auditChecklist: [
        'Verify log sources',
        'Check log integrity',
        'Test alert rules',
        'Review retention policy',
        'Validate SIEM integration'
      ]
    },
    {
      vulnerability: 'patch outdated software version',
      nistFunction: 'Protect',
      severity: 'High',
      recommendations: [
        '**Establish Patch Management Policy**',
        '• Critical patches: 48 hours',
        '• High severity: 1 week',
        '• Medium/Low: 1 month',
        '**Maintain Software Inventory**',
        '• All applications and versions',
        '• Dependencies and libraries',
        '• End-of-life software',
        '**Subscribe to Security Advisories**',
        '• Vendor mailing lists',
        '• CVE notifications',
        '• NVD feeds',
        '**Test Patches Before Deployment**',
        '• Staging environment',
        '• Impact assessment',
        '• Rollback plan',
        '**Automate Patch Deployment**',
        '• WSUS for Windows',
        '• Yum/Apt for Linux',
        '• Container scanning'
      ],
      auditChecklist: [
        'Review patch policy',
        'Check software versions',
        'Verify patch testing',
        'Test automation',
        'Audit compliance'
      ]
    },
    {
      vulnerability: 'incident response no plan',
      nistFunction: 'Respond',
      severity: 'High',
      recommendations: [
        '**Create Incident Response Plan**',
        '• Define incident types',
        '• Roles and responsibilities',
        '• Communication channels',
        '• Escalation procedures',
        '**Establish Response Team**',
        '• 24/7 contact list',
        '• Backup personnel',
        '• External resources',
        '**Develop Playbooks**',
        '• Ransomware response',
        '• Data breach',
        '• DDoS attack',
        '• Insider threat',
        '**Conduct Regular Drills**',
        '• Tabletop exercises',
        '• Technical simulations',
        '• Lessons learned',
        '**Document Everything**',
        '• Incident timeline',
        '• Actions taken',
        '• Evidence preservation'
      ],
      auditChecklist: [
        'Review IR plan',
        'Test communication',
        'Validate playbooks',
        'Check drill records',
        'Verify documentation'
      ]
    }
  ];

  // ===== FUNCTION TO FIND BEST CONTROL RECOMMENDATIONS =====
  const findRecommendations = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Check each vulnerability
    for (const item of controlRecommendations) {
      const keywords = item.vulnerability.split(' ');
      for (const keyword of keywords) {
        if (lowerQuery.includes(keyword)) {
          return item;
        }
      }
    }
    
    // Default response with general controls
    return {
      vulnerability: 'general security',
      nistFunction: 'Multiple',
      severity: 'Varies',
      recommendations: [
        '**General Security Controls:**',
        '1. **Access Control**',
        '   • Enable MFA for all users',
        '   • Implement strong password policy',
        '   • Use least privilege principle',
        '',
        '2. **Data Protection**',
        '   • Encrypt sensitive data',
        '   • Regular backups (3-2-1 rule)',
        '   • Data classification',
        '',
        '3. **Network Security**',
        '   • Firewall configuration',
        '   • Network segmentation',
        '   • Regular vulnerability scanning',
        '',
        '4. **Monitoring & Detection**',
        '   • Centralized logging',
        '   • SIEM implementation',
        '   • Alert rules',
        '',
        '5. **Incident Response**',
        '   • Create incident response plan',
        '   • Conduct regular drills',
        '   • Document procedures',
        '',
        '6. **Compliance**',
        '   • Follow NIST CSF framework',
        '   • Regular audits',
        '   • Maintain evidence'
      ],
      auditChecklist: [
        'Review access controls',
        'Check encryption',
        'Verify backups',
        'Test monitoring',
        'Validate incident response'
      ]
    };
  };

  // ===== GENERATE RESPONSE =====
  const generateResponse = (query) => {
    const controls = findRecommendations(query);
    
    let response = `🔐 **CONTROL RECOMMENDATIONS FOR: ${query.toUpperCase()}**\n\n`;
    response += `**NIST CSF Function:** ${controls.nistFunction}\n`;
    response += `**Severity:** ${controls.severity}\n\n`;
    response += `**📋 RECOMMENDED CONTROLS:**\n\n`;
    
    controls.recommendations.forEach(rec => {
      response += `${rec}\n`;
    });
    
    response += `\n**✅ AUDIT CHECKLIST ITEMS:**\n`;
    controls.auditChecklist.forEach((item, i) => {
      response += `${i+1}. ${item}\n`;
    });
    
    response += `\n**📌 EXAMPLE IMPLEMENTATION:**\n`;
    if (query.includes('sql')) {
      response += '```python\n# Parameterized query example\ncursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))\n```\n';
    } else if (query.includes('mfa') || query.includes('lockout')) {
      response += '```javascript\n// Account lockout logic\nif (failedAttempts >= 5) {\n  account.locked = true;\n  account.lockedUntil = Date.now() + 30*60000;\n}\n```\n';
    } else if (query.includes('password')) {
      response += '```javascript\n// Password policy validation\nconst isValid = password.length >= 12 && \n  /[A-Z]/.test(password) && \n  /[0-9]/.test(password);\n```\n';
    }
    
    return {
      text: response,
      controls: controls.recommendations,
      checklist: controls.auditChecklist
    };
  };

  // ===== HANDLE SEND MESSAGE =====
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(inputMessage);
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // ===== QUICK QUESTIONS =====
  const quickQuestions = [
    { text: "How to fix SQL Injection?", icon: <FaBug /> },
    { text: "MFA and account lockout recommendations", icon: <FaLock /> },
    { text: "Controls for weak passwords", icon: <FaShieldAlt /> },
    { text: "How to implement encryption?", icon: <FaShieldAlt /> },
    { text: "Backup best practices", icon: <FaClipboardCheck /> },
    { text: "Incident response controls", icon: <FaExclamationTriangle /> }
  ];

  return (
    <DashboardLayout role="auditor">
      <div className="auditor-page">
        <div className="page-header">
          <div>
            <h2><FaRobot /> AI Control Recommendation</h2>
            <p>Get security control recommendations based on NIST CSF</p>
          </div>
        </div>

        <div className="ai-chat-container">
          {/* Sidebar with Quick Questions */}
          <div className="chat-sidebar">
            <h3>📌 Quick Recommendations</h3>
            <div className="quick-questions">
              {quickQuestions.map((q, idx) => (
                <button 
                  key={idx} 
                  className="quick-question"
                  onClick={() => setInputMessage(q.text)}
                >
                  {q.icon} {q.text}
                </button>
              ))}
            </div>
            
            <div className="info-box">
              <h4>🎯 How it works</h4>
              <p>Ask about any vulnerability or security issue, and I'll provide:</p>
              <ul>
                <li>✓ Specific security controls</li>
                <li>✓ Implementation steps</li>
                <li>✓ Code examples</li>
                <li>✓ Audit checklist items</li>
                <li>✓ NIST CSF mapping</li>
              </ul>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="chat-main">
            <div className="chat-messages">
              {messages.map(message => (
                <div key={message.id} className={`message ${message.type}`}>
                  {message.type === 'ai' && (
                    <div className="message-avatar">
                      <FaRobot />
                    </div>
                  )}
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">
                        {message.type === 'ai' ? 'AI Control Advisor' : 'You'}
                      </span>
                      <span className="message-time">{message.timestamp}</span>
                    </div>
                    <div className="message-text">
                      {message.text.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                    {message.type === 'ai' && (
                      <div className="message-actions">
                        <button className="message-action" onClick={() => navigator.clipboard.writeText(message.text)}>
                          <FaCopy /> Copy
                        </button>
                        <button className="message-action"><FaThumbsUp /></button>
                        <button className="message-action"><FaThumbsDown /></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="message ai">
                  <div className="message-avatar">
                    <FaRobot />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Ask for control recommendations (e.g., 'How to fix SQL Injection?')..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="send-button" onClick={handleSendMessage}>
                <FaPaperPlane />
              </button>
            </div>

            <div className="chat-footer">
              <FaRobot /> I provide specific security control recommendations based on NIST CSF. Ask me about any vulnerability!
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuditorAIAssistant;