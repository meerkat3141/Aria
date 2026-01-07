import React, { useRef, useEffect } from 'react';

interface AntigravityProps {
    particleCount?: number;
    particleSize?: number;
    speed?: number;
    hoverEffect?: boolean;
    color?: string;
}

export const Antigravity: React.FC<AntigravityProps> = ({
    particleCount = 100,
    particleSize = 2,
    speed = 0.5,
    hoverEffect = true,
    color = '#9DB68B'
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        class Particle {
            x: number;
            y: number;
            size: number;
            speedY: number;
            speedX: number;
            originalSpeedY: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * particleSize + 1;
                this.speedY = Math.random() * speed + 0.2;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.originalSpeedY = this.speedY;
            }

            update(mouseX: number, mouseY: number) {
                this.y -= this.speedY;
                this.x += this.speedX;

                // Reset on edges
                if (this.y < 0) this.y = height;
                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;

                // Mouse Interaction (Antigravity field)
                if (hoverEffect) {
                    const dx = this.x - mouseX;
                    const dy = this.y - mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const maxDistance = 150;
                    const force = (maxDistance - distance) / maxDistance;

                    if (distance < maxDistance) {
                        this.x += forceDirectionX * force * 2;
                        this.y += forceDirectionY * force * 2;
                    }
                }
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        let mouseX = 0;
        let mouseY = 0;

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update(mouseX, mouseY);
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [particleCount, particleSize, speed, hoverEffect, color]);

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" />;
};
