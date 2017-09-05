import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { Input, Output, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MapsComponent } from './maps.component';
import { Aspect } from '../common/aspect';
import { Persona } from '../common/persona';
import { FileImporterComponent } from '../common/file-importer/file-importer.component';
import { PersonaAspect } from '../common/persona-aspect';
import { PersonaService } from '../services/persona.service';
import { AspectService } from '../services/aspect.service';

import * as fileSaver from 'file-saver';
import * as sinon from 'sinon';
import * as chai from 'chai';
let should = chai.should();


@Component({
    selector: 'treemap',
    template: ''
})
class MockTreeMapComponent {
    @Input()
    public data;
    @Input()
    public scheme;
}

describe('MapsComponent', () => {

  let testPersonaService: PersonaService;
  let testAspectService: AspectService;
  let fixture;
  let component;

  beforeEach(() => {
    testAspectService = new AspectService();
    testPersonaService = new PersonaService(testAspectService);

    TestBed.configureTestingModule({
        declarations: [
          MapsComponent,
          MockTreeMapComponent,
          FileImporterComponent
        ],
        imports: [
          FormsModule
        ],
        providers: [
            {provide: PersonaService, useValue: testPersonaService},
            {provide: AspectService, useValue: testAspectService}
        ]
    });

    fixture = TestBed.createComponent(MapsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    component.should.be.ok;
  });

  describe('#ngOnInit', () => {

    let testAspect0 = new Aspect('test', 0);
    let testAspect1 = new Aspect('test1', 1);
    let testAspect2 = new Aspect('test2', 2);

    let pa0: PersonaAspect;
    let pa1: PersonaAspect;
    let pa2: PersonaAspect;

    beforeEach(() => {
      testAspectService.deleteAllAspects();
      testPersonaService.deleteAllPersonas();

      testAspectService.addAspect(testAspect0);
      testAspectService.addAspect(testAspect1);
      testAspectService.addAspect(testAspect2);

      pa0 = new PersonaAspect(testAspect0, 6);
      pa1 = new PersonaAspect(testAspect1, 8);
      pa2 = new PersonaAspect(testAspect2, 2);

      let persona0 = new Persona('bob');
      persona0.addPersonaAspect(pa0);
      persona0.addPersonaAspect(pa1);
      persona0.addPersonaAspect(pa2);

      let persona1 = new Persona('sally');
      persona1.addPersonaAspect(pa1);
      persona1.addPersonaAspect(pa2);

      let persona2 = new Persona('goat');
      persona2.addPersonaAspect(pa2);

      testPersonaService.addPersona(persona0);
      testPersonaService.addPersona(persona1);
      testPersonaService.addPersona(persona2);
    });

    it('should populate the data from retrieved personas', () => {
      let expected0 = [{name: testAspect0.getName(), value: pa0.getWeighting()},
                       {name: testAspect1.getName(), value: pa1.getWeighting()},
                       {name: testAspect2.getName(), value: pa2.getWeighting()}];
      let expected1 = [{name: testAspect1.getName(), value: pa1.getWeighting()},
                       {name: testAspect2.getName(), value: pa2.getWeighting()}];
      let expected2 = [{name: testAspect2.getName(), value: pa2.getWeighting()}];

      component.ngOnInit();

      let testData = component['data'];
      testData.length.should.equal(3);
      testData[0].should.deep.equal(expected0);
      testData[1].should.deep.equal(expected1);
      testData[2].should.deep.equal(expected2);
    });

    it('should populate the scheme from retrieved personas', () => {
      let expected0 = { domain: [Persona.colorMap[testAspect0.getConfidence() +1], Persona.colorMap[testAspect1.getConfidence() +1], Persona.colorMap[testAspect2.getConfidence() +1]] };
      let expected1 = { domain: [Persona.colorMap[testAspect1.getConfidence() +1], Persona.colorMap[testAspect2.getConfidence() +1]]};
      let expected2 = { domain: [Persona.colorMap[testAspect2.getConfidence() +1]]};

      component.ngOnInit();

      let testScheme = component['scheme'];
      testScheme.length.should.equal(3);
      testScheme[0].should.deep.equal(expected0);
      testScheme[1].should.deep.equal(expected1);
      testScheme[2].should.deep.equal(expected2);
    });
  });

  describe('#mapPersona', () => {
     it('should return false if scheme index empty', () => {
       component['data']  = [['stuff']];
       component['scheme'] = [[]];
       component.mapPersona(0).should.be.false;

     });

     it('should return false if data index empty', () => {
       component['data'] = [[]];
       component['scheme'] = [['stuff']];
       component.mapPersona(0).should.be.false;
     });

     it('should return true if scheme and data index present', () => {
       component['data'] = [['stuff']];
       component['scheme'] = [['stuff']];
       component.mapPersona(0).should.be.true;
     });
  });

  describe('#import', () => {
    it('should delete all data', () => {
      let aspectSpy = sinon.spy(testAspectService, 'deleteAllAspects');
      let personaSpy = sinon.spy(testPersonaService, 'deleteAllPersonas');

      let importData = '{"aspects":[{"name":"DemoAspect0","confidence":-1},{"name":"DemoAspect1","confidence":3},{"name":"DemoAspect2","confidence":5}],' +
                       '"personas": [{"name":"DemoPersona","data":[{"name":"DemoAspect0","value":10},{"name":"DemoAspect1","value":5},{"name":"DemoAspect2","value":2}]}]}';

      component.import(importData);

      aspectSpy.should.have.been.called;
      personaSpy.should.have.been.called;
    });

    it('should add all aspects from the passed data', () => {
      let importData = '{"aspects":[{"name":"DemoAspect0","confidence":-1},{"name":"DemoAspect1","confidence":3},{"name":"DemoAspect2","confidence":5}],' +
                       '"personas": [{"name":"DemoPersona","data":[{"name":"DemoAspect0","value":10},{"name":"DemoAspect1","value":5},{"name":"DemoAspect2","value":2}]}]}';

      component.import(importData);

      let aspects = testAspectService.getAspects();
      aspects.length.should.be.equal(3);
      aspects.should.contain(new Aspect('DemoAspect0',-1));
      aspects.should.contain(new Aspect('DemoAspect1',3));
      aspects.should.contain(new Aspect('DemoAspect2',5));
    });

    it('should add all persona information from the passed data', () => {
      let importData = '{"aspects":[{"name":"DemoAspect0","confidence":-1},{"name":"DemoAspect1","confidence":3},{"name":"DemoAspect2","confidence":5}],' +
                       '"personas": [{"name":"DemoPersona","data":[{"name":"DemoAspect0","value":10},{"name":"DemoAspect1","value":5},{"name":"DemoAspect2","value":2}]}]}';

      let a0 = new Aspect('DemoAspect0',-1);
      let a1 = new Aspect('DemoAspect1',3);
      let a2 = new Aspect('DemoAspect2',5);
      let pa0 = new PersonaAspect(a0, 10);
      let pa1 = new PersonaAspect(a1, 5);
      let pa2 = new PersonaAspect(a2, 2);
      let tp0 = new Persona('DemoPersona');
      tp0.addPersonaAspects([pa0, pa1, pa2]);
      component.import(importData);

      let personas = testPersonaService.getPersonas();
      personas.length.should.be.equal(1);
      personas.should.contain(tp0);
    });

    it('should call ngOnInit at end', () => {
      let initSpy = sinon.spy(component, 'ngOnInit');

      let importData = '{"aspects":[{"name":"DemoAspect0","confidence":-1},{"name":"DemoAspect1","confidence":3},{"name":"DemoAspect2","confidence":5}],' +
                       '"personas": [{"name":"DemoPersona","data":[{"name":"DemoAspect0","value":10},{"name":"DemoAspect1","value":5},{"name":"DemoAspect2","value":2}]}]}';

      component.import(importData);

      initSpy.should.have.been.called;
    });

  });

  describe('#export', () => {

    let mockSave;

    beforeAll(() => {
      mockSave = sinon.stub(fileSaver, 'saveAs');
    });

    afterAll(() => {
        fileSaver.saveAs.restore();
        (window as any).File.restore();
    });

    it('should export with correct data', (done) => {
      let expectedData = '{"aspects":[{"name":"DemoAspect0","confidence":-1},{"name":"DemoAspect1","confidence":3},{"name":"DemoAspect2","confidence":5}],' +
                         '"personas": [{"name":"DemoPersona","data":[{"name":"DemoAspect0","value":10},{"name":"DemoAspect1","value":5},{"name":"DemoAspect2","value":2}]}]}';

      let expectedDataJson = JSON.parse(expectedData);

      let a0 = new Aspect('DemoAspect0',-1);
      let a1 = new Aspect('DemoAspect1',3);
      let a2 = new Aspect('DemoAspect2',5);
      let pa0 = new PersonaAspect(a0, 10);
      let pa1 = new PersonaAspect(a1, 5);
      let pa2 = new PersonaAspect(a2, 2);
      let tp0 = new Persona('DemoPersona');
      tp0.addPersonaAspects([pa0, pa1, pa2]);

      testAspectService.addAspects([a0, a1, a2]);
      testPersonaService.addPersona(tp0);

      component.export();

      fixture.whenStable().then(() => {
          mockSave.should.have.been.called;

          let fileData = mockSave.getCall(0).args[0];

          let reader = new FileReader();
          reader.onload = () => {
            try {
              let actualDataJson = JSON.parse(reader.result);
              actualDataJson.should.be.deep.equal(expectedDataJson);
              done();
            } catch (error) {
              fail(error);
              done();
            }
          };
          reader.readAsText(fileData);
      });
    });

    it('should save the data to a file with correct failename and type', (done) => {
      let testFile = new Blob(['test'], {type: 'text/plain;charset=utf-8'});
      let testFilename: string = 'persona-mapping.psm';

      component.export();

      fixture.whenStable().then(() => {
          try {
            mockSave.should.have.been.called;

            let passedFile = mockSave.getCall(0).args[0];
            passedFile.type.should.equal(testFile.type);

            let passedFilename = mockSave.getCall(0).args[1];
            passedFilename.should.equal(testFilename);

            done();
          } catch (error) {
            fail(error);
            done();
          }
      });
    });

  });

  describe('#fileAccepted', () => {
      it('should call this.import if valid file', async(() => {
          let b = new Blob(['{aspects:[], personas:[]}'], {type: 'text/plain'});
          let file = new File([b], 'persona-mapping.psm');

          let importMock = sinon.stub(component, 'import');

          // Call method
          component.fileAccepted(file);
          // Check
          importMock.called;
      }));

      it('should call this.fileRejected when there is an error reading the file', () => {

          let b = new Blob(['{aspects:[], personas:[]}'], {type: 'text/plain'});
          let file = new File([b], 'persona-mapping.psm');

          let rejectMock = sinon.stub(component, 'fileRejected');
          let dataBufferMock = sinon.stub(component, 'getDataBuffer')
          .returns(Promise.reject('some bad data'));

          component.fileAccepted(file);
          rejectMock.called;
      });
  });

  describe('#getDataBuffer', () => {
        let file;
        let mockFileReadObj;
        let mockBuffer;
        let mockFileRead;
        let content;

        beforeEach(() => {
            content = 'hello world';
            let data = new Blob([content], {type: 'text/plain'});
            file = new File([data], 'mock.bna');

            mockFileReadObj = {
                readAsText: sinon.stub(),
                result: content,
                onload: sinon.stub(),
                onerror: sinon.stub()
            };

            mockFileRead = sinon.stub(window, 'FileReader');
            mockFileRead.returns(mockFileReadObj);
        });

        afterEach(() => {
            mockFileRead.restore();
        });

        it('should return data from a file', () => {
            let promise = component.getDataBuffer(file);
            mockFileReadObj.onload();
            return promise
            .then((data) => {
                data.toString().should.equal(content);
            });
        });

        it('should give error in promise chain', () => {
            let promise = component.getDataBuffer(file);
            mockFileReadObj.onerror('error');
            return promise
            .then((data) => {
                data.should.be.null;
            })
            .catch((err) => {
                err.should.equal('error');
            });
        });
    });

  describe('#fileRejected', () => {

    let alertStub;

    beforeAll(() => {
      alertStub = sinon.stub(window, 'alert');
    });

    afterAll(() => {
      alertStub.restore();
    });

    it('should alert the user to the error', () => {

      component.fileRejected('sucks to be you');

      alertStub.should.have.been.calledWith('Error: sucks to be you');
    });
  });

});
