import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Target, Monitor, Gem, CalendarDays,
  CheckCircle2, Lock, ArrowLeft, Clock, Wifi, Home,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ─── */
const BENEFITS = [
  {
    Icon: Target,
    title: "Personalised Design Brief",
    desc: "Our designers deeply understand your style, needs, and lifestyle before drawing a single line.",
  },
  {
    Icon: Monitor,
    title: "Free 3D Visualisation",
    desc: "Walk through a photorealistic 3D model of your transformed space before we lift a tool.",
  },
  {
    Icon: Gem,
    title: "Premium Material Curation",
    desc: "Access our exclusive catalogue of hand-picked materials, finishes, and hardware.",
  },
  {
    Icon: CalendarDays,
    title: "Flexible Scheduling",
    desc: "Book online, on-site, or virtually — at a time that works perfectly for you.",
  },
];

const TRUST_ITEMS = [
  "Trusted by 500+ Families",
  "⭐ 4.9/5 Google Rating",
  "120+ Projects Delivered",
  "8 Years of Excellence",
  "Free 3D Preview",
  "No Obligation Quote",
];

const SERVICES = [
  { id: "interior",          label: "Full Interior Design", Icon: Home },
  { id: "kitchen",           label: "Modular Kitchen",      Icon: Gem  },
  { id: "wardrobe",          label: "Custom Wardrobes",     Icon: CalendarDays },
  { id: "renovation",        label: "Renovation",           Icon: Target },
  { id: "commercial",        label: "Commercial Space",     Icon: Monitor },
  { id: "consultation-only", label: "Consultation Only",    Icon: Clock },
];

