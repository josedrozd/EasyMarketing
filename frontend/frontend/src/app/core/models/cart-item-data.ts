import { PlatformNode, ServiceNode, QualityNode, QuantityNode } from "./panel-nodes";

export class CartItemData {
    username!: string;
    platform!: PlatformNode;
    product!: ServiceNode;
    quality!: QualityNode;
    quantity!: QuantityNode;
    constructor(
      username: string,
      platform: PlatformNode,
      product: ServiceNode,
      quality: QualityNode,
      quantity: QuantityNode
    ){
      this.username = username;
      this.platform = platform;
      this.product = product;
      this.quality = quality;
      this.quantity = quantity;
    }
}