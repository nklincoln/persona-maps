import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { Input, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PersonaConfigComponent } from './persona-config.component';
import { AspectService } from '../../services/aspect.service';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../common/persona';
import { Aspect } from '../../common/aspect';
import { PersonaAspect } from '../../common/persona-aspect';

import * as sinon from 'sinon';
import * as chai from 'chai';
let should = chai.should();

describe('PersonaConfigComponent', () => {

  let testAspectService: AspectService;
  let testPersonaService: PersonaService;
  let component: PersonaConfigComponent;
  let fixture: ComponentFixture<PersonaConfigComponent>;
  let mockModal: NgbModal;

  beforeEach(() => {

    testAspectService = new AspectService();
    testPersonaService = new PersonaService(testAspectService);
    testAspectService.deleteAllAspects();
    testPersonaService.deleteAllPersonas();

    mockModal = sinon.createStubInstance(NgbModal);

    TestBed.configureTestingModule({
        declarations: [
          PersonaConfigComponent
        ],
        imports: [
          FormsModule,
          NgbModule.forRoot()
        ],
        providers: [
          {provide: NgbModal, useValue: mockModal},
          {provide: AspectService, useValue: testAspectService},
          {provide: PersonaService, useValue: testPersonaService},
        ]
    });

    fixture = TestBed.createComponent(PersonaConfigComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    component.should.be.ok;
  });

  describe('#ngOnInit', () => {
    it('should retrieve personas and aspects from services', () => {
      let aspectSpy = sinon.spy(testAspectService, 'getAspects');
      let personaSpy = sinon.spy(testPersonaService, 'getPersonas');

      component.ngOnInit();

      aspectSpy.should.have.been.called;
      personaSpy.should.have.been.called;
    });

    it('should set a default persona if existing from service', () => {
      let testPersona = new Persona('bob');
      testPersonaService.addPersona(testPersona);

      component.ngOnInit();

      component['selectedPersona'].should.deep.equal(testPersona);
    });
  });

  describe('#viewPersona', () => {
    it('should set the selected persona', () => {
      let testPersona0 = new Persona('bob');
      let testPersona1 = new Persona('sal');

      component.viewPersona(testPersona0);
      component['selectedPersona'].should.deep.equal(testPersona0);

      component.viewPersona(testPersona1);
      component['selectedPersona'].should.deep.equal(testPersona1);
    });
  });

  describe('#deletePersona', () => {
    it('should delete the persona from persona service', () => {
      let testPersona0 = new Persona('bob');
      let testPersona1 = new Persona('sal');
      let testPersona2 = new Persona('ted');
      testPersonaService.addPersona(testPersona0);
      testPersonaService.addPersona(testPersona1);
      testPersonaService.addPersona(testPersona2);

      component.deletePersona(testPersona1);

      let personas = testPersonaService.getPersonas();
      personas.should.contain(testPersona0);
      personas.should.contain(testPersona2);
      personas.should.not.contain(testPersona1);
    });

    it('should set a default persona if existing', () => {
      let testPersona0 = new Persona('bob');
      let testPersona1 = new Persona('sal');
      let testPersona2 = new Persona('ted');
      testPersonaService.addPersona(testPersona0);
      testPersonaService.addPersona(testPersona1);
      testPersonaService.addPersona(testPersona2);

      component.deletePersona(testPersona0);

      component['selectedPersona'].should.deep.equal(testPersona1);
    });

    it('should set null persona if none existing', () => {
      let testPersona0 = new Persona('bob');
      testPersonaService.addPersona(testPersona0);

      component.deletePersona(testPersona0);

      should.not.exist(component['selectedPersona']);
    });
  });

  describe('#removePersonaAspect', () => {
    it('should remove a personaAspect from the selected persona', () => {
      let testPersona = new Persona('bob');
      let aspect0 = new Aspect('testAspect0', 0);
      let aspect1 = new Aspect('testAspect1', 1);
      let aspect2 = new Aspect('testAspect2', 2);
      let personaAspect0 = new PersonaAspect(aspect0, 3);
      let personaAspect1 = new PersonaAspect(aspect1, 3);
      let personaAspect2 = new PersonaAspect(aspect2, 3);

      testPersona.addPersonaAspects([personaAspect0, personaAspect1, personaAspect2]);
      testPersonaService.addPersona(testPersona);

      component['selectedPersona'] = testPersona;
      component.removePersonaAspect(personaAspect1);

      let personaAspects = testPersona.getPersonaAspects();
      personaAspects.should.not.contain(personaAspect1);
      personaAspects.should.contain(personaAspect0);
      personaAspects.should.contain(personaAspect2);
    });
  });

  describe('#editPersonaAspect', () => {
    it('should open the PersonaAspectModal', fakeAsync(() => {
      let testPersona = new Persona('bob');
      let testPersonaAspect0 = new PersonaAspect(new Aspect('testAspect0', 0), 3);
      let testPersonaAspect1 = new PersonaAspect(new Aspect('testAspect1', 1), 3);
      testPersona.addPersonaAspects([testPersonaAspect0, testPersonaAspect1]);
      mockModal.open = sinon.stub().returns({
              componentInstance: {
                  businessNetwork: {}
              },
              result: Promise.resolve(testPersonaAspect0)
          });
      component['selectedPersona'] = testPersona;

      component.editPersonaAspect(testPersonaAspect0);
      tick();

      mockModal.open.should.have.been.called;
    }));

    it('should update the persona aspect based on return from the PersonaAspectModal', fakeAsync(() => {
      let testPersona = new Persona('bob');
      let testAspect = new Aspect('testAspect0', 0);
      let testPersonaAspect0 = new PersonaAspect(testAspect, 3);
      let testPersonaAspect1 = new PersonaAspect(new Aspect('testAspect1', 1), 3);
      let testPersonaAspect2 = new PersonaAspect(testAspect, 7);
      testPersona.addPersonaAspects([testPersonaAspect0, testPersonaAspect1]);
      mockModal.open = sinon.stub().returns({
              componentInstance: {
                  businessNetwork: {}
              },
              result: Promise.resolve(testPersonaAspect2)
          });
      component['selectedPersona'] = testPersona;

      component.editPersonaAspect(testPersonaAspect0);
      tick();

      testPersona.getPersonaAspect(testAspect).getWeighting().should.be.equal(7);
    }));

    it('should not update the persona aspect if the return from the PersonaAspectModal is false', fakeAsync(() => {
      let testPersona = new Persona('bob');
      let testAspect = new Aspect('testAspect0', 0);
      let testPersonaAspect0 = new PersonaAspect(testAspect, 3);
      let testPersonaAspect1 = new PersonaAspect(new Aspect('testAspect1', 1), 3);
      let testPersonaAspect2 = new PersonaAspect(testAspect, 7);
      testPersona.addPersonaAspects([testPersonaAspect0, testPersonaAspect1]);
      mockModal.open = sinon.stub().returns({
              componentInstance: {
                  businessNetwork: {}
              },
              result: Promise.resolve(false)
          });
      component['selectedPersona'] = testPersona;

      component.editPersonaAspect(testPersonaAspect0);
      tick();

      testPersona.getPersonaAspect(testAspect).getWeighting().should.be.equal(3);
    }));
  });

  describe('#addPersona', () => {
    it('should open the NewPersonaModal', fakeAsync(() => {
      let testPersona = new Persona('bob');
      component['personas'] = [];
      mockModal.open = sinon.stub().returns({
              componentInstance: {
                  businessNetwork: {}
              },
              result: Promise.resolve(testPersona)
          });

      component.addPersona();
      tick();

      mockModal.open.should.have.been.called;
    }));

    it('should add the persona on return from the NewPersonaModal', fakeAsync(() => {
      let testPersona = new Persona('bob');
      component['personas'] = [];
      mockModal.open = sinon.stub().returns({
              componentInstance: {
                  businessNetwork: {}
              },
              result: Promise.resolve(testPersona)
          });

      component.addPersona();
      tick();

      component['personas'].should.contain(testPersona);
    }));

    it('should set the current persona as that returned from the NewPersonaModal', fakeAsync(() => {
      let testPersona0 = new Persona('bob');
      let testPersona1 = new Persona('sal');
      let testPersona2 = new Persona('ted');
      component['personas'] = [testPersona0, testPersona1];
      mockModal.open = sinon.stub().returns({
              componentInstance: {
                  businessNetwork: {}
              },
              result: Promise.resolve(testPersona2)
          });

      component.addPersona();
      tick();

      component['selectedPersona'].should.be.equal(testPersona2);

    }));

    it('should not update the personas if the return from the NewPersonaModal is false', fakeAsync(() => {
      let testPersona0 = new Persona('bob');
      let testPersona1 = new Persona('sal');
      let testPersona2 = new Persona('ted');
      component['selectedPersona'] = testPersona0;
      component['personas'] = [testPersona0, testPersona1];
      mockModal.open = sinon.stub().returns({
              componentInstance: {
                  businessNetwork: {}
              },
              result: Promise.resolve(false)
          });

      component.addPersona();
      tick();

      component['personas'].should.be.length(2);
      component['personas'].should.contain(testPersona0);
      component['personas'].should.contain(testPersona1);
      component['selectedPersona'].should.be.equal(testPersona0);
    }));
  });

  describe('#addPersonaAspect', () => {
    it('should open the PersonaAspectModal', fakeAsync(() => {
      let testAspect = new Aspect('testAspect0', 0);
      let testPersonaAspect0 = new PersonaAspect(testAspect, 3);
      let testPersona = new Persona('bob');
      component['selectedPersona'] = testPersona;
      mockModal.open = sinon.stub().returns({
              componentInstance: {
                  businessNetwork: {}
              },
              result: Promise.resolve(testPersonaAspect0)
          });

      component.addPersonaAspect();
      tick();

      mockModal.open.should.have.been.called;
    }));

    it('should add the personaAspect on return from the PersonaAspectModal', fakeAsync(() => {
      let testAspect = new Aspect('testAspect0', 0);
      let testPersonaAspect0 = new PersonaAspect(testAspect, 3);
      let testPersona = new Persona('bob');
      component['selectedPersona'] = testPersona;
      mockModal.open = sinon.stub().returns({
              componentInstance: {
                  businessNetwork: {}
              },
              result: Promise.resolve(testPersonaAspect0)
          });

      component.addPersonaAspect();
      tick();

      testPersona.getPersonaAspects().should.contain(testPersonaAspect0);
    }));

    it('should not do anything if the return from the PersonaAspectModal is false', fakeAsync(() => {
      let testAspect = new Aspect('testAspect0', 0);
      let testPersonaAspect0 = new PersonaAspect(testAspect, 3);
      let testPersona = new Persona('bob');
      component['selectedPersona'] = testPersona;
      mockModal.open = sinon.stub().returns({
              componentInstance: {
                  businessNetwork: {}
              },
              result: Promise.resolve(false)
          });

      component.addPersonaAspect();
      tick();

      testPersona.getPersonaAspects().should.be.empty;
    }));
  });

});
