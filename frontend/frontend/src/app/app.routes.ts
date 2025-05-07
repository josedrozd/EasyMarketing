import { Routes } from '@angular/router';
import { PingComponent } from './components/ping/ping.component';
import { SuccessComponent } from './components/success/success.component';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthorizedComponent } from './components/pages/exceptions/unauthorized/unauthorized.component';
import { NotFoundComponent } from './components/pages/exceptions/not-found/not-found.component';
import { BadRequestComponent } from './components/pages/exceptions/bad-request/bad-request.component';
import { AddServiceComponent } from './components/temporary/add-service/add-service.component';
import { ProcessPuchaseComponent } from './components/temporary/process-puchase/process-puchase.component';
import { PanelComponent } from './components/panel/panel/panel.component';

export const routes: Routes = [
    { path: 'bad-request', component: BadRequestComponent},
    { path: '404', component: NotFoundComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: 'ping', component: PingComponent, runGuardsAndResolvers: 'always' },
    { path: 'process-purchase', component: SuccessComponent},
    { path: 'mp', 
        loadComponent: () => import('./components/mp-checkout/mp-checkout.component').then(m => m.MercadoPagoButtonComponent), 
        providers: [importProvidersFrom(CommonModule)]
    },
    {
        path: 'admin',
        children: [
          { path: 'manual-processing', component: ProcessPuchaseComponent},
          { path: 'add-service', component: AddServiceComponent},
          { path: 'services-panel', component: PanelComponent }
        ]
      }
];
