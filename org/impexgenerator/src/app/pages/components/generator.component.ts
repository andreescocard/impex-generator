import { Component, OnInit } from '@angular/core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  standalone: true,
})
export class GeneratorComponent implements OnInit {
    
 
  options = ['Option 1', 'Option 2', 'Option 3'];
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
