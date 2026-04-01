const Footer = () => {
  return (
    <footer className="bg-charcoal border-t border-primary-foreground/10 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div>
            <a href="#" className="text-2xl font-bold text-primary-foreground">
              CABINET FACTORY<span className="text-gradient-gold">.</span>
            </a>
            <p className="mt-4 text-sm text-primary-foreground/50 leading-relaxed">
              Next-generation CABINET FACTORY interiors engineered with precision and
              elegance.
            </p>
          </div>

          {[
            {
              title: "Company",
              links: ["About", "Careers", "Press", "Blog"],
            },
            {
              title: "Products",
              links: ["Kitchen", "Living Room", "Bedroom", "Office"],
            },
            {
              title: "Support",
              links: ["Contact", "FAQ", "Warranty", "Care Guide"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-primary-foreground mb-4 tracking-wide">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-primary-foreground/50 hover:text-accent transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} CABINET FACTORY. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-xs text-primary-foreground/40 hover:text-accent transition-colors duration-300"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
