import { Injectable } from '@angular/core';

import { Persona } from '../common/persona';
import { Aspect } from '../common/aspect';
import { PersonaAspect } from '../common/persona-aspect';
import { AspectService } from './aspect.service';

@Injectable()
export class PersonaService {

  private personas: Array<Persona> = [];

  constructor(aspectService: AspectService) {
    let a = new PersonaAspect(aspectService.getAspectByName('DemoAspect0'), 10);
    let b = new PersonaAspect(aspectService.getAspectByName('DemoAspect1'), 5);
    let c = new PersonaAspect(aspectService.getAspectByName('DemoAspect2'), 2);
    let demo = new Persona('DemoPersona');
    demo.addPersonaAspects([a, b, c]);
    this.addPersona(demo);
  }

  addPersona(persona: Persona) {
    if(this.containsPersona(persona)) {
      this.updatePersona(persona);
    } else {
      this.personas.push(persona);
    }
  }

  containsPersona(persona: Persona): boolean {
    return this.personas.findIndex((comp) => comp.getName().valueOf() === persona.getName()) !== -1;
  }

  updatePersona(persona: Persona) {
    let index = this.personas.findIndex((comp) => comp.getName().valueOf() === persona.getName());
    if (index !== -1) {
      this.personas[index] = persona;
    } else {
      throw new Error('No Persona found with name [' + persona.getName() + '] for update.');
    }
  }

  getPersonaByName(name: string): Persona {
    let index = this.personas.findIndex((pers) => pers.getName().valueOf() === name);
    if( index !== -1) {
      return this.personas[index];
    } else {
      throw new Error('No Persona found with name [' + name + '] for get.');
    }
  }

  getPersonas(): Array<Persona>{
    return this.personas;
  }

  deletePersona(persona: Persona) {
    let index = this.personas.findIndex((pers) => pers.getName().valueOf() === persona.getName());
    if( index !== -1) {
      this.personas.splice(index, 1);
    } else {
      throw new Error('No Persona found with name [' + persona.getName() + '] for delete.');
    }
  }

  deleteAllPersonas() {
      this.personas = [];
  }

}
