import { Inject, Injectable, PLATFORM_ID, computed, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CanvasBlock {
  id: string;
  typeId: string;
  label: string;
  createdAt: string;
  content: string;
}

const STORAGE_KEY = 'impex.canvas';

@Injectable({ providedIn: 'root' })
export class CanvasService {
  private readonly isBrowser: boolean;
  private readonly blocksSignal = signal<CanvasBlock[]>([]);

  readonly blocks = this.blocksSignal.asReadonly();
  readonly output = computed(() => this.blocksSignal().map((block) => block.content).join('\n\n'));

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.blocksSignal.set(this.load());
  }

  add(typeId: string, label: string, content: string): void {
    this.blocksSignal.update((blocks) => [
      ...blocks,
      {
        id: this.createId(),
        typeId,
        label,
        createdAt: new Date().toISOString(),
        content,
      },
    ]);
    this.persist();
  }

  remove(id: string): void {
    this.blocksSignal.update((blocks) => blocks.filter((block) => block.id !== id));
    this.persist();
  }

  clear(): void {
    this.blocksSignal.set([]);
    this.persist();
  }

  move(id: string, direction: -1 | 1): void {
    const blocks = [...this.blocksSignal()];
    const index = blocks.findIndex((block) => block.id === id);
    const nextIndex = index + direction;

    if (index < 0 || nextIndex < 0 || nextIndex >= blocks.length) {
      return;
    }

    const [block] = blocks.splice(index, 1);
    blocks.splice(nextIndex, 0, block);
    this.blocksSignal.set(blocks);
    this.persist();
  }

  private load(): CanvasBlock[] {
    if (!this.isBrowser) {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as CanvasBlock[]) : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.blocksSignal()));
  }

  private createId(): string {
    if (this.isBrowser && 'crypto' in window && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
