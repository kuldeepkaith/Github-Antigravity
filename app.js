const SCMS = {
    cases: [
        {
            id: '2024/0912',
            type: 'Theft',
            location: 'Chandni Chowk',
            status: 'Urgent',
            time: '2h ago',
            victim: 'Rajesh Kumar',
            suspect: 'Mohan Lal',
            details: 'Suspect stole a mobile phone near the metro station exit.',
            priority: 'High'
        },
        {
            id: '2024/0845',
            type: 'Resolved',
            location: 'Sector 14',
            status: 'Closed',
            time: '5h ago',
            victim: 'Anita Devi',
            suspect: 'Unknown',
            details: 'Domestic dispute resolved through mediation.',
            priority: 'Low'
        },
        {
            id: '2023/1102',
            type: 'Assault',
            location: 'Sector 4',
            status: 'Closed',
            time: '1y ago',
            victim: 'Suresh Patel',
            suspect: 'Mohan Lal',
            details: 'Suspect involved in a street brawl.',
            priority: 'Medium'
        }
    ],
    currentUser: { name: 'Kuldeep kaith', rank: 'Investigator', badge: '8841-B', phone: '+91-9876543210' },
    activeView: 'login',
    isLoggedIn: false,
    settings: {
        biometric: true,
        alerts: true
    }
};

const AI_ENGINE = {
    extractEntities: (text) => {
        // Simple NLP simulation for demo
        const entities = {
            victim: text.match(/(?:ne mujhe|victim is|name is) ([A-Z][a-z]+ [A-Z][a-z]+)/i)?.[1] || "Unknown",
            location: text.match(/(?:at|near|location) ([A-Z][a-z]+ [A-Z][a-z]+)/i)?.[1] || "Unknown",
            crime: text.match(/(theft|assault|robbery|threat|murder)/i)?.[0] || "Unknown"
        };
        return entities;
    },
    suggestBNS: (crime) => {
        const mapping = {
            'theft': 'BNS 303: Punishment for Theft',
            'assault': 'BNS 115: Voluntarily causing hurt',
            'threat': 'BNS 351: Criminal Intimidation',
            'robbery': 'BNS 309: Robbery'
        };
        return mapping[crime.toLowerCase()] || "Manual classification required";
    },
    getSOP: (crime) => {
        const sops = {
            'theft': ['Secure the scene', 'Identify and interview witnesses', 'Check for CCTV in proximity', 'Collect physical evidence (fingerprints, etc.)', 'Record victim statement with phone number', 'Check local criminal records', 'Issue alarm/alert to nearby stations'],
            'assault': ['Provide immediate medical aid', 'Collect medical/MLC report', 'Secure weapon of offence', 'Record victim statement', 'Identify and record witness statements', 'Scene photography and mapping', 'Arrest/Detain suspect if identified'],
            'murder': ['Cordon off the crime scene', 'Inform forensics and dog squad', 'Conduct inquest proceedings (Panch Nama)', 'Send body for post-mortem', 'Collect all physical/biological evidence', 'Record statements of last seen witnesses'],
            'default': ['Secure the Scene', 'Photograph & Document Evidence', 'Identify and Record Witnesses', 'Collect Victim Contact Details', 'Upload relevant media/documents']
        };
        return sops[crime.toLowerCase()] || sops['default'];
    }
};

