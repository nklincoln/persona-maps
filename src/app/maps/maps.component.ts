import { Component, OnInit } from '@angular/core';

import { Aspect } from '../common/aspect';
import { Persona } from '../common/persona';
import { PersonaAspect } from '../common/persona-aspect';
import { AspectService } from '../services/aspect.service';
import { PersonaService } from '../services/persona.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'maps',
  styleUrls: [ './maps.component.scss'.toString()],
  templateUrl: './maps.component.html'
})
export class MapsComponent implements OnInit{

  private personas: Array<Persona> = [];
  private data: any = [];
  private scheme: any = [];
  private fileExt: string = '.psm';

  constructor(private aspectService: AspectService,
              private personaService: PersonaService) {
  }

  ngOnInit() {
    this.personas = this.personaService.getPersonas();
    this.personas.forEach((persona) => {
      this.data.push(persona.getData());
      this.scheme.push(persona.getScheme());
    });
  }

  mapPersona(index): boolean {
    if (this.data[index].length === 0 || this.scheme[index].length === 0) {
        return false;
    } else {
        return true
    }
  }

  import(importData) {

    // remove everything there already
    this.data = [];
    this.scheme = [];
    this.aspectService.deleteAllAspects();
    this.personaService.deleteAllPersonas();

    // Get information from input data
    let input = JSON.parse(importData);
    let aspects = input.aspects;
    let personas = input.personas;

    // Add aspects
    aspects.forEach((aspect) => {
      let a = new Aspect(aspect.name, aspect.confidence);
      this.aspectService.addAspect(a);
    });

    // Add personas
    personas.forEach((persona) => {
      let p = new Persona(persona.name);
      persona.data.forEach((jpa) =>{
        let pa = new PersonaAspect(this.aspectService.getAspectByName(jpa.name), jpa.value);
        p.addPersonaAspect(pa)
      });
      this.personaService.addPersona(p);
    });

    // Now reinitialise
    this.ngOnInit();
  }

  export() {
    let aspects = this.aspectService.getAspects();
    let personaInfo = [];
    this.personaService.getPersonas().forEach((persona) => {
      let name = persona.getName();
      let data = persona.getData();
      personaInfo.push({name : name, data : data});
    })
    let exportedData = '{"aspects":' + JSON.stringify(aspects) + ', "personas": ' + JSON.stringify(personaInfo) + '}';
    var data = new Blob([exportedData], { type: 'text/plain;charset=utf-8' });
    saveAs(data, 'persona-mapping' + this.fileExt);
  }

  fileAccepted(file: File) {
      this.getDataBuffer(file)
      .then((data) => {
          this.import(data);
      })
      .catch((err) => {
          this.fileRejected(err);
      });
  }

  getDataBuffer(file: File) {
      return new Promise((resolve, reject) => {
          let fileReader = new FileReader();
          fileReader.readAsText(file);
          fileReader.onload = () => {
              let dataBuffer = Buffer.from(fileReader.result);
              resolve(dataBuffer);
          };

          fileReader.onerror = (err) => {
              reject(err);
          };
      });
  }

  fileRejected(event){
    alert('Error: '+ event);
  }

}
