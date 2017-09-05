import { Aspect } from './aspect';

import * as sinon from 'sinon';
import * as chai from 'chai';
let should = chai.should();

describe('Aspect', () => {

    let myAspect: Aspect;

    beforeEach(() => {
      myAspect = new Aspect('myAspect', 5);
    })

    it('should be able to set and get the name', function () {
      myAspect.getName().should.equal('myAspect');
      myAspect.setName('newName');
      myAspect.getName().should.equal('newName');
    });

    it('should be able to set and get the confidence', function () {
      myAspect.getConfidence().should.be.equal(5);

      // loop over permissable values
      [-1, 0, 1, 2, 3, 4, 5].forEach((confidence) => {
        myAspect.setConfidence(confidence);
        myAspect.getConfidence().should.equal(confidence);
      });
    });

    it('should throw error if confidence value is below lower bound', function () {
      try {
        myAspect.setConfidence(-2);
        fail('should have errored on setting illegal low value');
      } catch (error) {
        error.toString().should.equal('Error: Confidence must be between -1 and 5.');
      }
    });

    it('should throw error if confidence value exceeds upper bound', function () {
      try {
        myAspect.setConfidence(6);
        fail('should have errored on setting illegal high value');
      } catch (error) {
        error.toString().should.equal('Error: Confidence must be between -1 and 5.');
      }
    });
});
