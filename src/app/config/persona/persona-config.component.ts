import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PersonaService } from '../../services/persona.service';
import { AspectService } from '../../services/aspect.service';
import { Aspect } from '../../common/aspect';
import { Persona } from '../../common/persona';
import { PersonaAspect } from '../../common/persona-aspect';
import { PersonaAspectModal } from './persona-aspect/persona-aspect.modal';
import { NewPersonaModal } from './new-persona/new-persona.modal';

@Component({
  selector: 'persona-config',
  styleUrls: ['./persona-config.component.scss'.toString()],
  templateUrl: './persona-config.component.html'
})

export class PersonaConfigComponent {

  private aspects: Array<Aspect>;
  private personas: Array<Persona>;

  private selectedPersona: Persona;

  constructor(private aspectService: AspectService,
              private personaService: PersonaService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.aspects = this.aspectService.getAspects();
    this.personas = this.personaService.getPersonas();
    this.selectedPersona = this.personas.length ? this.personas[0] : null;
  }

  viewPersona(persona: Persona) {
    this.selectedPersona = persona;
  }

  deletePersona(persona: Persona) {
    this.personaService.deletePersona(persona);
    this.personas = this.personaService.getPersonas();
    this.selectedPersona = this.personas.length ? this.personas[0] : null;
  }

  removePersonaAspect(personaAspect: PersonaAspect) {
    this.selectedPersona.removePersonaAspect(personaAspect.getAspect());
  }

  editPersonaAspect(personaAspect: PersonaAspect) {
    let modal = this.modalService.open(PersonaAspectModal);
    modal.componentInstance.personaAspect = personaAspect;
    modal.result.then((newPersonaAspect: PersonaAspect) => {
      if(newPersonaAspect) {
        this.selectedPersona.updatePersonaAspectWeighting(newPersonaAspect.getAspect(), newPersonaAspect.getWeighting()) ;
      }
    });
  }

  addPersona() {
    this.modalService.open(NewPersonaModal)
    .result.then((persona) => {
      if(persona) {
        this.personaService.addPersona(persona);
        this.personas = this.personaService.getPersonas();
        this.selectedPersona = this.personas[this.personas.length -1];
      }
    });
  }

  addPersonaAspect() {
    let modal = this.modalService.open(PersonaAspectModal);
    modal.componentInstance.isNew = true;
    modal.componentInstance.existingPersonaAspects = this.selectedPersona.getPersonaAspects();
    modal.result.then((newPersonaAspect: PersonaAspect) => {
      if(newPersonaAspect) {
        this.selectedPersona.addPersonaAspect(newPersonaAspect);
      }
    });
  }

  shiftUp(persona: Persona) {    
    this.personaService.shiftUp(persona);
    this.ngOnInit();
  }

  shiftDown(persona: Persona) {
    this.personaService.shiftDown(persona);
    this.ngOnInit();
  }
}
