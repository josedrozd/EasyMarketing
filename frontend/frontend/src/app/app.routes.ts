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
import { MainComponent } from './components/pages/main/main.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { IngresosComponent } from './components/pages/ingresos/ingresos.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { ServicesComponent } from './components/pages/services/services.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { LayoutComponent } from './components/pages/layout/layout.component';
import { PoliciesComponent } from './components/pages/policies/policies.component';

export const routes: Routes = [
    { path: 'bad-request', component: BadRequestComponent},
    { path: '404', component: NotFoundComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: 'ping', component: PingComponent, runGuardsAndResolvers: 'always' },
    { path: '', component: LayoutComponent,
        children: [
            { path: '', component: MainComponent },
            { path: 'servicios', component: ServicesComponent },
            { path: 'preguntas-frecuentes', component: FaqComponent },
            { path: 'genera-ingresos', component: IngresosComponent },
            { path: 'contacto', component: ContactComponent },
            { path: 'carrito', component: CartComponent },
            { path: 'politicas-privacidad', component: PoliciesComponent}
        ]
    },
    { path: 'process-purchase', component: SuccessComponent},
    { path: 'mp', 
        loadComponent: () => import('./components/mp-checkout/mp-checkout.component').then(m => m.MercadoPagoButtonComponent), 
        providers: [importProvidersFrom(CommonModule)]
    },
    { path: 'manual-processing', component: ProcessPuchaseComponent},
    { path: 'add-service', component: AddServiceComponent},
    {
        path: 'admin',
        children: [
          { path: 'services-panel', component: PanelComponent }
        ]
    }
];
