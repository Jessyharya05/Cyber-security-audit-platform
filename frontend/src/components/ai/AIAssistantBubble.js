// src/components/ai/AIAssistantBubble.js

import React, { useState, useRef, useEffect } from 'react';
import { 
  FaRobot, 
  FaPaperPlane, 
  FaTimes, 
  FaMicrophone,
  FaCopy,
  FaThumbsUp,
  FaThumbsDown,
  FaStar,
  FaMinus,
  FaExpand,
  FaCompress,
  FaBug,
  FaShieldAlt,
  FaLock,
  FaCloud,
  FaDatabase
} from 'react-icons/fa';
import './AIAssistantBubble.css';

const AIAssistantBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "👋 Hello! I'm your AI security assistant. How can I help you today?\n\nYou can ask me about:\n• Vulnerabilities (SQLi, XSS, etc.)\n• Security controls & MFA\n• NIST CSF framework\n• Audit recommendations\n• Best practices",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ==================== KNOWLEDGE BASE ====================

  const knowledgeBase = [
    {
      keywords: ['sql injection', 'sqli', 'sql', 'injection'],
      response: {
        text: `**🔍 SQL INJECTION**\n\n**What is it?**\nSQL Injection is an attack where malicious SQL statements are inserted into application inputs to manipulate the database.\n\n**Impact:**\n• Data breach\n• Authentication bypass\n• Data loss\n• Database takeover\n\n**Recommendations:**\n1. Use parameterized queries\n2. Input validation\n3. Stored procedures\n4. Least privilege\n5. WAF implementation\n\n**Example:**\n\`\`\`python\n# Safe query\ncursor.execute("SELECT * FROM users WHERE email = %s", (email,))\n\`\`\``
      }
    },
    {
      keywords: ['xss', 'cross site', 'cross-site', 'scripting'],
      response: {
        text: `**🔍 CROSS-SITE SCRIPTING (XSS)**\n\n**What is it?**\nXSS allows attackers to inject malicious scripts into web pages viewed by other users.\n\n**Types:**\n• Reflected XSS\n• Stored XSS\n• DOM-based XSS\n\n**Recommendations:**\n1. Content Security Policy (CSP)\n2. Output encoding\n3. Input sanitization\n4. HttpOnly cookies\n5. X-XSS-Protection header\n\n**Example CSP:**\n\`\`\`http\nContent-Security-Policy: default-src 'self'\n\`\`\``
      }
    },
    {
      keywords: ['mfa', '2fa', 'multi factor', 'two factor', 'authentication'],
      response: {
        text: `**🔐 MULTI-FACTOR AUTHENTICATION (MFA)**\n\n**What is it?**\nMFA requires users to provide multiple verification factors to access accounts.\n\n**MFA Methods:**\n• TOTP (Google/Microsoft Authenticator)\n• SMS/Email OTP\n• Biometric\n• Hardware tokens\n\n**Implementation Steps:**\n1. Enable for all users\n2. Start with admins\n3. Provide backup codes\n4. Configure account lockout\n\n**Account Lockout:**\n• 5 failed attempts = lock\n• 30 minute lockout duration\n• Progressive delays recommended`
      }
    },
    {
      keywords: ['password', 'password policy', 'weak password'],
      response: {
        text: `**🔐 PASSWORD POLICY BEST PRACTICES**\n\n**NIST Recommendations:**\n• Minimum 8 characters (12+ recommended)\n• Check against breached passwords\n• Allow paste in password fields\n• Show password while typing\n\n**Additional Controls:**\n• Account lockout after 5 attempts\n• Password history (10-24 passwords)\n• MFA implementation\n\n**Example Policy:**\n\`\`\`javascript\nif (password.length < 12) reject;\nif (isPasswordBreached(password)) reject;\nif (password === lastPassword) reject;\n\`\`\``
      }
    },
    {
      keywords: ['nist', 'nist csf', 'cybersecurity framework'],
      response: {
        text: `**📋 NIST CYBERSECURITY FRAMEWORK**\n\n**5 Core Functions:**\n\n1. **IDENTIFY**\n   • Asset Management\n   • Risk Assessment\n   • Governance\n\n2. **PROTECT**\n   • Access Control\n   • Data Security\n   • Awareness Training\n\n3. **DETECT**\n   • Anomalies & Events\n   • Continuous Monitoring\n\n4. **RESPOND**\n   • Response Planning\n   • Communications\n   • Analysis\n\n5. **RECOVER**\n   • Recovery Planning\n   • Improvements`
      }
    },
    {
      keywords: ['encryption', 'tls', 'ssl', 'https'],
      response: {
        text: `**🔐 ENCRYPTION BEST PRACTICES**\n\n**Data at Rest:**\n• Full disk encryption\n• Database encryption\n• Backup encryption\n\n**Data in Transit:**\n• TLS 1.3 only\n• HTTPS everywhere\n• Strong cipher suites\n\n**Configuration Example:**\n\`\`\`nginx\nserver {\n    listen 443 ssl;\n    ssl_protocols TLSv1.2 TLSv1.3;\n    ssl_ciphers HIGH:!aNULL:!MD5;\n}\n\`\`\``
      }
    },
    {
      keywords: ['ransomware', 'malware', 'virus'],
      response: {
        text: `**💀 RANSOMWARE PREVENTION**\n\n**Prevention:**\n• Regular backups (3-2-1 rule)\n• Patch management\n• Email filtering\n• User awareness training\n• Application whitelisting\n\n**Response Steps:**\n1. Isolate infected systems\n2. DO NOT pay ransom\n3. Contact authorities\n4. Restore from backups\n5. Investigate root cause`
      }
    },
    {
      keywords: ['incident response', 'breach', 'security incident'],
      response: {
        text: `**🚨 INCIDENT RESPONSE**\n\n**NIST SP 800-61 Phases:**\n\n1. **PREPARATION**\n   • Create IR plan\n   • Form response team\n   • Prepare tools\n\n2. **DETECTION & ANALYSIS**\n   • Monitor alerts\n   • Analyze indicators\n   • Prioritize incidents\n\n3. **CONTAINMENT & RECOVERY**\n   • Isolate systems\n   • Remove threat\n   • Restore operations\n\n4. **POST-INCIDENT**\n   • Lessons learned\n   • Update procedures\n   • Report stakeholders`
      }
    },
    {
      keywords: ['cloud security', 'aws', 'azure', 'cloud'],
      response: {
        text: `**☁️ CLOUD SECURITY**\n\n**Shared Responsibility:**\n• Provider: Physical, infrastructure\n• Customer: Data, access, configs\n\n**Best Practices:**\n1. IAM with least privilege\n2. Enable MFA for all\n3. Encrypt data everywhere\n4. Enable logging (CloudTrail)\n5. Regular security assessments\n6. Use security groups\n\n**Tools:**\n• AWS Security Hub\n• Azure Security Center\n• Prisma Cloud`
      }
    }
  ];

  // ==================== AI RESPONSE GENERATOR ====================

  const generateResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Check knowledge base
    for (const item of knowledgeBase) {
      for (const keyword of item.keywords) {
        if (lowerQuery.includes(keyword)) {
          return item.response.text;
        }
      }
    }

    // Question patterns
    if (lowerQuery.includes('how to') || lowerQuery.includes('how do i')) {
      return `**📝 STEP-BY-STEP GUIDE**\n\nBased on your question about "${query}", here's a general approach:\n\n1. **Assess** your current situation\n2. **Plan** the implementation\n3. **Implement** security controls\n4. **Test** effectiveness\n5. **Monitor** and maintain\n\nFor more specific guidance, please provide more details!`;
    }

    if (lowerQuery.includes('what is') || lowerQuery.includes('explain')) {
      return `**📚 EXPLANATION**\n\n"${query}" is a security concept that involves protecting information systems. Key aspects include:\n\n• **Confidentiality** - Data accessible only to authorized users\n• **Integrity** - Data accuracy and completeness\n• **Availability** - Systems accessible when needed\n\nWould you like more specific information?`;
    }

    if (lowerQuery.includes('recommend') || lowerQuery.includes('best practice')) {
      return `**✨ SECURITY RECOMMENDATIONS**\n\nBased on industry standards:\n\n1. **Identity & Access**\n   • Enable MFA\n   • Strong password policy\n   • Account lockout\n\n2. **Data Protection**\n   • Encrypt data\n   • Regular backups\n   • Data classification\n\n3. **Network Security**\n   • Firewalls\n   • Segmentation\n   • Monitoring\n\n4. **Incident Response**\n   • Create IR plan\n   • Regular drills\n   • Document incidents`;
    }

    // Default response
    return `**🤔 HOW CAN I HELP?**\n\nI can help you with:\n\n• **Vulnerabilities:** SQL Injection, XSS, CSRF\n• **Controls:** MFA, Password Policy, Encryption\n• **Frameworks:** NIST CSF, ISO 27001\n• **Compliance:** GDPR, PCI DSS\n• **Tools:** Burp Suite, Nmap\n• **Best Practices:** Cloud Security, DevSecOps\n\nPlease ask a specific question!`;
  };

  // ==================== HANDLE SEND MESSAGE ====================

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI typing
    setTimeout(() => {
      const response = generateResponse(inputMessage);
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: response,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // ==================== HANDLE QUICK QUESTION ====================

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  // ==================== HANDLE COPY ====================

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('✅ Copied to clipboard!');
  };

  // ==================== HANDLE FAVORITE ====================

  const handleFavorite = (message) => {
    setFavorites([message, ...favorites.slice(0, 4)]);
    alert('⭐ Added to favorites!');
  };

  // ==================== TOGGLE WINDOW SIZE ====================

  const getWindowClass = () => {
    if (isExpanded) return 'ai-bubble-window expanded';
    if (isMinimized) return 'ai-bubble-window minimized';
    return 'ai-bubble-window';
  };

  return (
    <>
      {/* AI Bubble Button */}
      {!isOpen && (
        <button className="ai-bubble-button" onClick={() => setIsOpen(true)}>
          <FaRobot />
          <span className="ai-bubble-pulse"></span>
        </button>
      )}

      {/* AI Chat Window */}
      {isOpen && (
        <div className={getWindowClass()}>
          {/* Header */}
          <div className="ai-bubble-header">
            <div className="header-left">
              <FaRobot className="header-icon" />
              <div>
                <h3>AI Security Assistant</h3>
                <p>Ask me anything about security</p>
              </div>
            </div>
            <div className="header-right">
              <button onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? <FaExpand /> : <FaMinus />}
              </button>
              <button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <FaCompress /> : <FaExpand />}
              </button>
              <button onClick={() => setIsOpen(false)}>
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="ai-bubble-messages">
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
                          {message.type === 'ai' ? 'AI Assistant' : 'You'}
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
                          <button onClick={() => handleCopy(message.text)}>
                            <FaCopy /> Copy
                          </button>
                          <button onClick={() => handleFavorite(message.text)}>
                            <FaStar /> Save
                          </button>
                          <button><FaThumbsUp /></button>
                          <button><FaThumbsDown /></button>
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
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              <div className="ai-bubble-quick">
                <button onClick={() => handleQuickQuestion("What is SQL Injection?")}>
                  <FaBug /> SQL Injection
                </button>
                <button onClick={() => handleQuickQuestion("How to implement MFA?")}>
                  <FaLock /> MFA
                </button>
                <button onClick={() => handleQuickQuestion("NIST CSF overview")}>
                  <FaShieldAlt /> NIST CSF
                </button>
                <button onClick={() => handleQuickQuestion("Cloud security best practices")}>
                  <FaCloud /> Cloud
                </button>
              </div>

              {/* Input Area */}
              <div className="ai-bubble-input">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>
                  <FaPaperPlane />
                </button>
              </div>

              {/* Footer */}
              <div className="ai-bubble-footer">
                <FaRobot /> I can answer any security question!
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistantBubble;