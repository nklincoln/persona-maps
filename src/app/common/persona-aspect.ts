import { Aspect } from './aspect';

export class PersonaAspect {

  private aspect: Aspect;
  private weighting;

  constructor(aspect: Aspect, weighting){
    this.aspect = aspect
    this.setWeighting(weighting);
  }

  getAspect(): Aspect {
    return this.aspect;
  }

  getWeighting() {
    return this.weighting;
  }

  setWeighting(weighting) {
    if(weighting>=1 && weighting<=10) {
      this.weighting = weighting;
    } else {
      throw Error('Weighting must be between 1 and 10.')
    }
  }

  setAspect(aspect: Aspect) {
    this.aspect = aspect;
  }

}
