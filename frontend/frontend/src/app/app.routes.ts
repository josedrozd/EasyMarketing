import { Routes } from '@angular/router';
import { PingComponent } from './components/ping/ping.component';
import { SuccessComponent } from './components/success/success.component';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthorizedComponent } from './components/pages/exceptions/unauthorized/unauthorized.component';
import { NotFoundComponent } from './components/pages/exceptions/not-found/not-found.component';
import { BadRequestComponent } from './components/pages/exceptions/bad-request/bad-request.component';
import { PanelComponent } from './components/panel/panel/panel.component';
import { MainComponent } from './components/pages/main/main.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { IngresosComponent } from './components/pages/ingresos/ingresos.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { ServicesComponent } from './components/pages/services/services.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { LayoutComponent } from './components/pages/layout/layout.component';
import { PoliciesComponent } from './components/pages/policies/policies.component';
import { ProductsComponent } from './components/pages/services/products/products.component';
import { HowitworksComponent } from './components/pages/howitworks/howitworks.component';
import { DetailsComponent } from './components/pages/services/products/details/details.component';
import { OrderDataComponent } from './components/pages/orders/order-data/order-data.component';
import { OrderDetailsComponent } from './components/pages/orders/order-details/order-details.component';
import { OrderLayoutComponent } from './components/pages/orders/order-layout/order-layout.component';

export const routes: Routes = [
    { path: 'ping', component: PingComponent, runGuardsAndResolvers: 'always' },
    { path: '', component: LayoutComponent,
        children: [
            { path: '', component: MainComponent },
            { path: 'bad-request', component: BadRequestComponent},
            { path: '404', component: NotFoundComponent },
            { path: 'unauthorized', component: UnauthorizedComponent },
            { path: 'servicios', component: ServicesComponent},
            { path: 'servicios/:name/productos', component: ProductsComponent },
            { path: 'servicios/:name/productos/:product/detalles', component: DetailsComponent },
            { path: 'preguntas-frecuentes', component: FaqComponent },
            { path: 'genera-ingresos', component: IngresosComponent },
            { path: 'contacto', component: ContactComponent },
            { path: 'carrito', component: CartComponent },
            { path: 'politicas-privacidad', component: PoliciesComponent},
            { path: 'como-funciona', component: HowitworksComponent}
        ]
    },
    { path: 'ordenes', component: OrderLayoutComponent,
        children: [
            { path: 'ingresar-datos', component: OrderDataComponent },
            { path: 'detalles', component: OrderDetailsComponent },
        ]

    },
    { path: 'process-purchase', component: SuccessComponent},
    { path: 'mp', 
        loadComponent: () => import('./components/mp-checkout/mp-checkout.component').then(m => m.MercadoPagoButtonComponent), 
        providers: [importProvidersFrom(CommonModule)]
    },
    //{ path: 'manual-processing', component: ProcessPuchaseComponent},
    //{ path: 'add-service', component: AddServiceComponent},
    {
        path: 'admin',
        children: [
          { path: 'services-panel', component: PanelComponent }
        ]
    }
];
