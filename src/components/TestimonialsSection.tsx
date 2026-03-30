import { useState, useEffect } from "react";

const testimonials = [
  {
    quote: "The transformation was beyond anything we imagined. Our 800 sq ft apartment now feels like a luxury penthouse.",
    name: "Arjun Mehta",
    role: "Homeowner, Mumbai",
  },
  {
    quote: "Precision engineering meets artistry. Every detail is considered, every surface is flawless.",
    name: "Priya Sharma",
    role: "Interior Designer",
  },
  {
    quote: "We've worked with many brands — Modular is in a league of its own. Truly premium, truly transformative.",
    name: "Rahul Kapoor",
    role: "Architect, Delhi",
  },
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="py-32 lg:py-40 bg-background">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-accent mb-4">
          Testimonials
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-16">
          What People Say
        </h2>

        <div className="relative min-h-[200px]">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
                i === active
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-light text-foreground leading-relaxed mb-8 max-w-3xl italic">
                "{t.quote}"
              </blockquote>
              <p className="text-base font-semibold text-foreground">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                i === active ? "bg-accent w-8" : "bg-border hover:bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