const TIME_SLOTS = ["10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];

/* ── Tiny toast component ── */
const Toast = ({ msg, onClose }: { msg: string; onClose: () => void }) => (
  <div
    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3
      px-6 py-4 rounded-2xl text-white text-sm font-bold shadow-[0_20px_60px_rgba(0,0,0,0.6)]
      animate-in fade-in slide-in-from-bottom-4 duration-300"
    style={{
      background: "linear-gradient(135deg, rgba(20,20,20,0.97), rgba(30,20,15,0.97))",
      border: "1px solid rgba(140,90,60,0.4)",
      backdropFilter: "blur(20px)",
      maxWidth: "calc(100vw - 3rem)",
    }}
  >
    <CheckCircle2 size={20} className="text-[#8C5A3C] flex-shrink-0" />
    <span>{msg}</span>
    <button
      onClick={onClose}
      className="ml-2 text-white/60 hover:text-white transition-colors text-lg leading-none"
    >
      ×
    </button>
  </div>
);

/* ─── Page ─── */
const Consultation = () => {
  const heroRef     = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const tickerRef   = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    service: "", date: "", time: "",
    mode: "online", notes: "",
  });

  const update = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  /* ── Animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(headlineRef.current, { y: 70, opacity: 0, duration: 1.2, delay: 0.15 })
        .from(".consult-sub", { y: 30, opacity: 0, duration: 0.9 }, "-=0.7")
        .from(".consult-badge", { y: 16, opacity: 0, scale: 0.88, duration: 0.6, stagger: 0.07, ease: "back.out(1.7)" }, "-=0.5")
        .from(formCardRef.current, { y: 60, opacity: 0, scale: 0.97, duration: 1.0 }, "-=0.5");

      /* Benefits — trigger at 75% so no dead space */
      gsap.fromTo(".benefit-card", 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: benefitsRef.current, start: "top 82%" } }
      );
      gsap.fromTo(".consult-heading-anim",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: "power3.out", scrollTrigger: { trigger: benefitsRef.current, start: "top 82%" } }
      );
      gsap.fromTo(ctaRef.current,
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ctaRef.current, start: "top 88%" } }
      );

      /* Ticker marquee */
      if (tickerRef.current) {
        const ticker = tickerRef.current;
        const clone  = ticker.cloneNode(true) as HTMLDivElement;
        ticker.parentElement?.appendChild(clone);
        const w = ticker.offsetWidth;
        gsap.fromTo(
          [ticker, clone],
          { x: (i) => (i === 0 ? 0 : w) },
          { x: (i) => (i === 0 ? -w : 0), duration: 18, ease: "none", repeat: -1 }
        );
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    /* Simulate API call */
    setTimeout(() => {
      setLoading(false);
      gsap.to(formCardRef.current, {
        scale: 0.97, opacity: 0, duration: 0.25, ease: "power2.in",
        onComplete: () => {
          setSubmitted(true);
          showToast("🎉 Consultation booked! Check your email for confirmation.");
        },
      });
    }, 900);
  };

  const today = new Date().toISOString().split("T")[0];

  /* ── Shared input class ── */
  const inputCls = `w-full px-4 py-3 rounded-xl text-sm text-white
    bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)]
    placeholder:text-white/50 outline-none
    focus:border-[#8C5A3C] focus:shadow-[0_0_0_3px_rgba(140,90,60,0.18)]
    transition-all duration-300 appearance-none`;

  return (
    <div ref={heroRef} className="min-h-screen" style={{ background: "#080808" }}>
      <Navbar />

      {/* ── HERO + FORM ── */}
      <div className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[600px] h-[500px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(ellipse, #8C5A3C 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute top-24 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(ellipse, #3B82F6 0%, transparent 70%)", filter: "blur(70px)" }} />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 xl:gap-16 items-start relative z-10">

          {/* ── Left copy ── */}
          <div>
            <p className="text-[10px] font-black tracking-[0.55em] uppercase text-[#8C5A3C] mb-5">
              Book a Session
            </p>
            <h1
              ref={headlineRef}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.06] tracking-tight mb-5"
            >
              Book a Free
              <br />
              <span style={{
                background: "linear-gradient(135deg, #8C5A3C, #C9945A)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontStyle: "italic",
              }}>
                Consultation
              </span>
            </h1>
            <p className="consult-sub text-base sm:text-lg text-white/85 max-w-lg leading-relaxed mb-8">
              Sit down with our senior design team and walk away with a complete
              vision for your space — free, personalised, and no obligation.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {["45-min Session", "3D Preview Included", "No Commitment", "Online or In-Person"].map((b) => (
                <span
                  key={b}
                  className="consult-badge px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide
                    border border-[#C9945A]/50 bg-[#C9945A]/15 text-white"
                >
                  ✦ {b}
                </span>
              ))}
            </div>

            {/* Preview image — desktop only */}
            <div className="mt-10 relative hidden lg:block">
              <div className="absolute -inset-4 rounded-3xl opacity-25 pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(140,90,60,0.4) 0%, transparent 70%)", filter: "blur(40px)" }} />
              <img
                src="/indian_living_room.png"
                alt="Luxury interior consultation"
                className="relative w-full rounded-2xl object-cover"
                style={{ height: "260px", boxShadow: "0 30px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.05)" }}
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: "linear-gradient(0deg, rgba(8,8,8,0.45) 0%, transparent 55%)" }} />
              {/* Stat badges */}
              <div className="absolute bottom-4 left-4 px-4 py-2.5 rounded-xl"
                style={{ background: "rgba(0,0,0,0.68)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[8px] font-black tracking-[0.3em] uppercase text-[#8C5A3C] mb-0.5">Satisfaction</p>
                <p className="text-white font-extrabold text-xl leading-none">98%</p>
              </div>
              <div className="absolute bottom-4 right-4 px-4 py-2.5 rounded-xl"
                style={{ background: "rgba(0,0,0,0.68)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[8px] font-black tracking-[0.3em] uppercase text-[#8C5A3C] mb-0.5">Projects</p>
                <p className="text-white font-extrabold text-xl leading-none">120+</p>
              </div>
            </div>
          </div>

          {/* ── Right form card ── */}
          <div
            ref={formCardRef}
            className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 xl:p-10"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="text-lg sm:text-xl font-extrabold text-white mb-1">Schedule Your Session</h2>
                <p className="text-white/70 text-xs mb-6">All sessions are free. No credit card required.</p>

                {/* Personal info */}
                <div className="space-y-3 sm:space-y-4 mb-5">
                  {[
                    { key: "name",  label: "Full Name", type: "text",  placeholder: "Priya Mehta" },
                    { key: "email", label: "Email",     type: "email", placeholder: "priya@email.com" },
                    { key: "phone", label: "Phone",     type: "tel",   placeholder: "+91 98765 43210" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-[10px] font-black tracking-[0.22em] uppercase text-white/80 mb-1.5">
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={(form as Record<string, string>)[f.key]}
                        onChange={(e) => update(f.key, e.target.value)}
                        required
                        className={inputCls}
                      />
                    </div>
                  ))}
                </div>

                {/* Service selector */}
                <div className="mb-5">
                  <label className="block text-[10px] font-black tracking-[0.22em] uppercase text-white/80 mb-2.5">
                    Service Interested In
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {SERVICES.map(({ id, label, Icon: SI }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => update("service", id)}
                        className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold border transition-all duration-250
                          hover:scale-[1.02] active:scale-[0.97] flex items-center gap-2 ${
                          form.service === id
                            ? "border-[#8C5A3C] bg-[#8C5A3C]/10 text-white shadow-[0_0_10px_rgba(140,90,60,0.18)]"
                            : "border-white/10 bg-white/[0.04] text-white/80 hover:border-white/22 hover:text-white"
                        }`}
                      >
                        <SI size={13} className="flex-shrink-0" />
                        <span className="leading-tight">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode toggle */}
                <div className="mb-5">
                  <label className="block text-[10px] font-black tracking-[0.22em] uppercase text-white/80 mb-2.5">
                    Consultation Mode
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: "online",    label: "Online",    Icon: Wifi },
                      { id: "in-person", label: "In-Person", Icon: Home },
                    ].map(({ id, label, Icon: MI }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => update("mode", id)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all duration-250
                          flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.97] ${
                          form.mode === id
                            ? "border-[#8C5A3C] bg-[#8C5A3C]/12 text-white shadow-[0_0_14px_rgba(140,90,60,0.22)]"
                            : "border-white/10 bg-white/[0.04] text-white/80 hover:border-white/22 hover:text-white"
                        }`}
                      >
                        <MI size={15} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div>
                    <label className="block text-[10px] font-black tracking-[0.22em] uppercase text-white/80 mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={form.date}
                      onChange={(e) => update("date", e.target.value)}
                      required
                      className={inputCls + " [color-scheme:dark]"}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black tracking-[0.22em] uppercase text-white/80 mb-1.5">
                      Time
                    </label>
                    {/* Custom select wrapper — avoids system dropdown color issues */}
                    <div className="relative">
                      <select
                        value={form.time}
                        onChange={(e) => update("time", e.target.value)}
                        required
                        className={inputCls + " pr-9 cursor-pointer"}
                        style={{ color: form.time ? "white" : "rgba(255,255,255,0.3)" }}
                      >
                        <option value="" disabled style={{ background: "#1a1a1a", color: "rgba(255,255,255,0.5)" }}>
                          Select Time
                        </option>
                        {TIME_SLOTS.map((t) => (
                          <option key={t} value={t} style={{ background: "#1a1a1a", color: "white" }}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={15}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-7">
                  <label className="block text-[10px] font-black tracking-[0.22em] uppercase text-white/70 mb-1.5">
                    Notes <span className="normal-case font-normal text-white/55">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your space, style preferences, special requirements..."
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    className={inputCls + " resize-none"}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`relative w-full py-4 rounded-full text-sm font-bold tracking-[0.12em] uppercase text-white
                    overflow-hidden group transition-all duration-300
                    ${loading
                      ? "bg-[#8C5A3C]/60 cursor-not-allowed"
                      : "bg-[#8C5A3C] hover:bg-[#A67352] hover:scale-[1.02] active:scale-[0.97] shadow-[0_0_28px_rgba(140,90,60,0.38)] hover:shadow-[0_0_48px_rgba(140,90,60,0.62)]"
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Booking...
                      </>
                    ) : (
                      "Confirm Booking ✦"
                    )}
                  </span>
                  {!loading && (
                    <span className="absolute inset-0 bg-gradient-to-r from-[#8C5A3C] via-[#C9945A] to-[#8C5A3C]
                      opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-full" />
                  )}
                </button>

                <p className="text-center text-white/75 text-[11px] mt-3 flex items-center justify-center gap-1.5">
                  <Lock size={10} />&nbsp;Your details are kept private. No spam, ever.
                </p>
              </form>
            ) : (
              /* ── Success state ── */
              <div className="text-center py-10 sm:py-14">
                <div
                  className="w-16 h-16 rounded-full bg-[#8C5A3C]/12 border border-[#8C5A3C]/30 flex items-center justify-center mx-auto mb-6"
                  style={{ boxShadow: "0 0 40px rgba(140,90,60,0.3)" }}
                >
                  <CheckCircle2 size={28} className="text-[#8C5A3C]" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-2">You're Booked!</h3>
                <p className="text-white/75 text-sm leading-relaxed mb-2">
                  Thank you, <span className="text-[#8C5A3C] font-bold">{form.name || "there"}</span>!
                </p>
                <p className="text-white/65 text-sm leading-relaxed mb-8">
                  Your <span className="text-white/80">{form.mode}</span> session is confirmed for{" "}
                  <span className="text-white/80">{form.date} at {form.time}</span>.
                  A confirmation was sent to <span className="text-[#8C5A3C]">{form.email}</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 justify-center px-7 py-3.5 rounded-full bg-[#8C5A3C] text-white text-sm font-bold
                      hover:bg-[#A67352] hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <ArrowLeft size={16} /> Back to Home
                  </a>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name:"",email:"",phone:"",service:"",date:"",time:"",mode:"online",notes:"" }); }}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/12
                      text-white/80 text-sm font-bold hover:border-white/28 hover:text-white transition-all duration-300"
                  >
                    Book Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── TICKER ── */}
      <div
        className="py-6 sm:py-8 overflow-hidden border-y border-white/[0.05]"
        style={{
          maskImage: "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)",
          WebkitMaskImage: "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)",
        }}
      >
        <div className="flex whitespace-nowrap">
          <div ref={tickerRef} className="flex items-center gap-10 pr-10 text-[10px] font-black tracking-[0.38em] uppercase text-white/60">
            {TRUST_ITEMS.map((t, i) => (
              <span key={i} className={t.startsWith("⭐") ? "text-yellow-400/40" : ""}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── BENEFITS ── */}
      <div ref={benefitsRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <p className="consult-heading-anim text-[10px] font-black tracking-[0.48em] uppercase text-[#8C5A3C] mb-3">
            Why Choose Us
          </p>
          <h2 className="consult-heading-anim text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            What You'll <span style={{ color: "#C9945A", fontStyle: "italic" }}>Experience</span>
          </h2>
          <p className="consult-heading-anim text-white/70 max-w-sm sm:max-w-md mx-auto text-sm">
            Every consultation is a collaborative journey toward your perfect space.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {BENEFITS.map(({ Icon: BI, title, desc }, i) => (
            <div
              key={title}
              className="benefit-card group relative p-6 sm:p-7 rounded-2xl border border-white/[0.06]
                bg-white/[0.02] hover:border-[#8C5A3C]/28 hover:bg-[#8C5A3C]/[0.04]
                transition-all duration-350 hover:-translate-y-1
                hover:shadow-[0_16px_50px_rgba(0,0,0,0.5)] overflow-hidden cursor-default"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 25% 50%, rgba(140,90,60,0.07) 0%, transparent 70%)" }} />
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-[#8C5A3C]/10 border border-[#8C5A3C]/15
                  flex items-center justify-center mb-4 group-hover:bg-[#8C5A3C]/18 transition-colors duration-300">
                  <BI size={20} className="text-[#C9945A]" />
                </div>
                <h3 className="text-white font-bold text-base sm:text-lg mb-2">{title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
              </div>
              <div className="absolute bottom-4 right-4 text-5xl font-black text-white/[0.025]
                group-hover:text-white/[0.05] transition-colors duration-350 select-none leading-none">
                0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TRUST STATS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { n: "500+",  l: "Families"   },
            { n: "4.9★",  l: "Google"     },
            { n: "120+",  l: "Projects"   },
            { n: "8 Yr",  l: "Experience" },
            { n: "Free",  l: "3D Preview" },
            { n: "0%",    l: "Commitment" },
          ].map((s) => (
            <div
              key={s.l}
              className="flex flex-col items-center text-center py-4 px-2 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <span className="text-lg sm:text-xl font-black text-white mb-0.5">{s.n}</span>
              <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.25em] uppercase text-white/60">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div ref={ctaRef} className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 sm:pb-32 text-center">
        <div
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden py-12 sm:py-16 px-6 sm:px-10"
          style={{
            background: "linear-gradient(175deg, #0d0a08 0%, rgba(140,90,60,0.07) 50%, #080808 100%)",
            border: "1px solid rgba(140,90,60,0.16)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(140,90,60,0.09) 0%, transparent 70%)", filter: "blur(50px)" }} />
          </div>
          <p className="text-[10px] font-black tracking-[0.48em] uppercase text-[#8C5A3C] mb-4 relative z-10">
            No Risk. No Commitment.
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 relative z-10 leading-tight">
            Your Dream Space{" "}
            <span style={{ color: "#C9945A", fontStyle: "italic" }}>Awaits You</span>
          </h2>
          <p className="text-white/80 max-w-sm mx-auto mb-8 relative z-10 text-sm">
            Join 500+ families who transformed their home with Cabinet Factory.
            Your first consultation is always free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative z-10">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="group relative inline-flex items-center overflow-hidden rounded-full bg-[#8C5A3C] text-white
                px-8 sm:px-10 py-3.5 sm:py-4 text-sm font-bold tracking-[0.12em] uppercase
                shadow-[0_0_32px_rgba(140,90,60,0.45)] hover:shadow-[0_0_50px_rgba(140,90,60,0.65)]
                transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95 w-full sm:w-auto justify-center"
            >
              <span className="relative z-10">Book Now — It's Free</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#8C5A3C] via-[#C9945A] to-[#8C5A3C]
                opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            </a>
            <a
              href="/quote"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 text-white/80
                px-8 sm:px-10 py-3.5 sm:py-4 text-sm font-bold tracking-[0.12em] uppercase
                hover:border-white/28 hover:text-white transition-all duration-300 hover:scale-[1.03] active:scale-95
                w-full sm:w-auto justify-center"
            >
              Get a Quote Instead
            </a>
          </div>
        </div>
      </div>

      <Footer />

      {/* ── Toast notification ── */}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Consultation;
