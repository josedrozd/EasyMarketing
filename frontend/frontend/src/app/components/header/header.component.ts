import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../services/backend/services/services.service';
import { Observable } from 'rxjs';
import { TreeNode } from '../panel/tree-node/tree-node.component';
import { CommonModule } from '@angular/common';
import { ExtraNode } from '../../core/models/panel-nodes';
import { OrderDataService } from '../../services/order-data.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  menuOpen = false;
  dropdownOpen = false;

  @ViewChild('menuButton') menuButtonRef!: ElementRef;
  @ViewChild('navRef') navRef!: ElementRef;
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  servicios$!: Observable<TreeNode[]>;
  servicesList: TreeNode[] = [];

  selectedNode!: TreeNode;

  cartItemCount: number = 0;

  logoFilter = '';

  constructor(
    private services: ServicesService,
    private orderDataService: OrderDataService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.servicios$ = this.services.getServices();
    this.servicios$.subscribe(tree => {
      this.servicesList = tree.flatMap(node => node.children ?? []).filter(child => (child as any).active);
    });
    this.cartService.getCartItems$().subscribe(items => {
      this.cartItemCount = items.length;
    });
  }

  onSelect(node: TreeNode, event: Event) {
    event.stopPropagation();
    this.selectedNode = node;
    this.orderDataService.setServiceRefId(node.refId);
    if (node.nodeType == "extra") {
      window.location.href = (node as ExtraNode).destinationUrl;
    } else {
      this.router.navigate(['/servicios', this.slugify(node.name), 'productos']);
    }
  }
  
  slugify(text: string) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  }

  toggleMenu(event: Event) {
    event?.stopPropagation();
    this.menuOpen = !this.menuOpen;
    if (!this.menuOpen) this.dropdownOpen = false;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeMenu() {
    this.menuOpen = false;
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    if (this.menuButtonRef && this.menuButtonRef.nativeElement.contains(target)) return;

    if (this.dropdownOpen && !this.dropdownRef.nativeElement.contains(target)) {
      this.dropdownOpen = false;
    }

    if (this.menuOpen &&
        !this.navRef.nativeElement.contains(target) &&
        !this.dropdownRef.nativeElement.contains(target)) {
      this.menuOpen = false;
      this.dropdownOpen = false;
    }
  }

}
