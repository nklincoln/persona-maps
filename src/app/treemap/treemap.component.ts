import { Component, Input } from '@angular/core';
import { AspectService } from '../services/aspect.service';

@Component({
  selector: 'treemap',
  styleUrls: ['./treemap.component.css'],
  templateUrl: './treemap.component.html'
})

export class TreemapComponent {

  constructor(private aspectService: AspectService) {
  }

  @Input() data: any = [];
  @Input() scheme: any = [];

  onSelect(event) {
    let name = event.name;
    let weighting = event.value;
    let confidence = this.aspectService.getAspectByName(name).getConfidence();

    let msg = 'aspect name: ' + name + '\n' +
              'aspect weighting: ' + weighting + '\n' +
              'aspect confidence: ' + confidence + '\n';

    alert(msg);
  }
}
