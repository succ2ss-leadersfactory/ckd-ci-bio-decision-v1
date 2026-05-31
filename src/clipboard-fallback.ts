function fallbackCopyText(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      ok ? resolve() : reject(new Error('Fallback copy failed'));
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
}

function installClipboardFallback() {
  const originalWriteText = navigator.clipboard?.writeText?.bind(navigator.clipboard);

  const patchedClipboard = {
    ...(navigator.clipboard || {}),
    writeText: async (text: string) => {
      if (originalWriteText) {
        try {
          await originalWriteText(text);
          return;
        } catch {
          await fallbackCopyText(text);
          return;
        }
      }
      await fallbackCopyText(text);
    }
  };

  try {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: patchedClipboard
    });
  } catch {
    // Some browsers may not allow patching navigator.clipboard.
    // In that case the original optional clipboard call remains unchanged.
  }
}

installClipboardFallback();

export {};
