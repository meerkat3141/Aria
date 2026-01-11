import React from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const BackgroundLines = ({
    children,
    className,
    svgOptions,
}: {
    children?: React.ReactNode;
    className?: string;
    svgOptions?: {
        duration?: number;
    };
}) => {
    return (
        <div
            className={cn(
                "h-full w-full bg-[#EADCC9] flex flex-col justify-center items-center relative overflow-hidden",
                className
            )}
        >
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <SVG svgOptions={svgOptions} />
            </div>
            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
};

const SVG = ({
    svgOptions,
}: {
    svgOptions?: {
        duration?: number;
    };
}) => {
    const paths = [
        "M-100 100 C 100 200, 300 0, 500 100 C 700 200, 900 0, 1100 100",
        "M-100 200 C 100 300, 300 100, 500 200 C 700 300, 900 100, 1100 200",
        "M-100 300 C 100 400, 300 200, 500 300 C 700 400, 900 200, 1100 300",
        "M-100 400 C 100 500, 300 300, 500 400 C 700 500, 900 300, 1100 400",
        "M-100 500 C 100 600, 300 400, 500 500 C 700 600, 900 400, 1100 500",

        "M-100 0 C 0 200, 500 400, 1000 600",
        "M0 -100 C 100 100, 400 500, 800 800",
        "M200 -100 C 300 100, 600 500, 1000 800",
    ];

    const colors = [
        "#9DB68B",
        "#D4C5B0",
        "#2C3E50",
        "#8CA87A",
        "#9DB68B",
        "#D4C5B0",
        "#2C3E50",
        "#8CA87A",
    ];

    return (
        <svg
            viewBox="0 0 1000 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full opacity-30"
            preserveAspectRatio="none"
        >
            {paths.map((path, idx) => (
                <motion.path
                    key={idx}
                    d={path}
                    stroke={colors[idx % colors.length]}
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: [0, 1, 1],
                        opacity: [0, 1, 0.5],
                        pathOffset: [0, 0, 1],
                        strokeDasharray: ["10 10", "0 0", "10 10"]
                    }}
                    transition={{
                        duration: svgOptions?.duration || 10 + Math.random() * 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: Math.random() * 5,
                    }}
                />
            ))}

            {Array.from({ length: 20 }).map((_, i) => (
                <motion.circle
                    key={`circle-${i}`}
                    r={Math.random() * 3 + 1}
                    fill={colors[i % colors.length]}
                    initial={{
                        cx: Math.random() * 1000,
                        cy: Math.random() * 600,
                        opacity: 0
                    }}
                    animate={{
                        cy: [null, Math.random() * 600],
                        cx: [null, Math.random() * 1000],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}
        </svg>
    );
};
