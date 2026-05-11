import React from 'react';
import type { JobResults } from '../types';
import { api } from '../services/api';
import { AuditGraph } from './AuditGraph';
import { DownloadIcon, CloseIcon, QuestionMarkCircleIcon } from './Icons';
import { getLetterGrade, GradeGuide } from './AuditList';
import { useState, useEffect } from 'react';

interface Props {
    jobId: string;
    results: JobResults;
    onClose: () => void;
}

// Modal displaying detailed compliance results and site graph for a completed audit job
export const DetailsModal: React.FC<Props> = ({ jobId, results, onClose }) => {
    const [showGradeGuide, setShowGradeGuide] = useState(false);
    
    useEffect(() => {
        const handleClickOutside = () => setShowGradeGuide(false);
        if (showGradeGuide) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showGradeGuide]);

    const avg = Math.round(results.results.reduce((acc, curr) => acc + curr.score, 0) / results.results.length);
    const letterGrade = getLetterGrade(avg);

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 pb-4 px-4">
            <div
                className="absolute inset-0"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-6xl max-h-[80vh] bg-[#F5F5DC] border border-[#D4C5B0] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                <div className="flex items-center justify-between p-6 border-b border-[#D4C5B0]">
                    <div className="flex items-center space-x-6">
                        <div>
                            <h2 className="text-2xl font-bold text-[#2C3E50] tracking-tight font-serif">Audit Details</h2>
                            <p className="text-[#5D6D7E] font-mono text-sm mt-1">Job ID: {jobId}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 relative border-l-2 border-[#D4C5B0] pl-6 h-full">
                            <div className={`font-bold text-lg uppercase tracking-wider border px-3 py-1.5 rounded-lg shadow-sm ${letterGrade.color}`}>
                                Grade: {letterGrade.grade}
                            </div>
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setShowGradeGuide(!showGradeGuide); 
                                }}
                                className="text-[#9DB68B] hover:text-[#2C3E50] transition-colors p-1 rounded-full hover:bg-black/5"
                            >
                                <QuestionMarkCircleIcon className="w-6 h-6" />
                            </button>
                            {showGradeGuide && (
                                <div className="absolute top-14 left-0 z-[110]">
                                    <GradeGuide onClose={() => setShowGradeGuide(false)} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a
                            href={api.getReportUrl(jobId)}
                            download
                            className="px-4 py-2 bg-[#F5F5DC] text-[#2C3E50] border-2 border-[#2C3E50] rounded-md text-sm flex items-center transition-all font-bold hover:shadow-[4px_4px_0px_0px_#2C3E50] hover:-translate-y-1 active:translate-y-0 active:shadow-none"
                        >
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            Download PDF
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 bg-[#F5F5DC] border-2 border-[#2C3E50] rounded-md text-[#2C3E50] transition-all hover:shadow-[4px_4px_0px_0px_#2C3E50] hover:-translate-y-1 active:translate-y-0 active:shadow-none"
                            aria-label="Close details"
                        >
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                    {results.graph_data && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#2C3E50]">Site Structure & Scores</h3>
                            <AuditGraph data={results} />
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#2C3E50]">Page Results</h3>
                        <div className="grid gap-3">
                            {results.results.map((page, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white border border-[#D4C5B0] p-4 rounded-lg hover:border-[#9DB68B] transition-colors">
                                    <code className="text-[#2C3E50] text-sm truncate w-2/3" title={page.url}>{page.url}</code>
                                    <div className="flex items-center space-x-4">
                                        <div className={`px-3 py-1 rounded bg-black/5 border border-black/10 font-mono font-bold ${page.score >= 90 ? 'text-emerald-700' : page.score >= 70 ? 'text-amber-700' : 'text-rose-700'}`}>
                                            {page.score}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
