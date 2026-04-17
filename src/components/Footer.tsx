import { useEffect, useRef, Suspense, lazy } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Lazy-load 3D canvas ────────────────────────────────────────────────────
const FooterCanvas = lazy(() => import("./FooterCanvas"));

// ─── Social Icons ────────────────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

const FooterColumn = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-5">
    <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8C5A3C]">
      {title}
    </h4>
    {children}
  </div>
);

const FooterLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    className="group relative inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors duration-300 w-fit"
  >
    <span className="relative">
      {label}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#8C5A3C] transition-all duration-400 ease-out group-hover:w-full" />
    </span>
    <span className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-[#8C5A3C] text-xs">
      →
    </span>
  </a>
);

const SocialLinks = () => {
  const socials = [
    { icon: <InstagramIcon />, href: "#", label: "Instagram" },
    { icon: <PinterestIcon />, href: "#", label: "Pinterest" },
    { icon: <WhatsAppIcon />, href: "https://wa.me/", label: "WhatsApp" },
  ];

  return (
    <div className="flex items-center gap-3">
      {socials.map(({ icon, href, label }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          aria-label={label}
          className="group relative flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-[#8C5A3C]/60 hover:bg-[#8C5A3C]/10 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_16px_rgba(140,90,60,0.35)]"
        >
          {icon}
        </a>
      ))}
    </div>
  );
};

const CTASection = () => (
  <div className="flex flex-col gap-5">
    <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8C5A3C]">
      Get Started
    </h4>
    <p className="text-xl font-bold text-white leading-snug max-w-[220px]">
      Start your dream space{" "}
      <span className="italic font-light text-[#A67352]">today.</span>
    </p>
    <p className="text-sm text-white/40 max-w-[200px] leading-relaxed">
      Let's craft interiors that inspire. Every detail, perfected.
    </p>
    <a
      href="#contact"
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3 text-sm font-bold tracking-widest uppercase text-white border border-[#8C5A3C]/50 bg-[#8C5A3C]/15 transition-all duration-400 hover:border-[#8C5A3C] hover:bg-[#8C5A3C]/30 hover:shadow-[0_0_32px_rgba(140,90,60,0.3)] hover:-translate-y-0.5 w-fit"
    >
      <span className="relative z-10">Book Consultation</span>
      <span className="absolute inset-0 bg-gradient-to-r from-[#8C5A3C]/0 via-[#A67352]/20 to-[#8C5A3C]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
    </a>
  </div>
);

// ─── Back to Top ──────────────────────────────────────────────────────────────
const BackToTop = () => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Back to top"
      className="group flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-white/30 hover:text-[#A67352] transition-colors duration-300"
    >
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/10 group-hover:border-[#8C5A3C]/50 group-hover:bg-[#8C5A3C]/10 transition-all duration-300 group-hover:-translate-y-0.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          className="w-3 h-3"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </span>
      Back to top
    </button>
  );
};

