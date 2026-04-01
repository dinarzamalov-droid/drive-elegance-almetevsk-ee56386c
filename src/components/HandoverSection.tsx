import { ClipboardCheck, Users, Camera, FileText, RotateCcw, Ban } from "lucide-react";
import AnimatedSection, { AnimatedItem } from "./AnimatedSection";

const steps = [
  { num: "01", icon: ClipboardCheck, title: "Подготовка автомобиля", desc: "Мойка, проверка технического состояния, заправка топливом перед каждой выдачей" },
  { num: "02", icon: Users, title: "Встреча и анкета", desc: "Проверка документов (паспорт, водительское удостоверение), заполнение анкеты арендатора" },
  { num: "03", icon: Camera, title: "Фотофиксация", desc: "Совместный осмотр автомобиля, фиксация состояния кузова и салона на фото и видео" },
  { num: "04", icon: FileText, title: "Акт приёма-передачи", desc: "Подписание акта с описанием состояния авто, пробега и уровня топлива" },
  { num: "05", icon: RotateCcw, title: "Возврат", desc: "Повторный осмотр, сверка с актом, возврат залога при отсутствии повреждений" },
];

const restrictions = [
  "Передача автомобиля третьим лицам запрещена",
  "Коммерческое использование без согласования запрещено",
  "Участие в гонках и дрифт запрещены",
  "Любая противоправная деятельность запрещена",
  "Курение в салоне и перевозка животных без переноски запрещены",
];

const HandoverSection = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Порядок выдачи</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Выдача и <span className="text-gradient-gold">осмотр</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-16">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <AnimatedItem key={s.num} delay={i * 0.1}>
                <div className="bg-card-gradient border border-border rounded-2xl p-5 text-center h-full flex flex-col">
                  <div className="text-4xl font-black text-gradient-gold opacity-30 mb-3">{s.num}</div>
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-xs text-muted-foreground flex-1">{s.desc}</p>
                </div>
              </AnimatedItem>
            );
          })}
        </div>

        <AnimatedSection delay={0.3}>
          <div className="max-w-2xl mx-auto bg-card-gradient border border-destructive/30 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                <Ban className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Ограничения при аренде</h3>
            </div>
            <ul className="space-y-3">
              {restrictions.map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Ban className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HandoverSection;
