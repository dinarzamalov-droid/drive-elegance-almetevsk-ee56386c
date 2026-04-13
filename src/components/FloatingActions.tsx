import { cn } from "@/lib/utils";
import { useFooterVisible } from "@/hooks/use-footer-visible";
import FloatingMessenger from "./FloatingMessenger";
import AIChatBot from "./AIChatBot";
import ThemeSwitcher from "./ThemeSwitcher";

const FloatingActions = () => {
  const isFooterVisible = useFooterVisible();

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-4 transition-opacity duration-300",
        isFooterVisible ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      <ThemeSwitcher />
      <AIChatBot />
      <FloatingMessenger />
    </div>
  );
};

export default FloatingActions;
