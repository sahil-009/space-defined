import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    title: "Strategy",
    description: "We begin by understanding how you live — your habits, rituals, and aspirations — to craft spaces that work on your terms.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" stroke="url(#strategy-grad)" strokeWidth="1.5" strokeDasharray="3 2" />
        <path d="M10 22L14 16L18 19L22 12" stroke="url(#strategy-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="22" cy="12" r="2" fill="url(#strategy-grad)" />
        <defs>
          <linearGradient id="strategy-grad" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8C5A3C"/>
            <stop offset="1" stopColor="#D4A574"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    title: "Design",
    description: "Every line, proportion, and material pairing is chosen with intention — beauty that serves, never decorates for its own sake.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="10" height="10" rx="2" stroke="url(#design-grad)" strokeWidth="1.5"/>
        <rect x="18" y="4" width="10" height="10" rx="2" stroke="url(#design-grad)" strokeWidth="1.5"/>
        <rect x="4" y="18" width="10" height="10" rx="2" stroke="url(#design-grad)" strokeWidth="1.5"/>
        <path d="M18 23H28M23 18V28" stroke="url(#design-grad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="design-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8C5A3C"/>
            <stop offset="1" stopColor="#D4A574"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    title: "Development",
    description: "Precision manufacturing using CNC-machined components and artisan joinery — built to outlast trends by decades.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="url(#dev-grad)" strokeWidth="1.5"/>
        <path d="M16 4V16M16 16L28 10M16 16L4 10M16 16V28" stroke="url(#dev-grad)" strokeWidth="1" opacity="0.5"/>
        <defs>
          <linearGradient id="dev-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8C5A3C"/>
            <stop offset="1" stopColor="#D4A574"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    title: "Experience",
    description: "The final reveal is a moment of transformative wonder — a space that feels inevitable, as if it always belonged.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 6C16 6 8 12 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 12 16 6 16 6Z" stroke="url(#exp-grad)" strokeWidth="1.5"/>
        <path d="M12 18C12 18 13 22 16 22C19 22 20 18 20 18" stroke="url(#exp-grad)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="16" cy="8" r="1.5" fill="url(#exp-grad)" />
        <defs>
          <linearGradient id="exp-grad" x1="8" y1="6" x2="24" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8C5A3C"/>
            <stop offset="1" stopColor="#D4A574"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
];

const StorytellingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const gradRef = useRef<HTMLDivElement>(null);

  // Mouse-reactive background gradient
  useEffect(() => {
    const section = sectionRef.current;
    const grad = gradRef.current;
    if (!section || !grad) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;
      gsap.to(grad, {
        background: `radial-gradient(ellipse 80% 60% at ${xPct}% ${yPct}%, rgba(212,165,116,0.12) 0%, rgba(140,90,60,0.06) 40%, transparent 70%)`,
        duration: 1.0,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(grad, {
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,165,116,0.06) 0%, transparent 70%)",
        duration: 1.5,
        ease: "power3.out",
      });
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle parallax on the background orbs
      gsap.to(".story-orb-1", {
        y: -80,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });
      gsap.to(".story-orb-2", {
        y: 60,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Eyebrow label
      gsap.from(".story-eyebrow", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });

      // Headline words stagger with blur
      gsap.from(".story-word", {
        y: 60,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1.1,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: { trigger: ".story-headline", start: "top 85%" },
      });

      // Supporting paragraph
      gsap.from(".story-paragraph", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
        scrollTrigger: { trigger: ".story-paragraph", start: "top 88%" },
      });

      // Divider line draw
      gsap.from(".story-divider", {
        scaleX: 0,
        duration: 1.2,
        ease: "power3.out",
        transformOrigin: "left center",
        scrollTrigger: { trigger: ".story-divider", start: "top 90%" },
      });

      // Pillar cards stagger with scale + blur
      gsap.from(".pillar-card", {
        y: 80,
        opacity: 0,
        scale: 0.92,
        filter: "blur(6px)",
        duration: 1.0,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pillars-grid", start: "top 82%" },
        onComplete: () => {
          // Clear will-change after animation
          document.querySelectorAll(".pillar-card").forEach((el) => {
            (el as HTMLElement).style.willChange = "auto";
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Pillar card hover handlers
  const handleCardEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: -10,
      scale: 1.03,
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(e.currentTarget.querySelector(".pillar-glow"), {
      opacity: 1,
      duration: 0.4,
    });
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.6)",
    });
    gsap.to(e.currentTarget.querySelector(".pillar-glow"), {
      opacity: 0,
      duration: 0.4,
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-36 lg:py-52 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FAFAF8 0%, #F5F0E8 100%)" }}
    >
      {/* Background decorative orbs */}
      <div
        className="story-orb-1 absolute top-20 right-[10%] w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,165,116,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="story-orb-2 absolute bottom-32 left-[6%] w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(140,90,60,0.08) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Mouse-reactive gradient overlay */}
      <div
        ref={gradRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,165,116,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Eyebrow */}
        <p className="story-eyebrow text-[11px] font-black tracking-[0.4em] uppercase text-[#8C5A3C]/70 mb-8 text-center">
          Our Approach
        </p>

        {/* Cinematic headline */}
        <div className="story-headline text-center mb-8 overflow-hidden">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.06] tracking-tight text-foreground">
            {["We", "don't", "just", "design", "spaces."].map((word, i) => (
              <span key={i} className="story-word inline-block mr-[0.22em]">{word}</span>
            ))}
            <br />
            <span className="story-word inline-block" style={{
              background: "linear-gradient(135deg, #8C5A3C 0%, #D4A574 50%, #8C5A3C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontStyle: "italic",
            }}>
              We craft experiences
            </span>{" "}
            <span className="story-word inline-block">that people</span>{" "}
            <span className="story-word inline-block" style={{
              background: "linear-gradient(135deg, #8C5A3C 0%, #D4A574 50%, #8C5A3C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontStyle: "italic",
            }}>feel.</span>
          </h2>
        </div>

        {/* Divider */}
        <div className="story-divider w-16 h-[2px] mx-auto mb-10 origin-left rounded-full"
          style={{ background: "linear-gradient(90deg, #8C5A3C, #D4A574)" }}
        />

        {/* Supporting paragraph */}
        <p className="story-paragraph text-center text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-24 lg:mb-32">
          Our philosophy is simple: a room should feel as good as it looks. Every decision we make — from structural form to material texture — serves the people who live inside it.
        </p>

        {/* Pillars Grid */}
        <div className="pillars-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="pillar-card group relative rounded-2xl p-7 cursor-default"
              style={{ willChange: "transform, box-shadow" }}
              onMouseEnter={handleCardEnter}
              onMouseLeave={handleCardLeave}
            >
              {/* Glass background */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: "rgba(255,252,248,0.65)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              />

              {/* Glow effect (shown on hover) */}
              <div
                className="pillar-glow absolute inset-0 rounded-2xl pointer-events-none opacity-0"
                style={{
                  background: `linear-gradient(135deg, rgba(212,165,116,0.12) 0%, rgba(140,90,60,0.06) 100%)`,
                  boxShadow: "0 20px 60px rgba(140,90,60,0.15), 0 0 0 1px rgba(212,165,116,0.2)",
                }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(140,90,60,0.08) 0%, rgba(212,165,116,0.06) 100%)",
                    border: "1px solid rgba(212,165,116,0.2)",
                  }}
                >
                  {pillar.icon}
                </div>

                {/* Number */}
                <p className="text-[10px] font-black tracking-[0.35em] uppercase mb-3"
                  style={{ color: "rgba(140,90,60,0.5)" }}
                >
                  0{i + 1}
                </p>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-foreground mb-3 tracking-tight">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className="mt-5 w-8 h-[2px] rounded-full transition-all duration-500 group-hover:w-14"
                  style={{ background: "linear-gradient(90deg, #8C5A3C, #D4A574)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StorytellingSection;
