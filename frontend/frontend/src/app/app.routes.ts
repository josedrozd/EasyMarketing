import { Routes } from '@angular/router';
import { PingComponent } from './components/ping/ping.component';
import { SuccessComponent } from './components/success/success.component';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MercadoPagoButtonComponent } from './components/mp-checkout/mp-checkout.component';

export const routes: Routes = [
    { path: 'ping', component: PingComponent, runGuardsAndResolvers: 'always' },
    { path: 'success', component: SuccessComponent},
    { path: 'mp', 
        loadComponent: () => import('./components/mp-checkout/mp-checkout.component').then(m => m.MercadoPagoButtonComponent), 
        providers: [importProvidersFrom(CommonModule)]
    }
];
