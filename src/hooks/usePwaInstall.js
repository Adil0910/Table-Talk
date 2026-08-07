import { useEffect, useState, useCallback } from 'react';

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true // iOS Safari
  );
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(isStandalone());
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    setIsIos(/iphone|ipad|ipod/i.test(ua) && !window.MSStream);

    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }

    function handleAppInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return null;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return choice.outcome; // 'accepted' | 'dismissed'
  }, [deferredPrompt]);

  // canInstall is true once Chrome/Edge/Android have fired the prompt event.
  // On iOS Safari there's no such event - installing is a manual "Add to
  // Home Screen" step, so we surface isIos so the UI can show instructions.
  return {
    canInstall: !!deferredPrompt && !installed,
    isIos: isIos && !installed,
    installed,
    promptInstall
  };
}
