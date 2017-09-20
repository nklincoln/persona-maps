import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PersonaAspect } from '../../../common/persona-aspect';
import { Aspect } from '../../../common/aspect';
import { AspectService } from '../../../services/aspect.service';

@Component({
    selector: 'persona-aspect',
    templateUrl: './persona-aspect.modal.html',
    styleUrls: ['./persona-aspect.modal.scss'.toString()]
})

export class PersonaAspectModal implements OnInit{

    weighting = 1;

    private aspects: Array<Aspect> = null;
    private personaAspect: PersonaAspect = null;
    private aspect: Aspect = null;
    private isNew: boolean = false;
    private existingPersonaAspects: Array<PersonaAspect> = [];

    private weightingValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    constructor(public activeModal: NgbActiveModal,
                private aspectService: AspectService) {
    }

    ngOnInit() {
      // work off clone of array and prune already selected items      
      this.aspects = this.aspectService.getAspects().slice(0);

      this.existingPersonaAspects.forEach((personaAspect) => {
        let aspect = personaAspect.getAspect();
        let index = this.aspects.findIndex((asp) => asp.getName().valueOf() === aspect.getName());
        this.aspects.splice(index,1);
      })

      if (this.personaAspect) {
        this.weighting = this.personaAspect.getWeighting();
        this.aspect = this.personaAspect.getAspect();
      } else {
        this.aspect = this.aspects[0];
      }
    }

    onWeightingSelect(weight) {
      this.weighting = weight;
    }

    onAspectSelect(aspect: Aspect) {
      this.aspect = this.aspectService.getAspect(aspect);
    }

    validContents(): boolean {
      return (this.aspect != null && this.weighting !== null);
    }

    process() {
      this.activeModal.close(new PersonaAspect(this.aspect, this.weighting));
    }

}
