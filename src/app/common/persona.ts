import { PersonaAspect } from './persona-aspect';
import { Aspect } from './aspect';

export class Persona {

  private name: string;
  private personaAspects: Array<PersonaAspect> = [];

  // Color map[6]: grey, red, dark-orange, light-orange, yellow, light-green, green
  static colorMap = ['#A6ACAF', '#FF0000', '#FF9912', '#FFD700', '#FFFF00', '#ADFF2F', '#7CFC00'];

  constructor(name: string) {
    this.name = name;
  }

  setName(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  addPersonaAspect(comp: PersonaAspect) {
    this.personaAspects.push(comp);
  }

  addPersonaAspects(components: Array<PersonaAspect>) {
    components.forEach((component) => {
      this.addPersonaAspect(component);
    })
  }

  getPersonaAspects(): PersonaAspect[] {
    return this.personaAspects;
  }

  getPersonaAspect(aspect: Aspect): PersonaAspect {
    let index = this.personaAspects.findIndex((personaAspect) => personaAspect.getAspect().getName().valueOf() === aspect.getName());
    if (index !== -1) {
      return this.personaAspects[index];
    } else {
      throw new Error('No PersonaAspect containing Aspect with name [' + aspect.getName() + '].');
    }
  }

  hasPersonaAspect(aspect: Aspect): boolean {
    return ( this.personaAspects.findIndex((personaAspect) => personaAspect.getAspect().getName().valueOf() === aspect.getName()) !== -1);
  }

  removePersonaAspect(aspect: Aspect) {
    let index = this.personaAspects.findIndex((personaAspect) => personaAspect.getAspect().getName().valueOf() === aspect.getName());
    if (index !== -1) {
      this.personaAspects.splice(index,1);
    } else {
      throw new Error('No PersonaAspect containing Aspect with name [' + aspect.getName() + '].');
    }
  }

  updatePersonaAspectWeighting(aspect: Aspect, weighting){
    let index = this.personaAspects.findIndex((personaAspect) =>  personaAspect.getAspect().getName().valueOf() === aspect.getName() );
    if (index !== -1) {
      this.personaAspects[index].setWeighting(weighting);
    } else {
      throw new Error('No PersonaAspect containing Aspect with name [' + aspect.getName() + '].');
    }
  }

  getScheme() {
    let domainEntries: any =[];
    this.personaAspects.forEach((personaComp) => {
      domainEntries.push(Persona.colorMap[personaComp.getAspect().getConfidence() + 1]);
    })

    return { domain: domainEntries };
  }

  getData() {
    let data: any =[];
    this.personaAspects.forEach((personaComp) => {
      data.push({name: personaComp.getAspect().getName(), value: personaComp.getWeighting()});
    })
    return data;
  }

}
