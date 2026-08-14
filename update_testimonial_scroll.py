import re

with open('src/components/ui/testimonial.tsx', 'r') as f:
    content = f.read()

# 1. Update imports to include useEffect and useState
content = content.replace(
    'import { useRef } from "react";',
    'import { useRef, useEffect, useState } from "react";'
)

# 2. Add ref and state in the component
hook_logic = """
function ClientFeedback() {
    const testimonialRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      let animationFrameId: number;
      
      const scroll = () => {
        // Only scroll on mobile (when it has overflow and lg breakpoint is not active)
        if (!isPaused && window.innerWidth < 1024) {
          if (container.scrollWidth > container.clientWidth) {
            container.scrollLeft += 0.5;
            // loop back
            if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
              container.scrollLeft = 0;
            }
          }
        }
        animationFrameId = requestAnimationFrame(scroll);
      };

      animationFrameId = requestAnimationFrame(scroll);

      return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused]);
"""

content = content.replace(
    'function ClientFeedback() {\n    const testimonialRef = useRef<HTMLDivElement>(null);',
    hook_logic
)

# 3. Apply the ref and remove snap so scrolling is smooth
# Original: className="lg:grid lg:grid-cols-3 gap-4 grid grid-rows-2 grid-flow-col auto-cols-[85vw] sm:auto-cols-[300px] overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:grid-flow-row lg:grid-rows-none lg:auto-cols-auto w-full lg:py-10 pt-10 pb-8 lg:px-10 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
# Updated: remove snap-x snap-mandatory, add ref, add onClick to pause

content = content.replace(
    '<div className="lg:grid lg:grid-cols-3 gap-4 grid grid-rows-2 grid-flow-col auto-cols-[85vw] sm:auto-cols-[300px] overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:grid-flow-row lg:grid-rows-none lg:auto-cols-auto w-full lg:py-10 pt-10 pb-8 lg:px-10 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">',
    '<div ref={scrollContainerRef} onClick={() => setIsPaused(!isPaused)} className="lg:grid lg:grid-cols-3 gap-4 grid grid-rows-2 grid-flow-col auto-cols-[85vw] sm:auto-cols-[300px] overflow-x-auto lg:overflow-visible lg:grid-flow-row lg:grid-rows-none lg:auto-cols-auto w-full lg:py-10 pt-10 pb-8 lg:px-10 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">'
)

# 4. Remove snap-center from items so they scroll continuously
content = content.replace('w-full snap-center lg:w-auto', 'w-full lg:w-auto')

with open('src/components/ui/testimonial.tsx', 'w') as f:
    f.write(content)

print("Done updating script.")
