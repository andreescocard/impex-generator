import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-generator',
  imports: [CommonModule, FormsModule],
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  standalone: true,
})
export class GeneratorComponent implements OnInit {
  options = ['Choose one','Feature Flag', 'Paragraph',  'Page', 'Product Images'];
  selectedOption: string = 'Choose one';
  darkMode = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
    console.log('Submit button clicked with option:', this.selectedOption);
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
}