function renderDashboard() {
    const urgentCount = SCMS.cases.filter(c => c.status === 'Urgent').length;
    return `
        <div id="dashboard-view" style="padding-bottom: 2rem;">
            <div class="glass glass-card mb-6" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(192, 132, 252, 0.1)); border-color: rgba(99, 102, 241, 0.3);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h2 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Welcome, ${SCMS.currentUser.name}</h2>
                        <p style="color: var(--text-muted); font-size: 0.875rem;">AI Command is active. ${urgentCount} urgent cases in your sector.</p>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div class="glass glass-card" style="text-align: center; cursor: pointer;" onclick="showView('caseList')">
                    <i data-lucide="folder" style="color: var(--primary); margin-bottom: 0.5rem;"></i>
                    <div style="font-size: 1.25rem; font-weight: 700;">${SCMS.cases.length}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Total Cases</div>
                </div>
                <div class="glass glass-card" style="text-align: center; cursor: pointer;" onclick="showView('urgentList')">
                    <i data-lucide="alert-circle" style="color: var(--accent-red); margin-bottom: 0.5rem;"></i>
                    <div style="font-size: 1.25rem; font-weight: 700;">${urgentCount.toString().padStart(2, '0')}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Urgent</div>
                </div>
            </div>

            <h3 style="margin-bottom: 1rem; font-size: 1rem; display: flex; align-items: center; gap: 8px;">
                <i data-lucide="book-open" style="width: 18px; height: 18px;"></i>
                Digital Law Library
            </h3>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
                <div class="glass glass-card" style="padding: 0.75rem; text-align: center; cursor: pointer; border-color: rgba(34, 197, 94, 0.3);" onclick="showView('lawLibrary_BNS')">
                    <div style="font-weight: 700; color: var(--accent-green); font-size: 0.875rem;">BNS</div>
                    <div style="font-size: 0.65rem; color: var(--text-muted);">IPC New</div>
                </div>
                <div class="glass glass-card" style="padding: 0.75rem; text-align: center; cursor: pointer; border-color: rgba(99, 102, 241, 0.3);" onclick="showView('lawLibrary_BNSS')">
                    <div style="font-weight: 700; color: var(--primary); font-size: 0.875rem;">BNSS</div>
                    <div style="font-size: 0.65rem; color: var(--text-muted);">CrPC New</div>
                </div>
                <div class="glass glass-card" style="padding: 0.75rem; text-align: center; cursor: pointer; border-color: rgba(245, 158, 11, 0.3);" onclick="showView('lawLibrary_BSA')">
                    <div style="font-weight: 700; color: #f59e0b; font-size: 0.875rem;">BSA</div>
                    <div style="font-size: 0.65rem; color: var(--text-muted);">IEA New</div>
                </div>
            </div>

            <h3 style="margin-bottom: 1rem; font-size: 1rem; display: flex; align-items: center; gap: 8px;">
                <i data-lucide="activity" style="width: 18px; height: 18px;"></i>
                Recent Activity
            </h3>

            <div class="recent-cases">
                ${SCMS.cases.map(c => `
                    <div class="glass glass-card mb-4" style="margin-bottom: 1rem; cursor: pointer;" onclick="showCaseDetail('${c.id}')">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span class="badge ${c.status === 'Urgent' ? 'badge-red' : 'badge-green'}">${c.type}</span>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">${c.time}</span>
                        </div>
                        <div style="font-weight: 600; margin-bottom: 4px;">FIR #${c.id}</div>
                        <div style="font-size: 0.8125rem; color: var(--text-muted);">Location: ${c.location}</div>
                        <div style="margin-top: 8px; font-size: 0.75rem; color: var(--primary); display: flex; align-items: center; gap: 4px;">
                            View Details <i data-lucide="chevron-right" style="width: 12px; height: 12px;"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderRegister() {
    return `
        <div id="register-view">
            <h2 style="margin-bottom: 1.5rem; font-size: 1.25rem;">AI-Assisted Registration</h2>
            
            <div class="glass glass-card mb-6" style="margin-bottom: 1.5rem; border: 1px dashed var(--primary); position: relative;">
                <select id="stt-lang" class="glass-input" style="position: absolute; top: 10px; right: 10px; width: auto; padding: 4px 8px; font-size: 0.75rem; background: rgba(0,0,0,0.5); border: 1px solid var(--glass-border);">
                    <option value="en">English (India)</option>
                    <option value="hi">Hindi (हिंदी)</option>
                </select>
                <div style="text-align: center; padding: 1.5rem 1rem 1rem;">
                    <div id="mic-btn" class="btn-primary" style="width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 1rem; cursor: pointer;">
                        <i data-lucide="mic"></i>
                    </div>
                    <p id="stt-status" style="font-size: 0.875rem; color: var(--text-muted);">Tap to record complaint</p>
                </div>
            </div>

            <div class="input-group">
                <label class="input-label">Complaint Transcript</label>
                <textarea id="complaint-text" class="glass-input" rows="4" placeholder="Speak or type the complaint details..."></textarea>
            </div>

            <!-- Victim Evidence Upload -->
            <div class="glass glass-card mb-6" style="margin-bottom: 1.5rem; background: rgba(255,255,255,0.02); border: 1px dashed var(--glass-border);">
                <h4 style="font-size: 0.8125rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="paperclip" style="width: 14px;"></i> Victim Evidence (Documents/Videos)
                </h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button class="btn-primary" style="background: rgba(255,255,255,0.05); padding: 10px; font-size: 0.75rem;" onclick="simulateVictimUpload('Document')">
                        <i data-lucide="file-plus"></i> Add Document
                    </button>
                    <button class="btn-primary" style="background: rgba(255,255,255,0.05); padding: 10px; font-size: 0.75rem;" onclick="simulateVictimUpload('Video')">
                        <i data-lucide="video"></i> Add Video
                    </button>
                </div>
                <div id="registration-evidence-list" style="margin-top: 10px; display: flex; flex-direction: column; gap: 5px;">
                    <!-- Pending evidence items -->
                </div>
            </div>

            <div style="display: flex; gap: 8px; margin-bottom: 1.5rem;">
                <button class="btn-primary" onclick="simulateAI()" style="background: rgba(99, 102, 241, 0.2); border: 1px solid var(--primary); font-size: 0.875rem;">
                    <i data-lucide="brain" style="width: 16px;"></i> Analyze with AI
                </button>
            </div>

            <div id="ai-results" style="display: none;" class="animate-fade-in">
                <div class="glass glass-card mb-6" style="margin-bottom: 1.5rem; background: rgba(34, 197, 94, 0.05);">
                    <h4 style="font-size: 0.875rem; margin-bottom: 1rem; color: var(--accent-green);">AI EXTRACTION RESULTS</h4>
                    <div class="input-group">
                        <label class="input-label">Extracted Victim</label>
                        <input type="text" id="ext-victim" class="glass-input">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Victim Phone Number</label>
                        <input type="text" id="ext-phone" class="glass-input" placeholder="e.g. +91 9xxx-xxxxxx">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Extracted Location</label>
                        <input type="text" id="ext-location" class="glass-input">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Suggested Legal Section</label>
                        <div id="ext-section" class="badge badge-red" style="padding: 8px;">Pending Analysis</div>
                    </div>
                </div>

                <div class="glass glass-card mb-6">
                    <h4 style="font-size: 0.875rem; margin-bottom: 0.5rem;">INVESTIGATION STEPS (SOP)</h4>
                    <ul id="sop-list" style="list-style: none; font-size: 0.8125rem; color: var(--text-muted);">
                        <!-- Dynamic SOPs -->
                    </ul>
                </div>

                <button class="btn-primary" onclick="submitCase()">
                    <i data-lucide="check-circle"></i> Complete Registration
                </button>
            </div>
        </div>
    `;
}

function showView(viewId) {
    if (!SCMS.isLoggedIn && viewId !== 'login') {
        showView('login');
        return;
    }

    const main = document.getElementById('app-view');
    const nav = document.querySelector('.bottom-nav');

    // Hide nav if login
    if (viewId === 'login') {
        nav.style.display = 'none';
        document.querySelector('header').style.display = 'none';
    } else {
        nav.style.display = 'flex';
        document.querySelector('header').style.display = 'block';
    }

    main.innerHTML = '<div style="display: flex; justify-content: center; padding: 2rem;"><i data-lucide="loader-2" class="animate-spin" style="color: var(--primary);"></i></div>';
    lucide.createIcons();

    setTimeout(() => {
        if (viewId === 'dashboard') main.innerHTML = renderDashboard();
        else if (viewId === 'register') {
            main.innerHTML = renderRegister();
            setupVoiceRecording();
        }
        else if (viewId === 'analytics') main.innerHTML = renderAnalytics();
        else if (viewId === 'search') main.innerHTML = renderSearch();
        else if (viewId === 'profile') main.innerHTML = renderProfile();
        else if (viewId === 'login') main.innerHTML = renderLogin();
        else if (viewId === 'caseList') main.innerHTML = renderCaseList('Total Cases');
        else if (viewId === 'urgentList') main.innerHTML = renderCaseList('Urgent Cases', 'Urgent');
        else if (viewId === 'predictivePatrol') main.innerHTML = renderPredictivePatrol();
        else if (viewId === 'supervisorDashboard') main.innerHTML = renderSupervisorDashboard();
        else if (viewId.startsWith('lawLibrary_')) {
            const bookCode = viewId.split('_')[1];
            main.innerHTML = renderLawLibrary(bookCode);
        }

        lucide.createIcons();
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            let compareId = viewId;
            if (['caseList', 'urgentList', 'supervisorDashboard'].includes(viewId) || viewId.startsWith('lawLibrary_')) compareId = 'dashboard';
            if (viewId === 'predictivePatrol') compareId = 'analytics';
            if (item.outerHTML.includes(`'${compareId}'`)) item.classList.add('active');
        });
    }, 300);
}

