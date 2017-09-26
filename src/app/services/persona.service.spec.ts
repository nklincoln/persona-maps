import { PersonaService } from './persona.service';
import { AspectService } from './aspect.service';
import { Persona } from './../common/persona';
import { Aspect } from './../common/aspect';
import { PersonaAspect } from './../common/persona-aspect';

import * as sinon from 'sinon';
import * as chai from 'chai';
let should = chai.should();

describe('PersonaService', () => {

  let personaService: PersonaService;
  let aspectService: AspectService;

  beforeEach(() => {
    aspectService = new AspectService();
    personaService = new PersonaService(aspectService);
  });

  describe('#addPersona', () => {

    beforeEach(() => {
      personaService['personas'] = [];
    });

    it('should add a persona to the service if new persona', () => {
      let testPersona0 = new Persona('bob');
      personaService.addPersona(testPersona0);

      personaService['personas'].length.should.be.equal(1);
      personaService['personas'].should.contain(testPersona0);

    });

    it('should update a persona in the service if existing persona', () => {
      let testPersona0 = new Persona('bob');
      let testPersona2 = new Persona('bob');

      let aspect = new Aspect('test', 3);
      let pa = new PersonaAspect(aspect, 4);
      testPersona2.addPersonaAspect(pa);

      personaService['personas'] = [testPersona0];

      personaService.addPersona(testPersona2);

      personaService['personas'].length.should.be.equal(1);
      personaService['personas'][0].getPersonaAspects().should.contain(pa);
    });

  });

  describe('#containsPersona', () => {

    beforeEach(() => {
      personaService['personas'] = [];
    });

    it('should return true if persona in service', () => {
      let testPersona0 = new Persona('bob');
      let testPersona1 = new Persona('sal');
      let testPersona2 = new Persona('ted');

      personaService['personas'] = [testPersona0, testPersona1, testPersona2];

      personaService.containsPersona(testPersona0).should.be.true;
      personaService.containsPersona(testPersona1).should.be.true;
      personaService.containsPersona(testPersona2).should.be.true;
    });

    it('should return false if persona not in service', () => {
      let testPersona0 = new Persona('bob');
      let testPersona1 = new Persona('sal');
      let testPersona2 = new Persona('ted');

      personaService.containsPersona(testPersona0).should.be.false;
      personaService.containsPersona(testPersona1).should.be.false;
      personaService.containsPersona(testPersona2).should.be.false;
    });

  });

  describe('#updatePersona', () => {

    beforeEach(() => {
      personaService['personas'] = [];
    });

    it('should update existing persona in service', () => {
      let testPersona0 = new Persona('bob');
      let testPersona2 = new Persona('bob');

      let aspect = new Aspect('test', 3);
      let pa = new PersonaAspect(aspect, 4);
      testPersona2.addPersonaAspect(pa);

      personaService['personas'] = [testPersona0];

      personaService.updatePersona(testPersona2);

      personaService['personas'][0].getPersonaAspects().length.should.equal(1);
      personaService['personas'][0].getPersonaAspects().should.contain(pa);

    });

    it('should throw error if persona not in service', () => {
      try {
        personaService.updatePersona(new Persona('rumple-stiltskin'));
        fail('should have errored on no matching aspect');
      } catch (error) {
        error.toString().should.equal('Error: No Persona found with name [rumple-stiltskin] for update.');
      }
    });

  });

  describe('#getPersonaByName', () => {

    beforeEach(() => {
      personaService['personas'] = [];
    });

    it('should get an existing persona by name', () => {
      let testPersona0 = new Persona('bob');
      let testPersona1 = new Persona('sal');
      let testPersona2 = new Persona('ted');

      personaService['personas'] = [testPersona0, testPersona1, testPersona2];

      let persona = personaService.getPersonaByName('sal');
      persona.getName().should.be.equal('sal');
    });

    it('should throw an error if no persona matched', () => {
      try {
        personaService.getPersonaByName('rumple-stiltskin');
        fail('should have errored on no matching aspect');
      } catch (error) {
        error.toString().should.equal('Error: No Persona found with name [rumple-stiltskin] for get.');
      }
    });

  });

  describe('#getPersonas', () => {

    beforeEach(() => {
      personaService['personas'] = [];
    });

    it('should return all personas', () => {
      let testPersona0 = new Persona('bob');
      let testPersona1 = new Persona('sal');
      let testPersona2 = new Persona('ted');

      personaService['personas'] = [testPersona0, testPersona1, testPersona2];

      personaService.getPersonas().should.deep.equal([testPersona0, testPersona1, testPersona2]);
    });

  });

  describe('#deletePersona', () => {

    beforeEach(() => {
      personaService['personas'] = [];
    });

    it('should delete a named persona in the service', () => {
      let testPersona0 = new Persona('bob');
      let testPersona1 = new Persona('sal');
      let testPersona2 = new Persona('ted');

      personaService['personas'] = [testPersona0, testPersona1, testPersona2];

      personaService.deletePersona(testPersona1);

      personaService['personas'].should.deep.equal( [testPersona0, testPersona2]);
    });

    it('should throw an error if no persona matched', () => {
      try {
        personaService.deletePersona(new Persona('rumple-stiltskin'));
        fail('should have errored on no matching aspect');
      } catch (error) {
        error.toString().should.equal('Error: No Persona found with name [rumple-stiltskin] for delete.');
      }
    });

  });

  describe('#deleteAllPersonas', () => {

    beforeEach(() => {
      personaService['personas'] = [];
    });

    it('should delete all personas in the service', () => {
      let testPersona0 = new Persona('bob');
      let testPersona1 = new Persona('sal');
      let testPersona2 = new Persona('ted');

      personaService['personas'] = [testPersona0, testPersona1, testPersona2];

      personaService.deleteAllPersonas();

      personaService['personas'].length.should.be.equal(0);
    });
  });

  describe('#shiftUp', () => {
    let testPersona0;
    let testPersona1;
    let testPersona2;

    beforeEach(() => {
      testPersona0 = new Persona('bob');
      testPersona1 = new Persona('sal');
      testPersona2 = new Persona('ted');
      personaService['personas'] = [testPersona0, testPersona1, testPersona2];
    });

    it('should move a persona up through the list', () => {
      personaService.shiftUp(testPersona2);
      personaService['personas'].should.deep.equal([testPersona0, testPersona2, testPersona1]);
    });

    it('should wrap upward motion to the bottom of the list', () => {
      personaService.shiftUp(testPersona0);
      personaService['personas'].should.deep.equal([testPersona1, testPersona2, testPersona0]);
    });

  });

  describe('#shiftDown', () => {
    let testPersona0;
    let testPersona1;
    let testPersona2;

    beforeEach(() => {
      testPersona0 = new Persona('bob');
      testPersona1 = new Persona('sal');
      testPersona2 = new Persona('ted');
      personaService['personas'] = [testPersona0, testPersona1, testPersona2];
    });

    it('should move a persona down through the list', () => {
      personaService.shiftDown(testPersona1);
      personaService['personas'].should.deep.equal([testPersona0, testPersona2, testPersona1]);

    });

    it('should wrap downward motion to the top of the list', () => {
      personaService.shiftDown(testPersona2);
      personaService['personas'].should.deep.equal([testPersona2, testPersona0, testPersona1]);
    });

  });
});
