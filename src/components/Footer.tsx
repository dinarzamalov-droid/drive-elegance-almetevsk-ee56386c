import { MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const footerLinks = [
  { label: "О нас", href: "#about" },
  { label: "Автопарк", href: "#fleet" },
  { label: "Условия", href: "#terms" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Сертификаты", href: "#certificates" },
  { label: "Клуб", href: "#club" },
  { label: "Моё бронирование", href: "/my-booking" },
  { label: "Контакты", href: "#contact" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-4 bg-gradient-dark">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <a href="#">
              <img src={logo} alt="3D Drive" className="h-8" />
            </a>
            <p className="text-xs text-muted-foreground mt-2">Премиальная аренда автомобилей в Альметьевске</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((l) =>
              l.href.startsWith("/") ? (
                <Link key={l.href} to={l.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ) : (
                <a key={l.href} href={l.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </a>
              )
            )}
          </div>

          <div className="flex gap-3">
            <a href="https://wa.me/79868262332" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href="https://t.me/3ddrive" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 3D Drive. Все права защищены.</p>
          <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
