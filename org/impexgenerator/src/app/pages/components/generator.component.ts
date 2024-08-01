import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generator',
  imports: [CommonModule],
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  standalone: true,
})
export class GeneratorComponent implements OnInit {
    
 
  options = ['Paragraph', 'Feature Flag', 'Page', 'Product Images'];
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
    console.log('Submit button clicked');
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
