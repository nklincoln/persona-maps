import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'file-importer',
    templateUrl: './file-importer.component.html',
    styleUrls: ['./file-importer.component.scss'.toString()]
})

export class FileImporterComponent {

    @Output()
    public fileAccepted: EventEmitter<File> = new EventEmitter<File>();

    @Output()
    public fileRejected: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    public supportedFileTypes: string[] = [];

    onFileChange($event) {
        let droppedFile: File = $event.target.files[0];

        let indexOfDot = droppedFile.name.lastIndexOf('.');
        let droppedFileType = droppedFile.name.slice(indexOfDot);

        if (this.supportedFileTypes.length > 0 && this.supportedFileTypes.indexOf(droppedFileType) < 0) {
            this.fileRejected.emit('file ' + droppedFile.name + ' has an unsupported file type.');
        } else {
            this.fileAccepted.emit(droppedFile);
        }
    }
}
