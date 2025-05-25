import { Pipe, PipeTransform } from '@angular/core';
import { PlatformNode, ServiceNode, QualityNode, QuantityNode, ExtraNode } from '../../../../core/models/panel-nodes';
import { TreeNode } from '../tree-node.component';

@Pipe({ name: 'nodeDisplay' })
  export class NodeDisplayPipe implements PipeTransform {
    transform(node: TreeNode): string {
      if (node instanceof PlatformNode) {
        return `${node.name} - Pagos automáticos: ${node.automaticPaymentAllowed ? 'Sí' : 'No'} - ${node.imgUrl.slice(0,12)}... - Activo: ${node.active ? 'Sí' : 'No'}`;
      } else if (node instanceof ServiceNode) {
        return `${node.name} - Tipo: ${node.type} - ${node.imgUrl.slice(0,12)}... - Activo: ${node.activated ? 'Sí' : 'No'}`;
      } else if (node instanceof QualityNode) {
        return `${node.name} - ${node.automaticPayment
          ? `Proveedor: ${node.provider} - Id: ${node.providerServiceId} - Pago automático: Sí`
          : 'Pago automático: No'} - Prioridad: ${node.priority} - Activo: ${node.activated ? 'Sí' : 'No'}`;
      } else if (node instanceof QuantityNode) {
        if (node.withDiscount) {
          return `Cantidad: ${node.quantity} - Precio base: $${node.basePrice} - Precio final: $${node.finalPrice} - Descuento: ${node.discount}%`;
        } else {
          return `Cantidad: ${node.quantity} - Precio: $${node.basePrice}`;
        }
      } else if (node instanceof ExtraNode) {
        return `${node.name} - ${node.imgUrl.slice(0,12)}... - ${node.destinationUrl.slice(0,12)}... - Activo: ${node.active ? 'Sí' : 'No'}`;
      }
      return node.name;
    }
}