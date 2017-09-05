import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { Input, Component, Directive } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import * as sinon from 'sinon';
import * as chai from 'chai';
let should = chai.should();

@Directive({
    selector: '[routerLink]',
    host: {
        '(click)': 'onClick()'
    }
})
class MockRouterLinkDirective {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}

@Directive({
    selector: '[routerLinkActive]'
})
class MockRouterLinkActiveDirective {
    @Input('routerLinkActive') linkParams: any;
}

@Directive({
    selector: 'router-outlet'
})
class MockRouterOutletDirective {
}

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerStub;

  beforeEach(() => {

    TestBed.configureTestingModule({
        declarations: [
          AppComponent,
          MockRouterLinkDirective,
          MockRouterLinkActiveDirective,
          MockRouterOutletDirective
        ],
        imports: [
          FormsModule,
          NgbModule.forRoot()
        ]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    component.should.be.ok;
  });

  describe('setAspectConfig', () => {
    it('should setAspectConfig', () => {
      component.setAspectConfig();
      component['currentOption'].should.be.equal('Configuration for Aspects');

    });
  });

  describe('setPersonaConfig', () => {
    it('should setPersonaConfig', () => {
      component.setPersonaConfig();
      component['currentOption'].should.be.equal('Configuration for Personas');
    });
  });

  describe('setMaps', () => {
    it('should setMaps', () => {
      component.setMaps();
      component['currentOption'].should.be.equal('Persona Mapping View');
    });
  });

});
