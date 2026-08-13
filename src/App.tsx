/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Code, ExternalLink, Globe, Layout, Menu, Smartphone, Sparkles, Star, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AsciiFlowTrail from './components/AsciiFlowTrail';
import FluidImage from './components/FluidImage';

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
    let targetTime = 0;
    let seeking = false;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const handleMouseMove = (e: MouseEvent) => {
      if (!video.duration || Number.isNaN(video.duration)) return;

      if (prevX === null) {
        prevX = e.clientX;
        targetTime = video.currentTime;
        return;
      }

      const delta = e.clientX - prevX;
      prevX = e.clientX;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTime = clamp(targetTime + timeOffset, 0, video.duration);

      if (!seeking) {
        seeking = true;
        video.currentTime = targetTime;
      }
    };

    const handleSeeked = () => {
      if (Math.abs(video.currentTime - targetTime) > 0.01) {
        video.currentTime = targetTime;
      } else {
        seeking = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      video.removeEventListener("seeked", handleSeeked);
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
  const [activeVideo, setActiveVideo] = useState(2);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <section className="relative w-full h-screen overflow-hidden bg-black font-sans">
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
      <div className="absolute inset-0 z-[2] flex flex-col pt-6 pb-6 px-6 sm:px-12">
        {/* Navigation */}
        <nav className="flex justify-between items-center w-full z-10">
          <div className="font-display italic text-white text-xl sm:text-2xl">
            Elden Web
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center liquid-glass rounded-full p-1.5 pl-6 gap-6">
            <div className="flex gap-6 text-white/90 text-sm font-medium font-sans">
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
              <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            </div>
            <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/90 transition-colors font-sans">
              Get Started
            </button>
          </div>

          {/* Mobile Nav Toggle */}
          <button 
            className="md:hidden liquid-glass w-12 h-12 rounded-full flex items-center justify-center text-white relative z-50"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className={`absolute transition-all duration-300 ${menuOpen ? 'opacity-0 scale-75 rotate-90' : 'opacity-100 scale-100 rotate-0'}`} />
            <X className={`absolute transition-all duration-300 ${menuOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'}`} />
          </button>
        </nav>

        {/* Hero Content (Centered) */}
        <div className={`flex-1 flex flex-col justify-center items-center text-center transition-colors duration-700 ${textColor}`}>
          <ScrollBlurText as="h1" className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] max-w-4xl mb-6">
            Crafting Premium<br/>Digital Experiences
          </ScrollBlurText>
          
          <ScrollBlurText as="p" delay={0.2} className={`max-w-xl text-lg sm:text-xl md:text-2xl leading-relaxed mb-10 font-display px-6 py-4 rounded-2xl backdrop-blur-sm border ${isDark ? 'bg-black/5 border-black/10 text-[#0C0C0C]' : 'bg-white/10 border-white/20 text-white shadow-lg'}`}>
            Elden Web is a top-tier digital agency specializing in immersive, high-performance websites and modern interactive experiences that elevate your brand and drive growth.
          </ScrollBlurText>
          
          <div className="liquid-glass rounded-full p-1.5 flex items-center w-full max-w-[320px] sm:max-w-sm mb-12">
            <input 
              type="email" 
              placeholder="Your Best Email" 
              className={`flex-1 bg-transparent border-none outline-none px-4 text-sm font-sans transition-colors duration-700 ${textColor} ${isDark ? 'placeholder-[#182C41]' : 'placeholder-white'} placeholder:opacity-60`}
            />
            <button className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-700 font-sans whitespace-nowrap ${bgColor} ${isDark ? 'text-white' : 'text-black'}`}>
              Start a Project
            </button>
          </div>
          
          {/* Video Switcher */}
          <div className="flex gap-4 sm:gap-6 flex-wrap justify-center font-sans">
            {LUMORA_VIDEOS.map((vid, idx) => {
              const isActive = idx === activeVideo;
              return (
                <button 
                  key={idx}
                  onClick={() => handleVideoSwitch(idx)}
                  className={`text-xs sm:text-sm font-medium pb-1 border-b-2 transition-all duration-700 ${
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col justify-center items-center"
          >
            <div className="flex flex-col items-center gap-6">
              {["Services", "Portfolio", "Testimonials"].map((link, i) => (
                <motion.a 
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.4, 0, 0.2, 1] }}
                  className="text-white text-3xl font-display"
                  onClick={() => setMenuOpen(false)}
                >
                  {link}
                </motion.a>
              ))}
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="mt-6 bg-white text-black px-8 py-3 rounded-full font-medium font-sans"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

