import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CheckPasswordService } from '../../../services/backend/security/check-password.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { group } from 'console';

export interface TreeNode {
  name: string;
  group?: boolean;
  children?: TreeNode[];
}

@Component({
  selector: 'app-panel',
  imports: [
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    CommonModule
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent {

  private platformId = inject(PLATFORM_ID);
  visible: boolean = false;
  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();

  constructor(
      private checkPassword: CheckPasswordService,
      private router: Router
  ){
    if (isPlatformBrowser(this.platformId)) {
      const authPassed = sessionStorage.getItem('auth_passed') === 'true';
      if (!authPassed) {
        const pass = prompt('Contraseña:');
        this.checkPassword.checkPassword(pass!).subscribe({
          next: (result) => {
            if (result) {
              sessionStorage.setItem('auth_passed', 'true');
              this.visible = true;
            } else {
              alert('Acceso denegado');
              this.router.navigate(['/404']);
            }
          }
        })
      } else {
        this.visible = true;
      }
    }
    this.dataSource.data = this.treeData;
  }

  treeData: TreeNode[] = [
    { name: 'PLATAFORMAS:', group: true,
      children: [
      { name: 'INSTAGRAM', 
        children: [
        { name: 'SERVICIOS:', group: true,
          children: [
          { name: 'Seguidores', 
            children: [
            { name: 'CALIDADES:', group: true,
              children: [
              { name: 'Clasicos', 
                children: [
                { name: 'CANTIDADES:', group: true,
                  children: [{ name: '100' }] }
              ]},
              { name: 'Premium' }
            ]}
          ]},
          { name: 'Likes' }
        ]},
      ]},
      { name: 'TIKTOK', 
        children: [] }
    ]}
  ];
  

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  getNodeClass(node: any): string {
    return node.group === true ? 'group-true' : 'group-false';
  }
}
