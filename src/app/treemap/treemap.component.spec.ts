import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Input, Output, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TreemapComponent } from './treemap.component';
import { AspectService } from '../services/aspect.service';
import { Aspect } from '../common/aspect';

import * as sinon from 'sinon';
import * as chai from 'chai';
let should = chai.should();


@Component({
    selector: 'ngx-charts-tree-map',
    template: ''
})
class MockTreeMapComponent {
    @Input()
    public scheme;
    @Input()
    public results;
    @Input()
    public select;
}

describe('MapsComponent', () => {

  let fixture;
  let component;
  let testAspectService: AspectService;

  beforeEach(() => {
    testAspectService = new AspectService();

    TestBed.configureTestingModule({
        declarations: [
          TreemapComponent,
          MockTreeMapComponent
        ],
        imports: [
          FormsModule
        ],
        providers: [
            {provide: AspectService, useValue: testAspectService}
        ]
    });

    fixture = TestBed.createComponent(TreemapComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    component.should.be.ok;
  });

  
  describe('#onSelect', () => {

    let alertStub;
    
    beforeAll(() => {
        alertStub = sinon.stub(window, 'alert');
    });

    afterAll(() => {
        alertStub.restore();
    });

    it('should alert the user with selected item values', () => {
        let event = {name: 'testAspect', value: 7};

        let aspect: Aspect = new Aspect('testAspect', 3);
        testAspectService.addAspect(aspect);

        let msg = 'aspect name: testAspect\n' +
                  'aspect weighting: 7\n' +
                  'aspect confidence: 3\n';

        component.onSelect(event);

        alertStub.should.have.been.calledWith(msg);
        
    });
  });

});
