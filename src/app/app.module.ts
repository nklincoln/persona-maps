import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { NgxChartsModule } from '@swimlane/ngx-charts/release';

import { AspectConfigComponent } from './config/aspect/aspect-config.component';
import { PersonaConfigComponent } from './config/persona/persona-config.component';
import { MapsComponent } from './maps/maps.component';
import { TreemapComponent } from './treemap/treemap.component';
import { DefineAspectModal } from './config/aspect/define-aspect/define-aspect.modal';
import { PersonaAspectModal } from './config/persona/persona-aspect/persona-aspect.modal';
import { NewPersonaModal } from './config/persona/new-persona/new-persona.modal';
import { FileImporterComponent } from './common/file-importer/file-importer.component'

import { PersonaService } from './services/persona.service';
import { AspectService } from './services/aspect.service';


@NgModule({
  declarations: [
    AppComponent,
    AspectConfigComponent,
    PersonaConfigComponent,
    MapsComponent,
    TreemapComponent,
    DefineAspectModal,
    PersonaAspectModal,
    NewPersonaModal,
    FileImporterComponent
  ],
  entryComponents: [
    DefineAspectModal,
    PersonaAspectModal,
    NewPersonaModal,
    FileImporterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(rootRouterConfig, { useHash: true })
  ],
  providers: [
    PersonaService,
    AspectService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
