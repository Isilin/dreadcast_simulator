const loaded = new Set<string>();

export const imageCache = {
  has: (src: string) => loaded.has(src),
  add: (src: string) => loaded.add(src),
  clear: () => loaded.clear(),
};

export const prefetchImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.add(src);
      resolve();
    };
    img.onerror = reject;
    img.src = src;
  });
};
