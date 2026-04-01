import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [typedLine1, setTypedLine1] = useState("");
  const [typedLine2, setTypedLine2] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Typewriter effect
  useEffect(() => {
    let isMounted = true;
    const text1 = "Transform Spaces.";
    const text2 = "Redefine Living.";

    const typeText = async () => {
      // Delay to sync with GSAP entrance
      await new Promise((r) => setTimeout(r, 600));

      for (let i = 0; i <= text1.length; i++) {
        if (!isMounted) return;
        setTypedLine1(text1.substring(0, i));
        await new Promise((r) => setTimeout(r, 50));
      }

      await new Promise((r) => setTimeout(r, 200));

      for (let i = 0; i <= text2.length; i++) {
        if (!isMounted) return;
        setTypedLine2(text2.substring(0, i));
        await new Promise((r) => setTimeout(r, 50));
      }
    };

    typeText();

    // Blinking cursor
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      isMounted = false;
      clearInterval(cursorInterval);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the 3D video container entrance
      gsap.from(videoContainerRef.current, {
        scale: 0.8,
        opacity: 0,
        rotateY: -30,
        rotateX: 15,
        duration: 1.8,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.from(headlineRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.6,
      });

      gsap.from(subtextRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.9,
      });

      gsap.from(ctaRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 1.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mouse-follow parallax for the 3D video element
  useEffect(() => {
    const container = videoContainerRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(container, {
        rotateY: x * 12,
        rotateX: -y * 8,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(container, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-cream"
    >
      {/* Subtle ambient glow behind the 3D element */}
      <div className="hero-ambient-glow" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* 3D Video Left */}
          <div className="relative order-1 hero-3d-perspective">
            <div
              ref={videoContainerRef}
              className="hero-3d-video-container"
            >
              {/* Floating glow ring */}
              <div className="hero-glow-ring" />

              {/* Main video element */}
              <div className="hero-video-wrapper">
                <video
                  src="/hero-3d-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="hero-video-element mix-blend-multiply"
                />
              </div>
            </div>
          </div>

          {/* Text Right */}
          <div className="order-2 flex flex-col gap-8">
            <h1
              ref={headlineRef}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight"
            >
              <span className="!text-foreground">{typedLine1 || "\u00A0"}</span>
              <br />
              <span className="text-[#8C5A3C]">
                {typedLine2 || (typedLine1 === "Transform Spaces." ? "" : "\u00A0")}
                <span
                  className={`font-light transition-opacity duration-100 ${
                    showCursor ? "opacity-100" : "opacity-0"
                  }`}
                >
                  |
                </span>
              </span>
            </h1>

            <p
              ref={subtextRef}
              className="text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              Experience next-generation modular interiors engineered with
              precision and elegance.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 text-base font-semibold"
              >
                Explore Designs
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-base font-semibold border-2 border-foreground/20 hover:border-foreground/40"
              >
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
