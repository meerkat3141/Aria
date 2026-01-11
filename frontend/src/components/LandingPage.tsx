import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, TrendingDownIcon, BrainIcon, GraphIcon, DocumentIcon } from './Icons';

interface Props {
    onGetStarted: () => void;
}

export const LandingPage: React.FC<Props> = ({ onGetStarted }) => {
    return (
        <div className="relative z-10 space-y-24 pb-20">
            <section className="text-center px-4 min-h-[90vh] flex flex-col justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#2C3E50] mb-6 tracking-tight">
                        Web Accessibility <br />
                        <span className="text-[#9DB68B]">Simplified by AI</span>
                    </h1>
                    <p className="text-xl text-[#5D6D7E] max-w-2xl mx-auto mb-10 font-sans">
                        Verifying website ADA compliance, through headless browsing, webscraping, and GenAI vision.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="px-8 py-4 bg-[#F5F5DC] text-[#2C3E50] rounded-md border-2 border-[#2C3E50] font-bold text-lg hover:shadow-[4px_4px_0px_0px_#2C3E50] hover:-translate-y-1 transition-all duration-200"
                    >
                        Start Compliance Audit
                    </button>
                </motion.div>
            </section>

            <section className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center bg-white/50 border border-[#D4C5B0] p-10 rounded-3xl backdrop-blur-sm">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-[#2C3E50]">Why It Matters</h2>
                        <p className="text-[#5D6D7E] text-lg leading-relaxed">
                            Website accessibility is not a privilege but a requirement. Despite ADA regulations to ensure accessibility across the web, numerous websites continue to violate these rules, and the web remains unnavigable for users with disabilities.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <div className="p-1 rounded bg-[#F5F5DC] mr-3">
                                    <ShieldCheckIcon className="w-5 h-5 text-[#2C3E50]" />
                                </div>
                                <span className="text-[#2C3E50] font-medium">Legal Risk: ADA lawsuits are rising year over year.</span>
                            </li>
                            <li className="flex items-start">
                                <div className="p-1 rounded bg-[#F5F5DC] mr-3">
                                    <TrendingDownIcon className="w-5 h-5 text-[#2C3E50]" />
                                </div>
                                <span className="text-[#2C3E50] font-medium">Lost Revenue: 71% of disabled users leave sites that are hard to use.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-[#2C3E50] p-8 rounded-2xl text-[#F5F5DC] text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#9DB68B]/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="relative z-10">
                            <div className="text-6xl font-black font-serif mb-2 text-[#9DB68B]">95.9%</div>
                            <p className="text-xl font-medium mb-4">of home pages have detected WCAG 2 failures.</p>
                            <p className="text-xs text-[#9DB68B]/80 uppercase tracking-widest font-bold">Source: WebAIM Million 2024</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold text-[#2C3E50] text-center mb-12">Powerful Capabilities</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<BrainIcon className="w-8 h-8 text-[#9DB68B]" />}
                        title="AI-Powered Analysis"
                        description="Uses GenAI to analyze website images as well as ARIA roles."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<GraphIcon className="w-8 h-8 text-[#9DB68B]" />}
                        title="Visual Graphing"
                        description="Provides interactive linkage maps for websites, to analyze site structure and accessibility."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<DocumentIcon className="w-8 h-8 text-[#9DB68B]" />}
                        title="PDF Reports"
                        description="Findings are summarized in PDF reports, readily available to submit to the website owners themselves or to report violations to ADA compliance organizations."
                        delay={0.3}
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="bg-white p-8 rounded-2xl border border-[#D4C5B0] shadow-sm hover:shadow-xl hover:border-[#9DB68B] transition-all duration-300 group"
    >
        <div className="mb-6 bg-[#F5F5DC] w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-[#D4C5B0]">{icon}</div>
        <h3 className="text-xl font-bold text-[#2C3E50] mb-3 font-serif">{title}</h3>
        <p className="text-[#5D6D7E] text-sm leading-relaxed">{description}</p>
    </motion.div>
);
