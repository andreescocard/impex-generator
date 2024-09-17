import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  output: string = '';
  copyButtonText: string = 'Copy to Clipboard';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder 
  ) {
  
    this.form = this.fb.group({
      featureFlagUid: ['', Validators.required],
      featureFlagEnabled: ['true', Validators.required],
      featureFlagName: ['', Validators.required],
      featureFlagDesc: ['', Validators.required],
    });
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
        uid: this.form.value.featureFlagUid,
        enabled: this.form.value.featureFlagEnabled === 'true',
        name: this.form.value.featureFlagName,
        description: this.form.value.featureFlagDesc
      };

      // Generate IMPEX content using the imported function
      this.output = createFeatureFlagImpex(flag);
    } else {
      // If the form is invalid, mark all fields as touched to show validation errors
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
}
