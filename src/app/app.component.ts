import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
            require('../assets/styles/personamaps.scss').toString(),
            require('./app.component.scss').toString()
          ],
})
export class AppComponent {

  currentOption: string = 'Persona Mapping view';

  setAspectConfig() {
    this.currentOption = 'Configuration for Aspects';
  }

  setPersonaConfig() {
    this.currentOption = 'Configuration for Personas';
  }

  setMaps() {
    this.currentOption = 'Persona Mapping View';
  }
}
