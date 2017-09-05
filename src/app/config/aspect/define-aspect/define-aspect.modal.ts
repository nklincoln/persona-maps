import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Aspect } from '../../../common/aspect';
import { AspectService } from '../../../services/aspect.service';

@Component({
    selector: 'define-aspect',
    templateUrl: './define-aspect.modal.html',
    styleUrls: ['./define-aspect.modal.scss'.toString()]
})

export class DefineAspectModal {

    name: string = null
    confidence = 0;

    private aspect: Aspect = null;

    private confidenceValues = [-1, 0 ,1, 2, 3, 4, 5];

    constructor(public activeModal: NgbActiveModal) {
    }

    onConfidenceSelect(conf) {
      this.confidence = conf;
    }

    validContents(): boolean {
      return (this.name !== null && this.name.length > 0);
    }

    process() {
      this.activeModal.close(new Aspect(this.name, this.confidence));
    }

}
