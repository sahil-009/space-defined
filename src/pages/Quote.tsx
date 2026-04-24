import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Home, Building2, ChefHat, Package,
  Shield, Zap, Trophy, Eye,
  CheckCircle2, ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ─── */
interface FormData {
  projectType: string;
  rooms: string[];
  budget: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

/* ─── Step Config ─── */
const STEPS = [
  { id: 1, label: "Project" },
  { id: 2, label: "Scope" },
  { id: 3, label: "Budget" },
  { id: 4, label: "Contact" },
];

const PROJECT_TYPES = [
  { id: "residential", label: "Residential", Icon: Home,      desc: "Home interiors & renovation" },
  { id: "commercial",  label: "Commercial",  Icon: Building2, desc: "Office & retail spaces" },
  { id: "modular",     label: "Modular Kitchens", Icon: ChefHat, desc: "Premium kitchen solutions" },
  { id: "wardrobe",    label: "Wardrobes",    Icon: Package,   desc: "Custom storage solutions" },
];

const ROOMS = [
  { id: "living",  label: "Living Room"  },
  { id: "bedroom", label: "Bedroom"      },
  { id: "kitchen", label: "Kitchen"      },
  { id: "bathroom",label: "Bathroom"     },
  { id: "office",  label: "Home Office"  },
  { id: "dining",  label: "Dining Room"  },
];

const BUDGETS = [
  { id: "5-10",  label: "₹5L – ₹10L",   desc: "Essential"    },
  { id: "10-25", label: "₹10L – ₹25L",  desc: "Premium"      },
  { id: "25-50", label: "₹25L – ₹50L",  desc: "Luxury"       },
  { id: "50+",   label: "₹50L+",         desc: "Ultra-Luxury" },
];

const TIMELINES = [
  { id: "asap", label: "ASAP"        },
  { id: "1-3m", label: "1–3 Months" },
  { id: "3-6m", label: "3–6 Months" },
  { id: "6m+",  label: "6+ Months"  },
];

const TRUST_CARDS = [
  { Icon: Shield, title: "No Obligation",  desc: "Free estimate with zero commitment required" },
  { Icon: Zap,    title: "48hr Response", desc: "Our team responds within 2 business days" },
  { Icon: Trophy, title: "120+ Projects", desc: "Delivered with 98% client satisfaction" },
  { Icon: Eye,    title: "Free 3D Preview", desc: "Visualise your space before we build" },
];

/* ── Toast ── */
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
    <button onClick={onClose} className="ml-2 text-white/60 hover:text-white transition-colors text-lg leading-none">×</button>
  </div>
);

