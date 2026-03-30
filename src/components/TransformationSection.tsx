import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TransformationSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".transform-headline", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(".transform-sub", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(".parallax-layer-1", {
        y: 100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.from(".parallax-layer-2", {
        y: -60,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="designs"
      className="relative py-32 lg:py-48 overflow-hidden bg-background"
    >
      {/* Decorative parallax elements */}
      <div className="parallax-layer-1 absolute top-20 right-10 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
      <div className="parallax-layer-2 absolute bottom-20 left-10 w-80 h-80 rounded-full bg-accent/8 blur-3xl" />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <p className="transform-sub text-sm font-semibold tracking-[0.2em] uppercase text-accent mb-6">
          The Concept
        </p>
        <h2 className="transform-headline text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight text-foreground">
          From concept to reality —
          <br />
          <span className="text-gradient-gold">engineered transformations.</span>
        </h2>
        <p className="transform-sub mt-8 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Every piece is meticulously designed to maximize space, functionality,
          and aesthetic harmony. Our modular systems adapt to your life, not the
          other way around.
        </p>
      </div>
    </section>
  );
};

export default TransformationSection;
