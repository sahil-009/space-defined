import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Image data ────────────────────────────────────────── */
const col1Images = [
  { src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=85", alt: "Luxury living room",    aspect: "aspect-[4/5]",    label: "Living Spaces" },
  { src: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=700&q=85", alt: "Minimalist bedroom",    aspect: "aspect-square",   label: "Bedrooms"      },
  { src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85", alt: "Modern sofa",            aspect: "aspect-[4/5]",    label: "Furniture"     },
];
const col2Images = [
  { src: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=700&q=85", alt: "Designer kitchen",     aspect: "aspect-[16/10]",  label: "Kitchens"      },
  { src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=85", alt: "Luxury bathroom",      aspect: "aspect-[4/5]",    label: "Bathrooms"     },
  { src: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=700&q=85", alt: "Office workspace",     aspect: "aspect-square",   label: "Workspaces"    },
];
const col3Images = [
  { src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&q=85", alt: "Textured wall",        aspect: "aspect-square",   label: "Materials"     },
  { src: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=700&q=85", alt: "Dining room",          aspect: "aspect-[4/5]",    label: "Dining"        },
  { src: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=700&q=85", alt: "Abstract decor",       aspect: "aspect-[16/10]",  label: "Accents"       },
];

/* ─── Tool badge icons ───────────────────────────────────── */
const PsIcon = () => (
  <svg viewBox="0 0 36 36" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" rx="7" fill="#001E36"/>
    <text x="5" y="25" fontFamily="Inter,sans-serif" fontWeight="800" fontSize="13" fill="#31A8FF">Ps</text>
  </svg>
);
const MaxIcon = () => (
  <svg viewBox="0 0 36 36" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" rx="7" fill="#0066B3"/>
    <text x="3" y="25" fontFamily="Inter,sans-serif" fontWeight="800" fontSize="11" fill="#FFF">3ds</text>
  </svg>
);

/* ─── Image card with per-card 3-D tilt ─────────────────── */
interface CardProps { src: string; alt: string; aspect: string; label: string; showMax?: boolean; }

const ImageCard = ({ src, alt, aspect, label, showMax }: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 18;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 14;
    gsap.to(el, { rotateY: x, rotateX: -y, duration: 0.35, ease: "power2.out", transformPerspective: 800 });
    // Shift the image slightly opposite for depth
    gsap.to(el.querySelector("img"), { x: x * 0.6, y: y * 0.6, duration: 0.35, ease: "power2.out" });
  };
  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.7, ease: "elastic.out(1,0.55)" });
    gsap.to(el.querySelector("img"), { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.55)" });
  };

  return (
    <div
      ref={cardRef}
      className={`ms-card group relative overflow-hidden rounded-2xl ${aspect} w-full bg-neutral-900 cursor-pointer`}
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.6)", transformStyle: "preserve-3d", willChange: "transform" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <img src={src} alt={alt} loading="lazy"
        className="absolute inset-0 w-full h-full object-cover scale-[1.04] transition-transform duration-700 group-hover:scale-110"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }}
      />

      {/* Hover blue-glow shimmer */}
      <div className="ms-card-shimmer absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, transparent 60%)" }}
      />

      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: "inset 0 0 0 1px rgba(59,130,246,0.35)" }}
      />

      {/* Bottom info bar */}
      <div className="absolute bottom-0 inset-x-0 px-4 pb-4 flex items-center justify-between translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
        <span className="text-[10px] font-black tracking-[0.28em] uppercase text-white/75">{label}</span>
        <div className="flex gap-1.5 items-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
          <PsIcon />
          {showMax && <MaxIcon />}
        </div>
      </div>
    </div>
  );
};

