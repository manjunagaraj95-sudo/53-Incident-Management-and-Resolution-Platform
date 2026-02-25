
import React, { useState } from 'react';

// --- ROLES Configuration for RBAC ---
const ROLES = {
    EMPLOYEE: 'Employee',
    SUPPORT_AGENT: 'Support Agent',
    SUPPORT_MANAGER: 'Support Manager',
    OPERATIONS_MANAGER: 'Operations Manager',
    ADMIN: 'Admin',
};

// --- STATUS Mapping for UI Labels and Colors ---
const STATUS_MAP = {
    NEW: { label: 'New', colorVar: 'var(--status-new)' },
    OPEN: { label: 'Open', colorVar: 'var(--status-open)' },
    IN_PROGRESS: { label: 'In Progress', colorVar: 'var(--status-in-progress)' },
    RESOLVED: { label: 'Resolved', colorVar: 'var(--status-resolved)' },
    CLOSED: { label: 'Closed', colorVar: 'var(--status-closed)' },
    REJECTED: { label: 'Rejected', colorVar: 'var(--status-rejected)' },
    ON_HOLD: { label: 'On Hold', colorVar: 'var(--status-on-hold)' },
    AWAITING_APPROVAL: { label: 'Awaiting Approval', colorVar: 'var(--status-awaiting-approval)' },
    SLA_BREACH: { label: 'SLA Breached', colorVar: 'var(--status-sla-breach)' },
};

// --- Dummy Data ---
const dummyUsers = [
    { id: 'usr-1', name: 'Alice Smith', email: 'alice.s@org.com', role: ROLES.EMPLOYEE },
    { id: 'usr-2', name: 'Bob Johnson', email: 'bob.j@org.com', role: ROLES.SUPPORT_AGENT },
    { id: 'usr-3', name: 'Charlie Brown', email: 'charlie.b@org.com', role: ROLES.SUPPORT_MANAGER },
    { id: 'usr-4', name: 'Diana Prince', email: 'diana.p@org.com', role: ROLES.OPERATIONS_MANAGER },
    { id: 'usr-5', name: 'Eve Adams', email: 'eve.a@org.com', role: ROLES.ADMIN },
    { id: 'usr-6', name: 'Frank White', email: 'frank.w@org.com', role: ROLES.EMPLOYEE },
    { id: 'usr-7', name: 'Grace Lee', email: 'grace.l@org.com', role: ROLES.SUPPORT_AGENT },
];