function renderCaseList(title, filterStatus = null) {
    const casesToDisplay = filterStatus ? SCMS.cases.filter(c => c.status === filterStatus) : SCMS.cases;
    return `
        <div id="case-list-view">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem;">
                <button onclick="showView('dashboard')" style="background: none; border: none; color: white; cursor: pointer; padding: 0;">
                    <i data-lucide="arrow-left"></i>
                </button>
                <h2 style="font-size: 1.25rem;">${title}</h2>
            </div>
            
            <div class="recent-cases">
                ${casesToDisplay.map(c => `
                    <div class="glass glass-card mb-4" style="margin-bottom: 1rem; cursor: pointer;" onclick="showCaseDetail('${c.id}')">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span class="badge ${c.status === 'Urgent' ? 'badge-red' : 'badge-green'}">${c.type}</span>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">${c.time}</span>
                        </div>
                        <div style="font-weight: 600; margin-bottom: 4px;">FIR #${c.id}</div>
                        <div style="font-size: 0.8125rem; color: var(--text-muted);">Location: ${c.location}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function showCaseDetail(caseId) {
    const caseData = SCMS.cases.find(c => c.id === caseId);
    if (!caseData) return;

    // Calculate linked cases
    const linkedCases = caseData.suspect && caseData.suspect !== 'Unknown'
        ? SCMS.cases.filter(c => c.suspect === caseData.suspect && c.id !== caseId)
        : [];

    const main = document.getElementById('app-view');
    main.innerHTML = `
        <div id="case-detail-view" class="animate-fade-in" style="padding-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem;">
                <button onclick="showView('dashboard')" style="background: none; border: none; color: white; cursor: pointer; padding: 0;">
                    <i data-lucide="arrow-left"></i>
                </button>
                <h2 style="font-size: 1.25rem;">Case Details: #${caseData.id}</h2>
            </div>

            <!-- Case Summary -->
            <div class="glass glass-card mb-6" style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <span class="badge ${caseData.status === 'Urgent' ? 'badge-red' : 'badge-green'}" ${caseData.type === 'Manual classification required' ? `style="cursor: pointer; border: 1px dashed white; animation: pulse 2s infinite;" onclick="classifyCase('${caseData.id}')" title="Click to Classify"` : ''}>
                        ${caseData.type} ${caseData.type === 'Manual classification required' ? '<i data-lucide="edit-2" style="width: 12px; margin-left: 4px;"></i>' : ''}
                    </span>
                    <span style="font-size: 0.875rem; color: var(--text-muted);">${caseData.time}</span>
                </div>
                <div style="font-size: 1.125rem; font-weight: 700; margin-bottom: 8px;">Incident near ${caseData.location}</div>
                <div style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1rem;">
                    <b>Victim:</b> ${caseData.victim || 'Anonymous'} <br>
                    <b>Phone:</b> ${caseData.victimPhone || 'Not provided'} <br>
                    <b>Suspect:</b> ${caseData.suspect || 'Unknown'}
                </div>
                <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; font-size: 0.875rem; line-height: 1.5; color: var(--text-main);">
                    ${caseData.details || 'No additional details provided for this case.'}
                </div>
            </div>

            <!-- Unknown Suspect Barcode -->
            ${caseData.suspect === 'Unknown' ? `
            <div class="glass glass-card mb-6" style="text-align: center; border: 1px dashed var(--accent-red);">
                <h4 style="font-size: 0.875rem; color: var(--accent-red); margin-bottom: 0.5rem;"><i data-lucide="scan"></i> Unknown Suspect Alert</h4>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem;">Scan securely for IO contact assignment.</p>
                <div style="background: white; padding: 1rem; border-radius: 8px; display: inline-block; margin-bottom: 1rem;">
                    <!-- Simulated Barcode using repeating gradients -->
                    <div style="width: 150px; height: 50px; background: repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 8px, #000 8px, #000 12px, transparent 12px, transparent 15px); mix-blend-mode: multiply;"></div>
                </div>
                <div style="font-size: 0.875rem; font-weight: bold;">Assigned IO: ${SCMS.currentUser.name}</div>
                <div style="font-size: 0.75rem; color: var(--primary);">Contact: ${SCMS.currentUser.phone}</div>
            </div>
            ` : ''}

            <!-- Complaint Linkage -->
            ${linkedCases.length > 0 ? `
            <div class="glass glass-card mb-6" style="border-color: rgba(99, 102, 241, 0.5);">
                <h4 style="font-size: 0.875rem; margin-bottom: 1rem; color: var(--primary);"><i data-lucide="link"></i> LINKED COMPLAINTS FOUND</h4>
                ${linkedCases.map(lc => `
                    <div style="background: rgba(99, 102, 241, 0.1); padding: 8px; border-radius: 8px; margin-bottom: 8px; font-size: 0.8125rem;">
                        <b>FIR #${lc.id}</b> - ${lc.type} at ${lc.location} <br>
                        <span style="color: var(--text-muted);">Common Suspect: ${caseData.suspect}</span>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            <!-- Automated SOP Guidance -->
            <div class="glass glass-card mb-6">
                <h4 style="font-size: 0.875rem; margin-bottom: 1rem; color: var(--text-muted);"><i data-lucide="clipboard-list"></i> INVESTIGATION SOP</h4>
                <ul style="list-style: none; font-size: 0.875rem;">
                    ${AI_ENGINE.getSOP(caseData.type).map(step => `
                        <li style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px;">
                            <input type="checkbox" style="margin-top: 4px; accent-color: var(--primary); cursor: pointer;" onchange="this.nextElementSibling.style.textDecoration = this.checked ? 'line-through' : 'none'; this.nextElementSibling.style.color = this.checked ? 'var(--text-muted)' : 'inherit';">
                            <span style="transition: all 0.2s;">${step}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <!-- Witness STT Recording -->
            <div class="glass glass-card mb-6">
                <h4 style="font-size: 0.875rem; margin-bottom: 1rem; color: var(--text-muted);"><i data-lucide="mic"></i> WITNESS STATEMENT</h4>
                <div style="display: flex; gap: 10px; margin-bottom: 1rem;">
                    <button id="witness-mic-btn" class="btn-primary" style="flex: 1;" onclick="toggleWitnessSTT()">
                        <i data-lucide="mic"></i> Record Speech
                    </button>
                    <button class="btn-primary" style="flex: 1; background: var(--glass-bg); border: 1px solid var(--glass-border);" onclick="document.getElementById('witness-text').value = ''">
                        Clear
                    </button>
                </div>
                <textarea id="witness-text" class="glass-input" rows="3" placeholder="Witness statement will appear here..."></textarea>
            </div>

            <!-- Pre-existing Evidence -->
            <div class="glass glass-card mb-6">
                <h4 style="font-size: 0.875rem; margin-bottom: 1rem; color: var(--text-muted);"><i data-lucide="folder-open"></i> EVIDENCE</h4>
                
                ${caseData.evidence && caseData.evidence.length > 0 ? `
                <div style="margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 8px;">
                    ${caseData.evidence.map(ev => `
                        <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; font-size: 0.875rem; border: 1px solid var(--glass-border);">
                            <i data-lucide="${ev.type === 'Video' ? 'video' : 'file-text'}" style="color: var(--primary); width: 18px;"></i>
                            <div style="flex: 1;">
                                <div style="font-weight: 600;">${ev.name}</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">${ev.type} provided by victim</div>
                            </div>
                            <i data-lucide="download" style="width: 16px; color: var(--text-muted); cursor: pointer;"></i>
                        </div>
                    `).join('')}
                </div>
                <div style="height: 1px; background: var(--glass-border); margin-bottom: 1.5rem;"></div>
                ` : ''}

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <button style="aspect-ratio: 1; width: 100%; border: none; background: rgba(255,255,255,0.05); border: 1px dashed var(--glass-border); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.2s;" onclick="simulateFileUpload('PDF / Document')" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                        <i data-lucide="file-text" style="width: 24px; color: var(--text-muted);"></i>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">Upload Doc</span>
                    </button>
                    <button style="aspect-ratio: 1; width: 100%; border: none; background: rgba(255,255,255,0.05); border: 1px dashed var(--glass-border); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.2s;" onclick="simulateFileUpload('Video Recording')" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                        <i data-lucide="video" style="width: 24px; color: var(--text-muted);"></i>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">Upload Video</span>
                    </button>
                </div>
            </div>
            
            <!-- Court Document & e-Sign Section Placeholder (To be implemented) -->
            <div id="signature-container"></div>
            
            <div class="glass glass-card" style="text-align: center; border: 1px solid rgba(59, 130, 246, 0.3);">
                <h4 style="font-size: 0.875rem; color: var(--accent-blue); margin-bottom: 1rem;"><i data-lucide="scale"></i> LEGAL & COURT TOOLS</h4>
                <button class="btn-primary" style="margin-bottom: 0.75rem; background: rgba(59, 130, 246, 0.2); border: 1px solid var(--accent-blue); color: white;" onclick="generateCourtReply('${caseId}')">
                    <i data-lucide="file-signature"></i> Draft Court Reply
                </button>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn-primary" style="flex: 1; font-size: 0.75rem; background: var(--accent-blue);" onclick="simulateAadhaarESign()">
                        <i data-lucide="fingerprint"></i> Aadhaar e-Sign
                    </button>
                    <button class="btn-primary" style="flex: 1; font-size: 0.75rem;" onclick="internalSignDialog()">
                        <i data-lucide="pen-tool"></i> Internal Sign
                    </button>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

let witnessRecognition;
let isWitnessRecording = false;

function toggleWitnessSTT() {
    const micBtn = document.getElementById('witness-mic-btn');
    const textArea = document.getElementById('witness-text');

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        alert("Speech recognition not supported in this browser. Simulating witness statement...");
        textArea.value = "I saw a man running away holding a black bag towards sector 14.";
        return;
    }

    if (isWitnessRecording) {
        witnessRecognition.stop();
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    witnessRecognition = new SpeechRecognition();
    witnessRecognition.continuous = false;
    witnessRecognition.lang = 'en-IN';

    witnessRecognition.onstart = () => {
        isWitnessRecording = true;
        micBtn.style.background = 'var(--accent-red)';
        micBtn.innerHTML = '<i data-lucide="square"></i> Stop Recording';
        lucide.createIcons();
    };

    witnessRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        textArea.value += (textArea.value ? '\n\n' : '') + transcript;
    };

    witnessRecognition.onend = () => {
        isWitnessRecording = false;
        micBtn.style.background = 'linear-gradient(135deg, var(--primary), #818cf8)';
        micBtn.innerHTML = '<i data-lucide="mic"></i> Record Speech';
        lucide.createIcons();
    };

    witnessRecognition.start();
}

// --- Modal System ---
function classifyCase(caseId) {
    showModal('Manual Classification', `
        <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem;">AI requires human verification. Select the correct crime category for FIR #${caseId}:</p>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.5rem;">
            <button class="btn-primary" style="background: rgba(255,255,255,0.05); color: white; border: 1px solid var(--glass-border); justify-content: flex-start; text-align: left;" onclick="applyClassification('${caseId}', 'Theft')">
                <i data-lucide="folder-open" style="width: 16px; margin-right: 8px; color: var(--primary);"></i> Theft
            </button>
            <button class="btn-primary" style="background: rgba(255,255,255,0.05); color: white; border: 1px solid var(--glass-border); justify-content: flex-start; text-align: left;" onclick="applyClassification('${caseId}', 'Assault')">
                <i data-lucide="folder-open" style="width: 16px; margin-right: 8px; color: var(--accent-red);"></i> Assault
            </button>
            <button class="btn-primary" style="background: rgba(255,255,255,0.05); color: white; border: 1px solid var(--glass-border); justify-content: flex-start; text-align: left;" onclick="applyClassification('${caseId}', 'Robbery')">
                <i data-lucide="folder-open" style="width: 16px; margin-right: 8px; color: #f59e0b;"></i> Robbery
            </button>
        </div>
    `);
}

function applyClassification(caseId, type) {
    const caseData = SCMS.cases.find(c => c.id === caseId);
    if (caseData) {
        caseData.type = type;
        // Also update BNS if needed based on classification
        const suggested = AI_ENGINE.suggestBNS(type);
        if (suggested !== "Manual classification required") {
            // Logic to update case data with specific sections if needed
        }
        closeModal();
        showCaseDetail(caseId); // Refresh to load new SOPs and update badge
    }
}

function simulateFileUpload(type) {
    showModal('Upload Evidence', `
        <div style="text-align: center; padding: 1rem 0;">
            <i data-lucide="upload-cloud" style="width: 48px; height: 48px; color: var(--primary); margin-bottom: 1rem;"></i>
            <h4 style="margin-bottom: 0.5rem;">Upload ${type}</h4>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1.5rem;">Choose a file from your device to securely attach it to this case record.</p>
            <input type="file" id="evidence-file-input" style="margin-bottom: 1.5rem; width: 100%; font-size: 0.75rem; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px;">
            <div style="display: flex; gap: 10px;">
                <button class="btn-primary" style="flex: 1; background: var(--accent-green);" onclick="closeModal(); alert('${type} saved to case repository.')">
                    Save to Case
                </button>
                <button class="btn-primary" style="flex: 1; background: rgba(255,255,255,0.1); border: 1px solid var(--glass-border);" onclick="closeModal()">
                    Cancel
                </button>
            </div>
        </div>
    `);
}

function showModal(title, content) {
    let modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        document.body.appendChild(modalContainer);
    }
    modalContainer.innerHTML = `
        <div id="scms-modal" style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: fadeIn 0.2s;">
            <div class="glass glass-card" style="width: 100%; max-width: 400px; max-height: 90vh; overflow-y: auto; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.75rem;">
                    <h3 style="font-size: 1.125rem; margin: 0;">${title}</h3>
                    <i data-lucide="x" style="cursor: pointer; color: var(--text-muted); width: 20px;" onclick="closeModal()"></i>
                </div>
                ${content}
            </div>
        </div>
    `;
    lucide.createIcons();
}

function closeModal() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) modalContainer.innerHTML = '';
}

