import { useNavigate } from "react-router-dom";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";

interface PdfViewerProps {
  title: string;
  fileId: string;
}

export const PdfViewer = ({ title, fileId }: PdfViewerProps) => {
  const navigate = useNavigate();
  const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const externalUrl = `https://drive.google.com/file/d/${fileId}/view`;
  return (
    <MobileShell>
      <div className="min-h-screen safe-px pt-12 pb-8">
        <div className="flex items-center justify-between gap-2">
          <button
            aria-label="Kembali"
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-foreground/70"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold text-foreground truncate">{title}</h1>
          <div className="w-9" />
        </div>

        <div className="mt-4 rounded-2xl overflow-hidden border border-border bg-card shadow-card">
          <iframe
            src={previewUrl}
            title={title}
            className="w-full h-[80vh] border-0"
            allow="autoplay"
          />
        </div>

        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full rounded-full border border-primary/30 bg-card text-foreground py-3 flex items-center justify-center gap-2 text-sm font-medium active:scale-[0.99] transition"
        >
          <ExternalLink className="h-4 w-4" /> Buka di Google Drive
        </a>
      </div>
    </MobileShell>
  );
};

const BukuAjar = () => (
  <PdfViewer title="Buku Ajar Intensitas Bunyi" fileId="1s7tKw-3vG5oCaywA5OGE61uJiBdIK7Cx" />
);

export default BukuAjar;
