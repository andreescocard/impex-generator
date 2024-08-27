import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-generator',
  imports: [CommonModule,FormsModule],
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  standalone: true,
})
export class GeneratorComponent implements OnInit {
    
 
  options = ['Choose one','Paragraph', 'Feature Flag', 'Page', 'Product Images'];
  selectedOption: string = 'Choose one';
  darkMode = true;

  ngOnInit(): void {
    this.applyDarkMode(this.darkMode);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  submit() {
    // Handle submit logic here
    console.log('Submit button clicked with option:', this.selectedOption);
  }

  private applyDarkMode(isDark: boolean) {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

}
