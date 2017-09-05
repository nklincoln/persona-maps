import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Persona } from '../../../common/persona';

@Component({
    selector: 'new-persona',
    templateUrl: './new-persona.modal.html',
    styleUrls: ['./new-persona.modal.scss'.toString()]
})

export class NewPersonaModal {

    name: string = null;

    constructor(public activeModal: NgbActiveModal) {
    }

    validContents(): boolean {
      return (this.name !== null && this.name.length > 0);
    }

    process() {
      this.activeModal.close(new Persona(this.name));
    }

}
