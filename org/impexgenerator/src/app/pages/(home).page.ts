import { Component } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';

@Component({
  selector: 'impexgenerator-home',
  standalone: true,
  imports: [AnalogWelcomeComponent],
  template: `
     <impexgenerator-analog-welcome/>
  `,
})
export default class HomeComponent {
}
