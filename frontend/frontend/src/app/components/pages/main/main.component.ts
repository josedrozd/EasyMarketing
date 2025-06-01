import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { RouterModule } from '@angular/router';
import { ServicesComponent } from '../services/services.component';
import { BackgroundComponent } from './background/background.component';

@Component({
  selector: 'app-main',
  imports: [
    RouterModule,
    ServicesComponent,
    BackgroundComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
