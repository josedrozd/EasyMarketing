import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { RouterModule } from '@angular/router';
import { ServicesComponent } from '../services/services.component';
import { BackgroundComponent } from './background/background.component';
import { ParticlesComponent } from './particles/particles.component';
import { FaqComponent } from '../faq/faq.component';

@Component({
  selector: 'app-main',
  imports: [
    RouterModule,
    ServicesComponent,
    BackgroundComponent,
    FaqComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
