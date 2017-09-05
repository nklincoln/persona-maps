import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { Input, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PersonaAspectModal } from './persona-aspect.modal';
import { AspectService } from '../../../services/aspect.service';
import { Aspect } from '../../../common/aspect';
import { PersonaAspect } from '../../../common/persona-aspect';

import * as sinon from 'sinon';
import * as chai from 'chai';
let should = chai.should();

describe('PersonaAspectModal', () => {

  let component: PersonaAspectModal;
  let fixture: ComponentFixture<PersonaAspectModal>;
  let testAspectService: AspectService;
  let testModal: NgbActiveModal;

  beforeEach(() => {
    testModal = new NgbActiveModal();
    testAspectService = new AspectService();
    testAspectService.deleteAllAspects();

    TestBed.configureTestingModule({
        declarations: [
          PersonaAspectModal
        ],
        imports: [
          FormsModule
        ],
        providers: [
          {provide: NgbActiveModal, useValue: testModal},
          {provide: AspectService, useValue: testAspectService},
        ]
    });

    fixture = TestBed.createComponent(PersonaAspectModal);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    component.should.be.ok;
  });

  describe('#ngOnInit', () => {
    it('should use a passed PersonaAspect if present', () => {
      let aspect = new Aspect('testAspect', 3);
      let weighting = 7;
      let personaAspect = new PersonaAspect(aspect, weighting);

      component['personaAspect'] = personaAspect;
      component.ngOnInit();

      component['weighting'].should.equal(weighting);
      component['aspect'].should.deep.equal(aspect);
    });

    it('should use the first retrieved aspect and a default weighting if no PersonaAspect present', () => {
      let aspect = new Aspect('testAspect', 3);
      testAspectService.addAspect(aspect);

      component.ngOnInit();

      component['weighting'].should.equal(0);
      component['aspect'].should.deep.equal(aspect);
    });
  });

  describe('#onWeightingSelect', () => {
    it('should set the weighting', () => {
      component.onWeightingSelect(2);
      component['weighting'].should.equal(2);

      component.onWeightingSelect(5);
      component['weighting'].should.equal(5);
    });
  });

  describe('#onAspectSelect', () => {
    it('should set the aspect', () => {
      let aspect0 = new Aspect('testAspect0', 3);
      let aspect1 = new Aspect('testAspect1', 4);

      component.onAspectSelect(aspect0);
      component['aspect'].should.deep.equal(aspect0);

      component.onAspectSelect(aspect1);
      component['aspect'].should.deep.equal(aspect1);
    });
  });

  describe('#validContents', () => {
    it('should return true if aspect and weighting are not null', () => {
      component['aspect'] = new Aspect('testAspect', 3);
      component['weighting'] = 7;
      component.validContents().should.be.true;
    });

    it('should return false if aspect is null', () => {
      component['aspect'] = null;
      component['weighting'] = 7;
      component.validContents().should.be.false;
    });

    it('should return false if weighting is null', () => {
      component['aspect'] = new Aspect('testAspect', 3);
      component['weighting'] = null;
      component.validContents().should.be.false;
    });

    it('should return false if aspect and weighting are null', () => {
      component['aspect'] = null;
      component['weighting'] = null;
      component.validContents().should.be.false;
    });
  });

  describe('#process', () => {
    it('should return a new PersonaAspect on close', () => {

      let closeSpy = sinon.spy(testModal, 'close');
      let aspect = new Aspect('testAspect', 3);
      let weighting = 7;
      let returnPersonaAspect = new PersonaAspect(aspect, weighting);
      component['aspect'] = aspect;
      component['weighting'] = weighting;

      component.process();

      closeSpy.should.have.been.calledWith(returnPersonaAspect);
    });
  });
});
