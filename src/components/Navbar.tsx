import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "О нас", href: "#about" },
  { label: "Автопарк", href: "#fleet" },
  { label: "Условия", href: "#terms" },
  { label: "Преимущества", href: "#why-us" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Сертификаты", href: "#certificates" },
  { label: "Клуб", href: "#club" },
  { label: "Контакты", href: "#contact" },
  { label: "Туристам", href: "/tourism" },
  { label: "Удобства", href: "/features" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        <a href="#">
          <img src={logo} alt="3D Drive" className="h-9" />
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href="tel:+79868262332"
            className="flex items-center gap-2 bg-gradient-gold text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Phone className="w-4 h-4" />
            Позвонить
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-foreground"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              >
                {item.label}
              </a>
            ))}
            <a
              href="tel:+79868262332"
              className="flex items-center justify-center gap-2 bg-gradient-gold text-primary-foreground px-5 py-3 rounded-lg text-sm font-semibold mt-2"
            >
              <Phone className="w-4 h-4" />
              +7 (986) 826 23 32
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
