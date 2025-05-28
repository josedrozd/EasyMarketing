import { TreeNode } from "../../components/panel/tree-node/tree-node.component";

export class BaseNode implements TreeNode {
    constructor(
      public id: number | null,
      public nodeType: string,
      public name: string,
      public group: boolean,
      public children: TreeNode[] | undefined,
      public expanded: boolean = false,
      public editing: boolean = true,
      public refId: string = crypto.randomUUID().toString()
    ) {}
}

export class GroupNode extends BaseNode {
    constructor(
        id: number | null,
        nodeType: string,
        name: string
    ) {
      super(id, nodeType, name, true, [], false, false);
    }
}

export class PlatformNode extends BaseNode {
    platform!: string;
    imgUrl!: string;
    automaticPaymentAllowed!: boolean;
    active!: boolean;
    constructor(
      id: number | null,
      name: string,
      platform: string,
      imgUrl: string,
      automaticPaymentAllowed: boolean,
      active: boolean
    ) {
      super(id, "platform", name, false, [new GroupNode(1, "service-group", "SERVICIOS:")], true);
      this.platform = platform;
      this.imgUrl = imgUrl;
      this.automaticPaymentAllowed = automaticPaymentAllowed;
      this.active = active;
    }
}

export class ServiceNode extends BaseNode {
    type!: string;
    product!: string;
    imgUrl!: string;
    activated!: boolean;
    description!: string;
    constructor(
        id: number | null,
        name: string,
        type: string,
        product: string,
        imgUrl: string,
        activated: boolean,
        description: string
    ) {
      super(id, "service", name, false, [new GroupNode(1, "quality-group", "CALIDADES:")], true);
      this.type = type;
      this.product = product;
      this.imgUrl = imgUrl;
      this.activated = activated;
      this.description = description;
    }
}

export class QualityNode extends BaseNode {
    provider!: string;
    providerServiceId!: number;
    minimum!: number;
    priority!: number;
    automaticPayment!: boolean;
    activated!: boolean;
    description!: string;
    constructor(
        id: number | null,
        name: string,
        provider: string,
        providerServiceId: number,
        minimum: number,
        automaticPayment: boolean,
        priority: number,
        activated: boolean,
        description: string
    ) {
      super(id, "quality", name, false, [new GroupNode(1, "quantity-group", "CANTIDADES:")], true);
      this.provider = provider;
      this.providerServiceId = providerServiceId;
      this.minimum = minimum;
      this.automaticPayment = automaticPayment;
      this.priority = priority;
      this.activated = activated;
      this.description = description;
    }
}

export class QuantityNode extends BaseNode {
    quantity!: number;
    withDiscount!: boolean;
    basePrice!: number;
    finalPrice!: number;
    discount!: number;
    constructor(
        id: number | null,
        quantity: number,
        withDiscount: boolean,
        basePrice: number,
        finalPrice: number,
        discount: number
    ) {
      super(id, "quantity", quantity.toString(), false, undefined);
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
    id: number | null,
    name: string,
    imgUrl: string,
    destinationUrl: string,
    active: boolean
  ) {
    super(id, "extra", name, false, undefined)
    this.imgUrl = imgUrl;
    this.destinationUrl = destinationUrl;
    this.active = active;
  }
}