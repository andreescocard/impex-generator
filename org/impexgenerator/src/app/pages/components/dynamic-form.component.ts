import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImpexField, ImpexValue } from '../../impex/field.types';
import { languageOptions } from '../../impex/types/shared';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
      @for (field of fields; track field) {
        @switch (field.kind) {
          @case ('group') {
            <div class="border-t border-gray-200 pt-4 dark:border-gray-700">
              <div class="mb-3 flex items-center justify-between gap-3">
                <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">{{ field.label }}</h3>
                <button type="button" (click)="addGroupItem(field)" class="inline-flex items-center gap-2 rounded bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700">
                  <span aria-hidden="true">+</span>
                  {{ labels.add }}
                </button>
              </div>
              <div [formArrayName]="field.id" class="space-y-4">
                @for (group of groupArray(field.id).controls; track group; let index = $index) {
                  <div [formGroupName]="index" class="rounded border border-gray-200 p-4 dark:border-gray-700">
                    <div class="mb-3 flex items-center justify-between">
                      <span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{{ field.label }} {{ index + 1 }}</span>
                      <button type="button" (click)="removeGroupItem(field.id, index)" [disabled]="groupArray(field.id).length === 1" class="inline-flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900">
                        <span aria-hidden="true">x</span>
                        {{ labels.remove }}
                      </button>
                    </div>
                    @for (child of field.fields; track child) {
                      <ng-container [ngTemplateOutlet]="fieldTemplate" [ngTemplateOutletContext]="{ field: child, parent: group }"></ng-container>
                    }
                  </div>
                }
              </div>
            </div>
          }
          @default {
            <ng-container [ngTemplateOutlet]="fieldTemplate" [ngTemplateOutletContext]="{ field: field, parent: form }"></ng-container>
          }
        }
      }
    
      <button type="submit" class="inline-flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700">
        <span aria-hidden="true">+</span>
        {{ labels.addToScript }}
      </button>
    </form>
    
    <ng-template #fieldTemplate let-field="field" let-parent="parent">
      <div [formGroup]="parent" class="mb-4">
        <label [attr.for]="controlId(field.id, parent)" class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-400">{{ field.label }}</label>
    
        @if (field.kind === 'textarea') {
          <textarea [id]="controlId(field.id, parent)" rows="4" class="common-input" [formControlName]="field.id"></textarea>
        }
    
        @if (field.kind === 'select') {
          <select [id]="controlId(field.id, parent)" class="common-input" [formControlName]="field.id">
            @for (option of field.options; track option) {
              <option [value]="option.value">{{ option.label }}</option>
            }
          </select>
        }
    
        @if (field.kind === 'lang') {
          <select [id]="controlId(field.id, parent)" class="common-input" [formControlName]="field.id">
            @for (option of languageOptions; track option) {
              <option [value]="option.value">{{ option.label }}</option>
            }
          </select>
        }
    
        @if (field.kind === 'boolean') {
          <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" [formControlName]="field.id" />
            {{ labels.enabled }}
          </label>
        }
    
        @if (field.kind === 'text' || field.kind === 'number') {
          <input
            [id]="controlId(field.id, parent)"
            [type]="field.kind === 'number' ? 'number' : 'text'"
            class="common-input"
            [placeholder]="field.placeholder || ''"
            [formControlName]="field.id"
            />
        }
    
        @if (parent.get(field.id)?.touched && parent.get(field.id)?.invalid) {
          <div class="mt-1 text-xs italic text-red-500">
            {{ field.label }} {{ labels.required }}
          </div>
        }
      </div>
    </ng-template>
    `,
})
export class DynamicFormComponent implements OnChanges {
  @Input({ required: true }) fields: ImpexField[] = [];
  @Input() initialValues: Record<string, ImpexValue> | null = null;
  @Input() labels = {
    add: 'Add',
    remove: 'Remove',
    addToScript: 'Add to script',
    enabled: 'Enabled',
    required: 'is required.',
  };
  @Output() submitted = new EventEmitter<Record<string, ImpexValue>>();

  readonly languageOptions = languageOptions;
  form = this.fb.group({});

  constructor(private readonly fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields'] || changes['initialValues']) {
      this.form = this.createForm(this.fields, this.initialValues || {});
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.form.getRawValue() as Record<string, ImpexValue>);
  }

  setValues(values: Record<string, ImpexValue>): void {
    this.form = this.createForm(this.fields, values);
  }

  groupArray(id: string): FormArray {
    return this.form.get(id) as FormArray;
  }

  addGroupItem(field: Extract<ImpexField, { kind: 'group' }>): void {
    this.groupArray(field.id).push(this.createGroup(field.fields, {}));
  }

  removeGroupItem(id: string, index: number): void {
    const array = this.groupArray(id);
    if (array.length > 1) {
      array.removeAt(index);
    }
  }

  controlId(id: string, parent: FormGroup): string {
    return `${id}-${Object.keys(parent.controls).join('-')}`;
  }

  private createForm(fields: ImpexField[], values: Record<string, ImpexValue>): FormGroup {
    return this.createGroup(fields, values);
  }

  private createGroup(fields: ImpexField[], values: Record<string, ImpexValue> | Record<string, unknown>): FormGroup {
    const group = this.fb.group({});

    fields.forEach((field) => {
      if (field.kind === 'group') {
        const rows = Array.isArray(values[field.id]) ? (values[field.id] as Record<string, ImpexValue>[]) : [{}];
        group.addControl(
          field.id,
          this.fb.array(rows.length ? rows.map((row) => this.createGroup(field.fields, row)) : [this.createGroup(field.fields, {})])
        );
        return;
      }

      group.addControl(field.id, new FormControl(this.defaultValue(field, values[field.id]), this.isRequired(field) ? Validators.required : []));
    });

    return group;
  }

  private defaultValue(field: Exclude<ImpexField, { kind: 'group' }>, value: unknown): unknown {
    if (value !== undefined && value !== null) {
      return value;
    }

    if ('default' in field && field.default !== undefined) {
      return field.default;
    }

    return field.kind === 'boolean' ? false : '';
  }

  private isRequired(field: Exclude<ImpexField, { kind: 'group' }>): boolean {
    return 'required' in field && field.required === true;
  }
}
