import axios from 'axios';
import type { AuditRequest, AuditJobResponse, JobStatus, JobResults } from '../types';

const API_URL = 'http://localhost:8000';

export const api = {
    startAudit: async (urls: string[], enableAi: boolean): Promise<string> => {
        const payload: AuditRequest = { urls, enable_ai: enableAi };
        const response = await axios.post<AuditJobResponse>(`${API_URL}/audit/start`, payload);
        return response.data.job_id;
    },

    getStatus: async (jobId: string): Promise<JobStatus> => {
        const response = await axios.get<JobStatus>(`${API_URL}/audit/${jobId}/status`);
        return response.data;
    },

    getResults: async (jobId: string): Promise<JobResults> => {
        const response = await axios.get<JobResults>(`${API_URL}/audit/${jobId}/results`);
        return response.data;
    },

    getReportUrl: (jobId: string) => {
        return `${API_URL}/audit/${jobId}/report/pdf`;
    }
};
