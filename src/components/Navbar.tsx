import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const isDarkPage = ["/designs", "/quote", "/consultation"].includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Smooth scroll for anchor links ── */
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 600);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ── Nav config ── */
  const homeLinks = [
    { label: "Designs",      href: "#designs"      },
    { label: "Features",     href: "#features"     },
    { label: "Materials",    href: "#materials"    },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact",      href: "#contact"      },
  ];

  const pageLinks = [
    { label: "Home",         href: "/"              },
    { label: "Designs",      href: "/designs"       },
    { label: "Quote",        href: "/quote"         },
    { label: "Consultation", href: "/consultation"  },
  ];

  const links = isHome ? homeLinks : pageLinks;
  const isAnchor = (href: string) => href.startsWith("#");

  /* ── Styles ── */
  const textColor = isDarkPage
    ? "text-white hover:text-[#C9945A]"
    : "text-black/80 hover:text-[#8C5A3C]";

  const pill = scrolled
    ? isDarkPage
      ? "bg-[#0d0d0d]/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.45)] border border-white/[0.07] rounded-full px-6 lg:px-8 h-16"
      : "bg-white/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/[0.06] rounded-full px-6 lg:px-8 h-16"
    : isDarkPage
      ? "bg-transparent h-20"
      : "bg-transparent h-20";

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled ? "pt-4 px-4" : "pt-5 px-5 lg:px-8"
      }`}
    >
      <div className={`mx-auto flex items-center justify-between transition-all duration-500 ease-in-out max-w-5xl ${pill}`}>

        {/* ── Logo ── */}
        <Link to="/" className="flex-shrink-0 hover:opacity-85 transition-opacity duration-200">
          {/* Wrap logo in a pill that ensures visibility on any background */}
          <div className={`rounded-xl overflow-hidden transition-all duration-300 ${
            isDarkPage && !scrolled
              ? "bg-white/[0.92] shadow-[0_2px_16px_rgba(0,0,0,0.35)] p-1"
              : isDarkPage && scrolled
              ? "bg-white/[0.88] shadow-sm p-1"
              : !scrolled
              ? "bg-white/80 shadow-sm p-1"
              : ""
          }`}>
            <img
              src="/logo.jpeg"
              alt="Cabinet Factory"
              className="h-8 sm:h-10 w-auto object-contain rounded-lg"
            />
          </div>
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden md:flex items-center gap-7 lg:gap-9">
          {links.map((l) => {
            const anchor = isAnchor(l.href);
            const isActive = !anchor && location.pathname === l.href;
            return anchor ? (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => handleAnchorClick(e, l.href)}
                className={`relative text-[11.5px] font-bold tracking-[0.16em] uppercase transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer select-none ${textColor}`}
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#8C5A3C] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100 rounded-full" />
              </a>
            ) : (
              <Link
                key={l.label}
                to={l.href}
                className={`relative text-[11.5px] font-bold tracking-[0.16em] uppercase transition-all duration-300 hover:-translate-y-0.5 group ${textColor} ${isActive ? "!text-[#C9945A]" : ""}`}
              >
                {l.label}
                <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] bg-[#8C5A3C] transition-all duration-300 rounded-full ${
                  isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                }`} />
              </Link>
            );
          })}
        </div>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:block">
          <Link
            to="/quote"
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[12px] font-black tracking-[0.14em] uppercase text-white
              bg-[#8C5A3C] hover:bg-[#A67352]
              hover:shadow-[0_0_28px_rgba(140,90,60,0.55)]
              hover:-translate-y-0.5 hover:scale-105 active:scale-95
              transition-all duration-300"
          >
            GET QUOTE
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
            isDarkPage
              ? "text-white hover:text-[#C9945A]"
              : "text-black/80 hover:text-[#8C5A3C]"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div className={`md:hidden absolute top-full left-4 right-4 mt-2 rounded-3xl p-5 shadow-2xl z-50
          animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-2xl
          ${isDarkPage
            ? "bg-[#0d0d0d]/95 border border-white/[0.08]"
            : "bg-white/95 border border-black/[0.06]"
          }`}
        >
          <div className="flex flex-col gap-1">
            {links.map((l) => {
              const anchor = isAnchor(l.href);
              const isActive = !anchor && location.pathname === l.href;
              return anchor ? (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => handleAnchorClick(e, l.href)}
                  className={`block py-3.5 px-4 text-sm font-bold tracking-[0.12em] uppercase text-center rounded-2xl transition-all duration-200 cursor-pointer ${
                    isDarkPage
                      ? "text-white hover:text-[#C9945A] hover:bg-white/[0.08]"
                      : "text-black/70 hover:text-[#8C5A3C] hover:bg-black/[0.04]"
                  }`}
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  to={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-3.5 px-4 text-sm font-bold tracking-[0.12em] uppercase text-center rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "text-[#C9945A] bg-[#8C5A3C]/10"
                      : isDarkPage
                      ? "text-white hover:text-[#C9945A] hover:bg-white/[0.08]"
                      : "text-black/70 hover:text-[#8C5A3C] hover:bg-black/[0.04]"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <div className={`mt-3 pt-3 border-t ${ isDarkPage ? "border-white/[0.08]" : "border-black/[0.06]" }`}>
              <Link
                to="/quote"
                onClick={() => setMobileOpen(false)}
                className="block w-full py-3.5 text-center bg-[#8C5A3C] text-white rounded-full font-black tracking-[0.14em] uppercase text-sm
                  hover:bg-[#A67352] hover:shadow-[0_0_24px_rgba(140,90,60,0.4)]
                  transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
