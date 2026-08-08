import { CachedAsset, NetworkSpeed } from '../types';

const INDEXEDDB_STORE_NAME = 'sanctuary_image_cache';
const NETWORK_SPEED_KEY = 'sanctuary_network_speed';

class CachedNetworkImageService {
  private memoryCache: Map<string, string> = new Map(); // url -> objectUrl or dataUri
  private hits: number = 0;
  private misses: number = 0;
  private networkSpeed: NetworkSpeed = 'fast4g';
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadNetworkSpeed();
  }

  public getNetworkSpeed(): NetworkSpeed {
    return this.networkSpeed;
  }

  public setNetworkSpeed(speed: NetworkSpeed) {
    this.networkSpeed = speed;
    localStorage.setItem(NETWORK_SPEED_KEY, speed);
    this.notifyListeners();
  }

  private loadNetworkSpeed() {
    const saved = localStorage.getItem(NETWORK_SPEED_KEY) as NetworkSpeed;
    if (saved) {
      this.networkSpeed = saved;
    }
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => cb());
  }

  public getCacheStats() {
    return {
      memoryEntriesCount: this.memoryCache.size,
      hits: this.hits,
      misses: this.misses,
      hitRatio: this.hits + this.misses > 0 ? Math.round((this.hits / (this.hits + this.misses)) * 100) : 100,
      cachedUrls: Array.from(this.memoryCache.keys()),
      networkSpeed: this.networkSpeed,
    };
  }

  /**
   * Primary Flutter CachedNetworkImage loader method
   */
  public async getImage(url: string): Promise<{ src: string; isFromCache: boolean }> {
    // 1. Check Memory Cache
    if (this.memoryCache.has(url)) {
      this.hits++;
      this.notifyListeners();
      return { src: this.memoryCache.get(url)!, isFromCache: true };
    }

    // 2. Check Disk Cache (LocalStorage / IndexedDB mock)
    const diskCached = localStorage.getItem(`img_cache_${btoa(url.slice(-30))}`);
    if (diskCached) {
      this.memoryCache.set(url, diskCached);
      this.hits++;
      this.notifyListeners();
      return { src: diskCached, isFromCache: true };
    }

    // Cache Miss
    this.misses++;

    // 3. Handle Offline mode
    if (this.networkSpeed === 'offline') {
      this.notifyListeners();
      throw new Error(`[Offline] Image not cached: ${url}`);
    }

    // 4. Handle Poor Network / Slow 3G simulation delay
    if (this.networkSpeed === 'slow3g') {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    // 5. Fetch from network and save to cache
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      // Save to memory cache
      this.memoryCache.set(url, objectUrl);

      // Convert to Data URL for persistent disk cache if size allows
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          if (reader.result && typeof reader.result === 'string') {
            localStorage.setItem(`img_cache_${btoa(url.slice(-30))}`, reader.result);
          }
        } catch {
          // localStorage full or limit reached
        }
      };
      reader.readAsDataURL(blob);

      this.notifyListeners();
      return { src: objectUrl, isFromCache: false };
    } catch (err) {
      // Fallback: If CORS blocks fetch or direct image hotlink works directly in img tag, return direct url
      this.memoryCache.set(url, url);
      this.notifyListeners();
      return { src: url, isFromCache: false };
    }
  }

  /**
   * Pre-cache array of image URLs
   */
  public async preCacheImages(urls: string[]): Promise<void> {
    for (const url of urls) {
      try {
        await this.getImage(url);
      } catch {
        // ignore pre-cache errors
      }
    }
  }

  public clearCache(): void {
    this.memoryCache.clear();
    this.hits = 0;
    this.misses = 0;
    // Clear localStorage image keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('img_cache_')) {
        localStorage.removeItem(key);
      }
    });
    this.notifyListeners();
  }
}

export const cachedNetworkImageService = new CachedNetworkImageService();