// --- Legal & Court Tools ---
function generateCourtReply(caseId) {
    const caseData = SCMS.cases.find(c => c.id === caseId);
    if (!caseData) return;
    const bnsSection = AI_ENGINE.suggestBNS(caseData.type) || "Relevant Sections";

    const draft = `IN THE HIGH COURT OF JUDICATURE\n\nREPLY AFFIDAVIT ON BEHALF OF RESPONDENT STATE\n\nFIR NO: ${caseData.id}\nPolice Station: Sector Command\nOffence: ${caseData.type} under ${bnsSection}\n\n1. That I am the Investigating Officer in the present case and well conversant with the facts and circumstances of the case.\n\n2. That the incident occurred near ${caseData.location} around ${caseData.time}.\n\n3. That the victim ${caseData.victim || 'Anonymous'} has recorded their statement under the newly integrated BNSS guidelines.\n\n4. Investigation is ongoing as per standard operating procedures (SOPs).`;

    showModal('AI Court Reply Draft', `
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem;">AI has drafted a structured response based on the case facts and BNS/BNSS laws.</p>
        <textarea class="glass-input" rows="12" style="font-size: 0.75rem; font-family: monospace; line-height: 1.4;">${draft}</textarea>
        <button class="btn-primary" style="margin-top: 1rem;" onclick="closeModal(); alert('Draft Saved to Case File!')">
            <i data-lucide="save"></i> Save Draft
        </button>
    `);
}

function simulateAadhaarESign() {
    showModal('Aadhaar e-Sign', `
        <div style="text-align: center;">
            <i data-lucide="fingerprint" style="width: 56px; height: 56px; color: var(--accent-blue); margin-bottom: 1rem;"></i>
            <div class="input-group" style="text-align: left;">
                <label class="input-label">Mobile Number</label>
                <div style="display: flex; gap: 8px;">
                    <input type="text" id="aadhaar-phone" class="glass-input" placeholder="enter phone number" style="text-transform: lowercase; flex: 1;">
                    <button class="btn-primary" style="width: auto; padding: 0 12px; font-size: 0.75rem;" onclick="sendSimulationOTP()">Send OTP</button>
                </div>
            </div>
            <p id="otp-status" style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem;">Enter the OTP sent to your Aadhaar-linked mobile number.</p>
            <input type="text" id="aadhaar-otp" class="glass-input" placeholder="X X X X X X" style="text-align: center; letter-spacing: 8px; font-size: 1.5rem; margin-bottom: 1.5rem; font-family: monospace;" maxlength="6">
            <button class="btn-primary" style="background: var(--accent-blue);" onclick="submitAadhaarSign()">
                Verify & Sign
            </button>
        </div>
    `);
}

window.sendSimulationOTP = function() {
    const phone = document.getElementById('aadhaar-phone').value;
    if(!phone) return alert('Enter a phone number first');
    const status = document.getElementById('otp-status');
    status.innerText = "OTP sent successfully to " + phone + "!";
    status.style.color = "var(--accent-green)";
    setTimeout(() => {
        alert("SIMULATION: OTP received on phone: " + Math.floor(100000 + Math.random() * 900000));
    }, 500);
}

window.submitAadhaarSign = function () {
    const phone = document.getElementById('aadhaar-phone').value;
    const otp = document.getElementById('aadhaar-otp').value;
    if (!phone) return alert('Please enter phone number.');
    if (!otp) return alert('Please enter OTP.');
    closeModal();
    addSignatureToCase('Aadhaar Verified e-Sign (' + phone + ')', 'var(--accent-blue)');
};

