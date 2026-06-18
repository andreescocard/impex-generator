import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImpexTypeDescriptor, ImpexValue } from '../../impex/field.types';
import { IMPEX_TYPES } from '../../impex/registry';
import { CanvasBlock, CanvasService } from '../../services/canvas.service';
import { LibraryService, LibrarySnippet } from '../../services/library.service';
import { DynamicFormComponent } from './dynamic-form.component';

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

  selectedType = IMPEX_TYPES[0];
  searchTerm = '';
  darkMode = true;
  copyButtonText = 'Copy';
  snippetName = '';
  snippets: LibrarySnippet[] = [];
  activeInitialValues: Record<string, ImpexValue> | null = null;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly canvas: CanvasService,
    private readonly library: LibraryService
  ) {}

  ngOnInit(): void {
    this.snippets = this.library.list();
    this.applyDarkMode(this.darkMode);
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
      this.copyButtonText = 'Copied';
      setTimeout(() => {
        this.copyButtonText = 'Copy';
      }, 2000);
    });
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
