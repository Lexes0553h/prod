/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { ArrowRight, Code, ExternalLink, Globe, Layout, Menu, Smartphone, Sparkles, Star, X, Mail, Phone } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import AsciiFlowTrail from './components/AsciiFlowTrail';
import RadialButton from './components/RadialButton';
import { LiquidButton } from './components/ui/liquid-glass-button';
import { TextRotator } from './components/ui/text-rotator';

import StarflowButton from './components/StarflowButton';

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4";

const SENSITIVITY = 0.8;

/**
 * Drives a <video>'s currentTime forward/backward based on horizontal
 * mouse movement, giving a "scrubbable" background effect.
 */
function useMouseScrubVideo(videoRef: React.RefObject<HTMLVideoElement>) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let prevX: number | null = null;
    let targetTime = video.currentTime;
    let currentRenderTime = video.currentTime;
    let seeking = false;
    let animationFrameId: number;
    let isVisible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          isVisible = entries[0].isIntersecting;
          if (isVisible) {
            prevX = null;
            targetTime = video.currentTime;
            currentRenderTime = video.currentTime;
            loop();
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        }
      },
      { threshold: 0 }
    );
    observer.observe(video);

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) return;
      if (!video.duration || Number.isNaN(video.duration)) return;

      if (prevX === null) {
        prevX = e.clientX;
        targetTime = video.currentTime;
        currentRenderTime = video.currentTime;
        return;
      }

      const delta = e.clientX - prevX;
      prevX = e.clientX;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTime = clamp(targetTime + timeOffset, 0, video.duration);
    };

    const loop = () => {
      if (!isVisible) return;
      
      if (video.duration && !Number.isNaN(video.duration)) {
        // Smoothly interpolate towards the target time
        currentRenderTime += (targetTime - currentRenderTime) * 0.08;
        
        // Only set currentTime if not currently seeking and difference is significant
        if (!seeking && Math.abs(video.currentTime - currentRenderTime) > 0.02) {
          seeking = true;
          video.currentTime = currentRenderTime;
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    const handleSeeked = () => {
      seeking = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      video.removeEventListener("seeked", handleSeeked);
      cancelAnimationFrame(animationFrameId);
    };
  }, [videoRef]);
}

function VideoScrubBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useMouseScrubVideo(videoRef);

  return (
    <video
      ref={videoRef}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ objectPosition: "70% center", zIndex: 0 }}
    />
  );
}

function AboutVideoSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white">
      <VideoScrubBackground />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
        <ScrollBlurText as="div" className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-sm font-medium tracking-wide mb-8">
          The Elden Web Standard
        </ScrollBlurText>
        <ScrollBlurText as="h2" className="text-4xl md:text-5xl lg:text-7xl font-display font-normal mb-8 leading-[1.1]">
          Fluidity in <span className="italic text-white/90">Motion</span>
        </ScrollBlurText>
        <ScrollBlurText as="p" delay={0.2} className="text-xl md:text-3xl text-zinc-300 max-w-3xl mx-auto font-garamond font-light leading-relaxed">
          We craft digital experiences where every interaction feels completely natural. Seamless transitions, intuitive architecture, and breathtaking aesthetics designed to convert.
        </ScrollBlurText>
      </div>
    </section>
  );
}

