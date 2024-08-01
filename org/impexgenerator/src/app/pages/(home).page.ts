import { Component } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';
import { GeneratorComponent } from './components/generator.component';

@Component({
  selector: 'impexgenerator-home',
  standalone: true,
  imports: [GeneratorComponent],
  template: `
     <app-generator/>
  `,
})
export default class HomeComponent {
}
