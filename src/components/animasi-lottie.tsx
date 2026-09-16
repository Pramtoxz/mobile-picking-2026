import { useGerakDikurangi } from "@/hooks/use-gerak-dikurangi";
import { LottieLight } from "lottie-react";
import { useEffect, useState, type ReactNode } from "react";

const sumber = {
  truk: () => import("@/assets/lottie/truck.json"),
  sukses: () => import("@/assets/lottie/success.json"),
};

export type NamaAnimasi = keyof typeof sumber;

interface AnimasiLottieProps {
  nama: NamaAnimasi;
  loop?: boolean;
  className?: string;
  onSelesai?: () => void;
  gantiDiam?: ReactNode;
}

export function AnimasiLottie({
  nama,
  loop = true,
  className,
  onSelesai,
  gantiDiam,
}: AnimasiLottieProps) {
  const [data, setData] = useState<object | null>(null);
  const gerakDikurangi = useGerakDikurangi();

  useEffect(() => {
    let dibatalkan = false;

    sumber[nama]().then((modul) => {
      if (!dibatalkan) {
        setData(modul.default as object);
      }
    });

    return () => {
      dibatalkan = true;
    };
  }, [nama]);

  useEffect(() => {
    if (!gerakDikurangi || !onSelesai) {
      return;
    }

    const jeda = setTimeout(onSelesai, 700);
    return () => clearTimeout(jeda);
  }, [gerakDikurangi, onSelesai]);

  if (gerakDikurangi) {
    return <div className={className}>{gantiDiam}</div>;
  }

  if (!data) {
    return <div className={className} aria-hidden />;
  }

  return (
    <LottieLight
      src={data}
      loop={loop}
      autoplay
      aria-hidden
      className={className}
      subscriptions={onSelesai ? { complete: onSelesai } : undefined}
    />
  );
}
