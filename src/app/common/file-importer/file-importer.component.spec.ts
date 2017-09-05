import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FileImporterComponent } from './file-importer.component';

import * as sinon from 'sinon';
import * as chai from 'chai';
let should = chai.should();

describe('FileImporterComponent', () => {
    let component: FileImporterComponent;
    let fixture: ComponentFixture<FileImporterComponent>;

    let spyFileAccepted;
    let spyFileRejected;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FileImporterComponent],
            providers: []
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FileImporterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        spyFileAccepted = sinon.spy(component.fileAccepted, 'emit');
        spyFileRejected = sinon.spy(component.fileRejected, 'emit');
    });

    it('should create the component', () => {
      component.should.be.ok;
    });

    describe('onFileChange', () => {

      it('should call file rejected when file not of right type', () => {
          component.supportedFileTypes = ['.psm'];
          let contents = new Blob(['/**My File*/'], {type: 'text/plain'});
          let file = new File([contents], 'SomeFile.zip');

          let event = {
              target: {
                  files: [file]
              }
          };

          component.onFileChange(event);
          spyFileRejected.should.have.been.calledWith('file SomeFile.zip has an unsupported file type.');
      });

      it('should call file accepted when file is of right type', () => {
          component.supportedFileTypes = ['.psm'];
          let contents = new Blob(['/**My File*/'], {type: 'text/plain'});
          let file = new File([contents], 'SomeFile.psm');

          let event = {
              target: {
                  files: [file]
              }
          };

          component.onFileChange(event);
          spyFileAccepted.should.have.been.calledWith(file);
      });
  });

});
