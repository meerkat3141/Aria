import React, { useState } from 'react';
import { SpinnerIcon } from './Icons';

interface Props {
    onAuditStart: (urls: string[], enableAi: boolean) => void;
    isLoading: boolean;
}

export const AuditForm: React.FC<Props> = ({ onAuditStart, isLoading }) => {
    const [text, setText] = useState('');
    const [enableAi, setEnableAi] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        const urls = text.split(/[\n,]+/)
            .map(u => u.trim())
            .filter(u => u.length > 0)
            .map(u => u.startsWith('http') ? u : `https://${u}`);

        if (urls.length === 0) return;

        onAuditStart(urls, enableAi);
    };

    return (
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-[#9DB68B] rounded-2xl opacity-20 group-hover:opacity-40 transition duration-1000 blur"></div>
            <div className="relative bg-[#F5F5DC] border border-[#D4C5B0] rounded-2xl p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[#2C3E50] text-sm font-bold mb-3 tracking-wide">
                            TARGET URLS
                        </label>
                        <textarea
                            className="w-full h-40 bg-white text-[#2C3E50] border border-[#D4C5B0] rounded-xl p-4 focus:outline-none focus:border-[#9DB68B] focus:ring-1 focus:ring-[#9DB68B] transition-all font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-[#9DB68B]/50"
                            placeholder="example.com&#10;plantpico.com"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <p className="mt-2 text-xs text-[#5D6D7E]">Supports multiple lines or comma-separated values.</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#D4C5B0]">
                        <label className="flex items-center cursor-pointer group/toggle">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={enableAi} onChange={e => setEnableAi(e.target.checked)} />
                                <div className={`block w-12 h-7 rounded-full transition-all duration-300 ${enableAi ? 'bg-[#9DB68B]/50 ring-1 ring-[#9DB68B]' : 'bg-gray-300 ring-1 ring-gray-400'}`}></div>
                                <div className={`absolute left-1 top-1 w-5 h-5 rounded-full transition-transform duration-300 shadow-md ${enableAi ? 'translate-x-5 bg-[#2E7D32]' : 'bg-white'}`}></div>
                            </div>
                            <div className="ml-4">
                                <div className={`text-sm font-medium transition-colors ${enableAi ? 'text-[#2E7D32]' : 'text-[#7F8C8D]'}`}>AI Analysis</div>
                                <div className="text-xs text-[#5D6D7E]">Deep semantic checks (Alt Text, ARIA)</div>
                            </div>
                        </label>

                        <button
                            type="submit"
                            disabled={isLoading || !text.trim()}
                            className={`px-8 py-3 rounded-md font-bold text-[#2C3E50] border-2 border-[#2C3E50] transition-all duration-200 flex items-center space-x-2 ${isLoading
                                ? 'bg-gray-200 cursor-not-allowed opacity-50'
                                : 'bg-[#F5F5DC] hover:shadow-[4px_4px_0px_0px_#2C3E50] hover:-translate-y-1 active:translate-y-0 active:shadow-none'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#2C3E50]" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <span>Start Audit</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
