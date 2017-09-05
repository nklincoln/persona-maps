import {Component} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PersonaService } from '../../services/persona.service';
import { AspectService } from '../../services/aspect.service';
import { DefineAspectModal } from './define-aspect/define-aspect.modal';
import { Aspect } from '../../common/aspect';

@Component({
  selector: 'aspect-config',
  styleUrls: ['./aspect-config.component.scss'.toString()],
  templateUrl: './aspect-config.component.html'
})
export class AspectConfigComponent {

  private personas;
  private aspects;

  constructor(protected aspectService: AspectService,
              protected personaService: PersonaService,
              protected modalService: NgbModal) {
  }

  ngOnInit() {
    this.aspects = this.aspectService.getAspects();
    this.personas = this.personaService.getPersonas();
  }

  addAspect() {
    this.modalService.open(DefineAspectModal).result.then((aspect) => {
      if (aspect) {
          if(this.aspectService.containsAspect(aspect)) {
            this.aspectService.updateAspect(aspect);
          } else {
            this.aspectService.addAspect(aspect);
          }
        }
    });
  }

  replaceAspect(originalAspect: Aspect) {
    let modal = this.modalService.open(DefineAspectModal);
    modal.componentInstance.name = originalAspect.getName();
    modal.componentInstance.confidence = originalAspect.getConfidence();
    modal.result.then((replaceAspect) => {
      if(replaceAspect) {
        this.aspectService.replaceAspect(originalAspect, replaceAspect);
        this.personaService.getPersonas().forEach((persona) => {
          if(persona.hasPersonaAspect(originalAspect)) {
            persona.getPersonaAspect(originalAspect).setAspect(replaceAspect);
          }
        });
        this.aspects = this.aspectService.getAspects();
      }
    });
  }

  deleteAspect(aspect: Aspect) {
    // pull from any personas
    this.personaService.getPersonas().forEach((persona) => {
      if (persona.hasPersonaAspect(aspect)) {
        persona.removePersonaAspect(aspect);
      }
    });
    this.aspectService.deleteAspect(aspect);
  }

}