const dummyIncidents = [
    {
        id: 'inc-001',
        title: 'Network outage in building A',
        description: 'Users in building A are reporting no network connectivity. Impacting all departments in A.',
        status: 'OPEN',
        priority: 'High',
        severity: 'Critical',
        reportedBy: 'Alice Smith',
        assignedTo: 'Bob Johnson',
        createdAt: '2023-10-26T10:00:00Z',
        updatedAt: '2023-10-26T11:30:00Z',
        resolutionNotes: null,
        slaStatus: 'MET',
        workflowStages: ['Reported', 'Assigned', 'Investigated', 'Resolved'],
        currentWorkflowStage: 'Assigned',
        auditTrail: [
            { timestamp: '2023-10-26T10:00:00Z', user: 'Alice Smith', action: 'Incident created.' },
            { timestamp: '2023-10-26T10:15:00Z', user: 'Bob Johnson', action: 'Incident assigned to Bob Johnson.' },
        ],
        attachments: [{ name: 'network-diagram.pdf', url: '/docs/network-diagram.pdf' }],
        relatedRecords: [{ type: 'Asset', id: 'asset-042', name: 'Switch-BldgA-Floor3' }],
    },
    {
        id: 'inc-002',
        title: 'Printer not working in HR department',
        description: 'The main printer in the HR office is offline. Users cannot print documents.',
        status: 'IN_PROGRESS',
        priority: 'Medium',
        severity: 'Minor',
        reportedBy: 'Frank White',
        assignedTo: 'Grace Lee',
        createdAt: '2023-10-26T09:00:00Z',
        updatedAt: '2023-10-26T12:00:00Z',
        resolutionNotes: null,
        slaStatus: 'MET',
        workflowStages: ['Reported', 'Assigned', 'Investigated', 'Resolved'],
        currentWorkflowStage: 'Investigated',
        auditTrail: [
            { timestamp: '2023-10-26T09:00:00Z', user: 'Frank White', action: 'Incident created.' },
            { timestamp: '2023-10-26T09:30:00Z', user: 'Grace Lee', action: 'Incident assigned to Grace Lee.' },
            { timestamp: '2023-10-26T12:00:00Z', user: 'Grace Lee', action: 'Printer checked, driver reinstallation started.' },
        ],
        attachments: [],
        relatedRecords: [],
    },
    {
        id: 'inc-003',
        title: 'Laptop performance issue - John Doe',
        description: 'John Doe (Sales) reports his laptop is extremely slow, crashing frequently.',
        status: 'NEW',
        priority: 'Medium',
        severity: 'Moderate',
        reportedBy: 'John Doe',
        assignedTo: null,
        createdAt: '2023-10-26T14:00:00Z',
        updatedAt: '2023-10-26T14:00:00Z',
        resolutionNotes: null,
        slaStatus: 'MET',
        workflowStages: ['Reported', 'Assigned', 'Investigated', 'Resolved'],
        currentWorkflowStage: 'Reported',
        auditTrail: [
            { timestamp: '2023-10-26T14:00:00Z', user: 'John Doe', action: 'Incident created.' },
        ],
        attachments: [],
        relatedRecords: [],
    },
    {
        id: 'inc-004',
        title: 'Unauthorized access attempt detected',
        description: 'Alert from SIEM system: multiple failed login attempts on a critical server.',
        status: 'OPEN',
        priority: 'Critical',
        severity: 'Critical',
        reportedBy: 'System Alert',
        assignedTo: 'Bob Johnson',
        createdAt: '2023-10-25T22:00:00Z',
        updatedAt: '2023-10-26T08:00:00Z',
        resolutionNotes: null,
        slaStatus: 'MET',
        workflowStages: ['Reported', 'Assigned', 'Investigated', 'Resolved', 'Approved', 'Closed'],
        currentWorkflowStage: 'Investigated',
        auditTrail: [
            { timestamp: '2023-10-25T22:00:00Z', user: 'System', action: 'Incident created by SIEM alert.' },
            { timestamp: '2023-10-26T08:00:00Z', user: 'Bob Johnson', action: 'Incident assigned to Bob Johnson. Initial investigation started.' },
        ],
        attachments: [],
        relatedRecords: [{ type: 'Server', id: 'srv-001', name: 'Prod-DB-Server' }],
    },
    {
        id: 'inc-005',
        title: 'Email delivery issues for external recipients',
        description: 'Some external emails are bouncing back with "recipient not found" errors.',
        status: 'ON_HOLD',
        priority: 'High',
        severity: 'Major',
        reportedBy: 'Diana Prince',
        assignedTo: 'Grace Lee',
        createdAt: '2023-10-24T16:00:00Z',
        updatedAt: '2023-10-26T10:00:00Z',
        resolutionNotes: 'Awaiting vendor response for DNS propagation issue.',
        slaStatus: 'MET',
        workflowStages: ['Reported', 'Assigned', 'Investigated', 'On Hold', 'Resolved'],
        currentWorkflowStage: 'On Hold',
        auditTrail: [
            { timestamp: '2023-10-24T16:00:00Z', user: 'Diana Prince', action: 'Incident created.' },
            { timestamp: '2023-10-24T16:30:00Z', user: 'Grace Lee', action: 'Incident assigned to Grace Lee.' },
            { timestamp: '2023-10-25T09:00:00Z', user: 'Grace Lee', action: 'Identified external DNS issue, contacted vendor.' },
            { timestamp: '2023-10-26T10:00:00Z', user: 'Grace Lee', action: 'Incident placed On Hold pending vendor resolution.' },
        ],
        attachments: [],
        relatedRecords: [],
    },
    {
        id: 'inc-006',
        title: 'New software installation request',
        description: 'Request to install "Adobe Creative Suite" on workstation for Marketing team.',
        status: 'AWAITING_APPROVAL',
        priority: 'Low',
        severity: 'Minor',
        reportedBy: 'Alice Smith',
        assignedTo: 'Charlie Brown',
        createdAt: '2023-10-23T11:00:00Z',
        updatedAt: '2023-10-23T14:00:00Z',
        resolutionNotes: null,
        slaStatus: 'MET',
        workflowStages: ['Requested', 'Assigned', 'Awaiting Approval', 'Approved', 'Resolved'],
        currentWorkflowStage: 'Awaiting Approval',
        auditTrail: [
            { timestamp: '2023-10-23T11:00:00Z', user: 'Alice Smith', action: 'New software installation request created.' },
            { timestamp: '2023-10-23T14:00:00Z', user: 'Charlie Brown', action: 'Request assigned for approval.' },
        ],
        attachments: [{ name: 'software-license.pdf', url: '/docs/software-license.pdf' }],
        relatedRecords: [],
    },
    {
        id: 'inc-007',
        title: 'Failed server patch deployment',
        description: 'Automatic patch deployment failed on critical application server.',
        status: 'SLA_BREACH',
        priority: 'High',
        severity: 'Major',
        reportedBy: 'System Alert',
        assignedTo: 'Bob Johnson',
        createdAt: '2023-10-22T03:00:00Z',
        updatedAt: '2023-10-26T15:00:00Z',
        resolutionNotes: null,
        slaStatus: 'BREACHED',
        workflowStages: ['Reported', 'Assigned', 'Investigated', 'Resolved'],
        currentWorkflowStage: 'Investigated',
        auditTrail: [
            { timestamp: '2023-10-22T03:00:00Z', user: 'System', action: 'Incident created due to failed patch.' },
            { timestamp: '2023-10-22T08:00:00Z', user: 'Bob Johnson', action: 'Incident assigned. Investigation pending.' },
            { timestamp: '2023-10-26T15:00:00Z', user: 'System', action: 'SLA breached for resolution.' },
        ],
        attachments: [],
        relatedRecords: [{ type: 'Server', id: 'srv-005', name: 'AppServer-HR' }],
    },
    {
        id: 'inc-008',
        title: 'User account locked out',
        description: 'User "Jane Doe" (Finance) is locked out of her account.',
        status: 'RESOLVED',
        priority: 'Low',
        severity: 'Minor',
        reportedBy: 'Jane Doe',
        assignedTo: 'Grace Lee',
        createdAt: '2023-10-26T08:30:00Z',
        updatedAt: '2023-10-26T08:45:00Z',
        resolutionNotes: 'Account unlocked, password reset initiated.',
        slaStatus: 'MET',
        workflowStages: ['Reported', 'Assigned', 'Resolved'],
        currentWorkflowStage: 'Resolved',
        auditTrail: [
            { timestamp: '2023-10-26T08:30:00Z', user: 'Jane Doe', action: 'Incident created.' },
            { timestamp: '2023-10-26T08:35:00Z', user: 'Grace Lee', action: 'Incident assigned to Grace Lee.' },
            { timestamp: '2023-10-26T08:45:00Z', user: 'Grace Lee', action: 'Account unlocked and resolved.' },
        ],
        attachments: [],
        relatedRecords: [{ type: 'User', id: 'usr-009', name: 'Jane Doe' }],
    },
    {
        id: 'inc-009',
        title: 'Request for new VPN access',
        description: 'New employee requires VPN access for remote work.',
        status: 'CLOSED',
        priority: 'Low',
        severity: 'Minor',
        reportedBy: 'Charlie Brown',
        assignedTo: 'Eve Adams',
        createdAt: '2023-10-20T09:00:00Z',
        updatedAt: '2023-10-20T11:00:00Z',
        resolutionNotes: 'VPN access configured and verified.',
        slaStatus: 'MET',
        workflowStages: ['Requested', 'Assigned', 'Approved', 'Resolved', 'Closed'],
        currentWorkflowStage: 'Closed',
        auditTrail: [
            { timestamp: '2023-10-20T09:00:00Z', user: 'Charlie Brown', action: 'New VPN access request created.' },
            { timestamp: '2023-10-20T09:15:00Z', user: 'Eve Adams', action: 'Request assigned to Eve Adams.' },
            { timestamp: '2023-10-20T10:00:00Z', user: 'Eve Adams', action: 'VPN configured.' },
            { timestamp: '2023-10-20T11:00:00Z', user: 'Eve Adams', action: 'Request closed.' },
        ],
        attachments: [],
        relatedRecords: [{ type: 'User', id: 'usr-010', name: 'New Employee' }],
    },
];

