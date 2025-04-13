export class CartItem {
    serviceId!: number;
    serviceName!: string;
    urls!: string[];
    urlType!: string | null;
    unitQuantity!: number;
    price!: number;

    constructor(
        serviceId: number,
        serviceName: string,
        urls: string[],
        urlType: string,
        unitQuantity: number,
        price: number
    ){
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.urls = urls;
        this.urlType = urlType;
        this.unitQuantity = unitQuantity;
        this.price = price;
    }
}
