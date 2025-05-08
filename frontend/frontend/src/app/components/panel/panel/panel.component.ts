import { ChangeDetectorRef, Component, inject, PLATFORM_ID } from '@angular/core';
import { CheckPasswordService } from '../../../services/backend/security/check-password.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { TreeNode, TreeNodeComponent } from '../tree-node/tree-node.component';

@Component({
  selector: 'app-panel',
  imports: [
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule, 
    TreeNodeComponent,
    CommonModule
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent {

  private platformId = inject(PLATFORM_ID);
  visible: boolean = false;

  treeData: TreeNode[] = [
    { name: 'PLATAFORMAS:', group: true, children: [] }
  ];

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
  }  

  addChild(parent: TreeNode): void {
    parent.children = parent.children ?? [];
  
    const nextGroupName = this.getNextGroupName(parent.name);
    const newNode: TreeNode = {
      name: '',
      group: false,
      editing: true,
      expanded: true,
      children: nextGroupName ? [{
        name: nextGroupName,
        group: true,
        expanded: true,
        children: []
      }] : undefined
    };
  
    parent.children.push(newNode);
    parent.expanded = true;
  }

  private getNextGroupName(currentName: string): string | null {
    switch (currentName) {
      case 'PLATAFORMAS:':
        return 'SERVICIOS:';
      case 'SERVICIOS:':
        return 'CALIDADES:';
      case 'CALIDADES:':
        return 'CANTIDADES:';
      default:
        return null;
    }
  }

  confirm(node: TreeNode): void {
    if (!node.name.trim()) return;
    node.editing = false;
  }
}
