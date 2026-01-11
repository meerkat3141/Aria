import { useRef, useEffect, useState } from 'react';

interface SquaresProps {
    direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
    speed?: number;
    borderColor?: string;
    squareSize?: number;
    hoverFillColor?: string;
    className?: string;
}

export const Squares: React.FC<SquaresProps> = ({
    direction = 'right',
    speed = 1,
    borderColor = '#333',
    squareSize = 40,
    hoverFillColor = '#222',
    className,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);
    const numSquaresX = useRef<number>(0);
    const numSquaresY = useRef<number>(0);
    const gridOffset = useRef({ x: 0, y: 0 });
    const [hoveredSquare, setHoveredSquare] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
            numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const drawGrid = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const offsetX = gridOffset.current.x % squareSize;
            const offsetY = gridOffset.current.y % squareSize;

            for (let x = 0; x < numSquaresX.current; x++) {
                for (let y = 0; y < numSquaresY.current; y++) {
                    const squareX = x * squareSize - offsetX;
                    const squareY = y * squareSize - offsetY;

                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(squareX, squareY, squareSize, squareSize);

                    if (hoveredSquare) {
                        if (
                            hoveredSquare.x >= squareX &&
                            hoveredSquare.x < squareX + squareSize &&
                            hoveredSquare.y >= squareY &&
                            hoveredSquare.y < squareY + squareSize
                        ) {
                            ctx.fillStyle = hoverFillColor;
                            ctx.fillRect(squareX, squareY, squareSize, squareSize);
                        }
                    }
                }
            }
        };

        const updateGrid = () => {
            switch (direction) {
                case 'right':
                    gridOffset.current.x = (gridOffset.current.x - speed + squareSize) % squareSize;
                    break;
                case 'left':
                    gridOffset.current.x = (gridOffset.current.x + speed + squareSize) % squareSize;
                    break;
                case 'down':
                    gridOffset.current.y = (gridOffset.current.y - speed + squareSize) % squareSize;
                    break;
                case 'up':
                    gridOffset.current.y = (gridOffset.current.y + speed + squareSize) % squareSize;
                    break;
                case 'diagonal':
                    gridOffset.current.x = (gridOffset.current.x - speed + squareSize) % squareSize;
                    gridOffset.current.y = (gridOffset.current.y - speed + squareSize) % squareSize;
                    break;
            }

            drawGrid();
            requestRef.current = requestAnimationFrame(updateGrid);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setHoveredSquare({ x, y });
        };

        const handleMouseLeave = () => {
            setHoveredSquare(null);
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        requestRef.current = requestAnimationFrame(updateGrid);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [direction, speed, borderColor, hoverFillColor, hoveredSquare, squareSize]);

    return <canvas ref={canvasRef} className={`w-full h-full border-none block ${className}`} />;
};
