import { motion } from "motion/react";
import React from "react";

export const TimelineContent = ({
  children,
  className,
  animationNum = 0,
  customVariants,
  as = "div",
  timelineRef,
}: any) => {
  const Component = (motion as any)[as] || motion.div;
  
  return (
    <Component
      className={className}
      custom={animationNum}
      variants={customVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </Component>
  );
};
