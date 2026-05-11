import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { JobStatus, JobResults } from '../types';
import { api } from '../services/api';
import { DetailsModal } from './DetailsModal';
import { QuestionMarkCircleIcon, CloseIcon } from './Icons';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Props {
    jobs: string[];
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
                                className="absolute inset-0 h-full w-full bg-[#D4C5B0] block rounded-3xl"
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

export const getLetterGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'text-white bg-[#9DB68B] border-[#9DB68B]' };
    if (score >= 80) return { grade: 'B', color: 'text-[#2C3E50] bg-[#9DB68B]/40 border-[#9DB68B]/50' };
    if (score >= 70) return { grade: 'C', color: 'text-[#2C3E50] bg-[#D4C5B0] border-[#D4C5B0]' };
    if (score >= 60) return { grade: 'D', color: 'text-[#2C3E50] bg-[#D4C5B0]/50 border-[#D4C5B0]/80' };
    return { grade: 'F', color: 'text-white bg-[#2C3E50] border-[#2C3E50]' };
};

export const GradeGuide = ({ onClose, className }: { onClose: () => void, className?: string }) => (
    <div className={cn("absolute z-50 w-64 bg-white border border-[#D4C5B0] rounded-xl shadow-xl p-4 animate-in fade-in zoom-in-95 cursor-default", className || "top-12 right-0")} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 border-b border-[#D4C5B0]/50 pb-2">
            <h4 className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider">Grading Scale</h4>
            <button onClick={onClose} className="text-[#5D6D7E] hover:text-[#2C3E50]"><CloseIcon className="w-4 h-4" /></button>
        </div>
        <ul className="text-sm space-y-3">
            <li className="flex items-center space-x-3">
                <span className="flex items-center justify-center font-bold text-white bg-[#9DB68B] border border-[#9DB68B] rounded w-6 h-6 text-xs shadow-sm">A</span>
                <div className="flex flex-col"><span className="text-[#2C3E50] text-xs font-bold">90 - 100</span><span className="text-[#5D6D7E] text-[10px]">Excellent Compliance</span></div>
            </li>
            <li className="flex items-center space-x-3">
                <span className="flex items-center justify-center font-bold text-[#2C3E50] bg-[#9DB68B]/40 border border-[#9DB68B]/50 rounded w-6 h-6 text-xs shadow-sm">B</span>
                <div className="flex flex-col"><span className="text-[#2C3E50] text-xs font-bold">80 - 89</span><span className="text-[#5D6D7E] text-[10px]">Good Compliance</span></div>
            </li>
            <li className="flex items-center space-x-3">
                <span className="flex items-center justify-center font-bold text-[#2C3E50] bg-[#D4C5B0] border border-[#D4C5B0] rounded w-6 h-6 text-xs shadow-sm">C</span>
                <div className="flex flex-col"><span className="text-[#2C3E50] text-xs font-bold">70 - 79</span><span className="text-[#5D6D7E] text-[10px]">Moderate Compliance</span></div>
            </li>
            <li className="flex items-center space-x-3">
                <span className="flex items-center justify-center font-bold text-[#2C3E50] bg-[#D4C5B0]/50 border border-[#D4C5B0]/80 rounded w-6 h-6 text-xs shadow-sm">D</span>
                <div className="flex flex-col"><span className="text-[#2C3E50] text-xs font-bold">60 - 69</span><span className="text-[#5D6D7E] text-[10px]">Poor Compliance</span></div>
            </li>
            <li className="flex items-center space-x-3">
                <span className="flex items-center justify-center font-bold text-white bg-[#2C3E50] border border-[#2C3E50] rounded w-6 h-6 text-xs shadow-sm">F</span>
                <div className="flex flex-col"><span className="text-[#2C3E50] text-xs font-bold">&lt; 60</span><span className="text-[#5D6D7E] text-[10px]">Failing Compliance</span></div>
            </li>
        </ul>
    </div>
);

const JobCard: React.FC<{ jobId: string }> = ({ jobId }) => {
    const [status, setStatus] = useState<JobStatus | null>(null);
    const [results, setResults] = useState<JobResults | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showGradeGuide, setShowGradeGuide] = useState(false);

    useEffect(() => {
        let interval: any;

        const checkStatus = async () => {
            try {
                const data = await api.getStatus(jobId);
                setStatus(data);

                if (data.status === 'Completed' || data.status === 'Failed') {
                    clearInterval(interval);
                    if (data.status === 'Completed') {
                        api.getResults(jobId).then(setResults).catch(console.error);
                    }
                }
            } catch (e) {
                console.error("Failed to poll status", e);
            }
        };

        checkStatus();
        interval = setInterval(checkStatus, 3000);

        return () => clearInterval(interval);
    }, [jobId]);

    // Handle clicks to close the grade guide if clicking outside
    useEffect(() => {
        const handleClickOutside = () => setShowGradeGuide(false);
        if (showGradeGuide) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showGradeGuide]);

    if (!status) return (
        <Card>
            <div className="p-6 h-[250px] animate-pulse">
                <div className="h-4 bg-[#D4C5B0] rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-[#D4C5B0] rounded w-1/2"></div>
            </div>
        </Card>
    );

    const getStatusIcon = (s: string) => {
        if (s === 'Completed') return <div className="text-emerald-700 font-bold text-xs uppercase tracking-wider border border-emerald-600/20 bg-emerald-100 px-2 py-1 rounded shadow-sm">Passed</div>;
        if (s === 'Failed') return <div className="text-rose-700 font-bold text-xs uppercase tracking-wider border border-rose-600/20 bg-rose-100 px-2 py-1 rounded shadow-sm">Failed</div>;
        return <div className="text-blue-700 font-bold text-xs uppercase tracking-wider border border-blue-600/20 bg-blue-100 px-2 py-1 rounded animate-pulse shadow-sm">Running</div>;
    };

    let letterGrade = null;
    if (results && results.results.length > 0) {
        const avg = Math.round(results.results.reduce((acc, curr) => acc + curr.score, 0) / results.results.length);
        letterGrade = getLetterGrade(avg);
    }

    return (
        <>
            <Card onClick={() => status.status === 'Completed' && results ? setShowModal(true) : null}>
                <div className="flex flex-col h-full justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <CardTitle>
                                {results ? new URL(results.results[0].url).hostname : 'Running Audit...'}
                            </CardTitle>
                            
                            <div className="flex items-center space-x-2 relative">
                                {getStatusIcon(status.status)}
                            </div>
                        </div>
                        <CardDescription>
                            ID: {jobId.slice(0, 8)}
                            <br />
                            {status.progress || 'Initializing...'}
                        </CardDescription>
                    </div>

                    <div className="mt-8 transition-colors flex justify-between items-end relative">
                        <div>
                            {status.status === 'Completed' ? (
                                <span className="text-[#5D6D7E] group-hover:text-[#2C3E50] text-sm font-medium flex items-center transition-colors">
                                    View Full Report &rarr;
                                </span>
                            ) : (
                                <span className="text-[#95A5A6] text-sm font-medium">Processing...</span>
                            )}
                        </div>
                        
                        {status.status === 'Completed' && letterGrade && (
                            <div className="flex items-center space-x-1">
                                <div className={`font-bold text-sm uppercase tracking-wider border px-2 py-1 rounded shadow-sm ${letterGrade.color}`}>
                                    Grade: {letterGrade.grade}
                                </div>
                                <button 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        setShowGradeGuide(!showGradeGuide); 
                                    }}
                                    className="text-[#9DB68B] hover:text-[#2C3E50] transition-colors p-1 rounded-full hover:bg-black/5"
                                >
                                    <QuestionMarkCircleIcon className="w-5 h-5" />
                                </button>
                                {showGradeGuide && <GradeGuide onClose={() => setShowGradeGuide(false)} className="bottom-12 right-0" />}
                            </div>
                        )}
                    </div>
                </div>
            </Card>

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
                "rounded-2xl h-full w-full p-4 overflow-visible bg-[#F5F5DC] border border-[#D4C5B0] relative z-20 cursor-pointer shadow-sm hover:border-[#9DB68B] hover:shadow-md transition-all duration-200",
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
        <h4 className={cn("text-[#2C3E50] font-bold tracking-wide mt-4 truncate max-w-[150px]", className)}>
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
