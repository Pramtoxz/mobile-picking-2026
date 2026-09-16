import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar, Style } from '@capacitor/status-bar';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

async function initNativePlugins() {
    const isNative = typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform();

    if (!isNative) {
        return;
    }

    try {
        await ScreenOrientation.lock({ orientation: 'landscape' });
        await StatusBar.setStyle({ style: Style.Dark });
    } catch (error) {
        console.warn('Native plugin error:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNativePlugins);
} else {
    initNativePlugins();
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
