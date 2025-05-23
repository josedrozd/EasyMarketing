import { Injectable } from '@angular/core';
import { TreeNode } from '../../../components/panel/tree-node/tree-node.component';
import { ExtraNode, GroupNode, PlatformNode, QualityNode, QuantityNode, ServiceNode } from '../../../core/models/panel-nodes';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export function reviveTreeNodes(nodes: TreeNode[]): TreeNode[] {
  return nodes.map(reviveNode);
}

function reviveNode(node: TreeNode): TreeNode {
  let revived: TreeNode;

  switch (node.nodeType) {
    case 'platform':
      revived = Object.assign(
        new PlatformNode(node.name, (node as any).imgUrl, (node as any).automaticPaymentAllowed, (node as any).active),
        node
      );
      break;

    case 'service':
      revived = Object.assign(
        new ServiceNode(node.name, (node as any).type, (node as any).imgUrl, (node as any).activated),
        node
      );
      break;

    case 'quality':
      revived = Object.assign(
        new QualityNode(
          node.name,
          (node as any).provider,
          (node as any).providerServiceId,
          (node as any).automaticPayment,
          (node as any).priority,
          (node as any).activated
        ),
        node
      );
      break;

    case 'quantity':
      revived = Object.assign(
        new QuantityNode(
          (node as any).quantity,
          (node as any).withDiscount,
          (node as any).basePrice,
          (node as any).finalPrice,
          (node as any).discount
        ),
        node
      );
      break;

    case 'extra':
      revived = Object.assign(
        new ExtraNode(
          node.name,
          (node as any).imgUrl,
          (node as any).destinationUrl
        ),
        node
      )
      break;

    default:
      revived = Object.assign(new GroupNode(node.nodeType, node.name), node);
      break;
  }

  if (revived.children) {
    revived.children = reviveTreeNodes(revived.children);
  }

  return revived;
}

@Injectable({
  providedIn: 'root'
})
export class PanelServicesService {
  private baseUrl = environment.apiUrl;

  private apiUrl = `${this.baseUrl}/api/services`;

  constructor(private http: HttpClient) {}

  getServices(): Observable<TreeNode[]> {
    return this.http.get<TreeNode[]>(this.apiUrl, { withCredentials: true }).pipe(
      map((rawTree: TreeNode[]) => reviveTreeNodes(rawTree))
    );
  }

  updateServices(tree: TreeNode[]): Observable<void> {
    return this.http.put<void>(this.apiUrl, tree, { withCredentials: true });
  }

}
