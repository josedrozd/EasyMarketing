export class CartItem {
    serviceId!: number;
    serviceName!: string;
    urls!: string[];
    urlType!: string | null;
    provider!: string;
    unitQuantity!: number;
    price!: number;

    constructor(
        serviceId: number,
        serviceName: string,
        urls: string[],
        urlType: string,
        provider: string,
        unitQuantity: number,
        price: number
    ){
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.urls = urls;
        this.urlType = urlType;
        this.provider = provider;
        this.unitQuantity = unitQuantity;
        this.price = price;
    }
}
