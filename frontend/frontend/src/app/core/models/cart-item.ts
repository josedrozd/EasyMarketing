export class CartItem {
    username!: string;
    serviceId!: number;
    serviceName!: string;
    urls!: string[];
    urlType!: string | null;
    provider!: string;
    unitQuantity!: number;
    price!: number;

    constructor(
        username: string,
        serviceId: number,
        serviceName: string,
        urls: string[],
        urlType: string,
        provider: string,
        unitQuantity: number,
        price: number
    ){
        this.username = username;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.urls = urls;
        this.urlType = urlType;
        this.provider = provider;
        this.unitQuantity = unitQuantity;
        this.price = price;
    }
}
