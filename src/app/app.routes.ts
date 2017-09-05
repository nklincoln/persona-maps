import { Routes } from '@angular/router';

import { AspectConfigComponent } from './config/aspect/aspect-config.component';
import { PersonaConfigComponent } from './config/persona/persona-config.component';
import { MapsComponent } from './maps/maps.component';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'maps', pathMatch: 'full' },
  { path: 'maps', component: MapsComponent },
  { path: 'aspect-config', component:AspectConfigComponent },
  { path: 'persona-config', component:PersonaConfigComponent }
];

