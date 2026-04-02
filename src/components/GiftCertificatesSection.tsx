import AnimatedSection from "./AnimatedSection";
import CustomCertificateForm from "./CustomCertificateForm";

const GiftCertificatesSection = () => {
  return (
    <section id="certificates" className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-12">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">
            Подарочные сертификаты
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-3">
            Подарите <span className="text-gradient-gold">впечатление</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Подарочный сертификат на любую сумму от 1 000 до 50 000 ₽ — идеальный подарок для близких, партнёров или сотрудников
          </p>
        </AnimatedSection>

        {/* Custom amount form */}
        <CustomCertificateForm />
      </div>
    </section>
  );
};

export default GiftCertificatesSection;
