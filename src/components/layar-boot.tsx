import logoMenara from "@/assets/images/logo-menara-horizontal.png";
import { AnimasiLottie } from "@/components/animasi-lottie";

interface LayarBootProps {
  keterangan?: string;
}

export default function LayarBoot({
  keterangan = "DIVISION H3 - PART WAREHOUSE",
}: LayarBootProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-ground p-4 select-none">
      <div className="flex w-full max-w-lg items-center justify-between gap-6 border-2 border-ink bg-panel p-5 rounded-sm shadow-md">
        {/* Kolom Kiri: Branding & Indikator Status */}
        <div className="flex flex-col items-start gap-2.5 min-w-0 flex-1">
          <img
            src={logoMenara}
            alt="Menara Agung"
            className="h-9 w-auto max-w-[180px] object-contain"
          />

          <div className="space-y-1">
            <p className="font-mono text-xs font-bold tracking-wider text-ink uppercase">
              {keterangan}
            </p>
            <p className="font-mono text-[10px] text-ink-2">
              Terminal Operasional Lapangan
            </p>
          </div>

          {/* Indikator Garis Loading Mekanis */}
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-rule">
            <div className="h-full w-full origin-left animate-indeterminate rounded-full bg-honda" />
          </div>
        </div>

        {/* Kolom Kanan: Animasi Lottie Truk (Proporsional Landscape: 110px tinggi) */}
        <div className="h-28 w-44 shrink-0 flex items-center justify-center overflow-hidden">
          <AnimasiLottie
            nama="truk"
            className="h-full w-full object-contain pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
