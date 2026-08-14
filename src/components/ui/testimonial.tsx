import { TimelineContent } from "./timeline-animation";
import { useRef, useEffect, useState } from "react";
import { Star } from "lucide-react";


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

  
    const revealVariants = {
      visible: (i: number) => ({
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: {
          delay: i * 0.2,
          duration: 0.5,
        },
      }),
      hidden: {
        filter: "blur(10px)",
        y: -20,
        opacity: 0,
      },
    };
  
  return (
    <main className="w-full bg-white font-sans" id="testimonials">
      <section className="relative h-full container text-black mx-auto rounded-lg py-14 bg-white" ref={testimonialRef}>
        <article className={"max-w-screen-md mx-auto text-center space-y-2 "} >
          <TimelineContent as="h1" className={"xl:text-4xl text-3xl font-display font-medium"} animationNum={0} customVariants={revealVariants} timelineRef={testimonialRef}>
            Trusted by Startups and the worlds's largest companies
          </TimelineContent>
          <TimelineContent as="p" className={"mx-auto text-gray-500"} animationNum={1} customVariants={revealVariants} timelineRef={testimonialRef}>
            Let's hear how Elden Web client's feels about our service
          </TimelineContent>
        </article>
        <div ref={scrollContainerRef} onClick={() => setIsPaused(!isPaused)} className="lg:grid lg:grid-cols-3 gap-4 grid grid-rows-2 grid-flow-col auto-cols-[85vw] sm:auto-cols-[300px] overflow-x-auto lg:overflow-visible lg:grid-flow-row lg:grid-rows-none lg:auto-cols-auto w-full lg:py-10 pt-10 pb-8 lg:px-10 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="contents lg:flex lg:flex-col lg:space-y-2 h-full lg:gap-0">
            <TimelineContent animationNum={0} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[7] flex-[6] flex flex-col justify-between relative bg-zinc-100 w-full lg:w-auto overflow-hidden rounded-lg border border-gray-200 p-5">
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:50px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
              <article className="mt-auto relative z-10">
                <p>
                  "Elden Web has been a game-changer for us. Their service is
                  top-notch and their team is incredibly responsive."
                </p>
                <div className="flex justify-between pt-5">
                  <div>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </TimelineContent>
            <TimelineContent animationNum={1} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[3] flex-[4] lg:h-fit lg:shrink-0 flex flex-col justify-between relative bg-blue-600 text-white w-full lg:w-auto overflow-hidden rounded-lg border border-gray-200 p-5">
              <article className="mt-auto">
                <p>
                  "We've seen incredible results with Elden Web. Their
                  expertise, dedication."
                </p>
                <div className="flex justify-between pt-5">
                  <div>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </TimelineContent>
          </div>
          <div className="contents lg:flex lg:flex-col lg:space-y-2 lg:gap-0">
            <TimelineContent animationNum={2} customVariants={revealVariants} timelineRef={testimonialRef} className="flex flex-col justify-between relative bg-[#111111] text-white w-full lg:w-auto overflow-hidden rounded-lg border border-gray-200 p-5">
              <article className="mt-auto">
                <p className="2xl:text-base text-sm">
                  "Their team is highly professional, and their innovative
                  solutions have truly transformed the way we operate."
                </p>
                <div className="flex justify-between items-end pt-5">
                  <div>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </TimelineContent>
            <TimelineContent animationNum={3} customVariants={revealVariants} timelineRef={testimonialRef} className="flex flex-col justify-between relative bg-[#111111] text-white w-full lg:w-auto overflow-hidden rounded-lg border border-gray-200 p-5">
              <article className="mt-auto">
                <p className="2xl:text-base text-sm">
                  "We're extremely satisfied with Elden Web. Their expertise
                  and dedication have exceeded our expectations."
                </p>
                <div className="flex justify-between items-end pt-5">
                  <div>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </TimelineContent>
            <TimelineContent animationNum={4} customVariants={revealVariants} timelineRef={testimonialRef} className="flex flex-col justify-between relative bg-[#111111] text-white w-full lg:w-auto overflow-hidden rounded-lg border border-gray-200 p-5">
              <article className="mt-auto">
                <p className="2xl:text-base text-sm">
                  "Their customer support is absolutely exceptional. They are
                  always available, incredibly helpful."
                </p>
                <div className="flex justify-between items-end pt-5">
                  <div>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </TimelineContent>
          </div>
          <div className="contents lg:flex lg:flex-col lg:space-y-2 lg:gap-0">
            <TimelineContent animationNum={5} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[3] flex-[4] flex flex-col justify-between relative bg-blue-600 text-white w-full lg:w-auto overflow-hidden rounded-lg border border-gray-200 p-5">
              <article className="mt-auto">
                <p>
                  "Elden Web has been a key partner in our growth journey."
                </p>
                <div className="flex justify-between pt-5">
                  <div>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </TimelineContent>
            <TimelineContent animationNum={6} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[7] flex-[6] flex flex-col justify-between relative bg-zinc-100 w-full lg:w-auto overflow-hidden rounded-lg border border-gray-200 p-5">
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:50px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
              <article className="mt-auto relative z-10">
                <p>
                  "Elden Web has been a true game-changer for us. Their
                  exceptional service, combined with their deep expertise and
                  commitment to excellence, has made a significant impact on our
                  business."
                </p>
                <div className="flex justify-between pt-5">
                  <div>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </TimelineContent>
          </div>
        </div>

        <div className="absolute border-b-2 border-[#e6e6e6] bottom-4 h-16 z-[2] md:w-full w-[90%] md:left-0 left-[5%]">
          <div className="container mx-auto w-full h-full relative before:absolute before:-left-2 before:-bottom-2 before:w-4 before:h-4 before:bg-white before:shadow-sm before:border before:border-gray-300 after:absolute after:-right-2 after:-bottom-2 after:w-4 after:h-4 after:bg-white after:shadow-sm after:border after:border-gray-300"></div>
        </div>
      </section>
    </main>
  );
}

export default ClientFeedback;
