import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(videoRef.current, {
        scale: 1.1,
        opacity: 0,
        duration: 1.5,
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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-cream"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Video Left */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl order-1">
            <video
              ref={videoRef}
              src="/hero-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[300px] sm:h-[400px] lg:h-[520px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent pointer-events-none" />
          </div>

          {/* Text Right */}
          <div className="order-2 flex flex-col gap-8">
            <h1
              ref={headlineRef}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight text-foreground"
            >
              Transform Spaces.
              <br />
              <span className="text-gradient-gold">Redefine Living.</span>
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