/* ─── Magnetic CTA button ────────────────────────────────── */
interface BtnProps { children: React.ReactNode; variant?: "white" | "ghost"; }
const MagneticBtn = ({ children, variant = "white" }: BtnProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = btnRef.current!.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.35;
    const y = (e.clientY - r.top  - r.height / 2) * 0.35;
    gsap.to(btnRef.current, { x, y, duration: 0.4, ease: "power2.out" });
  };
  const onLeave = () => gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });

  const base = "ms-btn px-9 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] cursor-pointer transition-all duration-300 active:scale-95 select-none";
  const styles = variant === "white"
    ? { background: "#FFFFFF", color: "#0B0B0B" }
    : { background: "transparent", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.22)" };

  return (
    <button ref={btnRef} className={base} style={styles} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </button>
  );
};

/* ─── Marquee ticker items ───────────────────────────────── */
const TICKER_ITEMS = [
  "Living Spaces", "★", "Bedrooms", "★", "Kitchens", "★",
  "Bathrooms", "★", "Furniture", "★", "Workspaces", "★",
  "Materials", "★", "Dining", "★", "Accents", "★",
];

/* ─── Main component ─────────────────────────────────────── */
const MasonrySection = () => {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const spotRef     = useRef<HTMLDivElement>(null);
  const col1Ref     = useRef<HTMLDivElement>(null);
  const col2Ref     = useRef<HTMLDivElement>(null);
  const col3Ref     = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const tickerRef   = useRef<HTMLDivElement>(null);

  /* ── Cursor spotlight ──────────────────────────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    const spot    = spotRef.current;
    if (!section || !spot) return;
    const move = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      gsap.to(spot, {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        duration: 0.9, ease: "power3.out",
      });
    };
    section.addEventListener("mousemove", move);
    return () => section.removeEventListener("mousemove", move);
  }, []);

  /* ── GSAP scroll + entrance animations ────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* eyebrow clip-reveal */
      gsap.from(".ms-eyebrow", {
        clipPath: "inset(100% 0% 0% 0%)",
        y: 20, opacity: 0,
        duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".ms-eyebrow", start: "top 88%" },
      });

      /* headline — word-by-word stagger + blur clear */
      const words = headlineRef.current?.querySelectorAll(".ms-word");
      if (words) {
        gsap.from(words, {
          y: 70, opacity: 0, filter: "blur(12px)",
          duration: 1.0, stagger: 0.09, ease: "power4.out",
          scrollTrigger: { trigger: headlineRef.current, start: "top 83%" },
          onComplete: () => words.forEach(w => ((w as HTMLElement).style.filter = "none")),
        });
      }

      /* sub paragraph */
      gsap.from(".ms-sub", {
        y: 34, opacity: 0, duration: 1.0, ease: "power3.out",
        scrollTrigger: { trigger: ".ms-sub", start: "top 88%" },
      });

      /* CTA row */
      gsap.from(".ms-btn", {
        y: 28, opacity: 0, scale: 0.92,
        duration: 0.85, stagger: 0.12, ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".ms-cta-row", start: "top 90%" },
      });

      /* Decorative shapes animate in */
      gsap.from(".ms-shape", {
        scale: 0, opacity: 0, duration: 1.4, stagger: 0.15, ease: "elastic.out(1, 0.5)",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      /* Section entry scale-reveal (pinned) */
      gsap.fromTo(sectionRef.current,
        { clipPath: "inset(4% 4% 4% 4% round 24px)", scale: 0.94 },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "top 55%",
            scrub: 1.2,
          },
        }
      );

      /* Badge chips rotate+fade in */
      gsap.from(".ms-badge", {
        y: 20, opacity: 0, scale: 0.85, rotate: -6,
        duration: 0.65, stagger: 0.08, ease: "back.out(1.8)",
        scrollTrigger: { trigger: ".ms-badges-row", start: "top 88%" },
      });

      /* Infinite marquee ticker */
      if (tickerRef.current) {
        const ticker = tickerRef.current;
        const clone  = ticker.cloneNode(true) as HTMLDivElement;
        ticker.parentElement?.appendChild(clone);
        const totalW = ticker.offsetWidth;
        gsap.fromTo(
          [ticker, clone],
          { x: (i) => (i === 0 ? 0 : totalW) },
          { x: (i) => (i === 0 ? -totalW : 0), duration: 22, ease: "none", repeat: -1 }
        );
      }

      /* Per-card scroll reveal: fade + slide up */
      document.querySelectorAll(".ms-card").forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 60, scale: 0.94 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 1.0, ease: "power3.out",
            delay: (i % 3) * 0.1,
            scrollTrigger: { trigger: card, start: "top 92%" },
          }
        );
      });

      /* Column parallax — different y speeds */
      const colData = [
        { ref: col1Ref, y: 0   },
        { ref: col2Ref, y: 55  },
        { ref: col3Ref, y: -40 },
      ];
      colData.forEach(({ ref, y }) => {
        if (!ref.current) return;
        gsap.to(ref.current, {
          y, ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom", end: "bottom top",
            scrub: 1.6,
          },
        });
      });

      /* Headline gradient sweep on scroll */
      gsap.fromTo(".ms-gradient-text",
        { backgroundPosition: "0% 50%" },
        {
          backgroundPosition: "100% 50%",
          ease: "none",
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%", end: "bottom 30%",
            scrub: 2,
          },
        }
      );

      /* Counter numbers count up */
      document.querySelectorAll(".ms-counter").forEach((el) => {
        const target = parseInt((el as HTMLElement).dataset.target ?? "0", 10);
        gsap.fromTo(el, { innerText: 0 }, {
          innerText: target,
          duration: 2.0, ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "#0B0B0B", paddingTop: "clamp(5rem,9vw,8rem)", paddingBottom: "clamp(5rem,9vw,8rem)" }}
    >
      {/* ── Cursor spotlight ── */}
      <div
        ref={spotRef}
        className="pointer-events-none absolute z-0"
        style={{
          width: 600, height: 600,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, rgba(234,179,8,0.04) 45%, transparent 70%)",
          filter: "blur(2px)",
          willChange: "transform",
        }}
      />

      {/* ── Decorative geometric shapes ── */}
      <div className="ms-shape absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ border: "1.5px solid rgba(59,130,246,0.22)", background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)" }}
      />
      <div className="ms-shape absolute top-14 left-40 w-9 h-9 rounded-full pointer-events-none"
        style={{ background: "rgba(59,130,246,0.4)" }}
      />
      <div className="ms-shape absolute top-1/2 -left-14 w-36 h-36 rounded-full pointer-events-none -translate-y-1/2"
        style={{ border: "1px solid rgba(59,130,246,0.12)" }}
      />
      <div className="ms-shape absolute -bottom-20 -right-14 w-72 h-36 pointer-events-none overflow-hidden rounded-t-full"
        style={{ background: "rgba(234,179,8,0.10)", border: "1.5px solid rgba(234,179,8,0.20)", borderBottom: "none" }}
      />
      <div className="ms-shape absolute bottom-24 right-32 w-6 h-6 rounded-full pointer-events-none"
        style={{ background: "rgba(234,179,8,0.55)" }}
      />
      <div className="ms-shape absolute top-32 right-16 w-3 h-3 rounded-full pointer-events-none"
        style={{ background: "rgba(234,179,8,0.30)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-20 lg:mb-24">

          {/* Eyebrow */}
          <p className="ms-eyebrow inline-block text-[9px] font-black tracking-[0.55em] uppercase mb-8"
            style={{ color: "rgba(234,179,8,0.75)" }}>
            Portfolio Showcase
          </p>

          {/* Headline — wrapped in words for stagger */}
          <h2
            ref={headlineRef}
            className="font-extrabold uppercase tracking-tight text-white leading-[1.06] mb-7 overflow-hidden"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.6rem)", fontFamily: "'Inter','Montserrat',sans-serif" }}
          >
            {["Spaces", "That"].map((w, i) => (
              <span key={i} className="ms-word inline-block mr-[0.22em]">{w}</span>
            ))}
            {" "}
            <span
              className="ms-word ms-gradient-text inline-block"
              style={{
                background: "linear-gradient(270deg, #EAB308, #3B82F6, #EAB308)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Define
            </span>{" "}
            <span className="ms-word inline-block">Living.</span>
          </h2>

          {/* Sub */}
          <p className="ms-sub text-gray-400 text-base lg:text-lg max-w-lg mx-auto leading-relaxed font-light">
            A curated collection of our finest projects — each one a study in
            precision, materiality, and lived experience.
          </p>

          {/* Stat counters */}
          <div className="ms-cta-row flex flex-wrap justify-center gap-12 mt-10 mb-10">
            {[
              { target: 120, suffix: "+", label: "Projects" },
              { target: 8, suffix: " Yrs", label: "Experience" },
              { target: 98, suffix: "%", label: "Satisfaction" },
            ].map(({ target, suffix, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-white font-black text-3xl lg:text-4xl leading-none">
                  <span className="ms-counter" data-target={target}>0</span>{suffix}
                </span>
                <span className="text-[10px] text-gray-500 font-bold tracking-[0.25em] uppercase">{label}</span>
              </div>
            ))}
          </div>

          {/* CTA pill buttons */}
          <div className="ms-cta-row flex flex-wrap gap-4 justify-center">
            <MagneticBtn variant="white">View All Projects</MagneticBtn>
            <MagneticBtn variant="ghost">Get In Touch</MagneticBtn>
          </div>
        </div>

        {/* ── Scrolling marquee ticker ── */}
        <div className="relative overflow-hidden my-12 select-none pointer-events-none" style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)" }}>
          <div className="flex whitespace-nowrap">
            <div ref={tickerRef} className="flex items-center gap-10 pr-10 text-[11px] font-black tracking-[0.3em] uppercase" style={{ color: "rgba(234,179,8,0.55)" }}>
              {TICKER_ITEMS.map((item, i) => (
                <span key={i} className={item === "★" ? "text-blue-500/60 text-xs" : ""}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Category badge chips ── */}
        <div className="ms-badges-row flex flex-wrap justify-center gap-2.5 mb-10">
          {["All", "Living", "Bedrooms", "Kitchens", "Outdoor", "Commercial"].map((tag, i) => (
            <span
              key={i}
              className="ms-badge px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer select-none transition-all duration-300 hover:scale-105 hover:bg-yellow-400 hover:text-black"
              style={{
                background: i === 0 ? "rgba(234,179,8,0.20)" : "rgba(255,255,255,0.06)",
                color: i === 0 ? "rgba(234,179,8,0.9)" : "rgba(255,255,255,0.45)",
                border: `1px solid ${i === 0 ? "rgba(234,179,8,0.30)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* ── Masonry Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 items-start">

          {/* Column 1 */}
          <div ref={col1Ref} className="flex flex-col gap-4 lg:gap-5">
            {col1Images.map((img, i) => (
              <ImageCard key={i} {...img} showMax={i % 2 === 0} />
            ))}
          </div>

          {/* Column 2 — offset down */}
          <div ref={col2Ref} className="flex flex-col gap-4 lg:gap-5 lg:mt-14">
            {col2Images.map((img, i) => (
              <ImageCard key={i} {...img} showMax={i % 2 !== 0} />
            ))}
          </div>

          {/* Column 3 — hidden on mobile */}
          <div ref={col3Ref} className="hidden sm:flex flex-col gap-4 lg:gap-5 lg:mt-6">
            {col3Images.map((img, i) => (
              <ImageCard key={i} {...img} showMax={i === 1} />
            ))}
          </div>
        </div>

        {/* ── Bottom gradient rule ── */}
        <div className="mt-24 w-full" style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.4) 30%, rgba(234,179,8,0.4) 70%, transparent 100%)",
        }} />
      </div>

      {/* Subtle fade into next section */}
      <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(0deg, rgba(15,15,15,0.4) 0%, transparent 100%)" }}
      />
    </section>
  );
};

export default MasonrySection;
