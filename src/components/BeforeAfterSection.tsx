import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Before / After slider
   • Desktop: drag handle (pointer events)
   • Mobile (≤768px): vertical swipe tabs — user taps
     "BEFORE" / "AFTER" buttons to toggle, no drag needed
   • Performance: position stored in ref + RAF, no setState
     on every frame so React never re-renders during drag
───────────────────────────────────────────── */

const BeforeAfterSection = () => {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const afterRef     = useRef<HTMLDivElement>(null);
  const handleRef    = useRef<HTMLDivElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const posRef       = useRef(50);            // 0-100, no state = no re-render
  const dragging     = useRef(false);
  const rafRef       = useRef<number>(0);
  const isMobile     = useRef(false);

  /* mobile toggle state — only this triggers a re-render */
  const [mobileView, setMobileView] = useState<"before" | "after">("after");

  /* detect mobile once */
  useEffect(() => {
    isMobile.current = window.matchMedia("(max-width: 768px)").matches;
  }, []);

  /* apply position to DOM via RAF — zero re-renders */
  const applyPos = (p: number) => {
    if (!afterRef.current || !handleRef.current || !lineRef.current) return;
    const clamped = Math.max(4, Math.min(96, p));
    afterRef.current.style.clipPath  = `inset(0 ${100 - clamped}% 0 0)`;
    handleRef.current.style.left     = `${clamped}%`;
    lineRef.current.style.left       = `${clamped}%`;
  };

  const scheduleUpdate = (clientX: number) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const p = ((clientX - rect.left) / rect.width) * 100;
      posRef.current = p;
      applyPos(p);
    });
  };

  /* ── Pointer handlers (desktop) ── */
  const onPointerDown = (e: React.PointerEvent) => {
    if (isMobile.current) return;
    dragging.current = true;
    containerRef.current?.setPointerCapture(e.pointerId);
    scheduleUpdate(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || isMobile.current) return;
    scheduleUpdate(e.clientX);
  };
  const onPointerUp = () => { dragging.current = false; };

  /* ── Initial position ── */
  useEffect(() => {
    applyPos(50);
  }, []);

  /* ── GSAP entrances ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ba-header > *", {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
      });
      gsap.from(".ba-slider-wrap", {
        y: 50, opacity: 0, scale: 0.97, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ".ba-slider-wrap", start: "top 88%" },
      });
    }, sectionRef);
    return () => { ctx.revert(); cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 bg-cream overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="ba-header text-center mb-10 sm:mb-14">
          <p className="text-xs font-black tracking-[0.32em] uppercase text-accent mb-4">Transformation</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
            Before &amp; <span className="text-gradient-gold">After</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Drag the handle to reveal the transformation
          </p>
        </div>

        {/* ── DESKTOP SLIDER ── */}
        <div
          ref={containerRef}
          className="ba-slider-wrap hidden md:block relative w-full aspect-[16/9] rounded-2xl lg:rounded-3xl overflow-hidden
            cursor-ew-resize select-none shadow-[0_30px_80px_rgba(0,0,0,0.22)] border border-border/20"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* BEFORE — always visible underneath */}
          <div className="absolute inset-0">
            <img
              src="/before-room.jpg"
              alt="Before — original empty room"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            <div className="absolute top-5 left-5 bg-black/55 backdrop-blur-sm px-3 py-1.5 rounded-full pointer-events-none"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)" }}>
              <p className="text-white text-[10px] font-black tracking-[0.35em] uppercase">Before</p>
            </div>
          </div>

          {/* AFTER — clipped left of handle */}
          <div ref={afterRef} className="absolute inset-0 will-change-[clip-path]">
            <img
              src="/pic5.jpeg"
              alt="After — transformed luxury interior"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10 pointer-events-none" />
            <div className="absolute top-5 left-5 bg-black/55 backdrop-blur-sm px-3 py-1.5 rounded-full pointer-events-none"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)" }}>
              <p className="text-white text-[10px] font-black tracking-[0.35em] uppercase">After</p>
            </div>
          </div>

          {/* Divider line */}
          <div ref={lineRef} className="absolute top-0 bottom-0 w-[2px] bg-white/80 z-20 will-change-[left]
            shadow-[0_0_12px_rgba(255,255,255,0.5)]" />

          {/* Drag handle */}
          <div
            ref={handleRef}
            className="absolute top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 will-change-[left]
              w-11 h-11 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 12H16M8 12L5 9M8 12L5 15M16 12L19 9M16 12L19 15" />
            </svg>
          </div>
        </div>

        {/* ── MOBILE TAB TOGGLE ── */}
        <div className="ba-slider-wrap md:hidden w-full">
          {/* Toggle tabs */}
          <div className="flex rounded-xl overflow-hidden border border-border/30 bg-foreground/5 mb-4 p-1 gap-1">
            {(["before", "after"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setMobileView(v)}
                className={`flex-1 py-2.5 rounded-lg text-xs font-black tracking-[0.18em] uppercase transition-all duration-300 ${
                  mobileView === v
                    ? "bg-accent text-white shadow-[0_2px_12px_rgba(140,90,60,0.35)]"
                    : "text-foreground/50 hover:text-foreground/80"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Image display */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            {/* before */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${mobileView === "before" ? "opacity-100" : "opacity-0"}`}>
              <img src="/before-room.jpg" alt="Before" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <p className="text-white text-[10px] font-black tracking-widest uppercase">Original Space</p>
              </div>
            </div>
            {/* after */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${mobileView === "after" ? "opacity-100" : "opacity-0"}`}>
              <img src="/pic5.jpeg" alt="After" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10 pointer-events-none" />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <p className="text-white text-[10px] font-black tracking-widest uppercase">Transformed</p>
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="text-center p-3 rounded-xl bg-foreground/5 border border-border/20">
              <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Before</p>
              <p className="text-sm font-bold text-foreground mt-1">Bare · Untouched</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-accent/8 border border-accent/20">
              <p className="text-[10px] font-black tracking-widest uppercase text-accent">After</p>
              <p className="text-sm font-bold text-foreground mt-1">Elegant · Warm</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BeforeAfterSection;
