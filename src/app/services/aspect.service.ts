import { Injectable } from '@angular/core';
import { Aspect } from '../common/aspect';

@Injectable()
export class AspectService {

  private aspects: Array<Aspect> = [];

  constructor() {
    this.addAspect(new Aspect('DemoAspect0', -1));
    this.addAspect(new Aspect('DemoAspect1', 3));
    this.addAspect(new Aspect('DemoAspect2', 5));
  }

  addAspect(aspect: Aspect) {
    if(this.containsAspect(aspect)) {
      this.updateAspect(aspect);
    } else {
      this.aspects.push(aspect);
    }
  }

  addAspects(aspects: Aspect[]) {
    aspects.forEach((aspect) => {
      if(this.containsAspect(aspect)) {
        this.updateAspect(aspect);
      } else {
        this.aspects.push(aspect);
      }
    });
  }

  getAspectByName(name: string): Aspect {
    let index = this.aspects.findIndex((asp) => asp.getName().valueOf() === name);
    if (index !== -1) {
      return  this.aspects[index];
    } else {
      throw new Error('No Aspect found with name [' + name + '].');
    }
  }

  getAspect(aspect: Aspect): Aspect {
    let index = this.aspects.findIndex((asp) => asp.getName().valueOf() === aspect.getName());
    if (index !== -1) {
      return  this.aspects[index];
    } else {
      throw new Error('No Aspect found with name [' + aspect.getName() + '].');
    }
  }

  getAspects(): Aspect[] {
    return this.aspects;
  }

  updateAspect(aspect: Aspect) {
    let index = this.aspects.findIndex((asp) => asp.getName().valueOf() === aspect.getName());
    if (index !== -1) {
      this.aspects[index] = aspect;
    } else {
      throw new Error('No Aspect found with name [' + aspect.getName() + '].');
    }
  }

  replaceAspect(original: Aspect, replace: Aspect) {
    let index = this.aspects.findIndex((asp) => asp.getName().valueOf() === original.getName());
    if (index !== -1) {
      this.aspects.splice(index, 1, replace);
    } else {
      throw new Error('No Aspect found with name [' + original.getName() + '].');
    }
  }

  containsAspect(aspect: Aspect): boolean {
    return this.aspects.findIndex((asp) => asp.getName().valueOf() === aspect.getName()) !== -1;
  }

  deleteAspect(aspect: Aspect) {
    let index = this.aspects.findIndex((asp) => asp.getName().valueOf() === aspect.getName());
    if (index !== -1) {
      this.aspects.splice(index,1);
    } else {
      throw new Error('No Aspect found with name [' + aspect.getName() + '].');
    }
  }

  deleteAllAspects() {
    this.aspects = [];
  }

}