function internalSignDialog() {
    showModal('Internal Digital Sign', `
        <div style="text-align: center;">
            <i data-lucide="pen-tool" style="width: 56px; height: 56px; color: var(--primary); margin-bottom: 1rem;"></i>
            <p style="font-size: 0.875rem; margin-bottom: 1.5rem;">Enter your confidential credential password to affix your official digital signature image.</p>
            <input type="password" id="internal-pass" class="glass-input" placeholder="••••••••" style="text-align: center; margin-bottom: 1.5rem; font-size: 1.25rem;">
            <button class="btn-primary" onclick="submitInternalSign()">
                Affix Signature
            </button>
        </div>
    `);
}

window.submitInternalSign = function () {
    const pass = document.getElementById('internal-pass').value;
    if (!pass) return alert('Please enter your password.');
    closeModal();
    addSignatureToCase('Digitally Signed by ' + SCMS.currentUser.name, 'var(--primary)');
};

function addSignatureToCase(signText, color) {
    const container = document.getElementById('signature-container');
    if (!container) return;

    const signHtml = `
        <div class="glass glass-card mb-4 animate-fade-in" style="border: 1px solid ${color}; display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.02);">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: ${color}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i data-lucide="check-circle" style="color: white; width: 24px;"></i>
            </div>
            <div>
                <div style="font-size: 0.875rem; font-weight: bold; color: ${color};">${signText}</div>
                <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 4px;">Timestamp: ${new Date().toLocaleString()}</div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', signHtml);
    lucide.createIcons();
}

function renderLogin() {
    return `
        <div id="login-view" style="padding: 2rem 1.5rem; display: flex; flex-direction: column; justify-content: center; min-height: 100vh;">
            <div style="text-align: center; margin-bottom: 3rem;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--primary), #c084fc); border-radius: 20px; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="shield-check" style="width: 48px; height: 48px; color: white;"></i>
                </div>
                <h1 style="font-size: 1.75rem; font-weight: 800; background: linear-gradient(to right, #818cf8, #c084fc); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">POLICE AI</h1>
                <p style="color: var(--text-muted);">Secure Command Access</p>
            </div>

            <div class="glass glass-card">
                <div class="input-group">
                    <label class="input-label">Badge ID</label>
                    <input type="text" id="login-badge" class="glass-input" placeholder="Enter Badge ID">
                </div>
                <div class="input-group">
                    <label class="input-label">Password</label>
                    <input type="password" id="login-pass" class="glass-input" placeholder="••••••••">
                </div>
                <button class="btn-primary" onclick="handleLoginSubmit()">
                    Login to System
                </button>
            </div>
            
            <p style="text-align: center; font-size: 0.75rem; color: var(--text-muted); margin-top: 2rem;">
                Authorized Personnel Only. <br> System access is monitored.
            </p>
        </div>
    `;
}

function handleLoginSubmit() {
    const badge = document.getElementById('login-badge').value;
    const pass = document.getElementById('login-pass').value;

    if (badge === '8841-B' && pass === 'password') {
        SCMS.isLoggedIn = true;
        showView('dashboard');
    } else {
        alert('Invalid Badge ID or Password. Hint: 8841-B / password');
    }
}

function logout() {
    SCMS.isLoggedIn = false;
    showView('login');
}

function toggleSetting(key) {
    SCMS.settings[key] = !SCMS.settings[key];
    const view = document.getElementById('profile-view');
    if (view) {
        showView('profile'); // Re-render
    }
}

function setupVoiceRecording() {
    const micBtn = document.getElementById('mic-btn');
    const statusText = document.getElementById('stt-status');
    const textArea = document.getElementById('complaint-text');

    if (!micBtn) return;

    let isRecording = false;
    let recognition;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        // Dynamically set language
        const langToggle = document.getElementById('stt-lang');
        recognition.lang = langToggle && langToggle.value === 'hi' ? 'hi-IN' : 'en-US';

        recognition.onstart = () => {
            micBtn.style.background = 'var(--accent-red)';
            statusText.innerText = "Listening... Speak now";
            statusText.style.color = 'var(--accent-red)';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            textArea.value += (textArea.value ? ' ' : '') + transcript;
            stopRecording();
        };

        recognition.onerror = () => stopRecording();
        recognition.onend = () => stopRecording();
    }

    function stopRecording() {
        isRecording = false;
        micBtn.style.background = '';
        statusText.innerText = "Tap to record complaint";
        statusText.style.color = 'var(--text-muted)';
        if (recognition) recognition.stop();
    }

    micBtn.onclick = () => {
        if (!recognition) {
            alert("Speech recognition not supported in this browser. Simulating...");
            const langToggle = document.getElementById('stt-lang');
            if (langToggle && langToggle.value === 'hi') {
                textArea.value = "Ankit ne subah 10 baje bank ke bahar meri chain chheen li.";
            } else {
                textArea.value = "Ankit snatched my gold chain outside the bank at 10 AM.";
            }
            simulateAI();
            return;
        }

        if (isRecording) {
            stopRecording();
        } else {
            // Update Lang right before starting in case user changed it
            const langToggle = document.getElementById('stt-lang');
            recognition.lang = langToggle && langToggle.value === 'hi' ? 'hi-IN' : 'en-US';
            isRecording = true;
            recognition.start();
        }
    };
}

let pendingEvidence = [];
window.simulateVictimUpload = function(type) {
    showModal('Add Evidence', `
        <div style="text-align: center; padding: 1rem 0;">
            <i data-lucide="upload-cloud" style="width: 48px; height: 48px; color: var(--primary); margin-bottom: 1rem;"></i>
            <h4 style="margin-bottom: 0.5rem;">Add Victim ${type}</h4>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1.5rem;">Simulating file selection for ${type} provided by the victim.</p>
            <input type="text" id="evidence-name" class="glass-input" placeholder="File Name (e.g. statement_video.mp4)" style="margin-bottom: 1rem;">
            <button class="btn-primary" onclick="confirmVictimEvidence('${type}')">
                Attach to FIR Form
            </button>
        </div>
    `);
}

window.confirmVictimEvidence = function(type) {
    const name = document.getElementById('evidence-name').value || (type + '_' + Date.now());
    pendingEvidence.push({ type, name });
    closeModal();
    updateRegistrationEvidenceList();
}

function updateRegistrationEvidenceList() {
    const list = document.getElementById('registration-evidence-list');
    if(!list) return;
    list.innerHTML = pendingEvidence.map((ev, i) => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 6px 10px; border-radius: 6px; font-size: 0.75rem;">
            <span><i data-lucide="${ev.type === 'Video' ? 'video' : 'file-text'}" style="width: 12px; margin-right: 4px;"></i> ${ev.name}</span>
            <i data-lucide="trash-2" style="width: 12px; color: var(--accent-red); cursor: pointer;" onclick="removePendingEvidence(${i})"></i>
        </div>
    `).join('');
    lucide.createIcons();
}

window.removePendingEvidence = function(index) {
    pendingEvidence.splice(index, 1);
    updateRegistrationEvidenceList();
}

function simulateAI() {
    const text = document.getElementById('complaint-text').value;
    if (!text) return alert("Please enter or record a complaint first.");

    const results = AI_ENGINE.extractEntities(text);
    const section = AI_ENGINE.suggestBNS(results.crime);
    const sops = AI_ENGINE.getSOP(results.crime);

    document.getElementById('ai-results').style.display = 'block';
    document.getElementById('ext-victim').value = results.victim;
    document.getElementById('ext-location').value = results.location;
    document.getElementById('ext-section').innerText = section;

    document.getElementById('sop-list').innerHTML = sops.map(step => `
        <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <i data-lucide="square" style="width: 14px; color: var(--primary);"></i> ${step}
        </li>
    `).join('');
    lucide.createIcons();
}

