import React, { useRef, useState } from 'react';

interface RadialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  baseColor?: string;
  glowColor?: string;
  glowSize?: number;
  icon?: React.ReactNode;
  animationSpeed?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function RadialButton({
  children,
  className = '',
  size = 'md',
  baseColor = 'bg-black/20',
  glowColor = 'rgba(255,255,255,0.25)',
  glowSize = 100,
  icon,
  animationSpeed = 300,
  ...props
}: RadialButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const sizeClasses = {
    sm: 'px-6 py-2 text-xs md:text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-full font-medium transition-all active:scale-95 ${baseColor} ${sizeClasses[size]} ${className}`}
      style={{ transitionDuration: `${animationSpeed}ms` }}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle ${glowSize}px at ${pos.x}px ${pos.y}px, ${glowColor}, transparent 100%)`,
          transitionDuration: `${animationSpeed}ms`,
        }}
      />
      <div className="relative z-10 flex items-center justify-center gap-2">
        {children}
        {icon && <span className="flex items-center">{icon}</span>}
      </div>
    </button>
  );
}
