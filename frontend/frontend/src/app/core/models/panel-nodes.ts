import { TreeNode } from "../../components/panel/tree-node/tree-node.component";

export class BaseNode implements TreeNode {
    constructor(
      public nodeType: string,
      public name: string,
      public group: boolean,
      public children: TreeNode[] | undefined,
      public expanded: boolean = false,
      public editing: boolean = true,
      public id: string = crypto.randomUUID().toString()
    ) {}
}

export class GroupNode extends BaseNode {
    constructor(
        nodeType: string,
        name: string
    ) {
      super(nodeType, name, true, [], false, false);
    }
}

export class PlatformNode extends BaseNode {
    automaticPaymentAllowed!: boolean;
    active!: boolean;
    constructor(
      name: string,
      automaticPaymentAllowed: boolean,
      active: boolean
    ) {
      super("platform", name, false, [new GroupNode("service-group", "SERVICIOS:")], true);
      this.automaticPaymentAllowed = automaticPaymentAllowed;
      this.active = active;
    }
}

export class ServiceNode extends BaseNode {
    type!: string;
    activated!: boolean;
    constructor(
        name: string,
        type: string,
        activated: boolean
    ) {
      super("service", name, false, [new GroupNode("quality-group", "CALIDADES:")], true);
      this.type = type;
      this.activated = activated;
    }
}

export class QualityNode extends BaseNode {
    provider!: string;
    providerServiceId!: number;
    priority!: number;
    automaticPayment!: boolean;
    activated!: boolean;
    constructor(
        name: string,
        provider: string,
        providerServiceId: number,
        automaticPayment: boolean,
        priority: number,
        activated: boolean
    ) {
      super("quality", name, false, [new GroupNode("quantity-group", "CANTIDADES:")], true);
      this.provider = provider;
      this.providerServiceId = providerServiceId;
      this.automaticPayment = automaticPayment;
      this.priority = priority;
      this.activated = activated;
    }
}

export class QuantityNode extends BaseNode {
    quantity!: number;
    price!: number;
    discount!: number;
    constructor(
        quantity: number,
        price: number,
        discount: number
    ) {
      super("quantity", quantity.toString(), false, undefined);
      this.quantity = quantity;
      this.price = price;
      this.discount = discount;
    }
}