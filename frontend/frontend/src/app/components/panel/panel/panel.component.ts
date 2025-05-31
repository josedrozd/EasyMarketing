import { ChangeDetectorRef, Component, inject, PLATFORM_ID } from '@angular/core';
import { CheckPasswordService } from '../../../services/backend/security/check-password.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { TreeNode, TreeNodeComponent } from '../tree-node/tree-node.component';
import { ExtraNode, GroupNode, PlatformNode, QualityNode, QuantityNode, ServiceNode } from '../../../core/models/panel-nodes';
import { FormsModule } from '@angular/forms';
import { ServicesService } from '../../../services/backend/services/services.service'
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation-box.component';

function calculateDiscount(basePrice: number, finalPrice: number): number {
  if (!basePrice || !finalPrice || basePrice === 0) {
    return 0;
  }
  return Math.ceil(100 - ((finalPrice / basePrice) * 100));
}

@Component({
  selector: 'app-panel',
  imports: [
    ConfirmationBoxComponent,
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
  deleteConfirmationBoxVisible: boolean = false;
  applyConfirmationBoxVisible: boolean = false;

  treeData!: TreeNode[];

  editingNodeType!: string | null;
  editingParentNode!: TreeNode | null;
  nodeBeingEdited!: TreeNode | null;
  formData: any = {};

  currentTree: TreeNode[] = this.treeData;
  historyStack: any[] = [];
  nodeToRemove!: TreeNode | null;

  constructor(
      private checkPassword: CheckPasswordService,
      private router: Router,
      private panelService: ServicesService
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
    this.panelService.refreshServices().subscribe({
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
      case 'EXTRAS:': return 'extra';
      default: return null;
    }
  }

  confirmForm(): void {
    if (!this.validateFormData()) return;
  
    if (this.nodeBeingEdited) {
      if (this.nodeBeingEdited instanceof QuantityNode)
        this.formData.discount = calculateDiscount(+this.formData.basePrice, +this.formData.finalPrice);
      if (this.nodeBeingEdited instanceof PlatformNode && this.formData.platform !== "INSTAGRAM")
        this.formData.automaticPaymentAllowed = false;
      Object.assign(this.nodeBeingEdited, this.formData);
    } else if (this.editingParentNode && this.editingNodeType) {
      let newNode: TreeNode;
  
      switch (this.editingNodeType) {
        case 'platform':
          newNode = new PlatformNode(
            null,
            this.formData.name,
            this.formData.platform,
            this.formData.imgUrl,
            ((this.formData.platform === "INSTAGRAM") ? (this.formData.automaticPaymentAllowed || false) : false),
            this.formData.active || false
          );
          break;
        case 'service':
          newNode = new ServiceNode(
            null,
            this.formData.name,
            this.formData.type,
            this.formData.product,
            this.formData.imgUrl,
            this.formData.activated || false,
            this.formData.description
          );
          break;
        case 'quality':
          newNode = new QualityNode(
            null,
            this.formData.name,
            this.formData.provider,
            +this.formData.providerServiceId,
            +this.formData.minimum,
            this.formData.automaticPayment || false,
            +this.formData.priority,
            this.formData.activated || false,
            this.formData.description
          );
          break;
        case 'quantity':
          this.formData.discount = calculateDiscount(+this.formData.basePrice, +this.formData.finalPrice);
          newNode = new QuantityNode(
            null,
            +this.formData.quantity,
            this.formData.withDiscount || false,
            +this.formData.basePrice,
            +this.formData.finalPrice,
            +this.formData.discount
          );
          break;
        case 'extra':
          newNode = new ExtraNode(
            null,
            this.formData.name,
            this.formData.imgUrl,
            this.formData.destinationUrl,
            this.formData.active || false
          )
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
      case 'platform':
        if (!this.formData.imgUrl?.trim()) {
          alert('Las url de la imagen no puede estar vacia.');
          return false;
        }
        if (!this.formData.platform?.trim()) {
          alert('La plataforma es obligatoria.');
          return false;
        }
        break;
      case 'service':
        if (!this.formData.type?.trim()) {
          alert('El tipo de servicio es obligatorio.');
          return false;
        }
        if (!this.formData.product?.trim()) {
          alert('El tipo de producto es obligatorio.');
          return false;
        }
        if (!this.formData.imgUrl?.trim()) {
          alert('Las url de la imagen no puede estar vacia.');
          return false;
        }
        if (!this.formData.description?.trim()) {
          alert('Debe proveer una descripcion.');
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
          if (this.formData.minimum == null) {
            alert('Debe ingresar una cantidad minima.');
            return false;
          }
        }
        if (this.formData.priority == null) {
          alert('Debe establecer una prioridad.');
          return false;
        }
        if (!this.formData.description?.trim()) {
          alert('Debe proveer una descripcion.');
          return false;
        }
        break;
      case 'quantity':
        if (this.formData.quantity == null || this.formData.basePrice == null) {
          alert('Debe completar cantidad y precio.');
          return false;
        }
        if (this.formData.withDiscount && !this.formData.finalPrice) {
          alert('Debe completar el precio final');
          console.log(this.formData.finalPrice);
          return false;
        }
        break;
      case 'extra':
        if (!this.formData.imgUrl?.trim() || !this.formData.destinationUrl?.trim()) {
          alert('Las urls no pueden estar vacias.');
          return false;
        }
    }
  
    return true;
  }
  
  cancelForm(): void {
    this.editingNodeType = null;
    this.editingParentNode = null;
    this.nodeBeingEdited = null;
    this.formData = {};
  }

  confirmDeletion(nodeToRemove: TreeNode): void {
    this.nodeToRemove = nodeToRemove;
    this.deleteConfirmationBoxVisible = true;
  }

  cancelDelete(): void {
    this.nodeToRemove = null;
    this.deleteConfirmationBoxVisible = false;
  }

  removeNode(): void {  
    if (!this.nodeToRemove) return;

    const recurse = (nodes: TreeNode[]): boolean => {
      const index = nodes.findIndex(n => n.refId === this.nodeToRemove?.refId);
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
    this.deleteConfirmationBoxVisible = false;
    this.nodeToRemove = null;
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

  getProducts(): string[] {
    return ["LIKES", "FOLLOWERS", "VIEWS", "COMMENTS", "OTHERS"];
  }

  getPlatforms(): string[] {
    return ["INSTAGRAM", "TIKTOK", "YOUTUBE", "FACEBOOK", "KICK", "OTHER"];
  }

  navigateTo(node: TreeNode) {
    console.log("navigateTo:" + node.refId + " - " + this.currentTree[0]?.refId);
    if (node.refId !== this.currentTree[0]?.refId) {
      this.historyStack.push(this.currentTree);
      this.currentTree = [node];
    }
  }

  goBack() {
    if (this.historyStack.length > 0)
      this.currentTree = this.historyStack.pop();
  }

  confirmApply(): void {
    this.applyConfirmationBoxVisible = true;
  }

  cancelApply(): void {
    this.applyConfirmationBoxVisible = false;
  }

  applyChanges(): void {
    this.isSaving = true;
    this.applyConfirmationBoxVisible = false;
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
