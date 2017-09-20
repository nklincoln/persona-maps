import { AspectService } from './aspect.service';
import { Aspect } from './../common/aspect';

import * as sinon from 'sinon';
import * as chai from 'chai';
let should = chai.should();

describe('AspectService', () => {

  let aspectService: AspectService;

  beforeEach(() => {
    aspectService = new AspectService();
  });

  describe('#addAspect', () => {

    beforeEach(() => {
      aspectService['aspects'] = [];
    });

    it('should add an aspect to the service if new aspect', () => {
      aspectService['aspects'].length.should.be.equal(0);

      let testAspect0 = new Aspect('test', 0);
      let testAspect1 = new Aspect('test1', 1);
      let testAspect2 = new Aspect('test2', 2);

      aspectService.addAspect(testAspect0);
      aspectService['aspects'].length.should.be.equal(1);
      aspectService['aspects'][0].should.deep.equal(testAspect0);

      aspectService.addAspect(testAspect1);
      aspectService['aspects'].length.should.be.equal(2);
      aspectService['aspects'][1].should.deep.equal(testAspect1);

      aspectService.addAspect(testAspect2);
      aspectService['aspects'].length.should.be.equal(3);
      aspectService['aspects'][2].should.deep.equal(testAspect2);
    });

    it('should add an aspect to the service if new aspect and retain an alphabetised list of aspects', () => {
      aspectService['aspects'].length.should.be.equal(0);

      let testAspectA = new Aspect('a', 0);
      let testAspectB = new Aspect('b', 1);
      let testAspectC = new Aspect('c', 2);
      let testAspectD = new Aspect('d', 2);

      // Init
      aspectService['aspects'] = [testAspectB];

      // Add to beginning
      aspectService.addAspect(testAspectA);
      aspectService['aspects'].length.should.be.equal(2);
      aspectService['aspects'][0].should.deep.equal(testAspectA);
      aspectService['aspects'][1].should.deep.equal(testAspectB);

      // Add to end
      aspectService.addAspect(testAspectD);
      aspectService['aspects'].length.should.be.equal(3);
      aspectService['aspects'][0].should.deep.equal(testAspectA);
      aspectService['aspects'][1].should.deep.equal(testAspectB);
      aspectService['aspects'][2].should.deep.equal(testAspectD);

      // Add to middle
      aspectService.addAspect(testAspectC);
      aspectService['aspects'].length.should.be.equal(4);
      aspectService['aspects'][0].should.deep.equal(testAspectA);
      aspectService['aspects'][1].should.deep.equal(testAspectB);
      aspectService['aspects'][2].should.deep.equal(testAspectC);
      aspectService['aspects'][3].should.deep.equal(testAspectD);
    });

    it('should update an existing aspect if present in the service', () => {
      aspectService['aspects'].length.should.be.equal(0);

      let testAspect0 = new Aspect('test', 0);
      let testAspect1 = new Aspect('test', 1);

      aspectService.addAspect(testAspect0);
      aspectService['aspects'].length.should.be.equal(1);
      aspectService['aspects'][0].should.deep.equal(testAspect0);

      aspectService.addAspect(testAspect1);
      aspectService['aspects'].length.should.be.equal(1);
      aspectService['aspects'][0].should.deep.equal(testAspect1);

    });
  });

describe('#addAspects', () => {

    beforeEach(() => {
      aspectService['aspects'] = [];
    });

    it('should add aspects to the service if new aspect', () => {
      aspectService['aspects'].length.should.be.equal(0);

      let testAspect0 = new Aspect('test', 0);
      let testAspect1 = new Aspect('test1', 1);
      let testAspect2 = new Aspect('test2', 2);

      aspectService.addAspects([testAspect0, testAspect1, testAspect2]);
      aspectService['aspects'].length.should.be.equal(3);
      aspectService['aspects'].should.contain(testAspect0);
      aspectService['aspects'].should.contain(testAspect1);
      aspectService['aspects'].should.contain(testAspect2);
    });

    it('should update an existing aspect if present in the service', () => {
      aspectService['aspects'].length.should.be.equal(0);

      let testAspect0 = new Aspect('test', 0);
      let testAspect1 = new Aspect('test1', 1);
      let testAspect2 = new Aspect('test2', 2);

      aspectService.addAspect(testAspect0);
      aspectService['aspects'].length.should.be.equal(1);
      aspectService['aspects'][0].should.deep.equal(testAspect0);

      let replaceAspect0 = new Aspect('test', 3);

      aspectService.addAspects([replaceAspect0, testAspect1, testAspect2]);
      aspectService['aspects'].length.should.be.equal(3);
      aspectService['aspects'].should.contain(replaceAspect0);
      aspectService['aspects'].should.contain(testAspect1);
      aspectService['aspects'].should.contain(testAspect2);

    });
  });

  describe('#getAspectByName', () => {

    beforeEach(() => {
      aspectService['aspects'] = [];
    });

    it('should return an aspect that matches by name', () => {
      let testAspect0 = new Aspect('test', 0);
      let testAspect1 = new Aspect('test2', 1);
      aspectService['aspects'] = [testAspect0, testAspect1];

      let returnAspect = aspectService.getAspectByName('test');
      returnAspect.getConfidence().should.be.equal(0);
      returnAspect.getName().should.be.equal('test');

    });

    it('should throw an error if no matching aspect', () => {
      try {
        aspectService.getAspectByName('test');
        fail('should have errored on no matching aspect');
      } catch (error) {
        error.toString().should.equal('Error: No Aspect found with name [test].');
      }
    });
  });

  describe('#getAspect', () => {

    beforeEach(() => {
      aspectService['aspects'] = [];
    });

    it('should return an aspect that matches by aspect', () => {
      let testAspect0 = new Aspect('test', 0);
      let testAspect1 = new Aspect('test2', 1);
      aspectService['aspects'] = [testAspect0, testAspect1];

      let returnAspect = aspectService.getAspect(testAspect1);
      returnAspect.getConfidence().should.be.equal(1);
      returnAspect.getName().should.be.equal('test2');
    });

    it('should throw an error if no matching aspect', () => {
      let testAspect = new Aspect('test', 0);
      try {
        aspectService.getAspect(testAspect);
        fail('should have errored on no matching aspect');
      } catch (error) {
        error.toString().should.equal('Error: No Aspect found with name [test].');
      }
    });
  });

  describe('#getAspects', () => {

    beforeEach(() => {
      aspectService['aspects'] = [];
    });

    it('should return all aspects in the service', () => {
      let testAspect0 = new Aspect('test', 0);
      let testAspect1 = new Aspect('test2', 1);
      aspectService['aspects'] = [testAspect0, testAspect1];

      let aspects = aspectService.getAspects();
      aspects.length.should.be.equal(2);
      aspects.should.contain(testAspect0);
      aspects.should.contain(testAspect1);
    });
  });

  describe('#updateAspect', () => {

    beforeEach(() => {
      aspectService['aspects'] = [];
    });

    it('should update an existing aspect in the service', () => {
      let testAspect0 = new Aspect('test', 0);
      let testAspect1 = new Aspect('test2', 1);
      let testAspect2 = new Aspect('test', 5);
      aspectService['aspects'] = [testAspect0, testAspect1];

      aspectService.updateAspect(testAspect2);

      aspectService['aspects'].length.should.be.equal(2);
      aspectService['aspects'].should.contain(testAspect2);
      aspectService['aspects'].should.contain(testAspect1);
    });

    it('should throw an error if no matching aspect', () => {
      let testAspect = new Aspect('test', 0);
      try {
        aspectService.updateAspect(testAspect);
        fail('should have errored on no matching aspect');
      } catch (error) {
        error.toString().should.equal('Error: No Aspect found with name [test].');
      }
    });
  });

  describe('#replaceAspect', () => {

    beforeEach(() => {
      aspectService['aspects'] = [];
    });

    it('should replace an aspect in the service with a new item', () => {
      let testAspect0 = new Aspect('test', 0);
      let testAspect1 = new Aspect('test1', 1);
      let testAspect2 = new Aspect('test2', 3); // note the name change here
      aspectService['aspects'] = [testAspect0, testAspect1];

      aspectService.replaceAspect(testAspect0, testAspect2);

      aspectService['aspects'].length.should.be.equal(2);
      aspectService['aspects'].should.contain(testAspect2);
      aspectService['aspects'].should.contain(testAspect1);
    });

    it('should throw an error if no matching aspect', () => {
      let testAspect = new Aspect('test', 0);
      try {
        aspectService.replaceAspect(testAspect, testAspect);
        fail('should have errored on no matching aspect');
      } catch (error) {
        error.toString().should.equal('Error: No Aspect found with name [test].');
      }
    });
  });

  describe('#containsAspect', () => {

    beforeEach(() => {
      aspectService['aspects'] = [];
    });

    it('should return false if aspect not in the service because service is empty', () => {
      aspectService.containsAspect(new Aspect('test', 0)).should.be.false;
    });

    it('should return false if aspect not in the service', () => {
      let testAspect0 = new Aspect('test', 0);
      let testAspect1 = new Aspect('test1', 1);
      aspectService['aspects'] = [testAspect0, testAspect1];
      aspectService.containsAspect(new Aspect('notHere', 0)).should.be.false;
    });

    it('should return true if aspect present in the service', () => {
      let testAspect0 = new Aspect('test', 0);
      let testAspect1 = new Aspect('test1', 1);
      aspectService['aspects'] = [testAspect0, testAspect1];

      aspectService.containsAspect(testAspect0).should.be.true;
    });
  });

  describe('#deleteAspect', () => {

    beforeEach(() => {
      aspectService['aspects'] = [];
    });

    it('should delete a passed aspect from the service', () => {
      let testAspect0 = new Aspect('test', 0);
      let testAspect1 = new Aspect('test1', 1);
      aspectService['aspects'] = [testAspect0, testAspect1];

      aspectService.deleteAspect(testAspect1);

      aspectService['aspects'].length.should.be.equal(1);
      aspectService['aspects'].should.contain(testAspect0);

    });

    it('should throw an error if no matching aspect', () => {
      let testAspect = new Aspect('test', 0);
      try {
        aspectService.deleteAspect(testAspect);
        fail('should have errored on no matching aspect');
      } catch (error) {
        error.toString().should.equal('Error: No Aspect found with name [test].');
      }
    });
  });

  describe('#deleteAllAspects', () => {
    beforeEach(() => {
      aspectService['aspects'] = [];
    });

    it('should delete all Aspects in the service', () => {
      let testAspect0 = new Aspect('test', 0);
      let testAspect1 = new Aspect('test1', 1);
      aspectService['aspects'] = [testAspect0, testAspect1];

      aspectService.deleteAllAspects();

      aspectService['aspects'].length.should.be.equal(0);
    });
  });

});
