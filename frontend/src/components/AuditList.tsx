import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { JobStatus, JobResults } from '../types';
import { api } from '../services/api';
import { DetailsModal } from './DetailsModal';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Props {
    jobs: string[]; // List of Job IDs
}

export const AuditList: React.FC<Props> = ({ jobs }) => {
    let reversedJobs = jobs.slice().reverse();
    return (
        <div className="max-w-7xl mx-auto px-4">
            {jobs.length === 0 && (
                <div className="text-center py-20 border border-dashed border-[#9DB68B]/30 rounded-2xl bg-white/10">
                    <p className="text-[#5D6D7E]">No active audits. Start one to see results here.</p>
                </div>
            )}
            <HoverEffect items={reversedJobs} />
        </div>
    );
};

export const HoverEffect = ({
    items,
    className,
}: {
    items: string[];
    className?: string;
}) => {
    let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
                className
            )}
        >
            {items.map((jobId, idx) => (
                <div
                    key={jobId}
                    className="relative group  block p-2 h-full w-full"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                className="absolute inset-0 h-full w-full bg-[#D4C5B0] block rounded-3xl" // Darker beige hover
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 0.6,
                                    transition: { duration: 0.15 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15, delay: 0.2 },
                                }}
                            />
                        )}
                    </AnimatePresence>
                    <JobCard jobId={jobId} />
                </div>
            ))}
        </div>
    );
};

const JobCard: React.FC<{ jobId: string }> = ({ jobId }) => {
    const [status, setStatus] = useState<JobStatus | null>(null);
    const [results, setResults] = useState<JobResults | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Poll for status
    useEffect(() => {
        let interval: any;

        const checkStatus = async () => {
            try {
                const data = await api.getStatus(jobId);
                setStatus(data);

                if (data.status === 'Completed' || data.status === 'Failed') {
                    clearInterval(interval);
                    if (data.status === 'Completed') {
                        // Fetch results for summary
                        api.getResults(jobId).then(setResults).catch(console.error);
                    }
                }
            } catch (e) {
                console.error("Failed to poll status", e);
            }
        };

        checkStatus();
        interval = setInterval(checkStatus, 3000); // Poll every 3s

        return () => clearInterval(interval);
    }, [jobId]);

    // Simple Matte Loading State
    if (!status) return (
        <Card>
            <div className="p-6 h-[250px] animate-pulse">
                <div className="h-4 bg-[#D4C5B0] rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-[#D4C5B0] rounded w-1/2"></div>
            </div>
        </Card>
    );

    const getStatusIcon = (s: string) => {
        if (s === 'Completed') return <div className="text-emerald-700 font-bold text-xs uppercase tracking-wider border border-emerald-600/20 bg-emerald-100 px-2 py-1 rounded">Passed</div>;
        if (s === 'Failed') return <div className="text-rose-700 font-bold text-xs uppercase tracking-wider border border-rose-600/20 bg-rose-100 px-2 py-1 rounded">Failed</div>;
        return <div className="text-blue-700 font-bold text-xs uppercase tracking-wider border border-blue-600/20 bg-blue-100 px-2 py-1 rounded animate-pulse">Running</div>;
    };

    return (
        <>
            <Card onClick={() => status.status === 'Completed' && results ? setShowModal(true) : null}>
                <div className="flex flex-col h-full justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <CardTitle>
                                {results ? new URL(results.results[0].url).hostname : 'Running Audit...'}
                            </CardTitle>
                            {getStatusIcon(status.status)}
                        </div>
                        <CardDescription>
                            ID: {jobId.slice(0, 8)}
                            <br />
                            {status.progress || 'Initializing...'}
                        </CardDescription>
                    </div>

                    <div className="mt-8 transition-colors">
                        {status.status === 'Completed' ? (
                            <span className="text-[#5D6D7E] group-hover:text-[#2C3E50] text-sm font-medium flex items-center transition-colors">
                                View Full Report &rarr;
                            </span>
                        ) : (
                            <span className="text-[#95A5A6] text-sm font-medium">Processing...</span>
                        )}
                    </div>
                </div>
            </Card>

            {/* Modal Portal */}
            {showModal && results && (
                <DetailsModal jobId={jobId} results={results} onClose={() => setShowModal(false)} />
            )}
        </>
    );
};

export const Card = ({
    className,
    children,
    onClick
}: {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "rounded-2xl h-full w-full p-4 overflow-hidden bg-[#F5F5DC] border border-[#D4C5B0] relative z-20 cursor-pointer shadow-sm hover:border-[#9DB68B] hover:shadow-md transition-all duration-200",
                className
            )}
        >
            <div className="relative z-50">
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export const CardTitle = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <h4 className={cn("text-[#2C3E50] font-bold tracking-wide mt-4", className)}>
            {children}
        </h4>
    );
};

export const CardDescription = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <p
            className={cn(
                "mt-4 text-[#5D6D7E] tracking-wide leading-relaxed text-sm",
                className
            )}
        >
            {children}
        </p>
    );
};
