import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Image data ─────────────────────────────────────────── */
const col1Images = [
  { src: "/indian_living_room.png",   alt: "Luxury Indian living room",   aspect: "aspect-[4/5]",   label: "Living Spaces" },
  { src: "/indian_bedroom.png",       alt: "Modern Indian bedroom",        aspect: "aspect-square",  label: "Bedrooms"      },
  { src: "/indian_furniture.png",     alt: "Indian luxury furniture",      aspect: "aspect-[4/5]",   label: "Furniture"     },
];
const col2Images = [
  { src: "/indian_kitchen.png",       alt: "Modern Indian kitchen",        aspect: "aspect-[16/10]", label: "Kitchens"      },
  { src: "/indian_bathroom.png",      alt: "Indian luxury bathroom",       aspect: "aspect-[4/5]",   label: "Bathrooms"     },
  { src: "/indian_workspace.png",     alt: "Indian home workspace",        aspect: "aspect-square",  label: "Workspaces"    },
];
const col3Images = [
  { src: "/indian_materials.png",     alt: "Indian interior materials",    aspect: "aspect-square",  label: "Materials"     },
  { src: "/indian_dining.png",        alt: "Indian luxury dining room",    aspect: "aspect-[4/5]",   label: "Dining"        },
  { src: "/indian_decor_accents.png", alt: "Indian decor accents",         aspect: "aspect-[16/10]", label: "Accents"       },
];

/* Five featured cards for the mobile scroll-deck */
const DECK_CARDS = [
  { src: "/indian_living_room.png",   label: "Living Spaces", alt: "Living room",  num: "01" },
  { src: "/indian_kitchen.png",       label: "Kitchens",      alt: "Kitchen",      num: "02" },
  { src: "/indian_bedroom.png",       label: "Bedrooms",      alt: "Bedroom",      num: "03" },
  { src: "/indian_bathroom.png",      label: "Bathrooms",     alt: "Bathroom",     num: "04" },
  { src: "/indian_dining.png",        label: "Dining",        alt: "Dining room",  num: "05" },
];
const CARD_N     = DECK_CARDS.length;
const SCROLL_PX  = 260; // px of scroll to transition each card away

/* ─── Tool badge icons ───────────────────────────────────── */
const PsIcon = () => (
  <svg viewBox="0 0 36 36" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" rx="7" fill="#001E36"/>
    <text x="5" y="25" fontFamily="Inter,sans-serif" fontWeight="800" fontSize="13" fill="#31A8FF">Ps</text>
  </svg>
);
const MaxIcon = () => (
  <svg viewBox="0 0 36 36" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" rx="7" fill="#0066B3"/>
    <text x="3" y="25" fontFamily="Inter,sans-serif" fontWeight="800" fontSize="11" fill="#FFF">3ds</text>
  </svg>
);

/* ─── Desktop ImageCard (3-D tilt) ──────────────────────── */
interface CardProps { src: string; alt: string; aspect: string; label: string; showMax?: boolean; }

const ImageCard = ({ src, alt, aspect, label, showMax }: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const x  = ((e.clientX - r.left) / r.width  - 0.5) * 18;
    const y  = ((e.clientY - r.top)  / r.height - 0.5) * 14;
    gsap.to(el, { rotateY: x, rotateX: -y, duration: 0.35, ease: "power2.out", transformPerspective: 800 });
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
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }}
      />
      <div className="ms-card-shimmer absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "linear-gradient(135deg, rgba(234,179,8,0.10) 0%, transparent 60%)" }}
      />
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: "inset 0 0 0 1px rgba(234,179,8,0.4)" }}
      />
      <div className="absolute bottom-0 inset-x-0 px-4 pb-4 flex items-center justify-between translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <span className="text-[10px] font-black tracking-[0.28em] uppercase text-white/75">{label}</span>
        <div className="flex gap-1.5 items-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
          <PsIcon />
          {showMax && <MaxIcon />}
        </div>
      </div>
    </div>
  );
};