// ─── Main Footer ──────────────────────────────────────────────────────────────
const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const cols = useRef<(HTMLDivElement | null)[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal columns staggered on scroll
      gsap.from(cols.current.filter(Boolean), {
        y: 50,
        opacity: 0,
        duration: 1.0,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(dividerRef.current, {
        scaleX: 0,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        transformOrigin: "left center",
        scrollTrigger: {
          trigger: dividerRef.current,
          start: "top 92%",
          once: true,
        },
      });

      gsap.from(bottomRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bottomRef.current,
          start: "top 96%",
          once: true,
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const navLinks = [
    { label: "Designs", href: "#designs" },
    { label: "Features", href: "#features" },
    { label: "Materials", href: "#materials" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Our Story", href: "#story" },
    { label: "Careers", href: "#careers" },
  ];

  const contactItems = [
    { icon: "📍", text: "Bengaluru, Karnataka, India" },
    { icon: "📞", text: "+91 98765 43210" },
    { icon: "✉️", text: "hello@cabinetfactory.in" },
    { icon: "🕐", text: "Mon – Sat, 9am – 7pm" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(175deg, #080808 0%, #0a0c12 40%, #06080f 70%, #050608 100%)",
      }}
    >
      {/* Ambient glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(ellipse at center, #8C5A3C 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{
            background:
              "radial-gradient(ellipse at center, #1a2a4a 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* ── CTA Banner ── */}
      <div
        className="relative border-b border-white/[0.04]"
        style={{
          background:
            "linear-gradient(90deg, rgba(140,90,60,0.05) 0%, rgba(26,42,74,0.04) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left copy */}
          <div className="text-center lg:text-left">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8C5A3C] mb-3">
              Premium Interiors
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Start your{" "}
              <span className="italic font-light text-[#A67352]">dream</span>{" "}
              space today
            </h2>
          </div>

          {/* 3D Canvas */}
          <div className="relative w-48 h-48 lg:w-56 lg:h-56 flex-shrink-0">
            <Suspense fallback={<div className="w-full h-full" />}>
              <FooterCanvas />
            </Suspense>
          </div>

          {/* Right CTA */}
          <div className="flex flex-col items-center lg:items-end gap-4">
            <a
              href="#contact"
              className="group relative inline-flex items-center overflow-hidden rounded-full bg-[#8C5A3C] text-white px-10 py-4 text-sm font-bold tracking-[0.15em] uppercase shadow-[0_8px_30px_rgba(140,90,60,0.3)] hover:shadow-[0_8px_40px_rgba(140,90,60,0.5)] transition-all duration-400 hover:-translate-y-1"
            >
              <span className="relative z-10">Book Consultation</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#8C5A3C] to-[#A67352] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <p className="text-[11px] text-white/30 tracking-wider">
              Free initial consultation · No commitment
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {/* Col 1 — Brand */}
        <div
          ref={(el) => { cols.current[0] = el; }}
          className="flex flex-col gap-6"
        >
          <a
            href="#"
            className="inline-block hover:opacity-80 transition-opacity duration-300"
          >
            <img src="/logo.jpeg" alt="Cabinet Factory" className="h-12 w-auto object-contain rounded-md brightness-0 invert opacity-90" />
          </a>
          <p className="text-sm text-white/35 leading-relaxed max-w-[200px]">
            Transforming living spaces into luxury experiences through precision
            craftsmanship and timeless design.
          </p>
          <SocialLinks />
          <div className="mt-2">
            <span className="inline-block text-[9px] font-bold tracking-[0.3em] uppercase text-white/20 border border-white/10 rounded-full px-3 py-1">
              Since 2010
            </span>
          </div>
        </div>

        {/* Col 2 — Navigation */}
        <div
          ref={(el) => { cols.current[1] = el; }}
        >
          <FooterColumn title="Navigation">
            <nav className="flex flex-col gap-3">
              {navLinks.map(({ label, href }) => (
                <FooterLink key={label} href={href} label={label} />
              ))}
            </nav>
          </FooterColumn>
        </div>

        {/* Col 3 — Contact */}
        <div
          ref={(el) => { cols.current[2] = el; }}
        >
          <FooterColumn title="Contact">
            <ul className="flex flex-col gap-4">
              {contactItems.map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="text-base leading-none mt-0.5 opacity-60">
                    {icon}
                  </span>
                  <span className="text-sm text-white/45 leading-snug">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </FooterColumn>
        </div>

        {/* Col 4 — CTA */}
        <div
          ref={(el) => { cols.current[3] = el; }}
        >
          <CTASection />
        </div>
      </div>

      {/* ── Divider ── */}
      <div
        ref={dividerRef}
        className="max-w-7xl mx-auto px-6 lg:px-12"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── Bottom bar ── */}
      <div
        ref={bottomRef}
        className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <p className="text-[11px] text-white/20 tracking-wider">
          © {new Date().getFullYear()} Cabinet Factory. All rights reserved.
        </p>
        <div className="flex items-center gap-8">
          {["Privacy Policy", "Terms of Use"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[11px] text-white/20 hover:text-white/50 tracking-wider transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </div>
        <BackToTop />
      </div>
    </footer>
  );
};

export default Footer;
