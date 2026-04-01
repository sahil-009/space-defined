import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const panels = [
  {
    title: "Living Room",
    desc: "CABINET FACTORY sofas and storage that transform open spaces into organized sanctuaries.",
    gradient: "from-amber-900/80 to-stone-900/80",
  },
  {
    title: "Kitchen",
    desc: "Precision-engineered cabinetry with hidden compartments and seamless finishes.",
    gradient: "from-stone-800/80 to-zinc-900/80",
  },
  {
    title: "Bedroom",
    desc: "Wall beds and wardrobe systems that double your usable floor space.",
    gradient: "from-zinc-800/80 to-neutral-900/80",
  },
  {
    title: "Office",
    desc: "Compact workstations that fold away completely, restoring your living space.",
    gradient: "from-neutral-800/80 to-stone-900/80",
  },
];

const ShowcaseSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const totalScroll = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${totalScroll}`,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="overflow-hidden bg-charcoal">
      <div ref={trackRef} className="flex h-screen w-max">
        {panels.map((p, i) => (
          <div
            key={i}
            className="relative flex items-center justify-center w-screen h-screen flex-shrink-0"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />
            <img
              src="/screenshot-showcase.png"
              alt={p.title}
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
            />
            <div className="relative z-10 text-center px-8 max-w-2xl">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-gold-light mb-4">
                {`0${i + 1}`}
              </p>
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-6">
                {p.title}
              </h3>
              <p className="text-lg text-primary-foreground/70 leading-relaxed">
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShowcaseSection;
