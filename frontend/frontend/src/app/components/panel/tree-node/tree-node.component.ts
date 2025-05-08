import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TreeNode {
  name: string;
  group: boolean;
  children?: TreeNode[];
  expanded?: boolean;
  editing?: boolean;
}

@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.css']
})
export class TreeNodeComponent {
  @Input() node!: TreeNode;
  @Output() addChild = new EventEmitter<TreeNode>();
  @Output() confirm   = new EventEmitter<TreeNode>();

  toggle(): void {
    this.node.expanded = !this.node.expanded;
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
      default:
        return '';
    }
  }
}