/* ─── Main Component ─── */
const Quote = () => {
  const heroRef     = useRef<HTMLDivElement>(null);
  const formRef     = useRef<HTMLDivElement>(null);
  const trustRef    = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);

  const [step,      setStep]      = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [toast,     setToast]     = useState<string | null>(null);
  const [formData,  setFormData]  = useState<FormData>({
    projectType: "", rooms: [], budget: "", timeline: "",
    name: "", email: "", phone: "", message: "",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  /* ── Entrance Animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(headlineRef.current, { y: 80, opacity: 0, duration: 1.2, delay: 0.2 })
        .from(subRef.current, { y: 40, opacity: 0, duration: 1.0 }, "-=0.7")
        .from(".quote-step-bar", { y: 30, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(formRef.current, { y: 60, opacity: 0, scale: 0.97, duration: 1.0 }, "-=0.4");

      gsap.from(".trust-card", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: trustRef.current, start: "top 88%" },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  /* ── Step transition animation ── */
  const animateStepTransition = (direction: "next" | "prev") => {
    if (!formRef.current) return;
    const xFrom = direction === "next" ? 60 : -60;
    gsap.fromTo(formRef.current,
      { x: xFrom, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  };

  const nextStep = () => {
    if (step < STEPS.length) {
      setStep(s => s + 1);
      animateStepTransition("next");
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(s => s - 1);
      animateStepTransition("prev");
    }
  };

  const toggleRoom = (id: string) => {
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.includes(id) ? prev.rooms.filter(r => r !== id) : [...prev.rooms, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast("✅ Quote request sent! We'll contact you within 48 hours.");
    }, 900);
  };

  const canNext = () => {
    if (step === 1) return !!formData.projectType;
    if (step === 2) return formData.rooms.length > 0;
    if (step === 3) return !!formData.budget && !!formData.timeline;
    return true;
  };

  return (
    <div className="min-h-screen" style={{ background: "#080808" }}>
      <Navbar />

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(ellipse, #8C5A3C 0%, transparent 70%)", filter: "blur(80px)" }} />
        </div>

        <p className="text-[11px] font-black tracking-[0.5em] uppercase text-[#8C5A3C] mb-6">
          Cabinet Factory
        </p>
        <h1
          ref={headlineRef}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6"
        >
          Get Your <br />
          <span style={{
            background: "linear-gradient(135deg, #8C5A3C, #C9945A, #8C5A3C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontStyle: "italic",
          }}>
            Free Quote
          </span>
        </h1>
        <p
          ref={subRef}
          className="text-base sm:text-lg text-white/85 max-w-xl mx-auto leading-relaxed"
        >
          Tell us about your space, and our design team will craft a personalised
          proposal within 48 hours — completely free, zero obligation.
        </p>

        {/* Step progress bar */}
        <div className="quote-step-bar flex items-center justify-center gap-0 mt-12 max-w-sm mx-auto">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 ${step >= s.id ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-400
                  ${step > s.id
                    ? "bg-[#8C5A3C] text-white shadow-[0_0_16px_rgba(140,90,60,0.5)]"
                    : step === s.id
                    ? "bg-[#8C5A3C]/20 border-2 border-[#8C5A3C] text-[#8C5A3C]"
                    : "bg-white/5 border border-white/10 text-white/50"
                  }`}>
                  {step > s.id ? "✓" : s.id}
                </div>
                <span className={`text-[9px] font-bold tracking-widest uppercase ${step >= s.id ? "text-white/80" : "text-white/55"}`}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`mx-1 w-12 sm:w-20 h-px transition-all duration-500 -mt-4 ${step > s.id ? "bg-[#8C5A3C]" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── FORM CARD ── */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        {!submitted ? (
          <div
            ref={formRef}
            className="rounded-3xl p-8 sm:p-12"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Step 1 — Project Type */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">What are you designing?</h2>
                  <p className="text-white/75 text-sm mb-7">Select the type of project you have in mind.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {PROJECT_TYPES.map(({ id, label, Icon: PI, desc }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, projectType: id }))}
                        className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300
                          hover:scale-[1.02] active:scale-[0.98]
                          ${formData.projectType === id
                            ? "border-[#8C5A3C] bg-[#8C5A3C]/10 shadow-[0_0_20px_rgba(140,90,60,0.25)]"
                            : "border-white/8 bg-white/3 hover:border-white/18 hover:bg-white/5"
                          }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3
                          group-hover:bg-[#8C5A3C]/15 transition-colors duration-300">
                          <PI size={20} className={formData.projectType === id ? "text-[#C9945A]" : "text-white/70"} />
                        </div>
                        <h3 className="text-white font-bold text-sm sm:text-base mb-1">{label}</h3>
                        <p className="text-white/75 text-xs">{desc}</p>
                        {formData.projectType === id && (
                          <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-[#8C5A3C] flex items-center justify-center">
                            <CheckCircle2 size={12} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 — Rooms */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">Which rooms are involved?</h2>
                  <p className="text-white/75 text-sm mb-8">Select all spaces you'd like to transform.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ROOMS.map(room => {
                      const active = formData.rooms.includes(room.id);
                      return (
                        <button
                          key={room.id}
                          type="button"
                          onClick={() => toggleRoom(room.id)}
                          className={`relative py-4 px-5 rounded-xl border text-sm font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]
                            ${active
                              ? "border-[#8C5A3C] bg-[#8C5A3C]/15 text-white shadow-[0_0_16px_rgba(140,90,60,0.25)]"
                              : "border-white/10 bg-white/[0.04] text-white/80 hover:border-white/25 hover:text-white"
                            }`}
                        >
                          {room.label}
                          {active && <span className="absolute top-2 right-2 text-[#8C5A3C] text-xs">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3 — Budget + Timeline */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">Budget & Timeline</h2>
                  <p className="text-white/75 text-sm mb-8">Help us plan the perfect experience for you.</p>

                  <h3 className="text-white/80 text-xs font-black tracking-[0.3em] uppercase mb-4">Budget Range</h3>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {BUDGETS.map(b => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, budget: b.id }))}
                        className={`text-left p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]
                          ${formData.budget === b.id
                            ? "border-[#8C5A3C] bg-[#8C5A3C]/15 shadow-[0_0_20px_rgba(140,90,60,0.25)]"
                            : "border-white/8 bg-white/3 hover:border-white/20"
                          }`}
                      >
                        <span className={`text-xs font-black tracking-[0.2em] uppercase mb-1 block ${formData.budget === b.id ? "text-[#C9945A]" : "text-white/70"}`}>
                          {b.desc}
                        </span>
                        <span className="text-white font-bold text-base">{b.label}</span>
                      </button>
                    ))}
                  </div>

                  <h3 className="text-white/80 text-xs font-black tracking-[0.3em] uppercase mb-4">Ideal Timeline</h3>
                  <div className="flex flex-wrap gap-3">
                    {TIMELINES.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, timeline: t.id }))}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 hover:scale-105 active:scale-95
                          ${formData.timeline === t.id
                            ? "border-[#8C5A3C] bg-[#8C5A3C]/15 text-white shadow-[0_0_16px_rgba(140,90,60,0.3)]"
                            : "border-white/10 bg-white/[0.04] text-white/80 hover:border-white/28 hover:text-white"
                          }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4 — Contact */}
              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">Almost there!</h2>
                  <p className="text-white/75 text-sm mb-8">Share your details and we'll be in touch within 48 hours.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { key: "name", label: "Full Name", type: "text", placeholder: "Arjun Sharma", full: false },
                      { key: "email", label: "Email Address", type: "email", placeholder: "arjun@email.com", full: false },
                      { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", full: true },
                    ].map(field => (
                      <div key={field.key} className={field.full ? "sm:col-span-2" : ""}>
                        <label className="block text-xs font-black tracking-[0.2em] uppercase text-white/80 mb-2">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={(formData as Record<string, string>)[field.key] as string}
                          onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                          required
                          className="w-full px-4 py-3.5 rounded-xl text-sm text-white bg-white/[0.06] border border-white/12 placeholder-white/35
                            focus:outline-none focus:border-[#8C5A3C] focus:shadow-[0_0_0_3px_rgba(140,90,60,0.15)]
                            transition-all duration-300"
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black tracking-[0.2em] uppercase text-white/80 mb-2">Message (Optional)</label>
                      <textarea
                        placeholder="Tell us more about your vision..."
                        rows={4}
                        value={formData.message}
                        onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full px-4 py-3.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 placeholder-white/25 resize-none
                          focus:outline-none focus:border-[#8C5A3C] focus:shadow-[0_0_0_3px_rgba(140,90,60,0.15)]
                          transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/8">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-6 py-3 rounded-full text-sm font-bold border border-white/20 text-white/80 hover:text-white hover:border-white/38 transition-all duration-300 ${step === 1 ? "invisible" : ""}`}
                >
                  ← Back
                </button>
                {step < STEPS.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canNext()}
                    className={`relative px-10 py-3.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 overflow-hidden
                      ${canNext()
                        ? "bg-[#8C5A3C] text-white hover:bg-[#A67352] hover:scale-105 active:scale-95 shadow-[0_0_24px_rgba(140,90,60,0.4)] hover:shadow-[0_0_40px_rgba(140,90,60,0.6)]"
                        : "bg-white/[0.06] text-white/50 cursor-not-allowed border border-white/10"
                      }`}
                  >
                    <span className="relative z-10">Continue →</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`relative px-8 sm:px-10 py-3.5 rounded-full text-sm font-bold tracking-wide
                      transition-all duration-300 overflow-hidden group
                      ${loading
                        ? "bg-[#8C5A3C]/60 text-white cursor-not-allowed"
                        : "bg-[#8C5A3C] text-white hover:bg-[#A67352] hover:scale-105 active:scale-95 shadow-[0_0_32px_rgba(140,90,60,0.45)] hover:shadow-[0_0_50px_rgba(140,90,60,0.65)]"
                      }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                          Sending...
                        </>
                      ) : "Send My Request ✦"}
                    </span>
                    {!loading && (
                      <span className="absolute inset-0 bg-gradient-to-r from-[#8C5A3C] via-[#C9945A] to-[#8C5A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          /* ── Success State ── */
          <div className="text-center py-16 sm:py-24 px-6 rounded-3xl"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(140,90,60,0.18)" }}>
            <div className="w-20 h-20 rounded-full bg-[#8C5A3C]/12 border border-[#8C5A3C]/28 flex items-center justify-center mx-auto mb-8"
              style={{ boxShadow: "0 0 50px rgba(140,90,60,0.28)" }}>
              <CheckCircle2 size={36} className="text-[#8C5A3C]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Request Sent!</h2>
            <p className="text-white/80 max-w-md mx-auto leading-relaxed text-sm">
              Thank you, <span className="text-[#8C5A3C] font-bold">{formData.name || "valued client"}</span>.
              Our design team will review your project and get back to you within 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <a href="/" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#8C5A3C] text-white text-sm font-bold
                hover:bg-[#A67352] hover:scale-105 active:scale-95 transition-all duration-300">
                <ArrowLeft size={16} /> Back to Home
              </a>
              <button onClick={() => { setSubmitted(false); setStep(1); setFormData({ projectType:"",rooms:[],budget:"",timeline:"",name:"",email:"",phone:"",message:"" }); }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/12 text-white/70 text-sm font-bold
                  hover:border-white/28 hover:text-white transition-all duration-300">
                New Quote
              </button>
            </div>
          </div>
        )}

        {/* ── Sticky summary sidebar (mobile: below form) ── */}
        {!submitted && step > 1 && (
          <div className="mt-6 px-6 py-5 rounded-2xl flex flex-wrap items-center gap-4"
            style={{ background: "rgba(140,90,60,0.05)", border: "1px solid rgba(140,90,60,0.15)" }}>
            <span className="text-xs font-black tracking-widest uppercase text-[#8C5A3C]">Your Selection</span>
            {formData.projectType && (
              <span className="text-xs text-white/70 bg-white/5 px-3 py-1 rounded-full">
                {PROJECT_TYPES.find(p => p.id === formData.projectType)?.label}
              </span>
            )}
            {formData.rooms.length > 0 && (
              <span className="text-xs text-white/80 bg-white/[0.06] px-3 py-1 rounded-full">
                {formData.rooms.length} room{formData.rooms.length > 1 ? "s" : ""}
              </span>
            )}
            {formData.budget && (
              <span className="text-xs text-white/80 bg-white/[0.06] px-3 py-1 rounded-full">
                {BUDGETS.find(b => b.id === formData.budget)?.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── TRUST CARDS ── */}
      <div ref={trustRef} className="max-w-6xl mx-auto px-6 pb-32">
        <p className="text-[10px] font-black tracking-[0.45em] uppercase text-[#8C5A3C] text-center mb-10">
          Why Cabinet Factory
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRUST_CARDS.map(({ Icon: TI, title, desc }) => (
            <div
              key={title}
              className="trust-card group p-5 sm:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]
                hover:border-[#8C5A3C]/28 hover:bg-[#8C5A3C]/[0.05]
                transition-all duration-350 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="w-11 h-11 rounded-xl bg-[#8C5A3C]/8 border border-[#8C5A3C]/12
                flex items-center justify-center mb-4 group-hover:bg-[#8C5A3C]/18 transition-colors duration-300">
                <TI size={20} className="text-[#C9945A]" />
              </div>
              <h3 className="text-white font-bold text-sm sm:text-base mb-2">{title}</h3>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      {/* Toast */}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Quote;
