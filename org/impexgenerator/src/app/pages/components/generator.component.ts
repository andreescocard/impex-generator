import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ImpexTypeDescriptor, ImpexValue } from '../../impex/field.types';
import { IMPEX_TYPES } from '../../impex/registry';
import { CanvasBlock, CanvasService } from '../../services/canvas.service';
import { LibraryService, LibrarySnippet } from '../../services/library.service';
import { DynamicFormComponent } from './dynamic-form.component';

type UiLanguage = 'en' | 'es' | 'pt-BR';

interface UiLabels {
  add: string;
  addToScript: string;
  blockCount: string;
  canvas: string;
  clear: string;
  copy: string;
  copied: string;
  createdBy: string;
  darkMode: string;
  download: string;
  down: string;
  enabled: string;
  language: string;
  lightMode: string;
  output: string;
  remove: string;
  required: string;
  save: string;
  searchPlaceholder: string;
  snippetLibrary: string;
  snippetName: string;
  types: string;
  up: string;
}

const UI_LABELS: Record<UiLanguage, UiLabels> = {
  en: {
    add: 'Add',
    addToScript: 'Add to script',
    blockCount: 'block(s)',
    canvas: 'Script canvas',
    clear: 'Clear',
    copy: 'Copy',
    copied: 'Copied',
    createdBy: 'Created by',
    darkMode: 'Dark mode',
    download: 'Download',
    down: 'Down',
    enabled: 'Enabled',
    language: 'Language',
    lightMode: 'Light mode',
    output: 'Output',
    remove: 'Remove',
    required: 'is required.',
    save: 'Save',
    searchPlaceholder: 'Search IMPEX types',
    snippetLibrary: 'Snippet library',
    snippetName: 'Snippet name',
    types: 'Types',
    up: 'Up',
  },
  es: {
    add: 'Agregar',
    addToScript: 'Agregar al script',
    blockCount: 'bloque(s)',
    canvas: 'Lienzo del script',
    clear: 'Limpiar',
    copy: 'Copiar',
    copied: 'Copiado',
    createdBy: 'Creado por',
    darkMode: 'Modo oscuro',
    download: 'Descargar',
    down: 'Abajo',
    enabled: 'Activo',
    language: 'Idioma',
    lightMode: 'Modo claro',
    output: 'Salida',
    remove: 'Eliminar',
    required: 'es obligatorio.',
    save: 'Guardar',
    searchPlaceholder: 'Buscar tipos IMPEX',
    snippetLibrary: 'Biblioteca de snippets',
    snippetName: 'Nombre del snippet',
    types: 'Tipos',
    up: 'Arriba',
  },
  'pt-BR': {
    add: 'Adicionar',
    addToScript: 'Adicionar ao script',
    blockCount: 'bloco(s)',
    canvas: 'Canvas do script',
    clear: 'Limpar',
    copy: 'Copiar',
    copied: 'Copiado',
    createdBy: 'Criado por',
    darkMode: 'Modo escuro',
    download: 'Baixar',
    down: 'Descer',
    enabled: 'Ativo',
    language: 'Idioma',
    lightMode: 'Modo claro',
    output: 'Saida',
    remove: 'Remover',
    required: 'e obrigatorio.',
    save: 'Salvar',
    searchPlaceholder: 'Buscar tipos IMPEX',
    snippetLibrary: 'Biblioteca de snippets',
    snippetName: 'Nome do snippet',
    types: 'Tipos',
    up: 'Subir',
  },
};

@Component({
  selector: 'app-generator',
  imports: [CommonModule, FormsModule, DynamicFormComponent],
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  standalone: true,
})
export class GeneratorComponent implements OnInit {
  @ViewChild(DynamicFormComponent) dynamicForm?: DynamicFormComponent;

  readonly types = IMPEX_TYPES;
  readonly canvasBlocks = this.canvas.blocks;
  readonly output = this.canvas.output;

  readonly typeIcons: Record<string, string> = {
    'featureFlag': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 shrink-0"><path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"/></svg>`,
    'paragraph': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 shrink-0"><path fill-rule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"/></svg>`,
    'page': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 shrink-0"><path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd"/><path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z"/></svg>`,
    'product': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 shrink-0"><path fill-rule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0 .75.75 0 0 1 1.5 0 4.5 4.5 0 1 1-9 0 .75.75 0 0 1 1.5 0Z" clip-rule="evenodd"/></svg>`,
    'productImages': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 shrink-0"><path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd"/></svg>`,
    'category': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 shrink-0"><path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z"/></svg>`,
    'cmsLinkComponent': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 shrink-0"><path fill-rule="evenodd" d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z" clip-rule="evenodd"/></svg>`,
    'contentSlot': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 shrink-0"><path fill-rule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm4.5 7.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0V12Zm2.25-3a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V9.75A.75.75 0 0 1 13.5 9Zm3.75-1.5a.75.75 0 0 0-1.5 0v9a.75.75 0 0 0 1.5 0v-9Z" clip-rule="evenodd"/></svg>`,
    'priceRow': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 shrink-0"><path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"/><path fill-rule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z" clip-rule="evenodd"/><path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z"/></svg>`,
  };