function ScrollBlurText({ children, as: Component = 'div', className = '', delay = 0 }: any) {
  const MotionComponent = motion[Component as keyof typeof motion] || motion.div;
  return (
    <MotionComponent
      initial={{ opacity: 0.5, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

const NAV_LINKS = [
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Testimonials', href: '#testimonials' }
];

const SERVICES = [
  {
    num: "01",
    title: "Custom Website Design",
    description: "We design clean, conversion-focused websites tailored to your brand — built to make every visitor feel like they landed in exactly the right place."
  },
  {
    num: "02",
    title: "3D & Immersive Websites",
    description: "Stand apart with depth. We craft interactive 3D web experiences that captivate, engage, and leave a lasting impression on anyone who visits."
  },
  {
    num: "03",
    title: "Portfolio Websites",
    description: "Whether you're a creative, agency, or freelancer, we build portfolio sites that showcase your work with elegance and purpose."
  },
  {
    num: "04",
    title: "Business & Landing Pages",
    description: "From service pages to lead-gen funnels, we create business-focused websites designed to turn visitors into paying clients."
  },
  {
    num: "05",
    title: "E-commerce Stores",
    description: "We build online stores that look great and sell better — with smooth navigation, trust-building design, and optimized checkout flows."
  }
];

const PORTFOLIO = [
  {
    id: 1,
    title: 'Aero Dynamics',
    category: 'E-Commerce Platform',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
    tags: ['Next.js', 'Stripe', 'Framer Motion']
  },
  {
    id: 2,
    title: 'Nexus AI',
    category: 'SaaS Landing Page',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
    tags: ['React', 'Tailwind', 'Three.js']
  },
  {
    id: 3,
    title: 'Lumina Tech',
    category: 'Corporate Business Site',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2676&auto=format&fit=crop',
    tags: ['Web Design', 'SEO', 'CMS']
  },
  {
    id: 4,
    title: 'Vanguard Capital',
    category: 'Fintech Application',
    image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2670&auto=format&fit=crop',
    tags: ['UI/UX', 'Dashboard', 'React']
  }
];

const TESTIMONIALS = [
  {
    name: 'Sarah Jenkins',
    role: 'CEO, TechFlow',
    text: 'Elden Web delivered the best website design we have ever had. The premium glass UI and colorful effects completely transformed our brand image. Award-winning quality!',
    rating: 5
  },
  {
    name: 'Marcus Chen',
    role: 'Founder, Elevate',
    text: 'Their high-performance web development and SEO strategies doubled our organic traffic. If you want a top-tier modern website, Elden Web is the best agency out there.',
    rating: 5
  },
  {
    name: 'Elena Rodriguez',
    role: 'CMO, StyleCo',
    text: 'We asked for a moving, vibrant website, and they overdelivered. The subtle 2px glow effects and smooth animations make our site feel like a high-end app.',
    rating: 5
  }
];

// @ts-ignore
const LUMORA_VIDEOS = [
  {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4",
    label: "Golden Hour",
  },
  {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4",
    label: "Still Water",
  },
  {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4",
    label: "Deep Woods",
  },
  {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4",
    label: "Quiet Dawn",
  },
];

function LumoraHero() {
  const [activeVideo, setActiveVideo] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const handleVideoSwitch = (index: number) => {
    if (index === activeVideo || isTransitioning) return;
    setActiveVideo(index);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const isDark = activeVideo === 2;
  const textColor = isDark ? 'text-[#182C41]' : 'text-white';
  const bgColor = isDark ? 'bg-[#182C41]' : 'bg-white';

  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col bg-black font-sans">
      {/* Video layer */}
      {LUMORA_VIDEOS.map((video, index) => (
        <video
          key={video.src}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === activeVideo ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={video.src} type="video/mp4" />
        </video>
      ))}

      {/* Content Layer (z-index 2) */}
      <div className="relative z-[2] flex-1 flex flex-col pt-4 pb-4 px-4 sm:pt-6 sm:pb-6 sm:px-12">
        {/* Navigation */}
        <motion.nav 
          variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: -100, opacity: 0 } }}
          animate={hidden ? "hidden" : "visible"}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 lg:left-12 lg:right-12 z-50 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0"
        >
          <div className={`self-start md:self-auto font-display italic text-black text-xl sm:text-2xl px-6 py-2 sm:px-6 sm:py-2.5 rounded-full inline-flex items-center justify-center transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg shadow-black/5' : 'liquid-glass'}`}>
            Elden Web
          </div>
          
          {/* Nav */}
          <div className={`flex items-center rounded-full p-1 sm:p-1.5 pl-3 sm:pl-6 gap-3 sm:gap-6 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full md:w-auto text-xs sm:text-sm font-medium font-sans transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg shadow-black/5 text-black' : 'liquid-glass text-white/90'}`}>
            <a href="#services" className="hover:opacity-70 transition-colors snap-center whitespace-nowrap shrink-0">Services</a>
            <a href="#portfolio" className="hover:opacity-70 transition-colors snap-center whitespace-nowrap shrink-0">Portfolio</a>
            <a href="#testimonials" className="hover:opacity-70 transition-colors snap-center whitespace-nowrap shrink-0">Testimonials</a>
            <RadialButton 
              size="sm" 
              baseColor={scrolled ? "bg-black" : "bg-white"}
              glowColor="rgba(0,0,0,0.15)" 
              className={`${scrolled ? 'text-white hover:bg-black/90' : 'text-black hover:bg-white/90'} shadow-lg font-sans snap-center shrink-0 ml-auto md:ml-2 !px-3 !py-1.5 sm:!px-6 sm:!py-2`}
              onClick={scrollToContact}
            >
              Get Started
            </RadialButton>
          </div>
        </motion.nav>

        {/* Hero Content (Centered) */}
        <div className={`flex-1 flex flex-col justify-center items-center text-center transition-colors duration-700 ${textColor} pt-40 md:pt-24 pb-8`}>
          <ScrollBlurText as="h1" className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] max-w-4xl mb-6">
            Crafting Premium<br/>Digital Experiences
          </ScrollBlurText>
          
          <LiquidButton className={`max-w-xl w-full h-auto mb-10 p-0 !whitespace-normal rounded-2xl [&>div.rounded-full]:rounded-2xl ${isDark ? 'text-[#0C0C0C]' : 'text-white'}`}>
            <ScrollBlurText as="div" delay={0.2} className="text-lg sm:text-xl md:text-2xl leading-relaxed font-display px-6 py-6 text-center">
              Elden Web is a top-tier digital agency specializing in immersive, high-performance websites and modern interactive experiences that elevate your brand and drive growth.
            </ScrollBlurText>
          </LiquidButton>
          
          <RadialButton 
            size="lg"
            baseColor={bgColor}
            glowColor={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.15)'}
            className={`font-sans whitespace-nowrap mb-12 shadow-xl hover:scale-105 active:scale-95 ${isDark ? 'text-white hover:bg-black' : 'text-black hover:bg-white/90'}`}
            onClick={scrollToContact}
          >
            Contact Us
          </RadialButton>
          
          {/* Video Switcher */}
          <div className="flex flex-col items-center gap-3 w-full">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] opacity-60 font-medium">Change Background</span>
            <div className="flex gap-4 sm:gap-6 flex-nowrap overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full max-w-[90vw] sm:max-w-none justify-start sm:justify-center font-sans px-4 sm:px-0">
              {LUMORA_VIDEOS.map((vid, idx) => {
                const isActive = idx === activeVideo;
                return (
                  <button 
                    key={idx}
                    onClick={() => handleVideoSwitch(idx)}
                    className={`snap-center shrink-0 text-xs sm:text-sm font-medium pb-1 border-b-2 transition-all duration-700 ${
                      isActive ? 'border-current opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    {vid.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>


      </div>


    </section>
  );
}

const FEATURES = [
  {
    title: "Tailored Digital Solutions",
    description: "Custom-built websites designed around your business and goals."
  },
  {
    title: "Immersive 3D Experiences",
    description: "Engaging 3D websites that make your brand stand out."
  },
  {
    title: "Seamless on Every Screen",
    description: "Fully responsive websites that look great on mobile, tablet, and desktop."
  },
  {
    title: "Built to Rank Higher",
    description: "SEO-focused websites designed to improve visibility and attract more visitors."
  }
];

function RadialFeatureCard({ feature, delay }: { feature: typeof FEATURES[0], delay: number, key?: string | number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    setPos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
    setIsActive(true);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={() => setIsActive(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      whileTap={{ scale: 0.96 }}
      className="bg-[#F9F9F9] border border-[#0C0C0C1A] rounded-3xl p-8 sm:p-10 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group cursor-pointer select-none"
    >
      <div 
        className="absolute bg-[#0C0C0C] rounded-full pointer-events-none transition-transform duration-700 ease-out z-0"
        style={{
          left: pos.x,
          top: pos.y,
          width: '1200px',
          height: '1200px',
          transform: `translate(-50%, -50%) scale(${isActive ? 1 : 0})`,
        }}
      />
      
      <div className="relative z-10 flex flex-col gap-4">
        <ScrollBlurText as="h3" delay={0.2} className="text-2xl font-display font-normal text-[#0C0C0C] group-hover:text-white transition-colors duration-300">
          {feature.title}
        </ScrollBlurText>
        <ScrollBlurText as="p" delay={0.3} className="text-[#0C0C0C] group-hover:text-white opacity-70 group-hover:opacity-90 font-sans leading-relaxed text-lg transition-colors duration-300">
          {feature.description}
        </ScrollBlurText>
      </div>
    </motion.div>
  );
}

function Services() {
  return (
    <section id="services" className="py-24 px-6 relative overflow-hidden bg-white text-[#0C0C0C] z-0">
      <AsciiFlowTrail />
      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <ScrollBlurText as="h2" className="text-4xl md:text-6xl font-display font-normal mb-16 uppercase tracking-tight text-center">
          Services
        </ScrollBlurText>
        
        <div className="w-full max-w-5xl flex flex-col">
          {SERVICES.map((service, i) => (
            <motion.div 
              key={service.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 md:gap-16 py-8 sm:py-10 md:py-12 border-b border-[#0C0C0C26] last:border-b-0"
              style={{ borderColor: 'rgba(12, 12, 12, 0.15)' }}
            >
              <div className="font-sans font-black text-[clamp(3rem,10vw,140px)] leading-none text-[#0C0C0C] shrink-0">
                {service.num}
              </div>
              <div className="flex flex-col gap-2 pt-2 sm:pt-4">
                <ScrollBlurText as="h3" delay={0.2} className="font-sans font-medium uppercase text-[clamp(1rem,2.2vw,2.1rem)] text-[#0C0C0C]">
                  {service.title}
                </ScrollBlurText>
                <ScrollBlurText as="p" delay={0.3} className="font-sans font-light leading-relaxed max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] opacity-60 text-[#0C0C0C]">
                  {service.description}
                </ScrollBlurText>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-full max-w-5xl mt-32">
          <ScrollBlurText as="h2" className="text-3xl md:text-5xl font-display font-normal mb-12 uppercase tracking-tight text-center">
            How We Deliver
          </ScrollBlurText>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, idx) => (
              <RadialFeatureCard key={feature.title} feature={feature} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const STICKY_PROJECTS = [
  {
    id: "01",
    category: "Client",
    title: "TouraLuxe",
    video: "https://res.cloudinary.com/ijqlhvsd/video/upload/v1786685270/Tourawebsite.mp4",
    liveLink: "https://touraluxe.vercel.app/"
  },
  {
    id: "02",
    category: "Personal",
    title: "Drip",
    video: "https://res.cloudinary.com/dxymukm5q/video/upload/q_auto/f_auto/v1779933951/Sequence_01_1_uopnzw.mp4"
  },
  {
    id: "03",
    category: "Client",
    title: "Solis Studio",
    video: "https://res.cloudinary.com/dxymukm5q/video/upload/q_auto/f_auto/v1779940084/Sequence_01_oa2owg.mp4"
  }
];

const scrollToContact = (e: React.MouseEvent) => {
  e.preventDefault();
  const el = document.getElementById('contact');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const ContactButton = () => (
  <StarflowButton
    onClick={scrollToContact}
    className="uppercase tracking-widest text-xs sm:text-sm md:text-base hover:scale-105 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
  >
    Contact Us
  </StarflowButton>
);

const StickyProjectCard = ({ project, index }: any) => {
  return (
    <div className={`sticky h-[85vh] w-full top-24 md:top-32 ${index === STICKY_PROJECTS.length - 1 ? 'mb-0' : 'mb-[40vh]'}`} style={{ top: `calc(6rem + ${index * 28}px)` }}>
      <div 
        className="w-full h-full bg-[#0C0C0C] border-2 border-[#D7E2EA] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-4 sm:p-6 md:p-8 flex flex-col gap-6 transform-origin-top shadow-2xl"
      >
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[#D7E2EA] shrink-0">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-5xl md:text-7xl font-display font-medium text-white/20">{project.id}</span>
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-sans tracking-widest uppercase opacity-70 mb-1">{project.category}</span>
              <h3 className="text-2xl md:text-4xl font-display font-medium text-white leading-none">{project.title}</h3>
            </div>
          </div>
          {project.liveLink && (
            <a 
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors whitespace-nowrap self-end sm:self-auto border border-white/20"
            >
              Live Project
              <ExternalLink size={16} />
            </a>
          )}
        </div>

        {/* Bottom Row - Video */}
        <div className="flex-1 min-h-0 w-full overflow-hidden rounded-[30px] sm:rounded-[40px] md:rounded-[50px]">
          <video 
            src={project.video} 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

function Portfolio() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section id="portfolio" ref={containerRef} className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 relative pt-24 pb-32 px-6 text-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="mb-16 flex items-center justify-center">
          <ScrollBlurText as="h2" className="text-4xl md:text-6xl font-display font-normal uppercase tracking-tight text-center text-white flex items-center gap-3">
            <span className="opacity-50">Our</span>
            <TextRotator words={["Portfolio", "Work", "Showcase", "Projects"]} />
          </ScrollBlurText>
        </div>
        
        <div className="w-full flex flex-col relative pb-0">
          {STICKY_PROJECTS.map((project, idx) => (
            <StickyProjectCard 
              key={project.id} 
              project={project} 
              index={idx} 
            />
          ))}
        </div>
        
        <div className="mt-20">
          <ContactButton />
        </div>
      </div>
    </section>
  );
}

import ClientFeedback from './components/ui/testimonial';

function Testimonials() {
  return <ClientFeedback />;
}

function Footer() {
  return (
    <footer id="contact" className="relative z-10 pt-24 pb-8 px-6 border-t border-white/10 overflow-hidden bg-[#0C0C0C] text-white">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Contact Us Form / Section */}
        <div className="flex flex-col items-center text-center mb-32">
          <h2 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-wide mb-6">Contact Us</h2>
          <p className="text-zinc-300 max-w-2xl text-lg font-sans">
            Ready to start your next project? Let's talk about how we can help you achieve your goals.
          </p>
          
          <div className="grid grid-cols-2 gap-3 md:gap-6 mt-16 w-full max-w-4xl mx-auto">
            {/* Email Card */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-12 rounded-[20px] sm:rounded-[30px] border border-white/5 bg-[#111111] shadow-2xl text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-4 sm:mb-6">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold uppercase tracking-widest mb-2 sm:mb-4">Email Us</h3>
              <p className="text-zinc-300 text-[10px] sm:text-base mb-6 sm:mb-8 font-sans break-all w-full max-w-full">eldenweb.sites@gmail.com</p>
              <a href="mailto:eldenweb.sites@gmail.com" className="px-4 py-2 sm:px-8 sm:py-3 rounded-full border border-white/10 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors whitespace-nowrap">
                Send Email
              </a>
            </div>

            {/* Phone Card */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-12 rounded-[20px] sm:rounded-[30px] border border-white/5 bg-[#111111] shadow-2xl text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-4 sm:mb-6">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold uppercase tracking-widest mb-2 sm:mb-4">Call Us</h3>
              <p className="text-zinc-300 text-xs sm:text-base mb-6 sm:mb-8 font-sans">+91 8147486632</p>
              <a href="tel:+918147486632" className="px-4 py-2 sm:px-8 sm:py-3 rounded-full border border-white/10 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors whitespace-nowrap">
                Call Now
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <a href="#" className="text-3xl font-display tracking-tight flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-lg font-sans font-bold">E</span>
              </div>
              Elden Web
            </a>
            <ScrollBlurText as="p" className="text-zinc-400 max-w-sm text-lg leading-relaxed mb-8">
              Elden makes the best websites and boosts your business presence online.
            </ScrollBlurText>
            <a href="mailto:hello@eldenweb.com" className="inline-flex items-center gap-2 text-xl font-bold hover:text-purple-400 transition-colors">
              hello@eldenweb.com <ArrowRight size={20} />
            </a>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Services</h4>
            <ul className="flex flex-col gap-4 text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">Custom Web Design</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SEO Optimization</a></li>
              <li><a href="#" className="hover:text-white transition-colors">UI/UX Strategy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">E-Commerce Apps</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="flex flex-col gap-4 text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">Portfolio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm text-zinc-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Elden Web Agency. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <div className="min-h-screen font-sans selection:bg-purple-500/30 selection:text-white">
        <main>
          <LumoraHero />
          <AboutVideoSection />
          <Services />
          <Portfolio />
          <Testimonials />
        </main>
        <Footer />
      </div>
    </>
  );
}
