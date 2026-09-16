import logoMenara from "@/assets/images/logo-menara-horizontal.png";
import { AnimasiLottie } from "@/components/animasi-lottie";

interface LayarBootProps {
  keterangan?: string;
}

export default function LayarBoot({
  keterangan = "DIVISION H3 - PART WAREHOUSE",
}: LayarBootProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-ground px-6 select-none">
      <div className="flex w-full max-w-sm sm:max-w-md flex-col items-center gap-6">
        {/* Branding & Status Info */}
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src={logoMenara}
            alt="Menara Agung"
            className="h-12 w-auto max-w-[220px] object-contain sm:h-14 sm:max-w-[260px]"
          />

          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium tracking-normal text-slate-600 sm:text-base">
              {keterangan}
            </p>

            {/* Subtle Progress / Activity Bar */}
            <div className="h-1 w-24 overflow-hidden rounded-full bg-ground-2">
              <div className="h-full w-full origin-left animate-indeterminate rounded-full bg-primary/60" />
            </div>
          </div>
        </div>
        {/* Area Animasi Utama */}
        <div className="relative aspect-[4/3] w-full flex items-center justify-center">
          <AnimasiLottie
            nama="truk"
            className="h-full w-full object-contain pointer-events-none drop-shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