function submitCase() {
    const victim = document.getElementById('ext-victim').value;
    const phone = document.getElementById('ext-phone').value;
    const location = document.getElementById('ext-location').value;
    const type = document.getElementById('ext-section').innerText.split(':')[0];

    SCMS.cases.unshift({
        id: '2024/' + Math.floor(1000 + Math.random() * 9000),
        type: type,
        victim: victim,
        victimPhone: phone,
        location: location,
        status: 'Urgent',
        time: 'Just now',
        details: document.getElementById('complaint-text').value,
        suspect: 'Unknown',
        evidence: [...pendingEvidence]
    });

    pendingEvidence = []; // Reset for next time
    showView('dashboard');
}

function renderSearch() {
    return `
        <div>
            <h2 style="margin-bottom: 1.5rem; font-size: 1.25rem;">Natural Language Search</h2>
            <div class="input-group">
                <input type="text" class="glass-input" placeholder="e.g. 'Show theft cases pending arrest'..." onkeyup="if(event.key==='Enter') simulateSearch(this.value)">
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">AI converts your query to database logic</p>
            </div>
            
            <div id="search-results" style="margin-top: 1.5rem;">
                <!-- Results -->
            </div>
        </div>
    `;
}

function simulateSearch(query) {
    if (!query) return;
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = '<i data-lucide="loader-2" class="animate-spin" style="margin: 0 auto; display: block; color: var(--primary);"></i>';
    lucide.createIcons();

    setTimeout(() => {
        const lowerQuery = query.toLowerCase();

        // Dynamic Filtering
        const matchingCases = SCMS.cases.filter(c => {
            return (c.type && c.type.toLowerCase().includes(lowerQuery)) ||
                (c.location && c.location.toLowerCase().includes(lowerQuery)) ||
                (c.victim && c.victim.toLowerCase().includes(lowerQuery)) ||
                (c.suspect && c.suspect.toLowerCase().includes(lowerQuery)) ||
                (c.details && c.details.toLowerCase().includes(lowerQuery)) ||
                (c.id && c.id.toLowerCase().includes(lowerQuery));
        });

        // Generate Pseudo-SQL for UI flavor
        let pseudoSql = `SELECT * FROM cases WHERE text_search LIKE '%${query}%'`;
        if (lowerQuery.includes('theft') || lowerQuery.includes('robbery')) pseudoSql = `SELECT * FROM cases WHERE type IN ('Theft', 'Robbery')`;
        if (lowerQuery.includes('sector') || lowerQuery.includes('chowk')) pseudoSql = `SELECT * FROM cases WHERE location LIKE '%${query}%'`;

        if (matchingCases.length === 0) {
            resultsDiv.innerHTML = `
                <div class="glass glass-card animate-fade-in" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                    <i data-lucide="search-x" style="width: 32px; height: 32px; margin: 0 auto 1rem; opacity: 0.5;"></i>
                    <p>No cases found matching "${query}"</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        let html = `
            <div class="glass glass-card animate-fade-in mb-4" style="background: rgba(30, 41, 59, 0.5);">
                <p style="font-size: 0.75rem; color: var(--accent-blue); margin-bottom: 8px; font-family: monospace;">QUERY GEN: ${pseudoSql}</p>
                <div style="border-top: 1px solid var(--glass-border); padding-top: 0.75rem;">
                    <div style="font-weight: 600; color: var(--text-main); font-size: 0.875rem;">Found ${matchingCases.length} matching case(s)</div>
                </div>
            </div>
            <div class="recent-cases">
        `;

        matchingCases.forEach(c => {
            html += `
                <div class="glass glass-card mb-4 animate-fade-in" style="margin-bottom: 1rem; cursor: pointer;" onclick="showCaseDetail('${c.id}')">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span class="badge ${c.status === 'Urgent' ? 'badge-red' : 'badge-green'}">${c.type}</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">${c.time}</span>
                    </div>
                    <div style="font-weight: 600; margin-bottom: 4px;">Near ${c.location}</div>
                    <div style="font-size: 0.8125rem; color: var(--text-muted);">FIR #${c.id} • Suspect: ${c.suspect || 'Unknown'}</div>
                </div>
            `;
        });

        html += `</div>`;
        resultsDiv.innerHTML = html;
        lucide.createIcons();
    }, 600);
}

function renderAnalytics() {
    return `
        <div id="analytics-view" style="padding-bottom: 2rem;">
            <h2 style="margin-bottom: 1.5rem; font-size: 1.25rem;">Crime Hotspot Mapping</h2>
            <div class="glass glass-card" style="height: 400px; position: relative; overflow: hidden; padding: 0; border-radius: 20px;">
                <!-- Embedded Google Map -->
                <iframe 
                    width="100%" 
                    height="100%" 
                    style="border:0; filter: contrast(1.1) saturate(0.8);" 
                    loading="lazy" 
                    allowfullscreen 
                    referrerpolicy="no-referrer-when-downgrade" 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d28014.240561571212!2d77.2167!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1709823420000!5m2!1sen!2sin&maptype=roadmap">
                </iframe>
                
                <!-- Overlay Mock Markers -->
                <div class="marker" style="position: absolute; top: 40%; left: 45%; cursor: pointer;" onclick="showCaseDetail('2024/0912')">
                    <i data-lucide="map-pin" style="color: #ef4444; filter: drop-shadow(0 0 5px #ef4444); fill: rgba(239, 68, 68, 0.2);"></i>
                    <div class="marker-label glass" style="position: absolute; top: -45px; left: -40px; padding: 6px 12px; font-size: 11px; white-space: nowrap; z-index: 10;">
                        <b>FIR #0912: Theft</b><br>
                        Lat: 28.6139, Lng: 77.2167
                    </div>
                </div>
                
                <div class="marker" style="position: absolute; top: 60%; left: 30%; cursor: pointer;" onclick="showCaseDetail('2024/0845')">
                    <i data-lucide="map-pin" style="color: #f59e0b; filter: drop-shadow(0 0 5px #f59e0b); fill: rgba(245, 158, 11, 0.2);"></i>
                    <div class="marker-label glass" style="position: absolute; top: -45px; left: -40px; padding: 6px 12px; font-size: 11px; white-space: nowrap; z-index: 10;">
                        <b>FIR #0845: Resolved</b><br>
                        Lat: 28.5992, Lng: 77.1973
                    </div>
                </div>

                <div class="marker" style="position: absolute; top: 30%; left: 70%; cursor: pointer;" onclick="alert('Incident #1042 - Predictive analysis underway')">
                    <i data-lucide="map-pin" style="color: #ef4444; filter: drop-shadow(0 0 5px #ef4444); fill: rgba(239, 68, 68, 0.2);"></i>
                    <div class="marker-label glass" style="position: absolute; top: -45px; left: -40px; padding: 6px 12px; font-size: 11px; white-space: nowrap; z-index: 10;">
                        <b>Incident #1042</b><br>
                        Lat: 28.6341, Lng: 77.2325
                    </div>
                </div>
                
                <div style="position: absolute; bottom: 10px; right: 10px; font-size: 0.65rem;" class="badge badge-red">LIVE GIS TRACKING</div>
            </div>
            
            <style>
                .marker:hover .marker-label { display: block; }
                .marker-label { display: none; background: rgba(15, 23, 42, 0.95); pointer-events: none; border: 1px solid var(--primary); }
                .marker i { width: 24px; height: 24px; transition: transform 0.2s; }
                .marker i:hover { transform: scale(1.2); }
            </style>

            <div style="margin-top: 1.5rem;">
                <h3 style="font-size: 1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
                     <i data-lucide="share-2" style="width: 18px;"></i> Case Linkage Graph
                </h3>
                <div class="glass glass-card" style="padding: 1.5rem; text-align: center;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; position: relative;">
                        <!-- Connection Lines -->
                        <div style="width: 2px; height: 40px; background: linear-gradient(to bottom, var(--primary), var(--accent-red)); margin-bottom: -1rem;"></div>
                        
                        <!-- Suspect Node -->
                        <div class="glass" style="padding: 12px 24px; background: rgba(99, 102, 241, 0.15); border: 2px solid var(--primary); border-radius: 99px; cursor: pointer; transition: 0.3s;" onclick="alert('Suspect Profile: Mohan Lal\\nAliases: Monu\\nCriminal Record: 3 Prev. Arrests')">
                            <div style="font-weight: 700; color: white;">Suspect: Mohan Lal</div>
                            <div style="font-size: 0.65rem; color: var(--text-muted);">Common Match Found</div>
                        </div>

                        <div style="display: flex; gap: 3rem; margin-top: 1rem;">
                            <!-- Linked Cases -->
                            <div class="glass glass-card" style="padding: 10px; border: 1px solid var(--accent-red); cursor: pointer; width: 120px;" onclick="showCaseDetail('2024/0912')">
                                <div class="badge badge-red" style="margin-bottom: 4px;">FIR #0912</div>
                                <div style="font-size: 0.65rem;">Theft: Sector 4</div>
                            </div>
                            <div class="glass glass-card" style="padding: 10px; border: 1px solid var(--accent-red); cursor: pointer; width: 120px;" onclick="showCaseDetail('2024/0845')">
                                <div class="badge badge-red" style="margin-bottom: 4px;">FIR #0845</div>
                                <div style="font-size: 0.65rem;">Resolved: Sector 14</div>
                            </div>
                        </div>
                    </div>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 1.5rem; background: rgba(239, 68, 68, 0.1); padding: 8px; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2);">
                        <b>AI Alert:</b> High probability of network involvement. Click nodes to investigate connections.
                    </p>
                </div>
            </div>
            
            <div style="margin-top: 1.5rem; margin-bottom: 2rem;">
                <button class="btn-primary" style="background: linear-gradient(135deg, #10b981, #059669);" onclick="showView('predictivePatrol')">
                    <i data-lucide="shield-alert"></i> Open Predictive Patrol Planner
                </button>
            </div>
        </div>
    `;
}

function renderProfile() {
    return `
        <div id="profile-view">
            <h2 style="margin-bottom: 1.5rem; font-size: 1.25rem;">Officer Profile</h2>
            
            <div class="glass glass-card mb-6" style="text-align: center; padding: 2rem;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--primary), #c084fc); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; border: 4px solid var(--glass-border);">
                    ${SCMS.currentUser.name.charAt(0)}
                </div>
                <h3 style="font-size: 1.25rem; margin-bottom: 0.25rem;">${SCMS.currentUser.name}</h3>
                <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">${SCMS.currentUser.rank} | Badge #8841-B</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid var(--glass-border); padding-top: 1.5rem; margin-bottom: 1.5rem;">
                    <div>
                        <div style="font-size: 1.125rem; font-weight: 700;">142</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Solved</div>
                    </div>
                    <div>
                        <div style="font-size: 1.125rem; font-weight: 700;">94%</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Efficiency</div>
                    </div>
                </div>

                <button class="btn-primary" style="background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #f59e0b;" onclick="showView('supervisorDashboard')">
                    <i data-lucide="bar-chart-2"></i> Open Supervisory Dashboard
                </button>
            </div>

            <div class="glass glass-card">
                <h4 style="font-size: 0.875rem; margin-bottom: 1rem; color: var(--text-muted);">ACCOUNT SETTINGS</h4>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="toggleSetting('biometric')">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <i data-lucide="shield" style="width: 18px; color: var(--primary);"></i>
                            <span>Biometric Login</span>
                        </div>
                        <div style="width: 40px; height: 20px; background: ${SCMS.settings.biometric ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)'}; border-radius: 10px; position: relative; transition: all 0.3s ease;">
                            <div style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; ${SCMS.settings.biometric ? 'right: 2px' : 'left: 2px'}; top: 2px; transition: all 0.3s ease;"></div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="toggleSetting('alerts')">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <i data-lucide="bell" style="width: 18px; color: var(--primary);"></i>
                            <span>Immediate Alerts</span>
                        </div>
                        <div style="width: 40px; height: 20px; background: ${SCMS.settings.alerts ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)'}; border-radius: 10px; position: relative; transition: all 0.3s ease;">
                            <div style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; ${SCMS.settings.alerts ? 'right: 2px' : 'left: 2px'}; top: 2px; transition: all 0.3s ease;"></div>
                        </div>
                    </div>
                    <button class="btn-primary" style="background: rgba(239, 68, 68, 0.1); color: var(--accent-red); margin-top: 1rem; border: 1px solid rgba(239, 68, 68, 0.2);" onclick="logout()">
                        <i data-lucide="log-out" style="width: 18px;"></i> Logout System
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderPredictivePatrol() {
    return `
        <div id="predictive-patrol-view" class="animate-fade-in" style="padding-bottom: 6rem;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem;">
                <button onclick="showView('analytics')" style="background: none; border: none; color: white; cursor: pointer; padding: 0;">
                    <i data-lucide="arrow-left"></i>
                </button>
                <h2 style="font-size: 1.25rem;">Predictive Patrol Planning</h2>
            </div>

            <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem;">AI-generated patrol suggestions based on historical crime patterns and situational data.</p>
            
            <div class="glass glass-card mb-6" style="padding: 0; overflow: hidden; height: 250px; position: relative;">
                <div style="width: 100%; height: 100%; background: #1e293b url('https://api.placeholder.com/600/400?text=Patrol+Zone+Map') no-repeat center/cover; opacity: 0.5;"></div>
                
                <!-- Zone Overlay -->
                <div style="position: absolute; top: 20%; left: 30%; width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0) 70%); border: 2px dashed rgba(239, 68, 68, 0.8); animation: pulse 2s infinite;">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); padding: 4px 8px; font-size: 10px; font-weight: 700; color: white; border-radius: 4px;">ZONE A (HIGH RISK)</div>
                </div>
                
                <!-- Suggested Route Line Simulation -->
                <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
                    <path d="M 50 200 Q 150 100 250 80 T 400 150" fill="transparent" stroke="var(--primary)" stroke-width="4" stroke-dasharray="8,8">
                        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
                    </path>
                </svg>
            </div>
            
            <style>
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
            </style>

            <h3 style="font-size: 1rem; margin-bottom: 1rem;"><i data-lucide="clock" style="width: 16px; margin-right: 6px;"></i> Recommended Actions</h3>
            
            <div class="glass glass-card mb-4" style="border-left: 4px solid var(--accent-red);">
                <div style="font-weight: 700; margin-bottom: 4px;">Deploy PCR Van to Sector 14</div>
                <div style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 8px;">High probability of property theft detected between 18:00 - 22:00.</div>
                <div class="badge badge-red">94% Confidence</div>
            </div>
            
            <div class="glass glass-card mb-4" style="border-left: 4px solid var(--primary);">
                <div style="font-weight: 700; margin-bottom: 4px;">Increase Foot Patrol at Chandni Chowk</div>
                <div style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 8px;">Elevated risk of pickpocketing due to upcoming local festival gathering.</div>
                <div class="badge" style="background: rgba(99, 102, 241, 0.2); color: var(--primary);">82% Confidence</div>
            </div>
            
            <button class="btn-primary" onclick="alert('Dispatch orders sent to available units.')">Deploy Recommended Units</button>
        </div>
    `;
}

function renderSupervisorDashboard() {
    return `
        <div id="supervisor-view" class="animate-fade-in" style="padding-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem;">
                <button onclick="showView('profile')" style="background: none; border: none; color: white; cursor: pointer; padding: 0;">
                    <i data-lucide="arrow-left"></i>
                </button>
                <h2 style="font-size: 1.25rem;">Supervisory Dashboard</h2>
            </div>
            
            <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem;">Station Pendency and IO Workload Overview.</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div class="glass glass-card" style="text-align: center; background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3);">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-red);">34</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Backlog (>30 Days)</div>
                </div>
                <div class="glass glass-card" style="text-align: center; background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.3);">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-green);">89%</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Resolution Rate</div>
                </div>
            </div>
            
            <h3 style="font-size: 1rem; margin-bottom: 1rem;"><i data-lucide="users" style="width: 16px; margin-right: 6px;"></i> IO Workload Distribution</h3>
            
            <div class="glass glass-card mb-6">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.875rem; font-weight: 600;">Kuldeep Kaith (IO-1)</span>
                    <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: var(--accent-red);">Overloaded: 18 Cases</span>
                </div>
                <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-bottom: 1rem;">
                    <div style="width: 90%; height: 100%; background: var(--accent-red);"></div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.875rem; font-weight: 600;">Sima Verma (IO-2)</span>
                    <span class="badge" style="background: rgba(34, 197, 94, 0.2); color: var(--accent-green);">Optimal: 5 Cases</span>
                </div>
                <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-bottom: 1rem;">
                    <div style="width: 40%; height: 100%; background: var(--accent-green);"></div>
                </div>
                
                <button class="btn-primary" style="font-size: 0.75rem; padding: 0.5rem;" onclick="alert('Re-assignment algorithms executing...')">
                    <i data-lucide="refresh-cw" style="width: 14px;"></i> Auto-Balance Workload
                </button>
            </div>
            
            <div class="glass glass-card" style="border: 1px dashed var(--primary); background: rgba(99, 102, 241, 0.1);">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="file-warning" style="color: white; width: 20px;"></i>
                    </div>
                    <div>
                        <div style="font-weight: bold; font-size: 0.875rem;">Action Required</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">4 cases pending chargesheet beyond 90 days.</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderLawLibrary(bookCode) {
    const bookTitles = {
        'BNS': 'Bharatiya Nyaya Sanhita, 2023',
        'BNSS': 'Bharatiya Nagarik Suraksha Sanhita, 2023',
        'BSA': 'Bharatiya Sakshya Adhiniyam, 2023'
    };
    const bookSubtitles = {
        'BNS': 'Replaces Indian Penal Code (IPC)',
        'BNSS': 'Replaces Code of Criminal Procedure (CrPC)',
        'BSA': 'Replaces Indian Evidence Act (IEA)'
    };

    // Mock chapters for demonstration
    const chapters = {
        'BNS': [
            { ch: 'Chapter I', title: 'Preliminary', sections: 'Sec 1-3' },
            { ch: 'Chapter II', title: 'Of Punishments', sections: 'Sec 4-13' },
            { ch: 'Chapter VI', title: 'Of Offences Affecting the Human Body', sections: 'Sec 99-145' },
            { ch: 'Chapter XVII', title: 'Of Offences Against Property', sections: 'Sec 301-333' }
        ],
        'BNSS': [
            { ch: 'Chapter I', title: 'Preliminary', sections: 'Sec 1-8' },
            { ch: 'Chapter V', title: 'Arrest of Persons', sections: 'Sec 35-62' },
            { ch: 'Chapter XII', title: 'Information to the Police and their Power to Investigate', sections: 'Sec 173-193' }
        ],
        'BSA': [
            { ch: 'Chapter I', title: 'Preliminary', sections: 'Sec 1-2' },
            { ch: 'Chapter V', title: 'Of Documentary Evidence', sections: 'Sec 56-90' },
            { ch: 'Chapter VI', title: 'Electronic Evidence', sections: 'Sec 61-63' }
        ]
    };

    const currentChapters = chapters[bookCode] || [];

    return `
        <div id="law-library-view" class="animate-fade-in" style="padding-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem;">
                <button onclick="showView('dashboard')" style="background: none; border: none; color: white; cursor: pointer; padding: 0;">
                    <i data-lucide="arrow-left"></i>
                </button>
                <h2 style="font-size: 1.25rem;">${bookCode}</h2>
            </div>
            
            <div class="glass glass-card mb-6" style="border-left: 4px solid var(--primary);">
                <h3 style="font-size: 1.125rem; margin-bottom: 4px;">${bookTitles[bookCode]}</h3>
                <p style="font-size: 0.8125rem; color: var(--text-muted);">${bookSubtitles[bookCode]}</p>
            </div>
            
            <div style="position: relative; margin-bottom: 1.5rem;">
                <input type="text" class="glass-input" placeholder="Search sections, keywords..." style="padding-left: 2.5rem;">
                <i data-lucide="search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); width: 18px;"></i>
            </div>
            
            <h4 style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem;">INDEX</h4>
            
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${currentChapters.map(chap => `
                    <div class="glass glass-card" style="padding: 1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="openLawChapter('${bookCode}', '${chap.ch}', '${chap.title}')">
                        <div>
                            <div style="font-size: 0.75rem; color: var(--primary); font-weight: bold; margin-bottom: 2px;">${chap.ch}</div>
                            <div style="font-weight: 600; font-size: 0.875rem;">${chap.title}</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 0.75rem;">
                            ${chap.sections}
                            <i data-lucide="chevron-right" style="width: 16px; display: inline-block; vertical-align: middle; margin-left: 4px;"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function openLawChapter(bookCode, chapterStr, title) {
    const contentMap = {
        'BNS': {
            'Chapter I': '<p><b>Section 1.</b> Short title, application and commencement. ...</p><p><b>Section 2.</b> Definitions. ...</p>',
            'Chapter II': '<p><b>Section 4.</b> Punishments. The punishments to which offenders are liable under the provisions of this Sanhita are: (a) Death; (b) Imprisonment for life...</p>',
            'Chapter VI': '<p><b>Section 99.</b> Acts against which there is no right of private defence. ...</p><p><b>Section 103.</b> Punishment for murder. ...</p>',
            'Chapter XVII': '<p><b>Section 301.</b> Theft. Whoever, intending to take dishonestly any movable property out of the possession of any person without that person\'s consent...</p>'
        },
        'BNSS': {
            'Chapter I': '<p><b>Section 1.</b> Short title, extent and commencement. ...</p><p><b>Section 2.</b> Definitions. (a) "audio-video electronic means" ...</p>',
            'Chapter V': '<p><b>Section 35.</b> When police may arrest without warrant. ...</p>',
            'Chapter XII': '<p><b>Section 173.</b> Information in cognizable cases. Every information relating to the commission of a cognizable offence...</p>'
        },
        'BSA': {
            'Chapter I': '<p><b>Section 1.</b> Short title, application and commencement. ...</p>',
            'Chapter V': '<p><b>Section 56.</b> Proof of contents of documents. ...</p>',
            'Chapter VI': '<p><b>Section 61.</b> Electronic records. ...</p><p><b>Section 63.</b> Admissibility of electronic records. ...</p>'
        }
    };

    const mockContent = (contentMap[bookCode] && contentMap[bookCode][chapterStr])
        ? contentMap[bookCode][chapterStr]
        : '<p>Content for this chapter is currently being digitized and updated in the system.</p>';

    showModal(`${bookCode} - ${chapterStr}`, `
        <div style="text-align: left; max-height: 60vh; overflow-y: auto; padding-right: 8px;">
            <h4 style="font-weight: 700; color: var(--primary); margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">${title}</h4>
            <div style="font-size: 0.875rem; line-height: 1.6; color: var(--text-main);">
                ${mockContent}
            </div>
            <div style="margin-top: 1.5rem; text-align: center;">
                <button class="btn-primary" onclick="closeModal()">Close Viewer</button>
            </div>
        </div>
    `);
}