const App = () => {
    // Centralized routing state
    const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
    const [currentUserRole, setCurrentUserRole] = useState(ROLES.SUPPORT_MANAGER); // Default role for demonstration

    // Simulate navigation
    const navigate = (screenName, params = {}) => {
        setView({ screen: screenName, params });
    };

    // Helper to get status label and color
    const getStatusProps = (statusKey) => STATUS_MAP[statusKey] || { label: statusKey, colorVar: 'var(--color-secondary)' };

    // Placeholder for user roles for navigation
    const userNavigation = [
        { name: 'Dashboard', screen: 'DASHBOARD', roles: [ROLES.EMPLOYEE, ROLES.SUPPORT_AGENT, ROLES.SUPPORT_MANAGER, ROLES.OPERATIONS_MANAGER, ROLES.ADMIN] },
        { name: 'My Incidents', screen: 'MY_INCIDENTS', roles: [ROLES.EMPLOYEE] },
        { name: 'All Incidents', screen: 'ALL_INCIDENTS', roles: [ROLES.SUPPORT_AGENT, ROLES.SUPPORT_MANAGER, ROLES.OPERATIONS_MANAGER, ROLES.ADMIN] },
        { name: 'Users', screen: 'USERS', roles: [ROLES.ADMIN, ROLES.OPERATIONS_MANAGER] },
        { name: 'Reports', screen: 'REPORTS', roles: [ROLES.SUPPORT_MANAGER, ROLES.OPERATIONS_MANAGER, ROLES.ADMIN] },
        { name: 'Settings', screen: 'SETTINGS', roles: [ROLES.ADMIN] },
    ];

    // --- Components for different screens ---

    const IncidentCard = ({ incident }) => {
        const { label, colorVar } = getStatusProps(incident?.status);
        const isSlaBreached = incident?.slaStatus === 'BREACHED';

        return (
            <div
                className="card"
                onClick={() => navigate('INCIDENT_DETAIL', { id: incident?.id })}
                data-status={incident?.status}
                data-sla={isSlaBreached ? 'BREACHED' : 'MET'}
                style={{ '--card-border-left-color': colorVar }}
            >
                <div>
                    <h3 className="card-title">{incident?.title}</h3>
                    <p className="card-subtitle">Reported by: {incident?.reportedBy}</p>
                    <p style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
                        Assigned to: {incident?.assignedTo || 'Unassigned'}
                    </p>
                </div>
                <div className="card-meta">
                    <span className="card-status-label" style={{ backgroundColor: colorVar }}>
                        {label}
                    </span>
                    {isSlaBreached && (
                        <span className="sla-status-indicator breached">
                            SLA Breached
                        </span>
                    )}
                    {!isSlaBreached && (
                        <span className="sla-status-indicator met">
                            SLA Met
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const DashboardScreen = () => {
        const recentIncidents = dummyIncidents.slice(0, 4); // Show 4 recent incidents

        return (
            <div className="screen">
                <h1 style={{ fontSize: 'var(--font-size-xxl)', marginBottom: 'var(--spacing-lg)' }}>Dashboard</h1>

                <div className="dashboard-grid">
                    <div className="dashboard-section">
                        <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-md)' }}>Key Metrics</h2>
                        <div className="card-grid">
                            <div className="card">
                                <h3 className="card-title">Open Incidents</h3>
                                <p style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)' }}>
                                    {dummyIncidents.filter(inc => inc.status === 'OPEN' || inc.status === 'IN_PROGRESS').length}
                                </p>
                            </div>
                            <div className="card">
                                <h3 className="card-title">Resolved Today</h3>
                                <p style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
                                    {dummyIncidents.filter(inc => inc.status === 'RESOLVED' && new Date(inc.updatedAt).toDateString() === new Date().toDateString()).length}
                                </p>
                            </div>
                            <div className="card">
                                <h3 className="card-title">SLA Breaches</h3>
                                <p style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-danger)' }}>
                                    {dummyIncidents.filter(inc => inc.slaStatus === 'BREACHED').length}
                                </p>
                            </div>
                            <div className="card">
                                <h3 className="card-title">Average Resolution Time</h3>
                                <p style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
                                    2.5 days
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h2 style={{ fontSize: 'var(--font-size-xl)', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>Real-time Analytics</h2>
                        <div className="card-grid">
                            <div className="chart-placeholder" style={{ gridColumn: 'span 2' }}>
                                <span className="chart-live-indicator"></span>
                                Bar Chart: Incidents by Priority
                            </div>
                            <div className="chart-placeholder">Donut Chart: Incidents by Status</div>
                            <div className="chart-placeholder">Gauge Chart: SLA Compliance</div>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h2 style={{ fontSize: 'var(--font-size-xl)', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>Recent Incidents</h2>
                        <div className="card-grid">
                            {recentIncidents.map(incident => (
                                <IncidentCard key={incident.id} incident={incident} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const IncidentsListScreen = ({ myIncidents = false }) => {
        const incidentsToDisplay = myIncidents
            ? dummyIncidents.filter(inc => inc.reportedBy === dummyUsers[0].name) // Alice Smith is Employee
            : dummyIncidents;

        return (
            <div className="screen">
                <div className="detail-header">
                    <h2>{myIncidents ? 'My Incidents' : 'All Incidents'}</h2>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <input type="text" placeholder="Search incidents..." className="search-bar" />
                        <button className="button button-outline">Filter</button>
                        {!myIncidents && (
                            <button className="button button-primary">New Incident</button>
                        )}
                    </div>
                </div>

                <div className="card-grid">
                    {incidentsToDisplay.map(incident => (
                        <IncidentCard key={incident.id} incident={incident} />
                    ))}
                </div>
            </div>
        );
    };

    const IncidentDetailScreen = ({ incidentId }) => {
        const incident = dummyIncidents.find(inc => inc.id === incidentId);

        if (!incident) {
            return (
                <div className="screen">
                    <p>Incident not found.</p>
                    <button onClick={() => navigate('ALL_INCIDENTS')} className="button button-primary">Back to Incidents</button>
                </div>
            );
        }

        const { label: statusLabel, colorVar: statusColor } = getStatusProps(incident?.status);

        const handleResolveIncident = () => {
            if (window.confirm(`Are you sure you want to resolve incident ${incident?.id}?`)) {
                // In a real app, dispatch an action to update incident status
                alert(`Incident ${incident?.id} resolved! (Simulated)`);
                // Simulate state update and navigate back or refresh
                navigate('ALL_INCIDENTS');
            }
        };

        const handleAssignIncident = () => {
             if (window.confirm(`Are you sure you want to assign incident ${incident?.id}?`)) {
                // In a real app, dispatch an action to update incident assignment
                alert(`Incident ${incident?.id} assigned! (Simulated)`);
                navigate('INCIDENT_DETAIL', { id: incidentId }); // Stay on detail page
            }
        };

        const isSupportOrManager = (currentUserRole === ROLES.SUPPORT_AGENT || currentUserRole === ROLES.SUPPORT_MANAGER || currentUserRole === ROLES.ADMIN);

        return (
            <div className="screen">
                <div className="breadcrumb">
                    <a onClick={() => navigate('DASHBOARD')}>Home</a>
                    <span>/</span>
                    <a onClick={() => navigate('ALL_INCIDENTS')}>Incidents</a>
                    <span>/</span>
                    <span>{incident?.id}</span>
                </div>

                <div className="detail-header">
                    <h2>{incident?.title}</h2>
                    <div className="detail-actions">
                        {isSupportOrManager && (incident?.status !== 'RESOLVED' && incident?.status !== 'CLOSED') && (
                            <>
                                {incident?.assignedTo === null && (
                                    <button onClick={handleAssignIncident} className="button button-primary">Assign</button>
                                )}
                                <button onClick={handleResolveIncident} className="button button-accent">Resolve Incident</button>
                                <button className="button button-secondary">Edit</button>
                            </>
                        )}
                        <button className="button button-outline">Export PDF</button>
                    </div>
                </div>

                <div className="workflow-tracker">
                    {incident?.workflowStages?.map((stage, index) => {
                        const isCompleted = incident?.workflowStages?.indexOf(incident?.currentWorkflowStage) > incident?.workflowStages?.indexOf(stage);
                        const isActive = incident?.currentWorkflowStage === stage;
                        return (
                            <div key={stage} className={`workflow-stage ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                                <div className="workflow-stage-icon">
                                    {isCompleted ? '✓' : (index + 1)}
                                </div>
                                <div className="workflow-stage-title">{stage}</div>
                                {index < (incident?.workflowStages?.length || 0) - 1 && <div className="workflow-stage-line"></div>}
                            </div>
                        );
                    })}
                </div>

                <div className="detail-section">
                    <h3>Incident Details</h3>
                    <div className="detail-row">
                        <div className="detail-label">Status:</div>
                        <div className="detail-value">
                            <span className="card-status-label" style={{ backgroundColor: statusColor, color: 'var(--color-text-light)' }}>
                                {statusLabel}
                            </span>
                            <span className={`sla-status-indicator ${incident?.slaStatus === 'BREACHED' ? 'breached' : 'met'}`}>
                                {incident?.slaStatus === 'BREACHED' ? 'SLA Breached' : 'SLA Met'}
                            </span>
                        </div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Description:</div>
                        <div className="detail-value">{incident?.description}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Priority:</div>
                        <div className="detail-value">{incident?.priority}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Severity:</div>
                        <div className="detail-value">{incident?.severity}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Reported By:</div>
                        <div className="detail-value">{incident?.reportedBy}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Assigned To:</div>
                        <div className="detail-value">{incident?.assignedTo || 'Unassigned'}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Created At:</div>
                        <div className="detail-value">{new Date(incident?.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Last Updated:</div>
                        <div className="detail-value">{new Date(incident?.updatedAt).toLocaleString()}</div>
                    </div>
                    {incident?.resolutionNotes && (
                        <div className="detail-row">
                            <div className="detail-label">Resolution Notes:</div>
                            <div className="detail-value">{incident?.resolutionNotes}</div>
                        </div>
                    )}
                </div>

                {incident?.attachments?.length > 0 && (
                    <div className="detail-section">
                        <h3>Attachments</h3>
                        {incident?.attachments?.map((attachment, index) => (
                            <div key={index} className="detail-row">
                                <div className="detail-label">File {index + 1}:</div>
                                <div className="detail-value">
                                    <a href={attachment?.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                                        {attachment?.name}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {incident?.relatedRecords?.length > 0 && (
                    <div className="detail-section">
                        <h3>Related Records</h3>
                        {incident?.relatedRecords?.map((record, index) => (
                            <div key={index} className="detail-row">
                                <div className="detail-label">{record?.type}:</div>
                                <div className="detail-value">{record?.name} (ID: {record?.id})</div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="detail-section">
                    <h3>Audit Trail</h3>
                    <div className="audit-log">
                        {incident?.auditTrail?.map((log, index) => (
                            <div key={index} className="audit-log-item">
                                <span className="audit-log-timestamp">{new Date(log?.timestamp).toLocaleString()}</span>
                                <span className="audit-log-details">
                                    <strong>{log?.user}:</strong> {log?.action}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const UsersListScreen = () => (
        <div className="screen">
            <h2 style={{ fontSize: 'var(--font-size-xxl)', marginBottom: 'var(--spacing-lg)' }}>User Management</h2>
            <div className="card-grid">
                {dummyUsers.map(user => (
                    <div key={user.id} className="card" onClick={() => alert(`View details for ${user.name}`)}>
                        <h3 className="card-title">{user.name}</h3>
                        <p className="card-subtitle">{user.email}</p>
                        <div className="card-meta">
                            <span className="card-status-label" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-text-light)' }}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const ReportsScreen = () => (
        <div className="screen">
            <h2 style={{ fontSize: 'var(--font-size-xxl)', marginBottom: 'var(--spacing-lg)' }}>Reports & Analytics</h2>
            <div className="dashboard-grid">
                <div className="chart-placeholder">Historical Incident Trends (Line Chart)</div>
                <div className="chart-placeholder">Team Workload Distribution (Bar Chart)</div>
                <div className="chart-placeholder">SLA Compliance by Department (Donut Chart)</div>
                <div className="chart-placeholder">Exportable Report Grid</div>
            </div>
            <div style={{ marginTop: 'var(--spacing-xl)', display: 'flex', gap: 'var(--spacing-md)' }}>
                <button className="button button-primary">Generate Report</button>
                <button className="button button-outline">Export to PDF</button>
                <button className="button button-outline">Export to Excel</button>
            </div>
        </div>
    );

    const SettingsScreen = () => (
        <div className="screen">
            <h2 style={{ fontSize: 'var(--font-size-xxl)', marginBottom: 'var(--spacing-lg)' }}>System Settings</h2>
            <div className="card-grid">
                <div className="card" onClick={() => alert('Configure roles and permissions')}>
                    <h3 className="card-title">Role-Based Access Control</h3>
                    <p className="card-subtitle">Manage user roles and permissions.</p>
                </div>
                <div className="card" onClick={() => alert('Manage SLA definitions')}>
                    <h3 className="card-title">SLA Definitions</h3>
                    <p className="card-subtitle">Configure Service Level Agreements.</p>
                </div>
                <div className="card" onClick={() => alert('System audit log view')}>
                    <h3 className="card-title">Global Audit Logs</h3>
                    <p className="card-subtitle">View all system activities.</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            <header className="header">
                <h1 className="header-title">Incident Hub</h1>
                <nav className="nav-menu">
                    {userNavigation.map(item => (
                        (item.roles.includes(currentUserRole)) && (
                            <button
                                key={item.screen}
                                className={`nav-item ${view.screen === item.screen ? 'active' : ''}`}
                                onClick={() => navigate(item.screen)}
                            >
                                {item.name}
                            </button>
                        )
                    ))}
                    <div style={{ marginLeft: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>Role: {currentUserRole}</span>
                        <select
                            style={{ padding: 'var(--spacing-xs)', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'var(--color-bg-light)', border: 'none' }}
                            value={currentUserRole}
                            onChange={(e) => setCurrentUserRole(e.target.value)}
                        >
                            {Object.values(ROLES).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                </nav>
            </header>

            <main className="main-content">
                {((view.screen === 'DASHBOARD') && <DashboardScreen />) ||
                ((view.screen === 'ALL_INCIDENTS') && <IncidentsListScreen />) ||
                ((view.screen === 'MY_INCIDENTS') && <IncidentsListScreen myIncidents={true} />) ||
                ((view.screen === 'INCIDENT_DETAIL') && <IncidentDetailScreen incidentId={view.params?.id} />) ||
                ((view.screen === 'USERS') && (
                    (currentUserRole === ROLES.ADMIN || currentUserRole === ROLES.OPERATIONS_MANAGER) ? <UsersListScreen /> : <div className="screen"><p>Access Denied.</p><button onClick={() => navigate('DASHBOARD')} className="button button-primary">Go to Dashboard</button></div>
                )) ||
                ((view.screen === 'REPORTS') && (
                    (currentUserRole === ROLES.SUPPORT_MANAGER || currentUserRole === ROLES.OPERATIONS_MANAGER || currentUserRole === ROLES.ADMIN) ? <ReportsScreen /> : <div className="screen"><p>Access Denied.</p><button onClick={() => navigate('DASHBOARD')} className="button button-primary">Go to Dashboard</button></div>
                )) ||
                ((view.screen === 'SETTINGS') && (
                    (currentUserRole === ROLES.ADMIN) ? <SettingsScreen /> : <div className="screen"><p>Access Denied.</p><button onClick={() => navigate('DASHBOARD')} className="button button-primary">Go to Dashboard</button></div>
                )) ||
                // Default fallback if screen not found or access denied
                (<div className="screen"><p>Page not found or access denied.</p><button onClick={() => navigate('DASHBOARD')} className="button button-primary">Go to Dashboard</button></div>)}
            </main>
        </div>
    );
};

export default App;