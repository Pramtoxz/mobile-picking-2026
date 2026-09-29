import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Sensory Feedback Engine untuk Terminal Gudang HMI.
 * Menggabungkan Haptic Vibration (Capacitor) dan Hardware Audio Synthesizer (Web Audio API)
 * tanpa memerlukan file MP3 eksternal (0 KB payload).
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
        const AudioClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioClass) {
            audioCtx = new AudioClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

export const sensory = {
    /**
     * Feedback ketukan tombol mekanis atau numpad.
     * Getaran mikro ringan + bunyi klik mekanik 12ms.
     */
    tap: async () => {
        try {
            await Haptics.impact({ style: ImpactStyle.Light });
        } catch {
            if ('vibrate' in navigator) {
                try { navigator.vibrate(10); } catch {}
            }
        }

        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(900, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.015);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.015);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.015);
        } catch {}
    },

    /**
     * Feedback konfirmasi aksi penting (contoh: part selesai diambil).
     * Getaran medium + nada ganda harmonis.
     */
    sukses: async () => {
        try {
            await Haptics.notification({ type: NotificationType.Success });
        } catch {
            if ('vibrate' in navigator) {
                try { navigator.vibrate([25, 40, 35]); } catch {}
            }
        }

        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            
            // Nada 1 (880 Hz - A5)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(880, now);
            gain1.gain.setValueAtTime(0.18, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.08);

            // Nada 2 (1760 Hz - A6)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1760, now + 0.07);
            gain2.gain.setValueAtTime(0.22, now + 0.07);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.07);
            osc2.stop(now + 0.22);
        } catch {}
    },

    /**
     * Feedback kesalahan validasi (contoh: salah hitung buta / peringatan).
     * Getaran peringatan ganda + nada rendah.
     */
    peringatan: async () => {
        try {
            await Haptics.notification({ type: NotificationType.Warning });
        } catch {
            if ('vibrate' in navigator) {
                try { navigator.vibrate([50, 50, 50]); } catch {}
            }
        }

        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        } catch {}
    },
};