function RadialFeatureCard({ feature, delay }: { feature: typeof FEATURES[0], delay: number }) {
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
    title: "Nextlevel Studio",
    img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
    img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
    img3: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85"
  },
  {
    id: "02",
    category: "Personal",
    title: "Aura Brand Identity",
    img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
    img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
    img3: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85"
  },
  {
    id: "03",
    category: "Client",
    title: "Solaris Digital",
    img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
    img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
    img3: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85"
  }
];

const ContactButton = () => (
  <button
    className="rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base transition-transform hover:scale-105 active:scale-95"
    style={{
      background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
      boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
      outline: '2px solid white',
      outlineOffset: '-3px'
    }}
  >
    Contact Me
  </button>
);

const StickyProjectCard = ({ project, index, progress, totalCards }: any) => {
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const range = [index * (1 / totalCards), 1];
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="sticky h-[85vh] w-full top-24 md:top-32" style={{ top: `calc(6rem + ${index * 28}px)` }}>
      <motion.div 
        style={{ scale }} 
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
          <button className="rounded-full border-2 border-[#D7E2EA] px-6 py-2 uppercase tracking-widest text-xs md:text-sm font-medium hover:bg-white hover:text-black transition-colors whitespace-nowrap">
            Live Project
          </button>
        </div>

        {/* Bottom Row - Image Grid */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1 min-h-0 overflow-hidden">
          {/* Left Column (40%) */}
          <div className="flex flex-col gap-4 w-full sm:w-[40%] h-full">
            <img 
              src={project.img1} 
              alt="" 
              className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px] shrink-0" 
              style={{ height: 'clamp(130px, 16vw, 230px)' }} 
            />
            <img 
              src={project.img2} 
              alt="" 
              className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px] flex-1 min-h-0" 
              style={{ height: 'clamp(160px, 22vw, 340px)' }} 
            />
          </div>
          {/* Right Column (60%) */}
          <div className="w-full sm:w-[60%] h-full">
            <img 
              src={project.img3} 
              alt="" 
              className="w-full h-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]" 
            />
          </div>
        </div>
      </motion.div>
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
        <div className="relative mb-16 w-full max-w-2xl h-[200px] flex items-center justify-center overflow-hidden rounded-[40px]">
          <div className="absolute inset-0 pointer-events-auto">
            <FluidImage />
          </div>
          <ScrollBlurText as="h2" className="text-4xl md:text-6xl font-display font-normal uppercase tracking-tight text-center text-white relative z-10 pointer-events-none drop-shadow-2xl">
            Project
          </ScrollBlurText>
        </div>
        
        <div className="w-full flex flex-col relative pb-[15vh]">
          {STICKY_PROJECTS.map((project, idx) => (
            <StickyProjectCard 
              key={project.id} 
              project={project} 
              index={idx} 
              progress={scrollYProgress} 
              totalCards={STICKY_PROJECTS.length} 
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <a href="#" className="text-3xl font-display tracking-tight flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-lg font-sans font-bold">E</span>
              </div>
              Elden Web
            </a>
            <ScrollBlurText as="p" className="text-zinc-400 max-w-sm text-lg leading-relaxed mb-8">
              A premium, award-winning web design agency delivering high-performance, colorful, and modern digital solutions.
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
