export interface AuditRequest {
    urls: string[];
    enable_ai: boolean;
}

export interface AuditJobResponse {
    job_id: string;
    status: string;
}

export interface JobStatus {
    job_id: string;
    status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
    progress: string;
    error?: string;
}

export interface AuditCheck {
    id: string;
    name: string;
    status: 'pass' | 'fail' | 'warning';
    description: string;
    remediation?: string;
}

export interface PageResult {
    url: string;
    score: number;
    perceivable: AuditCheck[];
    operable: AuditCheck[];
    understandable: AuditCheck[];
    robust: AuditCheck[];
    error?: string;
}

export interface GraphData {
    edges: { source: string; target: string }[];
}

export interface JobResults {
    job_id: string;
    status: string;
    results: PageResult[];
    graph_data?: GraphData;
}

export interface EmailRequest {
    organization: string;
    recipient: string;
    subject: string;
    message: string;
}