  readonly availableLanguages: { code: UiLanguage; flagSrc: string; label: string }[] = [
    { code: 'en', flagSrc: 'https://flagcdn.com/w40/us.png', label: 'English' },
    { code: 'es', flagSrc: 'https://flagcdn.com/w40/es.png', label: 'Español' },
    { code: 'pt-BR', flagSrc: 'https://flagcdn.com/w40/br.png', label: 'Português (BR)' },
  ];

  selectedType = IMPEX_TYPES[0];
  searchTerm = '';
  darkMode = true;
  uiLanguage: UiLanguage = 'en';
  copyButtonText = UI_LABELS.en.copy;
  snippetName = '';
  snippets: LibrarySnippet[] = [];
  activeInitialValues: Record<string, ImpexValue> | null = null;

  safeTypeIcons: Record<string, SafeHtml> = {};

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly canvas: CanvasService,
    private readonly library: LibraryService,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.snippets = this.library.list();
    this.applyDarkMode(this.darkMode);
    this.safeTypeIcons = Object.fromEntries(
      Object.entries(this.typeIcons).map(([k, v]) => [k, this.sanitizer.bypassSecurityTrustHtml(v)])
    );
  }

  get filteredTypes(): ImpexTypeDescriptor[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.types;
    }

    return this.types.filter(
      (type) =>
        type.label.toLowerCase().includes(term) ||
        type.category.toLowerCase().includes(term) ||
        type.description.toLowerCase().includes(term)
    );
  }

  get categories(): string[] {
    return [...new Set(this.filteredTypes.map((type) => type.category))];
  }

  get labels(): UiLabels {
    return UI_LABELS[this.uiLanguage];
  }

  get formLabels() {
    return {
      add: this.labels.add,
      remove: this.labels.remove,
      addToScript: this.labels.addToScript,
      enabled: this.labels.enabled,
      required: this.labels.required,
    };
  }

  typesForCategory(category: string): ImpexTypeDescriptor[] {
    return this.filteredTypes.filter((type) => type.category === category);
  }

  selectType(type: ImpexTypeDescriptor): void {
    this.selectedType = type;
    this.activeInitialValues = null;
  }

  addToCanvas(values: Record<string, ImpexValue>): void {
    this.canvas.add(this.selectedType.id, this.selectedType.label, this.selectedType.generate(values));
  }

  move(block: CanvasBlock, direction: -1 | 1): void {
    this.canvas.move(block.id, direction);
  }

  remove(block: CanvasBlock): void {
    this.canvas.remove(block.id);
  }

  clearCanvas(): void {
    this.canvas.clear();
  }

  copyToClipboard(): void {
    const output = this.output();
    if (!isPlatformBrowser(this.platformId) || !navigator.clipboard || !output) {
      return;
    }

    navigator.clipboard.writeText(output).then(() => {
      this.copyButtonText = this.labels.copied;
      setTimeout(() => {
        this.copyButtonText = this.labels.copy;
      }, 2000);
    });
  }

  setLanguage(language: UiLanguage): void {
    this.uiLanguage = language;
    this.copyButtonText = this.labels.copy;
  }

  download(): void {
    if (!isPlatformBrowser(this.platformId) || !this.output()) {
      return;
    }

    const blob = new Blob([this.output()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `impex-script-${new Date().toISOString().slice(0, 10)}.impex`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  saveSnippet(): void {
    const name = this.snippetName.trim();
    if (!name || !this.dynamicForm || this.dynamicForm.form.invalid) {
      this.dynamicForm?.form.markAllAsTouched();
      return;
    }

    this.library.save(name, this.selectedType.id, this.dynamicForm.form.getRawValue() as Record<string, ImpexValue>);
    this.snippetName = '';
    this.snippets = this.library.list();
  }

  loadSnippet(snippet: LibrarySnippet): void {
    const type = this.types.find((item) => item.id === snippet.typeId);
    if (!type) {
      return;
    }

    this.selectedType = type;
    this.activeInitialValues = snippet.values;
    setTimeout(() => this.dynamicForm?.setValues(snippet.values));
  }

  removeSnippet(snippet: LibrarySnippet): void {
    this.library.remove(snippet.id);
    this.snippets = this.library.list();
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    this.applyDarkMode(this.darkMode);
  }

  private applyDarkMode(isDark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document.documentElement.classList.toggle('dark', isDark);
  }
}
