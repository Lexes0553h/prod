import React from 'react';
import { motion } from 'motion/react';

interface StarflowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

const Sparkle = ({ className, delay = 0, size = 14 }: { className?: string, delay?: number, size?: number }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute pointer-events-none mix-blend-difference z-20 ${className}`}
    initial={{ scale: 0, rotate: 0, opacity: 0 }}
    variants={{
      hover: {
        scale: [0, 1, 0.8, 1, 0],
        rotate: [0, 90, 180],
        opacity: [0, 1, 1, 0],
        transition: { duration: 2, repeat: Infinity, delay, ease: "easeInOut" }
      }
    }}
  >
    <path
      d="M 5 0 L 5.354 4.646 L 10 5 L 5.354 5.354 L 5 10 L 4.646 5.354 L 0 5 L 4.646 4.646 Z"
      fill="white"
    />
  </motion.svg>
);

export default function StarflowButton({ children, className = '', ...props }: StarflowButtonProps) {
  return (
    <motion.button
      whileHover="hover"
      initial="initial"
      className={`group relative overflow-hidden text-white px-8 py-3 md:px-12 md:py-4 rounded-full font-medium transition-all duration-300 active:scale-95 flex items-center justify-center ${className}`}
      {...props}
    >
      {/* Animated glowing border/flow */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        variants={{
          hover: { opacity: 1 },
          initial: { opacity: 0 }
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[200%] h-full -skew-x-12"
          variants={{
            hover: {
              x: ['-100%', '100%'],
              transition: { duration: 1.5, repeat: Infinity, ease: 'linear' }
            }
          }}
        />
      </motion.div>

      {/* Background fill transition */}
      <motion.div
        className="absolute inset-0 z-0 bg-white pointer-events-none rounded-full origin-center"
        variants={{
          initial: { scale: 0, opacity: 0 },
          hover: { scale: 1, opacity: 0.1 } // Just a subtle lighten on hover
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Sparkles */}
      <Sparkle className="top-[10%] left-[15%]" size={10} delay={0} />
      <Sparkle className="bottom-[15%] left-[30%]" size={6} delay={0.6} />
      <Sparkle className="top-[20%] right-[30%]" size={8} delay={0.3} />
      <Sparkle className="bottom-[10%] right-[15%]" size={12} delay={0.9} />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
