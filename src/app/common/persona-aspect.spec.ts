import { PersonaAspect } from './persona-aspect';
import { Aspect } from './aspect';

import * as sinon from 'sinon';
import * as chai from 'chai';
let should = chai.should();

describe('PersonaAspect', () => {

    let myPersonaAspect: PersonaAspect;
    let myAspect: Aspect;

    beforeEach(() => {
      myAspect = new Aspect('myAspect', 3);
      myPersonaAspect = new PersonaAspect(myAspect, 8);
    })

    it('should be able to set and get the aspect', function () {
      let newAspect = new Aspect('myNewAspect', 1);
      myPersonaAspect.getAspect().should.deep.equal(myAspect);
      myPersonaAspect.setAspect(newAspect);
      myPersonaAspect.getAspect().should.deep.equal(newAspect)
    });

    it('should be able to set and get the weighting', function () {
      myPersonaAspect.getWeighting().should.be.equal(8);

      // loop over permissable values
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((weighting) => {
        myPersonaAspect.setWeighting(weighting);
        myPersonaAspect.getWeighting().should.equal(weighting)
      });
    });

    it('should throw error if weighting value is below lower bound', function () {
      try {
        myPersonaAspect.setWeighting(-2);
        fail('should have errored on setting illegal low value');
      } catch (error) {
        error.toString().should.equal('Error: Weighting must be between 1 and 10.');
      }
    });

    it('should throw error if weighting value exceeds upper bound', function () {
      try {
        myPersonaAspect.setWeighting(11);
        fail('should have errored on setting illegal high value');
      } catch (error) {
        error.toString().should.equal('Error: Weighting must be between 1 and 10.');
      }
    });
});