/* ─── Magnetic CTA button ─────────────────────────────────── */
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

  const base = "ms-btn px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] cursor-pointer transition-all duration-300 active:scale-95 select-none";
  const styles = variant === "white"
    ? { background: "#FFFFFF", color: "#0B0B0B" }
    : { background: "transparent", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.22)" };

  return (
    <button ref={btnRef} className={base} style={styles} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </button>
  );
};

/* ─── Marquee ticker ─────────────────────────────────────── */
const TICKER_ITEMS = [
  "Living Spaces", "★", "Bedrooms", "★", "Kitchens", "★",
  "Bathrooms", "★", "Furniture", "★", "Workspaces", "★",
  "Materials", "★", "Dining", "★", "Accents", "★",
];

/* ─── Main MasonrySection ─────────────────────────────────── */
const MasonrySection = () => {
  const sectionRef      = useRef<HTMLDivElement>(null);
  const spotRef         = useRef<HTMLDivElement>(null);
  const col1Ref         = useRef<HTMLDivElement>(null);
  const col2Ref         = useRef<HTMLDivElement>(null);
  const col3Ref         = useRef<HTMLDivElement>(null);
  const headlineRef     = useRef<HTMLHeadingElement>(null);
  const tickerRef       = useRef<HTMLDivElement>(null);
  const mobileDeckRef   = useRef<HTMLDivElement>(null);  // GSAP-pinned full-viewport wrapper
  const hintLineRef     = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard]   = useState(0);

  /* ── Cursor spotlight ────────────────────────────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    const spot    = spotRef.current;
    if (!section || !spot) return;
    const move = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      gsap.to(spot, { x: e.clientX - r.left, y: e.clientY - r.top, duration: 0.9, ease: "power3.out" });
    };
    section.addEventListener("mousemove", move);
    return () => section.removeEventListener("mousemove", move);
  }, []);

  /* ── GSAP animations ─────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ══ 1. BACKGROUND COLOR JOURNEY ══════════════════════
         The section bg smoothly shifts through 4 rich dark
         palettes as the user scrolls — midnight blue → wine
         → forest → back to near-black. Very cinematic.       */
      const bgTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end:   "bottom 40%",
          scrub: 3,
        },
      });
      bgTl
        .to(sectionRef.current, { backgroundColor: "#08091E", duration: 1 })   // deep midnight indigo
        .to(sectionRef.current, { backgroundColor: "#18080F", duration: 1 })   // deep maroon / wine
        .to(sectionRef.current, { backgroundColor: "#071210", duration: 1 })   // deep forest
        .to(sectionRef.current, { backgroundColor: "#0B0B0B", duration: 1 });  // back to near-black

      /* Also tint the spotlight to match color phase */
      const spotTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%", end: "bottom 40%",
          scrub: 3,
        },
      });
      spotTl
        .to(spotRef.current, { background: "radial-gradient(circle, rgba(59,130,246,0.11) 0%, rgba(99,100,230,0.05) 45%, transparent 70%)", duration: 1 })
        .to(spotRef.current, { background: "radial-gradient(circle, rgba(180,50,80,0.10) 0%, rgba(220,80,80,0.04) 45%, transparent 70%)", duration: 1 })
        .to(spotRef.current, { background: "radial-gradient(circle, rgba(40,140,100,0.09) 0%, rgba(60,160,90,0.04) 45%, transparent 70%)", duration: 1 })
        .to(spotRef.current, { background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, rgba(234,179,8,0.04) 45%, transparent 70%)", duration: 1 });

      /* ══ 2. ENTRANCE ANIMATIONS ═══════════════════════════ */
      gsap.from(".ms-eyebrow", {
        clipPath: "inset(100% 0% 0% 0%)", y: 20, opacity: 0,
        duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".ms-eyebrow", start: "top 88%" },
      });

      const words = headlineRef.current?.querySelectorAll(".ms-word");
      if (words) {
        gsap.from(words, {
          y: 70, opacity: 0, filter: "blur(12px)",
          duration: 1.0, stagger: 0.09, ease: "power4.out",
          scrollTrigger: { trigger: headlineRef.current, start: "top 83%" },
          onComplete: () => words.forEach(w => ((w as HTMLElement).style.filter = "none")),
        });
      }

      gsap.from(".ms-sub", {
        y: 34, opacity: 0, duration: 1.0, ease: "power3.out",
        scrollTrigger: { trigger: ".ms-sub", start: "top 88%" },
      });

      gsap.from(".ms-btn", {
        y: 28, opacity: 0, scale: 0.92,
        duration: 0.85, stagger: 0.12, ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".ms-cta-row", start: "top 90%" },
      });

      gsap.from(".ms-shape", {
        scale: 0, opacity: 0, duration: 1.4, stagger: 0.15, ease: "elastic.out(1, 0.5)",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      /* Section clip-reveal on entry (scale removed — scale creates a transform containing
         block that would make position:fixed children relative to the section, breaking
         the GSAP pin on mobile which relies on position:fixed for viewport locking) */
      gsap.fromTo(sectionRef.current,
        { clipPath: "inset(3% 3% 3% 3% round 20px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 90%", end: "top 60%", scrub: 1.2 },
        }
      );

      gsap.from(".ms-badge", {
        y: 20, opacity: 0, scale: 0.85, rotate: -6,
        duration: 0.65, stagger: 0.08, ease: "back.out(1.8)",
        scrollTrigger: { trigger: ".ms-badges-row", start: "top 88%" },
      });

      /* ══ 3. TICKER ════════════════════════════════════════ */
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

      /* ══ 4. DESKTOP-ONLY ANIMATIONS ═══════════════════════ */
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

      const colData = [
        { ref: col1Ref, y: 0   },
        { ref: col2Ref, y: 55  },
        { ref: col3Ref, y: -40 },
      ];
      colData.forEach(({ ref, y }) => {
        if (!ref.current) return;
        gsap.to(ref.current, {
          y, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.6 },
        });
      });

      gsap.fromTo(".ms-gradient-text",
        { backgroundPosition: "0% 50%" },
        {
          backgroundPosition: "100% 50%", ease: "none",
          scrollTrigger: { trigger: headlineRef.current, start: "top 80%", end: "bottom 30%", scrub: 2 },
        }
      );

      document.querySelectorAll(".ms-counter").forEach((el) => {
        const target = parseInt((el as HTMLElement).dataset.target ?? "0", 10);
        gsap.fromTo(el, { innerText: 0 }, {
          innerText: target, duration: 2.0, ease: "power2.out", snap: { innerText: 1 },
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      /* ══ 5. MOBILE PINNED CARD DECK ═══════════════════════
         GSAP pin:true freezes the deck in the viewport while
         the user scrolls — page sticks, cards reveal on scroll.
         pinSpacing:true inserts a spacer so content below
         shifts down by the total pin scroll distance.        */
      const isMobile = window.innerWidth < 1024;
      if (isMobile && mobileDeckRef.current) {
        const cardEls = Array.from(
          mobileDeckRef.current.querySelectorAll(".deck-card")
        ) as HTMLElement[];
        const n = cardEls.length;

        /* card[0] = Living Spaces = front of deck (depth 0, highest z-index)
           card[n-1] = Dining = back of deck (depth n-1, lowest z-index)     */
        cardEls.forEach((card, i) => {
          const depth = i;
          gsap.set(card, {
            y:       depth * 18,
            scale:   1 - depth * 0.055,
            rotate:  depth === 0 ? 0 : (i % 2 === 0 ? -2.5 : 2.5) * Math.min(depth, 3),
            zIndex:  n - i,  // card 0 → z-index n (highest = front)
            opacity: depth > 3 ? 0.15 : 1 - depth * 0.16,
          });
        });

        /* ── GSAP pin: page freezes here during card animations ── */
        const stackTl = gsap.timeline({
          scrollTrigger: {
            trigger:    mobileDeckRef.current,
            pin:        true,         // page sticks — this is the key
            pinSpacing: true,         // spacer pushes content below down
            start:      "top top",   // pin when deck top hits viewport top
            end:        `+=${n * SCROLL_PX}`,  // hold for n × SCROLL_PX px
            scrub:      1.5,          // smooth, cinematic scrub
            onUpdate: (self) => {
              const idx = Math.min(Math.floor(self.progress * n), n - 1);
              setActiveCard(idx);
            },
          },
        });

        cardEls.forEach((card, i) => {
          const dir = i % 2 === 0 ? -1 : 1;  // alternate left / right
          const t   = i * 1.0;

          /* Front card flies up-and-sideways with spin */
          stackTl.to(card, {
            y: -680, x: dir * 120, rotate: dir * 22,
            opacity: 0, scale: 0.80,
            duration: 1, ease: "power3.in",
          }, t);

          /* Remaining cards compact forward to fill the front slot */
          cardEls.slice(i + 1).forEach((nextCard, j) => {
            stackTl.to(nextCard, {
              y:       j * 18,
              scale:   1 - j * 0.055,
              rotate:  j === 0 ? 0 : ((i + 1 + j) % 2 === 0 ? -2.5 : 2.5) * Math.min(j, 3),
              opacity: j > 3 ? 0.15 : 1 - j * 0.16,
              zIndex:  n - (i + 1) - j,
              duration: 0.9,
            }, t + 0.2);
          });
        });

        /* ── Pulsing drop hint line ── */
        if (hintLineRef.current) {
          gsap.fromTo(hintLineRef.current,
            { y: "-100%", opacity: 1 },
            { y: "220%", opacity: 0.2, duration: 1.3, ease: "power2.in", repeat: -1, repeatDelay: 0.5 }
          );
        }
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        backgroundColor: "#0B0B0B",
        overflow: "visible",
        paddingTop: "clamp(4rem,8vw,8rem)",
        paddingBottom: "clamp(4rem,8vw,8rem)",
      }}
    >
      {/* ── Cursor spotlight ── */}
      <div
        ref={spotRef}
        className="pointer-events-none absolute z-0"
        style={{
          width: 600, height: 600, borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, rgba(234,179,8,0.04) 45%, transparent 70%)",
          filter: "blur(2px)", willChange: "transform",
        }}
      />

      {/* ── Decorative geometric shapes ── */}
      <div className="ms-shape absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ border: "1.5px solid rgba(59,130,246,0.22)", background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)" }} />
      <div className="ms-shape absolute top-14 left-40 w-9 h-9 rounded-full pointer-events-none"
        style={{ background: "rgba(59,130,246,0.4)" }} />
      <div className="ms-shape absolute top-1/2 -left-14 w-36 h-36 rounded-full pointer-events-none -translate-y-1/2"
        style={{ border: "1px solid rgba(59,130,246,0.12)" }} />
      <div className="ms-shape absolute -bottom-20 -right-14 w-72 h-36 pointer-events-none overflow-hidden rounded-t-full"
        style={{ background: "rgba(234,179,8,0.10)", border: "1.5px solid rgba(234,179,8,0.20)", borderBottom: "none" }} />
      <div className="ms-shape absolute bottom-24 right-32 w-6 h-6 rounded-full pointer-events-none"
        style={{ background: "rgba(234,179,8,0.55)" }} />
      <div className="ms-shape absolute top-32 right-16 w-3 h-3 rounded-full pointer-events-none"
        style={{ background: "rgba(234,179,8,0.30)" }} />

      <div className="max-w-7xl mx-auto px-5 lg:px-10 relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-12 lg:mb-20">
          <p className="ms-eyebrow inline-block text-[9px] font-black tracking-[0.55em] uppercase mb-6"
            style={{ color: "rgba(234,179,8,0.75)" }}>
            Portfolio Showcase
          </p>

          <h2
            ref={headlineRef}
            className="font-extrabold uppercase tracking-tight text-white leading-[1.06] mb-6 overflow-hidden"
            style={{ fontSize: "clamp(2rem,5.5vw,4.6rem)", fontFamily: "'Inter','Montserrat',sans-serif" }}
          >
            {["Spaces", "That"].map((w, i) => (
              <span key={i} className="ms-word inline-block mr-[0.22em]">{w}</span>
            ))}
            {" "}
            <span className="ms-word ms-gradient-text inline-block"
              style={{
                background: "linear-gradient(270deg,#EAB308,#3B82F6,#EAB308)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              Define
            </span>{" "}
            <span className="ms-word inline-block">Living.</span>
          </h2>

          <p className="ms-sub text-gray-400 text-sm lg:text-lg max-w-lg mx-auto leading-relaxed font-light">
            A curated collection of our finest projects — each one a study in
            precision, materiality, and lived experience.
          </p>

          {/* Stat counters */}
          <div className="ms-cta-row flex flex-wrap justify-center gap-8 sm:gap-12 mt-8 mb-8">
            {[
              { target: 120, suffix: "+",    label: "Projects"     },
              { target: 8,   suffix: " Yrs", label: "Experience"   },
              { target: 98,  suffix: "%",    label: "Satisfaction" },
            ].map(({ target, suffix, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-white font-black text-2xl lg:text-4xl leading-none">
                  <span className="ms-counter" data-target={target}>0</span>{suffix}
                </span>
                <span className="text-[10px] text-gray-500 font-bold tracking-[0.25em] uppercase">{label}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="ms-cta-row flex flex-wrap gap-3 justify-center">
            <MagneticBtn variant="white">View All Projects</MagneticBtn>
            <MagneticBtn variant="ghost">Get In Touch</MagneticBtn>
          </div>
        </div>

        {/* ── Marquee ticker ── */}
        <div className="relative overflow-hidden my-8 select-none pointer-events-none"
          style={{
            maskImage: "linear-gradient(90deg,transparent 0%,black 10%,black 90%,transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg,transparent 0%,black 10%,black 90%,transparent 100%)"
          }}>
          <div className="flex whitespace-nowrap">
            <div ref={tickerRef} className="flex items-center gap-10 pr-10 text-[11px] font-black tracking-[0.3em] uppercase"
              style={{ color: "rgba(234,179,8,0.55)" }}>
              {TICKER_ITEMS.map((item, i) => (
                <span key={i} className={item === "★" ? "text-blue-500/60 text-xs" : ""}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Category badge chips ── */}
        <div className="ms-badges-row flex flex-nowrap sm:flex-wrap overflow-x-auto hide-scrollbar justify-start sm:justify-center gap-3 mb-8 px-5 -mx-5 sm:px-0 sm:mx-0">
          {["All", "Living", "Bedrooms", "Kitchens", "Outdoor", "Commercial"].map((tag, i) => (
            <span key={i}
              className="ms-badge px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer select-none transition-all duration-300 hover:scale-105 hover:bg-yellow-400 hover:text-black"
              style={{
                background: i === 0 ? "rgba(234,179,8,0.20)" : "rgba(255,255,255,0.06)",
                color:      i === 0 ? "rgba(234,179,8,0.9)"  : "rgba(255,255,255,0.45)",
                border: `1px solid ${i === 0 ? "rgba(234,179,8,0.30)" : "rgba(255,255,255,0.08)"}`,
              }}>
              {tag}
            </span>
          ))}
        </div>

      </div>{/* /max-w-7xl — header + ticker + badges CLOSE */}

      {/* ══════════════════════════════════════════════════════
          MOBILE: GSAP-PINNED card deck
          Direct child of <section> (no max-w constraint!)
          so position:fixed during pin = full viewport width.
          pinSpacing inserts a spacer equal to n×SCROLL_PX.
      ════════════════════════════════════════════════════════ */}
      <div
        ref={mobileDeckRef}
        className="block lg:hidden w-full flex flex-col items-center justify-center"
        style={{
          minHeight: "100svh",
          paddingTop: "1.5rem",
          paddingBottom: "1.5rem",
          backgroundColor: "#0B0B0B",
        }}
      >
        {/* ── Progress counter ── */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[11px] font-black tabular-nums tracking-widest"
            style={{ color: "rgba(234,179,8,0.9)" }}>
            {String(activeCard + 1).padStart(2, "0")}
          </span>

          <div className="flex gap-1.5 items-center">
            {DECK_CARDS.map((_, i) => {
              const isPast   = i < activeCard;
              const isActive = i === activeCard;
              return (
                <div key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width:      isActive ? "28px" : isPast ? "6px" : "5px",
                    height:     "5px",
                    background: isActive ? "rgba(234,179,8,0.92)"
                              : isPast   ? "rgba(234,179,8,0.35)"
                                         : "rgba(255,255,255,0.13)",
                  }}
                />
              );
            })}
          </div>

          <span className="text-[11px] font-black tabular-nums tracking-widest text-white/25">
            {String(CARD_N).padStart(2, "0")}
          </span>
        </div>

        {/* ── Card stack ── */}
        <div className="relative" style={{ width: "78vw", maxWidth: "310px", height: "420px" }}>
          {DECK_CARDS.map((card, i) => (
            <div
              key={i}
              className="deck-card absolute inset-0 rounded-[28px] overflow-hidden"
              style={{
                boxShadow: "0 30px 80px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.04)",
                willChange: "transform, opacity",
              }}
            >
              <img src={card.src} alt={card.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(0deg,rgba(0,0,0,0.90) 0%,rgba(0,0,0,0.08) 55%,transparent 100%)" }}
              />
              <div className="absolute inset-0 rounded-[28px]"
                style={{ boxShadow: "inset 0 0 0 1px rgba(234,179,8,0.20)" }}
              />
              <div className="absolute inset-0 rounded-[28px] pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 45%)" }}
              />
              <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-black tracking-[0.4em] uppercase mb-1.5"
                    style={{ color: "rgba(234,179,8,0.75)" }}>
                    Space {card.num}
                  </p>
                  <h3 className="text-white text-[22px] font-extrabold leading-tight">{card.label}</h3>
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ml-3"
                  style={{ background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.28)" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M12 5L19 12L12 19" stroke="rgba(234,179,8,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Scroll hint ── */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-[8px] tracking-[0.55em] uppercase font-black text-white/25">
            Scroll to Reveal
          </p>
          <div className="relative rounded-full overflow-hidden"
            style={{ width: "2px", height: "36px", background: "rgba(255,255,255,0.08)" }}>
            <div
              ref={hintLineRef}
              className="absolute inset-x-0 top-0 rounded-full"
              style={{ height: "45%", background: "linear-gradient(to bottom, rgba(234,179,8,0.9), rgba(234,179,8,0.1))" }}
            />
          </div>
        </div>
      </div>

      {/* max-w-7xl — desktop masonry + bottom rule OPEN */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 relative z-10">

        {/* ══════════════════════════════════════════════════════
            DESKTOP: 3-column masonry grid (lg+)
        ════════════════════════════════════════════════════════ */}
        <div className="hidden lg:grid grid-cols-3 gap-5 items-start">

          <div ref={col1Ref} className="flex flex-col gap-5">
            {col1Images.map((img, i) => <ImageCard key={i} {...img} showMax={i % 2 === 0} />)}
          </div>

          <div ref={col2Ref} className="flex flex-col gap-5 mt-14">
            {col2Images.map((img, i) => <ImageCard key={i} {...img} showMax={i % 2 !== 0} />)}
          </div>

          <div ref={col3Ref} className="flex flex-col gap-5 mt-6">
            {col3Images.map((img, i) => <ImageCard key={i} {...img} showMax={i === 1} />)}
          </div>
        </div>

        {/* ── Bottom gradient rule ── */}
        <div className="mt-16 lg:mt-24 w-full" style={{
          height: "1px",
          background: "linear-gradient(90deg,transparent 0%,rgba(59,130,246,0.4) 30%,rgba(234,179,8,0.4) 70%,transparent 100%)",
        }} />
      </div>

      {/* Section bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(0deg,rgba(15,15,15,0.4) 0%,transparent 100%)" }}
      />
    </section>
  );
};

export default MasonrySection;
