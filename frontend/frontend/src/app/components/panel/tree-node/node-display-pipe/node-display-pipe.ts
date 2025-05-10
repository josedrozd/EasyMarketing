import { Pipe, PipeTransform } from '@angular/core';
import { PlatformNode, ServiceNode, QualityNode, QuantityNode } from '../../../../core/models/panel-nodes';
import { TreeNode } from '../tree-node.component';

@Pipe({ name: 'nodeDisplay' })
  export class NodeDisplayPipe implements PipeTransform {
    transform(node: TreeNode): string {
      if (node instanceof PlatformNode) {
        return `${node.name} - Pagos automáticos: ${node.automaticPaymentAllowed ? 'Sí' : 'No'} - Activo: ${node.active ? 'Sí' : 'No'}`;
      } else if (node instanceof ServiceNode) {
        return `${node.name} - Tipo: ${node.type} - Activo: ${node.activated ? 'Sí' : 'No'}`;
      } else if (node instanceof QualityNode) {
        return `${node.name} - ${node.automaticPayment
          ? `Proveedor: ${node.provider} - Id: ${node.providerServiceId} - Pago automático: Sí`
          : 'Pago automático: No'} - Prioridad: ${node.priority} - Activo: ${node.activated ? 'Sí' : 'No'}`;
      } else if (node instanceof QuantityNode) {
        return `Cantidad: ${node.quantity} - Precio: $${node.price} - Descuento: ${node.discount}%`;
      }
      return node.name;
    }
}