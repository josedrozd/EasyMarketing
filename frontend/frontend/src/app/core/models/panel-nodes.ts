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
    imgUrl!: string;
    automaticPaymentAllowed!: boolean;
    active!: boolean;
    constructor(
      name: string,
      imgUrl: string,
      automaticPaymentAllowed: boolean,
      active: boolean
    ) {
      super("platform", name, false, [new GroupNode("service-group", "SERVICIOS:")], true);
      this.imgUrl = imgUrl;
      this.automaticPaymentAllowed = automaticPaymentAllowed;
      this.active = active;
    }
}

export class ServiceNode extends BaseNode {
    type!: string;
    imgUrl!: string;
    activated!: boolean;
    constructor(
        name: string,
        type: string,
        imgUrl: string,
        activated: boolean
    ) {
      super("service", name, false, [new GroupNode("quality-group", "CALIDADES:")], true);
      this.type = type;
      this.imgUrl = imgUrl;
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
    withDiscount!: boolean;
    basePrice!: number;
    finalPrice!: number;
    discount!: number;
    constructor(
        quantity: number,
        withDiscount: boolean,
        basePrice: number,
        finalPrice: number,
        discount: number
    ) {
      super("quantity", quantity.toString(), false, undefined);
      this.quantity = quantity;
      this.withDiscount = withDiscount;
      this.basePrice = basePrice;
      this.finalPrice = finalPrice;
      this.discount = discount;
    }
}

export class ExtraNode extends BaseNode {
  imgUrl!: string;
  destinationUrl!: string;
  active!: boolean;
  constructor(
    name: string,
    imgUrl: string,
    destinationUrl: string,
    active: boolean
  ) {
    super("extra", name, false, undefined)
    this.imgUrl = imgUrl;
    this.destinationUrl = destinationUrl;
    this.active = active;
  }
}