import { Component, Input, Output, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NodeDisplayPipe } from './node-display-pipe/node-display-pipe';

export interface TreeNode {
  id: number | null;
  refId: string;
  nodeType: string;
  name: string;
  group: boolean;
  children?: TreeNode[];
  expanded?: boolean;
  editing?: boolean;
}

@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, NodeDisplayPipe],
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.css']
})
export class TreeNodeComponent {
  @Input() node!: TreeNode;
  @Output() addChild = new EventEmitter<TreeNode>();
  @Output() editNodeEvent = new EventEmitter<TreeNode>();
  @Output() deleteNode = new EventEmitter<TreeNode>();
  @Output() navigate = new EventEmitter<any>();
  @Input() currentTree: any;
  @Output() goBack = new EventEmitter<void>();

  toggle(): void {
    this.node.expanded = !this.node.expanded;
  }

  navigateTo(): void {
    console.log("navigate to: " + this.node.name);
    this.navigate.emit(this.node);
  }

  getAddButtonLabel(groupName: string): string {
    switch (groupName) {
      case 'PLATAFORMAS:':
        return 'plataforma';
      case 'SERVICIOS:':
        return 'servicio';
      case 'CALIDADES:':
        return 'calidad';
      case 'CANTIDADES:':
        return 'cantidad';
      case 'EXTRAS:':
        return 'extra';
      default:
        return '';
    }
  }

  getNodeClass(node: TreeNode): string {
    switch (node['nodeType']) {
      case 'platform-group': return 'platform-group';
      case 'service-group': return 'service-group';
      case 'quality-group': return 'quality-group';
      case 'quantity-group': return 'quantity-group';
      case 'extra-group': return 'extra-group';
      case 'platform': return 'platform-node';
      case 'service': return 'service-node';
      case 'quality': return 'quality-node';
      case 'quantity': return 'quantity-node';
      case 'extra': return 'extra';
      default: return 'default-node';
    }
  }

  get nodeCssClasses(): { [key: string]: boolean } {
    return {
      'group-true': this.node.group,
      'group-false': !this.node.group,
      [this.getNodeClass(this.node)]: true
    };
  }

}
