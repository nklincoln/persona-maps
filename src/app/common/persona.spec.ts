import { Aspect } from './aspect';
import { PersonaAspect } from './persona-aspect';
import { Persona } from './persona';

import * as sinon from 'sinon';
import * as chai from 'chai';
let should = chai.should();

describe('Persona', () => {

    let myAspect0: Aspect;
    let myAspect1: Aspect;
    let myAspect2: Aspect;
    let myAspect3: Aspect;

    let personaAspect0: PersonaAspect;
    let personaAspect1: PersonaAspect;
    let personaAspect2: PersonaAspect;
    let personaAspect3: PersonaAspect;

    let persona: Persona;

    beforeEach(() => {
      myAspect0 = new Aspect('myAspect0', 5);
      myAspect1 = new Aspect('myAspect1', 3);
      myAspect2 = new Aspect('myAspect2', 5);
      myAspect3 = new Aspect('myAspect3', 5);

      personaAspect0 = new PersonaAspect(myAspect0, 1);
      personaAspect1 = new PersonaAspect(myAspect1, 2);
      personaAspect2 = new PersonaAspect(myAspect2, 3);
      personaAspect3 = new PersonaAspect(myAspect3, 7);

      persona = new Persona('bob');
    })

    it('should be able to set and get the persona name', function () {
       persona.getName().should.equal('bob');
       persona.setName('sally');
       persona.getName().should.equal('sally');
    });

    it('should be able to add and get a single persona aspect', function () {
      persona.addPersonaAspect(personaAspect0);
      persona.getPersonaAspect(myAspect0).should.deep.equal(personaAspect0);
    });

    it('should throw if trying to get a single persona aspect that does not exist', function () {
      try {
        persona.getPersonaAspect(myAspect0).should.deep.equal(personaAspect0);
        fail('should have errored with missing aspect');
      } catch (error) {
        error.toString().should.equal('Error: No PersonaAspect containing Aspect with name [myAspect0].');
      }
    });

    it('should be able to add and get a multiple aspects', function () {
      let array = [personaAspect0, personaAspect1, personaAspect2, personaAspect3];
      persona.addPersonaAspects(array);
      persona.getPersonaAspects().should.deep.equal(array);
    });

    it('should be able to inform if contains aspect', function () {
      let array = [personaAspect0, personaAspect1, personaAspect2, personaAspect3];
      persona.addPersonaAspects(array);
      persona.hasPersonaAspect(myAspect1).should.be.true;
    });

    it('should be able to inform if does not contain aspect', function () {
      let array = [personaAspect1, personaAspect2, personaAspect3];
      persona.addPersonaAspects(array);
      persona.hasPersonaAspect(myAspect0).should.be.false;
    });

    it('should be able to remove a single aspect', function () {
      let array = [personaAspect0, personaAspect1, personaAspect2, personaAspect3];
      let expectedAfter = [personaAspect0, personaAspect1, personaAspect3];
      persona.addPersonaAspects(array);
      persona.getPersonaAspects().should.deep.equal(array);

      // remove an item and check
      persona.removePersonaAspect(myAspect2);
      persona.getPersonaAspects().should.deep.equal(expectedAfter);
    });

    it('should throw if trying to remove an aspect that doesnt exist', function () {
      try {
        persona.removePersonaAspect(myAspect0);
        fail('should have errored with missing aspect');
      } catch (error) {
        error.toString().should.equal('Error: No PersonaAspect containing Aspect with name [myAspect0].');
      }
    });

    it('should be able to update a persona aspect weighting', function () {
      let array = [personaAspect0, personaAspect1, personaAspect2, personaAspect3];
      persona.addPersonaAspects(array);
      persona.getPersonaAspect(myAspect0).getWeighting().should.be.equal(1);

      // update and check
      persona.updatePersonaAspectWeighting(myAspect0, 9);
      persona.getPersonaAspect(myAspect0).getWeighting().should.be.equal(9);
    });

    it('should throw if trying to update an aspect that doesnt exist', function () {
      try {
        persona.updatePersonaAspectWeighting(myAspect0, 7);
        fail('should have errored with missing aspect');
      } catch (error) {
        error.toString().should.equal('Error: No PersonaAspect containing Aspect with name [myAspect0].');
      }
    });

    it('should be able to return scheme data', function () {
      let array = [personaAspect0, personaAspect1];
      persona.addPersonaAspects(array);

      let expectedScheme = {domain: ['#7CFC00', '#FFFF00']};
      persona.getScheme().should.deep.equal(expectedScheme);
    });

    it('should be able to return persona aspect data', function () {
      let array = [personaAspect0, personaAspect1];
      persona.addPersonaAspects(array);

      let expectedData = [{name: 'myAspect0', value: 1}, {name: 'myAspect1', value: 2}];
      persona.getData().should.deep.equal(expectedData);
    });

});
