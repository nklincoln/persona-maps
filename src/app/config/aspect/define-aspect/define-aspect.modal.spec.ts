import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { Input, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DefineAspectModal } from './define-aspect.modal';
import { Aspect } from '../../../common/aspect';

import * as sinon from 'sinon';
import * as chai from 'chai';
let should = chai.should();

describe('DefineAspectModal', () => {

  let mockPersonaService;
  let component: DefineAspectModal;
  let fixture: ComponentFixture<DefineAspectModal>;
  let testModal: NgbActiveModal;

  beforeEach(() => {

    testModal = new NgbActiveModal();

    TestBed.configureTestingModule({
        declarations: [
          DefineAspectModal
        ],
        imports: [
          FormsModule
        ],
        providers: [
          {provide: NgbActiveModal, useValue: testModal}
        ]
    });

    fixture = TestBed.createComponent(DefineAspectModal);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    component.should.be.ok;
  });

  describe('#onConfidenceSelect', () =>{
    it('should set the confidence', () => {
      component['confidence'].should.be.equal(0);
      component.onConfidenceSelect(3);
      component['confidence'].should.be.equal(3);
    });
  })

  describe('#validContents', () =>{
    it('should return true if set name is valid', () => {
      component['name'] = 'bob';
      component.validContents().should.be.true;
    });

    it('should return false if set name is invalid (empty)', () => {
      component['name'] = '';
      component.validContents().should.be.false;
    });

    it('should return false if set name is invalid (null)', () => {
      component['name'] = null;
      component.validContents().should.be.false;
    });
  });

  describe('#process', () =>{
    it('should close the modal', () => {
      let closeSpy = sinon.spy(testModal, 'close');

      component.process();

      closeSpy.should.have.been.called;
    });

    it('should return a new aspect on close', () => {

      let closeSpy = sinon.spy(testModal, 'close');

      let returnAspect = new Aspect('testAspect', 2);
      component['name'] = returnAspect.getName();
      component['confidence'] = returnAspect.getConfidence();

      component.process();

      closeSpy.should.have.been.calledWith(returnAspect);
    });
  });

});
