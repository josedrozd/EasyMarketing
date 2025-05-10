import { ChangeDetectorRef, Component, inject, PLATFORM_ID } from '@angular/core';
import { CheckPasswordService } from '../../../services/backend/security/check-password.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { TreeNode, TreeNodeComponent } from '../tree-node/tree-node.component';
import { GroupNode, PlatformNode, QualityNode, QuantityNode, ServiceNode } from '../../../core/models/panel-nodes';
import { FormsModule } from '@angular/forms';
import { PanelServicesService } from '../../../services/backend/services/panel-services.service';

@Component({
  selector: 'app-panel',
  imports: [
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule, 
    TreeNodeComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent {

  private platformId = inject(PLATFORM_ID);
  visible: boolean = false;
  isSaving: boolean = false;
  isLoading: boolean = true;

  treeData!: TreeNode[];

  editingNodeType!: string | null;
  editingParentNode!: TreeNode | null;
  nodeBeingEdited!: TreeNode | null;
  formData: any = {};

  currentTree: TreeNode[] = this.treeData;
  historyStack: any[] = [];

  constructor(
      private checkPassword: CheckPasswordService,
      private router: Router,
      private panelService: PanelServicesService
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
              this.loadTreeData();
            } else {
              alert('Acceso denegado');
              this.router.navigate(['/404']);
            }
          }
        })
      } else {
        this.visible = true;
        this.loadTreeData();
      }
    }
  }  

  loadTreeData(): void {
    this.isLoading = true;
    this.panelService.getServices().subscribe({
      next: (tree) => {
        this.treeData = tree;
        this.currentTree = this.treeData;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener datos del backend:', err);
      }
    });
  }

  addChild(parent: TreeNode): void {
    this.editingParentNode = parent;
    this.editingNodeType = this.getNodeTypeFromGroupName(parent.name);
    this.formData = {};
  }
  
  private getNodeTypeFromGroupName(groupName: string | null): string | null {
    switch (groupName) {
      case 'PLATAFORMAS:': return 'platform';
      case 'SERVICIOS:': return 'service';
      case 'CALIDADES:': return 'quality';
      case 'CANTIDADES:': return 'quantity';
      default: return null;
    }
  }

  confirmForm(): void {
    if (!this.validateFormData()) return;
  
    if (this.nodeBeingEdited) {
      Object.assign(this.nodeBeingEdited, this.formData);
    } else if (this.editingParentNode && this.editingNodeType) {
      let newNode: TreeNode;
  
      switch (this.editingNodeType) {
        case 'platform':
          newNode = new PlatformNode(
            this.formData.name,
            this.formData.automaticPaymentAllowed,
            this.formData.active
          );
          break;
        case 'service':
          newNode = new ServiceNode(
            this.formData.name,
            this.formData.type,
            this.formData.activated || false
          );
          break;
        case 'quality':
          newNode = new QualityNode(
            this.formData.name,
            this.formData.provider,
            +this.formData.providerServiceId,
            this.formData.automaticPayment || false,
            +this.formData.priority,
            this.formData.activated || false
          );
          break;
        case 'quantity':
          newNode = new QuantityNode(
            +this.formData.quantity,
            +this.formData.price,
            +this.formData.discount
          );
          break;
        default:
          return;
      }
  
      this.editingParentNode.children = this.editingParentNode.children ?? [];
      this.editingParentNode.children.push(newNode);
      this.editingParentNode.expanded = true;
    }
  
    this.cancelForm();
  }

  private validateFormData(): boolean {
    if (this.editingNodeType !== 'quantity' && !this.formData.name?.trim()) {
      alert('El nombre no puede estar vacío.');
      return false;
    }
  
    switch (this.editingNodeType) {
      case 'service':
        if (!this.formData.type?.trim()) {
          alert('El tipo de servicio es obligatorio.');
          return false;
        }
        break;
      case 'quality':
        if (this.formData.automaticPayment) {
          if (!this.formData.provider?.trim()) {
            alert('Debe seleccionar un proveedor.');
            return false;
          }
          if (this.formData.providerServiceId == null) {
            alert('Debe ingresar un ID de proveedor.');
            return false;
          }
        }
        if (this.formData.priority == null) {
          alert('Debe establecer una prioridad.');
          return false;
        }
        break;
      case 'quantity':
        if (this.formData.quantity == null || this.formData.price == null) {
          alert('Debe completar cantidad y precio.');
          return false;
        }
        this.formData.discount = this.formData.discount ?? 0;
        break;
    }
  
    return true;
  }
  
  cancelForm(): void {
    this.editingNodeType = null;
    this.editingParentNode = null;
    this.nodeBeingEdited = null;
    this.formData = {};
  }

  removeNode(nodeToRemove: TreeNode): void {  
    const recurse = (nodes: TreeNode[]): boolean => {
      const index = nodes.findIndex(n => n.id === nodeToRemove.id);
      if (index !== -1) {
        nodes.splice(index, 1);
        return true;
      }
      for (const node of nodes) {
        if (node.children && recurse(node.children)) {
          return true;
        }
      }
      return false;
    };
  
    recurse(this.treeData);
  }

  editNode(node: TreeNode): void {
    this.nodeBeingEdited = node;
    this.editingNodeType = node.nodeType;
    this.formData = { ...node };
  }
  
  getTypes(): string[] {
    return ["PROFILE", "POST", "REEL", "OTHER"];
  }

  getProviders(): string[] {
    return ["HONEST", "SMMCOST"];
  }

  navigateTo(node: TreeNode) {
    console.log("navigateTo:" + node.id + " - " + this.currentTree[0]?.id);
    if (node.id !== this.currentTree[0]?.id) {
      this.historyStack.push(this.currentTree);
      this.currentTree = [node];
    }
  }

  goBack() {
    if (this.historyStack.length > 0)
      this.currentTree = this.historyStack.pop();
  }

  applyChanges(): void {
    this.isSaving = true;
    this.panelService.updateServices(this.treeData).subscribe({
      next: () => {
        this.isSaving = false;
        alert('Cambios guardados exitosamente.');
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error al guardar los cambios:', err);
        alert('Ocurrió un error al guardar los cambios.');
      }
    });
  }

}
