import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { createFeatureFlagImpex, FeatureFlag } from '../templates/featureflag'; 
@Component({
  selector: 'app-generator',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  standalone: true,
})
export class GeneratorComponent implements OnInit {
  options = ['Choose one', 'Feature Flag', 'Paragraph', 'Page', 'Product Images'];
  selectedOption: string = 'Choose one';
  darkMode = true;

  form: FormGroup; 
  formParagraph: FormGroup; 
  paragraphs: FormArray;
  output: string = '';
  copyButtonText: string = 'Copy to Clipboard';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder 
  ) {
  
    this.form = this.fb.group({
      featureFlagKey: ['', Validators.required],
      featureFlagStatus: ['true', Validators.required],
    });


    this.formParagraph = this.fb.group({
      env: ['Staged', Validators.required],
      contentCatalog: ['', Validators.required],
      lang: ['pt', Validators.required],  
      paragraphs: this.fb.array([this.createParagraph()])
    });

    this.paragraphs = this.formParagraph.get('paragraphs') as FormArray;
  }

  createParagraph(): FormGroup {
    return this.fb.group({
      uid: ['', Validators.required],
      name: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  addParagraph() {
    this.paragraphs.push(this.createParagraph());
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.applyDarkMode(this.darkMode);
    }
  }

  toggleDarkMode() {
    if (isPlatformBrowser(this.platformId)) {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  submit() {
    if (this.form.valid) {
      const flag: FeatureFlag = {
        key: this.form.value.featureFlagKey,
        status: this.form.value.featureFlagStatus === 'true'
      };
      this.output = createFeatureFlagImpex(flag);
    } else {
      this.form.markAllAsTouched();
    }

    if (this.formParagraph.valid) {
      const flag: FeatureFlag = {
        key: this.form.value.featureFlagKey,
        status: this.form.value.featureFlagStatus === 'true'
      };
      this.output = createFeatureFlagImpex(flag);
    } else {
      this.form.markAllAsTouched();
    }
  }

  private applyDarkMode(isDark: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }

  copyToClipboard() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.output).then(() => {
        this.copyButtonText = 'Copied!';
        setTimeout(() => {
          this.copyButtonText = 'Copy to Clipboard';
        }, 3000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    } else {
      console.error('Clipboard API not supported');
    }
  }

  onOptionChange() {
    this.output = '';
    if (this.selectedOption === 'Feature Flag') {
      this.form.reset({
        featureFlagKey: '',
        featureFlagStatus: 'true'
      });
    } else if (this.selectedOption === 'Paragraph') {
     this.resetParagraphForm();
    }
  }

  resetParagraphForm() {
    const paragraphArray = this.formParagraph.get('paragraphs') as FormArray;
    while (paragraphArray.length) {
      paragraphArray.removeAt(0); 
    }

    paragraphArray.push(this.createParagraph());

    this.formParagraph.reset({
      env: 'Staged',
      contentCatalog: '',
      lang: 'pt',
      paragraphs: paragraphArray
    });
  }

}
