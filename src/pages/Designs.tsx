import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ─── */
const FILTERS = ["All", "Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Wardrobe"];

interface DesignItem {
  id: string;
  src: string;
  label: string;
  category: string;
  tag: string;
  span?: "tall" | "wide" | "normal";
}

const DESIGNS: DesignItem[] = [
  { id: "d1", src: "/indian_living_room.png", label: "Modern Luxe Living", category: "Living Room", tag: "Featured", span: "tall" },
  { id: "d2", src: "/indian_kitchen.png", label: "Culinary Elegance", category: "Kitchen", tag: "Premium", span: "normal" },
  { id: "d3", src: "/indian_bedroom.png", label: "Serene Master Suite", category: "Bedroom", tag: "Bestseller", span: "normal" },
  { id: "d4", src: "/indian_bathroom.png", label: "Spa-Style Retreat", category: "Bathroom", tag: "New", span: "wide" },
  { id: "d5", src: "/indian_workspace.png", label: "Creative Studio", category: "Office", tag: "Minimal", span: "normal" },
  { id: "d6", src: "/indian_dining.png", label: "Intimate Dining Alcove", category: "Living Room", tag: "Classic", span: "normal" },
  { id: "d7", src: "/indian_materials.png", label: "Artisan Materials", category: "Wardrobe", tag: "Textured", span: "tall" },
  { id: "d8", src: "/indian_furniture.png", label: "Statement Furniture", category: "Bedroom", tag: "Bespoke", span: "normal" },
  { id: "d9", src: "/indian_decor_accents.png", label: "Curated Accents", category: "Kitchen", tag: "Details", span: "normal" },
];

/* ─── Before/After Slider (inline) ─── */
const MiniBeforeAfter = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(48);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/8] rounded-3xl overflow-hidden cursor-ew-resize select-none"
      style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)" }}
      onPointerDown={() => { dragging.current = true; }}
      onPointerUp={() => { dragging.current = false; }}
      onPointerLeave={() => { dragging.current = false; }}
      onPointerMove={e => { if (dragging.current) updatePos(e.clientX); }}
    >
      {/* Before */}
      <div className="absolute inset-0">
        <img src="/before-room.jpg" alt="Before" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-6 left-6">
          <span className="text-[9px] font-black tracking-[0.4em] uppercase text-white/70 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">Before</span>
        </div>
      </div>
      {/* After */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img src="/pic5.jpeg" alt="After" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10" />
        <div className="absolute top-6 left-6">
          <span className="text-[9px] font-black tracking-[0.4em] uppercase text-white bg-[#8C5A3C]/80 px-3 py-1.5 rounded-full backdrop-blur-sm">After</span>
        </div>
      </div>
      {/* Handle */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white z-10 drop-shadow-xl" style={{ left: `${position}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
          <span className="text-[#8C5A3C] text-sm font-black">⟷</span>
        </div>
      </div>
      {/* Labels */}
      <div className="absolute bottom-6 inset-x-6 flex justify-between pointer-events-none">
        <div className="text-white/80 text-xs font-bold">Original Space</div>
        <div className="text-white text-xs font-bold">Cabinet Factory Design</div>
      </div>
    </div>
  );
};

