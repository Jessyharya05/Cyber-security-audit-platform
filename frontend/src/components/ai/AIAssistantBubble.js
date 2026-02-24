// src/components/ai/AIAssistantBubble.js
// Upgraded: Context-aware AI Control Recommendations (Option C)
// Now accepts audit context as props and generates targeted mitigation advice

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
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
  FaExclamationTriangle,
  FaClipboardCheck,
  FaLightbulb
} from 'react-icons/fa';
import './AIAssistantBubble.css';

// ─────────────────────────────────────────────────────────────────────────────
// PROP INTERFACE (pass these from your parent audit components)
//
//  auditContext = {
//    selectedVulnerabilities : string[]   — e.g. ["SQL Injection", "XSS"]
//    nonCompliantControls    : string[]   — e.g. ["No MFA", "Weak Password"]
//    assets                  : { name, type, ciaValue }[]
//    complianceScore         : number     — 0-100
//    framework               : string     — "NIST CSF" | "ISO 27001" | "RMF" | "OCTAVE"
//    organizationName        : string
//  }
// ─────────────────────────────────────────────────────────────────────────────

const AIAssistantBubble = ({ auditContext = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "👋 Hello! I'm your AI Security Auditor.\n\nI can give you **context-aware recommendations** based on your actual audit data.\n\nTry asking:\n• What controls should I implement?\n• Explain my top risks\n• How do I fix [vulnerability]?\n• Generate my audit recommendations",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ─────────────────────────────────────────────────────────────────────────
  // CONTROL RECOMMENDATION DATABASE
  // Maps vulnerabilities/issues → specific, actionable control recommendations
  // ─────────────────────────────────────────────────────────────────────────

  const controlRecommendations = {
    'SQL Injection': {
      priority: 'CRITICAL',
      controls: [
        'Use parameterized queries / prepared statements for ALL database calls',
        'Implement input validation with allowlist (not just blocklist)',
        'Apply least-privilege database accounts (no DROP/ALTER in app user)',
        'Deploy a Web Application Firewall (WAF) with SQLi rules',
        'Enable database query logging and alert on anomalies'
      ],
      framework_map: {
        'NIST CSF': 'PR.DS-2 (Data in Transit), DE.CM-7 (Monitoring)',
        'ISO 27001': 'A.14.2.5 (Secure System Engineering), A.12.6.1',
        'RMF': 'SI-10 (Input Validation), SC-28 (Protection at Rest)'
      }
    },
    'Command Injection': {
      priority: 'CRITICAL',
      controls: [
        'Never pass user input directly to OS commands',
        'Use language-native APIs instead of shell commands',
        'Implement strict input allowlisting',
        'Run application with minimal OS privileges (non-root)',
        'Use containerization to limit blast radius'
      ],
      framework_map: {
        'NIST CSF': 'PR.PT-3 (Least Functionality)',
        'ISO 27001': 'A.14.2.5',
        'RMF': 'SI-10, CM-7 (Least Functionality)'
      }
    },
    'XSS': {
      priority: 'HIGH',
      controls: [
        'Implement Content Security Policy (CSP) headers',
        'Encode all output before rendering to HTML (use trusted libraries)',
        'Set HttpOnly and Secure flags on all session cookies',
        'Sanitize input server-side; never trust client-side only',
        'Add X-XSS-Protection and X-Content-Type-Options headers'
      ],
      framework_map: {
        'NIST CSF': 'PR.DS-2, PR.IP-1 (Baseline Configuration)',
        'ISO 27001': 'A.14.2.1 (Secure Development Policy)',
        'RMF': 'SI-3 (Malicious Code Protection), SC-8'
      }
    },
    'Cross-Site Scripting (XSS)': {
      priority: 'HIGH',
      controls: [
        'Implement Content Security Policy (CSP) headers',
        'Encode all output before rendering to HTML',
        'Set HttpOnly and Secure flags on all session cookies',
        'Sanitize input server-side',
        'Add X-XSS-Protection and X-Content-Type-Options headers'
      ],
      framework_map: {
        'NIST CSF': 'PR.DS-2, PR.IP-1',
        'ISO 27001': 'A.14.2.1',
        'RMF': 'SI-3, SC-8'
      }
    },
    'CSRF': {
      priority: 'HIGH',
      controls: [
        'Implement CSRF tokens on all state-changing requests',
        'Validate Origin and Referer headers server-side',
        'Use SameSite=Strict or SameSite=Lax cookie attribute',
        'Require re-authentication for sensitive operations',
        'Implement double-submit cookie pattern as fallback'
      ],
      framework_map: {
        'NIST CSF': 'PR.AC-3 (Remote Access Management)',
        'ISO 27001': 'A.14.2.5',
        'RMF': 'SC-8, IA-8'
      }
    },
    'Cross-Site Request Forgery (CSRF)': {
      priority: 'HIGH',
      controls: [
        'Implement CSRF tokens on all state-changing requests',
        'Validate Origin and Referer headers',
        'Use SameSite=Strict cookie attribute',
        'Require re-authentication for sensitive operations'
      ],
      framework_map: {
        'NIST CSF': 'PR.AC-3',
        'ISO 27001': 'A.14.2.5',
        'RMF': 'SC-8, IA-8'
      }
    },
    'Weak Password Policy': {
      priority: 'HIGH',
      controls: [
        'Enforce minimum 12-character passwords (NIST SP 800-63B)',
        'Check passwords against known breach databases (HaveIBeenPwned API)',
        'Implement account lockout after 5 failed attempts (30-min lockout)',
        'Enable Multi-Factor Authentication (MFA) — especially for admins',
        'Prohibit password reuse (last 10 passwords)',
        'Allow password managers (no paste blocking)'
      ],
      framework_map: {
        'NIST CSF': 'PR.AC-1 (Identity Management)',
        'ISO 27001': 'A.9.4.3 (Password Management)',
        'RMF': 'IA-5 (Authenticator Management)'
      }
    },
    'No Account Lockout': {
      priority: 'HIGH',
      controls: [
        'Lock accounts after 5 consecutive failed login attempts',
        'Implement 30-minute automatic unlock (or manual admin unlock)',
        'Add progressive delay between retries (1s, 2s, 4s...)',
        'Alert security team on repeated lockout events',
        'Log all failed authentication attempts with IP and timestamp'
      ],
      framework_map: {
        'NIST CSF': 'PR.AC-1, DE.CM-3',
        'ISO 27001': 'A.9.4.2',
        'RMF': 'AC-7 (Unsuccessful Login Attempts)'
      }
    },
    'No HTTPS / TLS': {
      priority: 'CRITICAL',
      controls: [
        'Install a valid TLS 1.2/1.3 certificate (disable TLS 1.0 and 1.1)',
        'Enforce HTTPS everywhere — redirect all HTTP to HTTPS (301)',
        'Implement HTTP Strict Transport Security (HSTS) header',
        'Use strong cipher suites (AES-256, disable RC4/DES)',
        'Renew certificates before expiry; use auto-renewal (Let\'s Encrypt)'
      ],
      framework_map: {
        'NIST CSF': 'PR.DS-2 (Data in Transit Protection)',
        'ISO 27001': 'A.10.1.1 (Cryptographic Controls)',
        'RMF': 'SC-8 (Transmission Confidentiality and Integrity)'
      }
    },
    'Weak Encryption': {
      priority: 'HIGH',
      controls: [
        'Use AES-256 for data at rest encryption',
        'Use TLS 1.3 for data in transit',
        'Hash passwords with bcrypt, Argon2, or PBKDF2 (never MD5/SHA1)',
        'Implement proper key management (rotate keys annually)',
        'Remove all deprecated algorithms (DES, 3DES, RC4, MD5)'
      ],
      framework_map: {
        'NIST CSF': 'PR.DS-1 (Data at Rest), PR.DS-2 (Data in Transit)',
        'ISO 27001': 'A.10.1 (Cryptographic Controls)',
        'RMF': 'SC-28 (Protection of Information at Rest)'
      }
    },
    'No Audit Logs': {
      priority: 'HIGH',
      controls: [
        'Enable comprehensive logging: authentication, access, data changes',
        'Use centralized log management (SIEM: Splunk, ELK, or Wazuh)',
        'Retain logs for minimum 90 days (1 year for compliance)',
        'Protect log integrity — write-once storage, no user can delete logs',
        'Set up real-time alerting on suspicious events',
        'Log format: timestamp, user, action, source IP, outcome'
      ],
      framework_map: {
        'NIST CSF': 'DE.CM-1 (Network Monitoring), RS.AN-1 (Notifications)',
        'ISO 27001': 'A.12.4.1 (Event Logging)',
        'RMF': 'AU-2 (Audit Events), AU-9 (Protection of Audit Information)'
      }
    },
    'IDOR': {
      priority: 'HIGH',
      controls: [
        'Implement server-side authorization checks on every object access',
        'Never rely on client-supplied IDs without ownership verification',
        'Use indirect reference maps (random tokens instead of sequential IDs)',
        'Apply role-based access control (RBAC) consistently',
        'Audit all API endpoints for object-level authorization'
      ],
      framework_map: {
        'NIST CSF': 'PR.AC-4 (Access Permission Management)',
        'ISO 27001': 'A.9.4.1 (Information Access Restriction)',
        'RMF': 'AC-3 (Access Enforcement)'
      }
    },
    'Privilege Escalation': {
      priority: 'CRITICAL',
      controls: [
        'Apply principle of least privilege to all accounts',
        'Conduct quarterly access reviews and remove unused privileges',
        'Separate admin accounts from regular user accounts',
        'Implement Privileged Access Management (PAM) solution',
        'Monitor and alert on privilege escalation attempts'
      ],
      framework_map: {
        'NIST CSF': 'PR.AC-4, DE.CM-3',
        'ISO 27001': 'A.9.2.3 (Privileged Access Rights)',
        'RMF': 'AC-6 (Least Privilege)'
      }
    },
    'Default Credentials': {
      priority: 'CRITICAL',
      controls: [
        'Change ALL default usernames and passwords before deployment',
        'Maintain an inventory of all systems and their credentials',
        'Force password change on first login for all accounts',
        'Implement automated scanning for default credentials',
        'Disable or remove unused default accounts entirely'
      ],
      framework_map: {
        'NIST CSF': 'PR.AC-1, PR.IP-1',
        'ISO 27001': 'A.9.2.4',
        'RMF': 'IA-5, CM-6 (Configuration Settings)'
      }
    },
    'Outdated Server Software': {
      priority: 'HIGH',
      controls: [
        'Implement automated patch management (monthly patch cycle minimum)',
        'Subscribe to vendor security advisories and CVE alerts',
        'Prioritize critical CVE patches within 72 hours of release',
        'Maintain a software inventory with version tracking',
        'Use a staging environment to test patches before production'
      ],
      framework_map: {
        'NIST CSF': 'PR.IP-12 (Vulnerability Management)',
        'ISO 27001': 'A.12.6.1 (Technical Vulnerability Management)',
        'RMF': 'SI-2 (Flaw Remediation), SI-7'
      }
    },
    'Session Hijacking': {
      priority: 'HIGH',
      controls: [
        'Regenerate session tokens after login (prevent session fixation)',
        'Set short session timeouts (15-30 min inactivity)',
        'Bind sessions to client IP and user-agent where feasible',
        'Use Secure, HttpOnly, SameSite=Strict cookie flags',
        'Implement server-side session invalidation on logout'
      ],
      framework_map: {
        'NIST CSF': 'PR.AC-3',
        'ISO 27001': 'A.9.4.2',
        'RMF': 'AC-12 (Session Termination)'
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CONTEXT-AWARE RESPONSE ENGINE
  // This is the core of Option C — generates recommendations based on
  // the real audit data passed in via auditContext props
  // ─────────────────────────────────────────────────────────────────────────

  const generateContextAwareRecommendations = useCallback(() => {
    const {
      selectedVulnerabilities = [],
      nonCompliantControls = [],
      assets = [],
      complianceScore,
      framework = 'NIST CSF',
      organizationName = 'your organization'
    } = auditContext;

    const allIssues = [...new Set([...selectedVulnerabilities, ...nonCompliantControls])];

    if (allIssues.length === 0) {
      return `**📋 NO AUDIT DATA YET**\n\nI don't have any vulnerabilities or non-compliant controls to analyze yet.\n\nPlease complete the following first:\n• Select vulnerabilities in the Asset/Vulnerability module\n• Mark controls as Non-Compliant in the Audit Checklist\n\nThen come back and ask me for recommendations!`;
    }

    // Sort by priority (CRITICAL first)
    const critical = allIssues.filter(issue => {
      const rec = controlRecommendations[issue];
      return rec && rec.priority === 'CRITICAL';
    });
    const high = allIssues.filter(issue => {
      const rec = controlRecommendations[issue];
      return rec && rec.priority === 'HIGH';
    });
    const unknown = allIssues.filter(issue => !controlRecommendations[issue]);

    let response = `**🎯 AI CONTROL RECOMMENDATIONS FOR ${organizationName.toUpperCase()}**\n`;
    response += `Framework: ${framework} | Compliance Score: ${complianceScore !== undefined ? complianceScore + '%' : 'N/A'}\n`;
    response += `─────────────────────────────────\n\n`;

    if (critical.length > 0) {
      response += `**🔴 CRITICAL PRIORITY — Fix Immediately**\n\n`;
      critical.forEach(issue => {
        const rec = controlRecommendations[issue];
        response += `▸ **${issue}**\n`;
        rec.controls.slice(0, 3).forEach(ctrl => {
          response += `  • ${ctrl}\n`;
        });
        if (rec.framework_map[framework]) {
          response += `  📌 ${framework}: ${rec.framework_map[framework]}\n`;
        }
        response += '\n';
      });
    }

    if (high.length > 0) {
      response += `**🟡 HIGH PRIORITY — Fix Within 30 Days**\n\n`;
      high.forEach(issue => {
        const rec = controlRecommendations[issue];
        response += `▸ **${issue}**\n`;
        rec.controls.slice(0, 3).forEach(ctrl => {
          response += `  • ${ctrl}\n`;
        });
        if (rec.framework_map[framework]) {
          response += `  📌 ${framework}: ${rec.framework_map[framework]}\n`;
        }
        response += '\n';
      });
    }

    if (unknown.length > 0) {
      response += `**⚪ OTHER ISSUES DETECTED**\n`;
      unknown.forEach(issue => {
        response += `  • ${issue} — Ask me to explain this for specific controls\n`;
      });
      response += '\n';
    }

    if (assets.length > 0) {
      const criticalAssets = assets.filter(a => a.ciaValue === 'High' || a.criticality === 'High');
      if (criticalAssets.length > 0) {
        response += `**⚡ PRIORITIZE THESE HIGH-VALUE ASSETS**\n`;
        criticalAssets.slice(0, 3).forEach(a => {
          response += `  • ${a.name} (${a.type || 'Asset'}) — Apply all CRITICAL controls here first\n`;
        });
        response += '\n';
      }
    }

    response += `**📊 REMEDIATION ROADMAP**\n`;
    response += `  Week 1–2: Fix all CRITICAL issues (${critical.length} items)\n`;
    response += `  Month 1: Address HIGH priority items (${high.length} items)\n`;
    response += `  Month 2–3: Evidence collection & re-audit\n`;

    return response;
  }, [auditContext]);

  // ─────────────────────────────────────────────────────────────────────────
  // GENERAL KNOWLEDGE BASE (fallback for non-context queries)
  // ─────────────────────────────────────────────────────────────────────────

  const knowledgeBase = [
    {
      keywords: ['sql injection', 'sqli'],
      response: `**🔍 SQL INJECTION — Controls**\n\n${(controlRecommendations['SQL Injection']?.controls || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n**Business Impact:**\nAttackers can steal, modify, or delete your entire database — including student records, credentials, and financial data.`
    },
    {
      keywords: ['xss', 'cross site scripting', 'cross-site scripting'],
      response: `**🔍 XSS — Controls**\n\n${(controlRecommendations['XSS']?.controls || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n**Business Impact:**\nAttackers can hijack user sessions, steal credentials, and deface your application.`
    },
    {
      keywords: ['mfa', '2fa', 'multi factor', 'two factor'],
      response: `**🔐 MFA IMPLEMENTATION**\n\n1. Enable TOTP (Google/Microsoft Authenticator) for all users\n2. Mandate MFA for admin accounts immediately\n3. Provide backup recovery codes\n4. Set account lockout after 5 failed MFA attempts\n5. Log all MFA events\n\n**NIST SP 800-63B Recommendation:**\nUse phishing-resistant MFA (WebAuthn/FIDO2) for high-value accounts.`
    },
    {
      keywords: ['password', 'password policy'],
      response: `**🔐 PASSWORD POLICY CONTROLS**\n\n${(controlRecommendations['Weak Password Policy']?.controls || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}`
    },
    {
      keywords: ['nist csf', 'nist framework', 'cybersecurity framework'],
      response: `**📋 NIST CSF AUDIT CHECKLIST**\n\n**IDENTIFY:** Asset inventory, risk assessment, governance policy\n**PROTECT:** MFA, encryption, access control, security training\n**DETECT:** SIEM/logging, IDS, anomaly detection, vulnerability scanning\n**RESPOND:** Incident response plan, communication plan, forensics\n**RECOVER:** Backup & recovery, disaster recovery plan, lessons learned`
    },
    {
      keywords: ['encryption', 'tls', 'https', 'ssl'],
      response: `**🔐 ENCRYPTION CONTROLS**\n\n${(controlRecommendations['No HTTPS / TLS']?.controls || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}`
    },
    {
      keywords: ['backup', 'ransomware', 'recovery'],
      response: `**💾 BACKUP & RECOVERY CONTROLS**\n\n1. Follow 3-2-1 rule: 3 copies, 2 media types, 1 offsite\n2. Test backups monthly (restore drill)\n3. Encrypt all backup data\n4. Immutable backups (ransomware protection)\n5. RTO/RPO defined in DR plan\n\n**If Ransomware Hits:**\n• Isolate immediately → Do NOT pay → Restore from backups → Report`
    }
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN RESPONSE GENERATOR
  // ─────────────────────────────────────────────────────────────────────────

  const generateResponse = useCallback((query) => {
    const lowerQuery = query.toLowerCase();

    // Context-aware trigger phrases
    const contextTriggers = [
      'my audit', 'my risk', 'my vulnerabilities', 'what should i fix',
      'what controls', 'give me recommendations', 'generate recommendations',
      'audit recommendations', 'control recommendations', 'what to implement',
      'fix my', 'remediate', 'remediation', 'my findings', 'my issues'
    ];

    if (contextTriggers.some(t => lowerQuery.includes(t))) {
      return generateContextAwareRecommendations();
    }

    // Explain specific vulnerability from audit context
    const { selectedVulnerabilities = [], nonCompliantControls = [] } = auditContext;
    const allIssues = [...selectedVulnerabilities, ...nonCompliantControls];
    for (const issue of allIssues) {
      if (lowerQuery.includes(issue.toLowerCase()) || lowerQuery.includes('fix ' + issue.toLowerCase().split(' ')[0])) {
        const rec = controlRecommendations[issue];
        if (rec) {
          const fw = auditContext.framework || 'NIST CSF';
          return `**🛠️ HOW TO FIX: ${issue.toUpperCase()}**\n\n**Priority:** ${rec.priority}\n\n**Controls to Implement:**\n${rec.controls.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n**Framework Mapping (${fw}):**\n${rec.framework_map[fw] || rec.framework_map['NIST CSF'] || 'See framework documentation'}\n\n**Verification:**\nAfter implementing, upload evidence (screenshot / config export) in the Evidence Collection module.`;
        }
      }
    }

    // Knowledge base lookup
    for (const item of knowledgeBase) {
      if (item.keywords.some(kw => lowerQuery.includes(kw))) {
        return item.response;
      }
    }

    // Generic patterns
    if (lowerQuery.includes('how to') || lowerQuery.includes('how do i')) {
      return `**📝 IMPLEMENTATION GUIDE**\n\nFor "${query}":\n\n1. **Assess** current state — document what exists\n2. **Plan** the control — define policy and technical steps\n3. **Implement** the control — apply configuration or code change\n4. **Test** effectiveness — verify it works as expected\n5. **Document** evidence — screenshot/export for audit upload\n6. **Monitor** ongoing — log and alert\n\nNeed specific steps? Provide more detail about your system!`;
    }

    if (lowerQuery.includes('compliance') || lowerQuery.includes('score')) {
      const score = auditContext.complianceScore;
      if (score !== undefined) {
        const status = score >= 85 ? '✅ Compliant' : score >= 60 ? '⚠️ Needs Improvement' : '❌ Non-Compliant';
        return `**📊 YOUR COMPLIANCE STATUS**\n\nScore: **${score}%** → ${status}\n\n${score < 85 ? `To reach 85% (Compliant), you need to address ${Math.ceil((85 - score) / 100 * (auditContext.nonCompliantControls?.length || 10))} more controls.\n\nAsk me "give me recommendations" for a prioritized action plan.` : 'Great job! Focus on maintaining this score with regular audits.'}`;
      }
      return `I don't have your compliance score yet. Please complete the audit checklist first, then ask me again!`;
    }

    return `**🤔 HOW CAN I HELP?**\n\nTry asking me:\n\n• **"Give me recommendations"** — context-aware controls for YOUR audit\n• **"How do I fix SQL Injection?"** — step-by-step remediation\n• **"Explain XSS to management"** — non-technical explanation\n• **"What is my compliance score?"** — status from your audit data\n• **"NIST CSF checklist"** — framework audit items\n\nI'm connected to your audit data and can give specific advice!`;
  }, [auditContext, generateContextAwareRecommendations]);

  // ─────────────────────────────────────────────────────────────────────────
  // MESSAGE HANDLING
  // ─────────────────────────────────────────────────────────────────────────

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  }, [generateResponse]);

  const handleSendMessage = () => {
    sendMessage(inputMessage);
    setInputMessage('');
  };

  // Fixed: no longer depends on stale inputMessage state
  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getWindowClass = () => {
    if (isExpanded) return 'ai-bubble-window expanded';
    if (isMinimized) return 'ai-bubble-window minimized';
    return 'ai-bubble-window';
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CONTEXT INDICATOR — shows a badge if audit data is connected
  // ─────────────────────────────────────────────────────────────────────────

  const hasContext = (auditContext.selectedVulnerabilities?.length > 0) ||
    (auditContext.nonCompliantControls?.length > 0);

  return (
    <>
      {!isOpen && (
        <button className="ai-bubble-button" onClick={() => setIsOpen(true)} title="AI Security Assistant">
          <FaRobot />
          {hasContext && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              background: '#ef4444', borderRadius: '50%',
              width: 16, height: 16, fontSize: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', border: '2px solid white'
            }}>
              {(auditContext.selectedVulnerabilities?.length || 0) + (auditContext.nonCompliantControls?.length || 0)}
            </span>
          )}
          <span className="ai-bubble-pulse"></span>
        </button>
      )}

      {isOpen && (
        <div className={getWindowClass()}>
          {/* Header */}
          <div className="ai-bubble-header">
            <div className="header-left">
              <FaRobot className="header-icon" />
              <div>
                <h3>AI Security Assistant</h3>
                <p>
                  {hasContext
                    ? `✅ Connected — ${(auditContext.selectedVulnerabilities?.length || 0) + (auditContext.nonCompliantControls?.length || 0)} issues loaded`
                    : 'Ask me anything about security'}
                </p>
              </div>
            </div>
            <div className="header-right">
              <button onClick={() => setIsMinimized(!isMinimized)} title="Minimize">
                {isMinimized ? <FaExpand /> : <FaMinus />}
              </button>
              <button onClick={() => setIsExpanded(!isExpanded)} title="Expand">
                {isExpanded ? <FaCompress /> : <FaExpand />}
              </button>
              <button onClick={() => setIsOpen(false)} title="Close">
                <FaTimes />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Context Banner */}
              {hasContext && (
                <div style={{
                  background: '#f0fdf4', borderBottom: '1px solid #bbf7d0',
                  padding: '8px 15px', fontSize: '11px', color: '#166534',
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <FaClipboardCheck />
                  Audit data loaded: {auditContext.selectedVulnerabilities?.length || 0} vulnerabilities,&nbsp;
                  {auditContext.nonCompliantControls?.length || 0} non-compliant controls
                  {auditContext.framework && ` | Framework: ${auditContext.framework}`}
                </div>
              )}

              {/* Messages */}
              <div className="ai-bubble-messages">
                {messages.map(message => (
                  <div key={message.id} className={`message ${message.type}`}>
                    {message.type === 'ai' && (
                      <div className="message-avatar"><FaRobot /></div>
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
                          <button><FaThumbsUp /></button>
                          <button><FaThumbsDown /></button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="message ai">
                    <div className="message-avatar"><FaRobot /></div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions — context-aware */}
              <div className="ai-bubble-quick">
                <button onClick={() => handleQuickQuestion("Give me recommendations for my audit")}>
                  <FaLightbulb /> My Recommendations
                </button>
                <button onClick={() => handleQuickQuestion("What is my compliance score?")}>
                  <FaClipboardCheck /> My Score
                </button>
                <button onClick={() => handleQuickQuestion("How do I implement MFA?")}>
                  <FaLock /> Fix MFA
                </button>
                <button onClick={() => handleQuickQuestion("Explain SQL Injection to management")}>
                  <FaBug /> SQL Injection
                </button>
                <button onClick={() => handleQuickQuestion("NIST CSF checklist")}>
                  <FaShieldAlt /> NIST CSF
                </button>
                <button onClick={() => handleQuickQuestion("Cloud security best practices")}>
                  <FaCloud /> Cloud
                </button>
              </div>

              {/* Input */}
              <div className="ai-bubble-input">
                <input
                  type="text"
                  placeholder={hasContext ? "Ask about your audit findings..." : "Ask a security question..."}
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
                <FaRobot />
                {hasContext ? '⚡ Context-aware mode active' : 'Connect audit data for personalized recommendations'}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistantBubble;