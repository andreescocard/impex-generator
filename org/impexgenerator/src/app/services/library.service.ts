import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ImpexValue } from '../impex/field.types';

export interface LibrarySnippet {
  id: string;
  name: string;
  typeId: string;
  values: Record<string, ImpexValue>;
}

const STORAGE_KEY = 'impex.library';

const STARTER_SNIPPETS: LibrarySnippet[] = [
  {
    id: 'starter-feature-flag',
    name: 'Starter feature flag',
    typeId: 'featureFlag',
    values: { key: 'newFeatureFlag', status: true },
  },
  {
    id: 'starter-paragraph',
    name: 'Starter paragraph',
    typeId: 'paragraph',
    values: {
      env: 'Staged',
      contentCatalog: 'electronicsContentCatalog',
      lang: 'en',
      paragraphs: [{ uid: 'homepageParagraph', name: 'Homepage Paragraph', componentRef: 'homepageParagraph', content: 'Hello SAP Commerce' }],
    },
  },
  {
    id: 'starter-product',
    name: 'Starter product',
    typeId: 'product',
    values: {
      productCatalog: 'electronicsProductCatalog',
      catalogVersion: 'Staged',
      lang: 'en',
      code: 'sample-product',
      name: 'Sample Product',
      description: 'A starter product snippet.',
      unit: 'pieces',
      approvalStatus: 'approved',
      supercategories: '',
    },
  },
];

@Injectable({ providedIn: 'root' })
export class LibraryService {
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  list(): LibrarySnippet[] {
    return [...STARTER_SNIPPETS, ...this.loadSaved()];
  }

  save(name: string, typeId: string, values: Record<string, ImpexValue>): LibrarySnippet {
    const snippet: LibrarySnippet = {
      id: this.createId(),
      name,
      typeId,
      values,
    };
    const snippets = [...this.loadSaved(), snippet];
    this.persist(snippets);
    return snippet;
  }

  remove(id: string): void {
    if (id.startsWith('starter-')) {
      return;
    }

    this.persist(this.loadSaved().filter((snippet) => snippet.id !== id));
  }

  private loadSaved(): LibrarySnippet[] {
    if (!this.isBrowser) {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as LibrarySnippet[]) : [];
    } catch {
      return [];
    }
  }

  private persist(snippets: LibrarySnippet[]): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
  }

  private createId(): string {
    if (this.isBrowser && 'crypto' in window && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }

    return `snippet-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
