import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type StickerFrom = "left" | "right" | "top" | "bottom";

interface Sticker {
  id: string;
  src: string;
  alt: string;
  from: StickerFrom;
  top: string;
  left?: string;
  right?: string;
  rotate: number;
  width: string;
}

const STICKERS: Sticker[] = [
  // ── TOP LEFT ──
  {
    id: "sofa",
    src: "/sticker_sofa.png",
    alt: "Luxury sofa",
    from: "left",
    top: "12%",
    left: "5%",
    rotate: -8,
    width: "clamp(130px, 16vw, 240px)",
  },
  {
    id: "table",
    src: "/sticker_table.png",
    alt: "Side table",
    from: "left",
    top: "45%",
    left: "10%",
    rotate: 5,
    width: "clamp(90px, 12vw, 150px)",
  },

  // ── TOP RIGHT ──
  {
    id: "chair",
    src: "/sticker_chair.png",
    alt: "Accent chair",
    from: "right",
    top: "14%",
    right: "7%",
    rotate: 10,
    width: "clamp(110px, 14vw, 200px)",
  },
  {
    id: "wardrobe",
    src: "/sticker_wardrobe.png",
    alt: "Aesthetic Wardrobe",
    from: "right",
    top: "40%",
    right: "8%",
    rotate: -3,
    width: "clamp(110px, 14vw, 220px)",
  },

  // ── BOTTOM CENTER CLUSTER ──
  {
    id: "lamp",
    src: "/sticker_lamp.png",
    alt: "Floor lamp",
    from: "bottom",
    top: "55%",
    left: "15%",
    rotate: -4,
    width: "clamp(90px, 12vw, 180px)",
  },
  {
    id: "bed",
    src: "/sticker_bed.png",
    alt: "Luxury Bed",
    from: "bottom",
    top: "60%",
    left: "39%",
    rotate: 0,
    width: "clamp(160px, 20vw, 300px)",
  },
  {
    id: "vase",
    src: "/sticker_vase.png",
    alt: "Decorative vase",
    from: "bottom",
    top: "65%",
    right: "18%",
    rotate: 6,
    width: "clamp(75px, 10vw, 130px)",
  },
];

const OFFSCREEN_PX = 280;

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stickerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      STICKERS.forEach((sticker, i) => {
        const el = stickerRefs.current[i];
        if (!el) return;

        const fromX =
          sticker.from === "left"
            ? -OFFSCREEN_PX
            : sticker.from === "right"
            ? OFFSCREEN_PX
            : 0;
        const fromY =
          sticker.from === "top"
            ? -OFFSCREEN_PX
            : sticker.from === "bottom"
            ? OFFSCREEN_PX
            : 0;

        gsap.set(el, {
          x: fromX,
          y: fromY,
          opacity: 0,
          rotate: sticker.rotate * 2.8,
          scale: 0.45,
        });

        gsap.to(el, {
          x: 0,
          y: 0,
          opacity: 1,
          rotate: sticker.rotate,
          scale: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "center 40%",
            scrub: 1.3,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-charcoal -mt-1 relative z-10 w-full overflow-hidden"
    >
      {/* ── Sticker layer ── */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {STICKERS.map((sticker, i) => (
          <div
            key={sticker.id}
            ref={(el) => { stickerRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: sticker.top,
              left: sticker.left,
              right: sticker.right,
              width: sticker.width,
              willChange: "transform, opacity",
              // Since the images have true transparent backgrounds, 
              // we no longer need any CSS mixBlendMode hacks!
              filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))"
            }}
            aria-hidden="true"
          >
            <img
              src={sticker.src}
              alt={sticker.alt}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                display: "block",
                userSelect: "none",
              }}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* ── Ambient glow blobs ── */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute w-96 h-96 rounded-full bg-[#8C5A3C]/8 blur-[100px]"
          style={{ top: "5%", left: "0%" }}
        />
        <div
          className="absolute w-96 h-96 rounded-full bg-[#C9A84C]/5 blur-[100px]"
          style={{ bottom: "5%", right: "0%" }}
        />
      </div>

      {/* ── Main lamp + CTA ── */}
      <LampContainer className="bg-charcoal min-h-[85vh] w-full pt-20">
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="flex flex-col items-center mt-8 w-full max-w-4xl mx-auto px-6 text-center relative z-30"
        >
          <p className="text-sm font-semibold tracking-[0.25em] uppercase text-accent mb-6">
            Let's Begin
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-8 drop-shadow-2xl">
            Ready to transform
            <br />
            <span className="text-gradient-gold">your space?</span>
          </h2>
          <p className="text-lg text-white/70 mb-12 max-w-xl mx-auto leading-relaxed">
            Book a free consultation with our design team and discover what's
            possible with premium craftsmanship and precision.
          </p>
          <Button
            size="lg"
            className="bg-[#8C5A3C] text-white hover:bg-[#A67352] rounded-full px-12 py-7 text-lg font-semibold shadow-[0_0_40px_rgba(140,90,60,0.4)] transition-all duration-300 hover:scale-105 border border-[#8C5A3C]/50 hover:shadow-[0_0_60px_rgba(140,90,60,0.6)] active:scale-95 transition-all duration-1000"
          >
            Book Consultation
          </Button>
        </motion.div>
      </LampContainer>
    </section>
  );
};

export default CTASection;
