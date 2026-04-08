import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Model3D from "@/components/Model3D";

gsap.registerPlugin(ScrollTrigger);

const VideoSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Video scale-up on scroll
      gsap.fromTo(
        ".video-frame",
        { scale: 0.85, borderRadius: "40px" },
        {
          scale: 1,
          borderRadius: "0px",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 10%",
            scrub: 1,
          },
        }
      );

      // Text content reveal
      gsap.from(".video-content > *", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: { trigger: ".video-content", start: "top 85%" },
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-cream">
      {/* Full-width beam background with cinematic scaling */}
      <div className="video-frame relative w-full h-[60vh] lg:h-[85vh] overflow-hidden">
        <BackgroundBeamsWithCollision className="h-full w-full bg-charcoal/20">
          <div className="text-center px-6 relative z-20">
            <p className="text-sm font-semibold tracking-[0.3em] uppercase text-accent mb-5">Immersive Experience</p>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground leading-tight max-w-4xl tracking-tight">
              Where Design{" "}
              <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))] italic">
                <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                  <span className="">Meets Craft.</span>
                </div>
                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                  <span className="">Meets Craft.</span>
                </div>
              </div>
            </h2>
          </div>
        </BackgroundBeamsWithCollision>
      </div>

      {/* Content below video */}
      <div className="video-content max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-accent mb-5">Our Process</p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight mb-6">
              Every detail is rendered with <span className="text-gradient-gold">precision</span>
            </h3>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-6">
              From material grain to ambient lighting, our team obsesses over every element.
              We use advanced 3D visualization to perfect designs before a single cut is made,
              ensuring your vision comes to life exactly as imagined.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              The result? Spaces that don't just look beautiful — they feel inevitable,
              as if they were always meant to exist.
            </p>
          </div>

          {/* 3D Model — raw Three.js, GLB camera + looping animation */}
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{ aspectRatio: "4 / 3", minHeight: "320px" }}
          >
            <Model3D
              src="/models/newoutput.glb"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
