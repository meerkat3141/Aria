import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    onGetStarted: () => void;
}

export const LandingPage: React.FC<Props> = ({ onGetStarted }) => {
    return (
        <div className="relative z-10 space-y-24 pb-20">
            {/* Hero Section */}
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
                        Automated audits, intelligent remediation suggestions, and comprehensive reporting to ensure your digital presence is inclusive for everyone.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="px-8 py-4 bg-[#F5F5DC] text-[#2C3E50] rounded-md border-2 border-[#2C3E50] font-bold text-lg hover:shadow-[4px_4px_0px_0px_#2C3E50] hover:-translate-y-1 transition-all duration-200"
                    >
                        Start Compliance Audit
                    </button>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center bg-white/50 border border-[#D4C5B0] p-10 rounded-3xl backdrop-blur-sm">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-[#2C3E50]">Why It Matters</h2>
                        <p className="text-[#5D6D7E] text-lg leading-relaxed">
                            Digital accessibility isn't just a legal requirement—it's a moral imperative. Yet, the vast majority of the web remains inaccessible to users with disabilities.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <div className="p-1 rounded bg-[#F5F5DC] mr-3">
                                    <svg className="w-5 h-5 text-[#2C3E50]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <span className="text-[#2C3E50] font-medium">Legal Risk: ADA lawsuits are rising year over year.</span>
                            </li>
                            <li className="flex items-start">
                                <div className="p-1 rounded bg-[#F5F5DC] mr-3">
                                    <svg className="w-5 h-5 text-[#2C3E50]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
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

            {/* Features (Bento Grid Style) */}
            <section className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold text-[#2C3E50] text-center mb-12">Powerful Capabilities</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<svg className="w-8 h-8 text-[#9DB68B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        title="AI-Powered Analysis"
                        description="Uses Google Gemini to semantically understand images and ARIA roles, going beyond simple rule checking."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<svg className="w-8 h-8 text-[#9DB68B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
                        title="Visual Graphing"
                        description="Interactive node graphs visualize your site's structure and accessibility score distribution."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<svg className="w-8 h-8 text-[#9DB68B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                        title="PDF Reports"
                        description="Generate professional, detailed PDF reports ready for your compliance team or developers."
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
