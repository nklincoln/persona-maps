import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { Input, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NewPersonaModal } from './new-persona.modal';
import { Persona } from '../../../common/persona';

import * as sinon from 'sinon';
import * as chai from 'chai';
let should = chai.should();

describe('NewPersonaModal', () => {

  let mockPersonaService;
  let component: NewPersonaModal;
  let fixture: ComponentFixture<NewPersonaModal>;
  let testModal: NgbActiveModal;

  beforeEach(() => {

    testModal = new NgbActiveModal();

    TestBed.configureTestingModule({
        declarations: [
          NewPersonaModal
        ],
        imports: [
          FormsModule
        ],
        providers: [
          {provide: NgbActiveModal, useValue: testModal}
        ]
    });

    fixture = TestBed.createComponent(NewPersonaModal);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    component.should.be.ok;
  });

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

    it('should return a new Persona on close', () => {

      let closeSpy = sinon.spy(testModal, 'close');

      let returnPersona = new Persona('bob');
      component['name'] = returnPersona.getName();

      component.process();

      closeSpy.should.have.been.calledWith(returnPersona);
    });
  });

});
