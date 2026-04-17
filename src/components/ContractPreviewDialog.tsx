import { useEffect, useRef } from "react";
import { Download, Check, X, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ContractPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  blobUrl: string | null;
  fileName: string;
  onDownload: () => void;
  onAgree?: () => void;
  showAgreeButton?: boolean;
}

const ContractPreviewDialog = ({
  open,
  onClose,
  blobUrl,
  fileName,
  onDownload,
  onAgree,
  showAgreeButton = true,
  }: ContractPreviewDialogProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePrint = () => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      win.focus();
      win.print();
    } catch {
      // Fallback: open in new tab and trigger print
      if (blobUrl) {
        const w = window.open(blobUrl, "_blank");
        w?.addEventListener("load", () => w.print());
      }
    }
  };

  // Revoke blob URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (blobUrl) {
        // Delay revoke so iframe finishes rendering before cleanup
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      }
    };
  }, [blobUrl]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 flex flex-col gap-0 bg-card">
        <DialogHeader className="px-5 py-3 border-b border-border flex-row items-center justify-between space-y-0">
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-base sm:text-lg truncate">Договор аренды</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Внимательно ознакомьтесь с условиями договора перед подтверждением
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 rounded-md hover:bg-secondary transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-hidden bg-secondary/30">
          {blobUrl ? (
            <iframe
              ref={iframeRef}
              src={blobUrl}
              title="Договор аренды"
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Загрузка договора…
            </div>
          )}
        </div>

        <div className="border-t border-border px-4 py-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm border border-primary text-primary hover:bg-primary/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            Скачать PDF
          </button>
          <button
            type="button"
            onClick={handlePrint}
            disabled={!blobUrl}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm border border-border text-foreground hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="w-4 h-4" />
            Печать
          </button>
          {showAgreeButton && onAgree && (
            <button
              type="button"
              onClick={() => {
                onAgree();
                onClose();
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm",
                "bg-gradient-gold text-primary-foreground hover:opacity-90 transition-opacity"
              )}
            >
              <Check className="w-4 h-4" />
              Ознакомился, согласен
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractPreviewDialog;
