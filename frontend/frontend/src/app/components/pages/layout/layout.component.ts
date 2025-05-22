import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SocialFooterComponent } from '../../social-footer/social-footer.component';

@Component({
  selector: 'app-layout',
  imports: [
    HeaderComponent,
    SocialFooterComponent,
    FooterComponent,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
