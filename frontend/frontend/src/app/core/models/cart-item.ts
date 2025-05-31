export class CartItem {
    username!: string;
    platformId!: number;
    productId!: number;
    qualityId!: number;
    quantityId!: number;
    urls!: string[];
    unitQuantity!: number;

    constructor(
        username: string,
        platformId: number,
        productId: number,
        qualityId: number,
        quantityId: number,
        urls: string[],
        unitQuantity: number
    ){
        this.username = username;
        this.platformId = platformId;
        this.productId = productId;
        this.qualityId = qualityId;
        this.quantityId = quantityId;
        this.urls = urls;
        this.unitQuantity = unitQuantity;
    }
}