/* ─── Gallery Card ─── */
const GalleryCard = ({ item }: { item: DesignItem }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 10;
    gsap.to(el, { rotateY: x, rotateX: -y, duration: 0.4, ease: "power2.out", transformPerspective: 900 });
  };
  const onLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1, 0.6)" });
  };

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.6)", transformStyle: "preserve-3d", willChange: "transform" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <img
        src={item.src}
        alt={item.label}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        style={{ minHeight: "200px" }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)" }} />
      {/* Shimmer on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(135deg, rgba(140,90,60,0.12) 0%, transparent 60%)" }} />
      {/* Gold border on hover */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ boxShadow: "inset 0 0 0 1px rgba(140,90,60,0.45)" }} />

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex items-end justify-between gap-2">
          <div>
            <span className="inline-block text-[8px] font-black tracking-[0.35em] uppercase text-[#C9945A] mb-1">{item.tag}</span>
            <h3 className="text-white font-bold text-sm leading-tight">{item.label}</h3>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ background: "rgba(140,90,60,0.2)", border: "1px solid rgba(140,90,60,0.4)" }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M12 5L19 12L12 19" stroke="rgba(201,148,90,1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const Designs = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const baRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? DESIGNS : DESIGNS.filter(d => d.category === activeFilter);

  /* ── Entrance Animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, { y: 80, opacity: 0, duration: 1.3, ease: "power3.out", delay: 0.2 });
      gsap.from(".designs-sub", { y: 40, opacity: 0, duration: 1.0, ease: "power3.out", delay: 0.6 });
      gsap.from(".filter-chip", { y: 20, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.06, ease: "back.out(1.8)", delay: 0.8 });

      gsap.from(baRef.current, {
        y: 60, opacity: 0, scale: 0.96, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: baRef.current, start: "top 85%" },
      });

      gsap.from(".ba-title-el", {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: baRef.current, start: "top 88%" },
      });

      gsap.from(ctaRef.current, {
        y: 50, opacity: 0, scale: 0.97, duration: 1.0, ease: "power3.out",
        scrollTrigger: { trigger: ctaRef.current, start: "top 88%" },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  /* ── Gallery cards animation on filter change ── */
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".gallery-card-wrap");
    gsap.fromTo(cards,
      { opacity: 0, y: 30, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.07, ease: "power3.out" }
    );
  }, [activeFilter]);

  return (
    <div ref={heroRef} className="min-h-screen" style={{ background: "#080808" }}>
      <Navbar />

      {/* ── HERO ── */}
      <div className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(ellipse, #3B82F6 0%, transparent 70%)", filter: "blur(100px)" }} />
          <div className="absolute top-16 right-0 w-[400px] h-[400px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(ellipse, #8C5A3C 0%, transparent 70%)", filter: "blur(80px)" }} />
        </div>

        <p className="text-[10px] font-black tracking-[0.55em] uppercase text-[#8C5A3C] mb-6">
          Portfolio & Gallery
        </p>
        <h1
          ref={headlineRef}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6"
        >
          Explore Our <br />
          <span style={{
            background: "linear-gradient(135deg, #C9945A, #3B82F6, #C9945A)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontStyle: "italic",
          }}>
            Signature Designs
          </span>
        </h1>
        <p className="designs-sub text-base sm:text-lg text-white/85 max-w-xl mx-auto leading-relaxed">
          A curated showcase of our finest interior transformations—each space
          crafted with precision, passion, and premium materials.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-10 mt-12">
          {[{ n: "120+", l: "Projects" }, { n: "8 Yrs", l: "Experience" }, { n: "98%", l: "Satisfaction" }].map(s => (
            <div key={s.l} className="designs-sub flex flex-col items-center">
              <span className="text-3xl font-black text-white">{s.n}</span>
              <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/80 mt-1">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto gap-2 sm:justify-center pb-2"
          style={{ scrollbarWidth: "none" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`filter-chip flex-shrink-0 px-5 py-2 rounded-full text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 active:scale-95
                ${activeFilter === f
                  ? "bg-[#8C5A3C] text-white shadow-[0_0_20px_rgba(140,90,60,0.45)]"
                  : "border border-white/12 bg-white/[0.05] text-white/75 hover:border-white/28 hover:text-white/88"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── MASONRY GALLERY ── */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div
          ref={gridRef}
          className="columns-1 sm:columns-2 lg:columns-3 gap-5"
          style={{ columnGap: "20px" }}
        >
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`gallery-card-wrap mb-5 break-inside-avoid
                ${item.span === "tall" ? "aspect-[3/4]" : item.span === "wide" ? "aspect-[4/3]" : "aspect-square"}
              `}
              style={{ display: "inline-block", width: "100%" }}
            >
              <GalleryCard item={item} />
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-3 text-center text-white/60 py-20 text-sm">No designs found for this category.</p>
          )}
        </div>
      </div>

      {/* ── BEFORE & AFTER ── */}
      <div ref={baRef} className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <p className="ba-title-el text-[10px] font-black tracking-[0.5em] uppercase text-[#8C5A3C] mb-4">Transformation</p>
          <h2 className="ba-title-el text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Before & <span style={{ color: "#C9945A", fontStyle: "italic" }}>After</span>
          </h2>
          <p className="ba-title-el text-white/75 text-sm max-w-md mx-auto">
            Drag the slider to reveal the transformation. Every detail, elevated.
          </p>
        </div>
        <MiniBeforeAfter />
      </div>

      {/* ── CTA BANNER ── */}
      <div ref={ctaRef} className="max-w-6xl mx-auto px-6 pb-32">
        <div
          className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(140,90,60,0.15) 0%, rgba(59,130,246,0.06) 100%)",
            border: "1px solid rgba(140,90,60,0.2)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          }}
        >
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(140,90,60,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
          </div>
          <p className="text-[10px] font-black tracking-[0.5em] uppercase text-[#8C5A3C] mb-4 relative z-10">
            Ready to Begin?
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 relative z-10">
            See Your Space,{" "}
            <span style={{ color: "#C9945A", fontStyle: "italic" }}>Transformed</span>
          </h2>
          <p className="text-white/80 max-w-md mx-auto mb-10 relative z-10 text-sm sm:text-base">
            Get a free 3D preview of your space designed by our award-winning team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              to="/quote"
              className="group relative inline-flex items-center overflow-hidden rounded-full bg-[#8C5A3C] text-white px-10 py-4 text-sm font-bold tracking-[0.1em] uppercase shadow-[0_0_32px_rgba(140,90,60,0.45)] hover:shadow-[0_0_50px_rgba(140,90,60,0.65)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Get Free Quote</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#8C5A3C] via-[#C9945A] to-[#8C5A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            </Link>
            <Link
              to="/consultation"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 text-white/80 px-10 py-4 text-sm font-bold tracking-[0.1em] uppercase hover:border-white/35 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Designs;
