import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { Input, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AspectConfigComponent } from './aspect-config.component';
import { AspectService } from '../../services/aspect.service';
import { PersonaService } from '../../services/persona.service';
import { Aspect } from '../../common/aspect';
import { Persona } from '../../common/persona';
import { PersonaAspect } from '../../common/persona-aspect';

import * as sinon from 'sinon';
import * as chai from 'chai';
let should = chai.should();

describe('AspectConfigComponent', () => {

  let personaService: PersonaService;
  let aspectService: AspectService;
  let mockModal: NgbModal;
  let component: AspectConfigComponent;
  let fixture: ComponentFixture<AspectConfigComponent>;

  beforeEach(() => {

    aspectService = new AspectService;
    personaService = new PersonaService(aspectService);
    mockModal = sinon.createStubInstance(NgbModal);

    TestBed.configureTestingModule({
        declarations: [
          AspectConfigComponent
        ],
        imports: [
          FormsModule,
          NgbModule.forRoot()
        ],
        providers: [
          {provide: PersonaService, useValue: personaService},
          {provide: AspectService, useValue: aspectService},
          {provide: NgbModal, useValue: mockModal}
        ]
    });

    fixture = TestBed.createComponent(AspectConfigComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    component.should.be.ok;
  });

  describe('#ngOnInit', () => {

    it('should retrieve all information from services', fakeAsync(() => {
      let aspectSpy = sinon.spy(aspectService, 'getAspects');
      let personaSpy = sinon.spy(personaService, 'getPersonas');
      // call init
      component.ngOnInit();
      tick();

      // check called
      aspectSpy.should.have.been.called;
      personaSpy.should.have.been.called;
    }));

  });

  describe('#addAspect', () => {

    let testAspect = new Aspect('test', 3);

    it('should open the add aspect modal', fakeAsync(() => {
      mockModal.open = sinon.stub().returns({
                componentInstance: {
                    businessNetwork: {}
                },
                result: Promise.resolve(testAspect)
            });

      component.addAspect();
      tick();

      mockModal.open.should.have.been.called;
    }));

    it('should add an aspect if it does not already exist', fakeAsync(() => {
      mockModal.open = sinon.stub().returns({
                componentInstance: {
                    businessNetwork: {}
                },
                result: Promise.resolve(testAspect)
            });

      let addAspectSpy = sinon.spy(aspectService, 'addAspect');
      let updateAspectSpy = sinon.spy(aspectService, 'updateAspect');

      component.addAspect();
      tick();

      mockModal.open.should.have.been.called;
      addAspectSpy.should.have.been.called;
      updateAspectSpy.should.not.have.been.called;
    }));

    it('should update an aspect if it already exists', fakeAsync(() => {
      mockModal.open = sinon.stub().returns({
                componentInstance: {
                    businessNetwork: {}
                },
                result: Promise.resolve(testAspect)
            });

      aspectService.addAspect(testAspect);

      let addAspectSpy = sinon.spy(aspectService, 'addAspect');
      let updateAspectSpy = sinon.spy(aspectService, 'updateAspect');

      component.addAspect();
      tick();

      mockModal.open.should.have.been.called;
      addAspectSpy.should.not.have.been.called;
      updateAspectSpy.should.have.been.called;
    }));

    it('should not add or update aspect if return is false', fakeAsync(() => {
      mockModal.open = sinon.stub().returns({
                componentInstance: {
                    businessNetwork: {}
                },
                result: Promise.resolve(false)
            });

      aspectService.addAspect(testAspect);

      let addAspectSpy = sinon.spy(aspectService, 'addAspect');
      let updateAspectSpy = sinon.spy(aspectService, 'updateAspect');

      component.addAspect();
      tick();

      mockModal.open.should.have.been.called;
      addAspectSpy.should.not.have.been.called;
      updateAspectSpy.should.not.have.been.called;
    }));

  });

  describe('#replaceAspect', () => {

    let testAspect0 = new Aspect('test', 0);
    let testAspect1 = new Aspect('test1', 1);
    let testAspect2 = new Aspect('test2', 2);

    beforeEach(() => {
      aspectService.deleteAllAspects();

      aspectService.addAspect(testAspect0);
      aspectService.addAspect(testAspect1);
      aspectService.addAspect(testAspect2);

      let pa0 = new PersonaAspect(testAspect0, 6);
      let pa1 = new PersonaAspect(testAspect1, 8);
      let pa2 = new PersonaAspect(testAspect2, 2);

      let persona0 = new Persona('bob');
      persona0.addPersonaAspect(pa0);
      persona0.addPersonaAspect(pa1);
      persona0.addPersonaAspect(pa2);

      let persona1 = new Persona('sally');
      persona1.addPersonaAspect(pa1);
      persona1.addPersonaAspect(pa2);

      let persona2 = new Persona('goat');
      persona1.addPersonaAspect(pa2);

      personaService.addPersona(persona0);
      personaService.addPersona(persona1);
      personaService.addPersona(persona2);
    });

    it('should open the add aspect modal', fakeAsync(() => {
      mockModal.open = sinon.stub().returns({
                componentInstance: {
                    businessNetwork: {}
                },
                result: Promise.resolve(testAspect0)
            });

      component.replaceAspect(testAspect0);
      tick();

      mockModal.open.should.have.been.called;
    }));

    it('should replace the aspect in the aspect service', fakeAsync(() => {
      let replaceAspect = new Aspect('test', 4);

      mockModal.open = sinon.stub().returns({
                componentInstance: {
                    businessNetwork: {}
                },
                result: Promise.resolve(replaceAspect)
            });

      aspectService.addAspect(testAspect0);

      component.replaceAspect(testAspect0);
      tick();

      // Get the aspect from the service, check the value
      let aspect: Aspect = aspectService.getAspect(testAspect0);
      aspect.getConfidence().should.be.equal(4);
    }));

    it('should update the aspect in all personas', fakeAsync(() => {

      let updateAspect = new Aspect('test', 5);
      mockModal.open = sinon.stub().returns({
                componentInstance: {
                    businessNetwork: {}
                },
                result: Promise.resolve(updateAspect)
            });

      component.replaceAspect(testAspect0);
      tick();

      // extensive check over personas that should have been updated
      personaService.getPersonas().forEach((persona) => {
        persona.getPersonaAspects().forEach((personaAspect: PersonaAspect) => {
          if (personaAspect.getAspect().getName().valueOf() === updateAspect.getName()) {
            personaAspect.getAspect().getConfidence().should.be.equal(updateAspect.getConfidence());
          }
        });
      });
    }));

    it('should not add or update if return is false', fakeAsync(() => {
      mockModal.open = sinon.stub().returns({
                componentInstance: {
                    businessNetwork: {}
                },
                result: Promise.resolve(false)
            });

      let replaceAspectSpy = sinon.spy(aspectService, 'replaceAspect');

      component.replaceAspect(testAspect0);
      tick();

      mockModal.open.should.have.been.called;
      replaceAspectSpy.should.not.have.been.called;
    }));

  });

  describe('#deleteAspect', () => {

    let testAspect0 = new Aspect('test', 0);
    let testAspect1 = new Aspect('test1', 1);
    let testAspect2 = new Aspect('test2', 2);

    beforeEach(() => {
      personaService.deleteAllPersonas();
      aspectService.deleteAllAspects();

      aspectService.addAspect(testAspect0);
      aspectService.addAspect(testAspect1);
      aspectService.addAspect(testAspect2);

      let pa0 = new PersonaAspect(testAspect0, 6);
      let pa1 = new PersonaAspect(testAspect1, 8);
      let pa2 = new PersonaAspect(testAspect2, 2);

      let persona0 = new Persona('bob');
      persona0.addPersonaAspect(pa0);
      persona0.addPersonaAspect(pa1);
      persona0.addPersonaAspect(pa2);

      let persona1 = new Persona('sally');
      persona1.addPersonaAspect(pa1);
      persona1.addPersonaAspect(pa2);

      let persona2 = new Persona('goat');
      persona1.addPersonaAspect(pa2);

      personaService.addPersona(persona0);
      personaService.addPersona(persona1);
      personaService.addPersona(persona2);

    });

    it('should remove the aspect from the aspect service', () => {
      personaService.deleteAllPersonas();
      component.deleteAspect(testAspect1);

      let aspects = aspectService.getAspects();

      aspects.should.not.contain(testAspect1);
      aspects.should.contain(testAspect0);
      aspects.should.contain(testAspect2);
    });

    it('should remove the aspect from any personas', () => {
      component.deleteAspect(testAspect1);

      personaService.getPersonas().forEach((persona) => {
        persona.hasPersonaAspect(testAspect1).should.be.false;
      });
    });

  });
});
