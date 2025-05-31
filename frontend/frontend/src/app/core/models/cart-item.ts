export class CartItem {
    username!: string;
    serviceId!: number;
    serviceName!: string;
    urls!: string[];
    urlType!: string | null;
    provider!: string;
    unitQuantity!: number;
    price!: number;
    totalQuantity!: number;
    qualityName!: string;
    picUrl!: string;

    constructor(
        username: string,
        serviceId: number,
        serviceName: string,
        urls: string[],
        urlType: string,
        provider: string,
        unitQuantity: number,
        price: number,
        totalQuantity: number,
        qualityName: string,
        picUrl: string
    ){
        this.username = username;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.urls = urls;
        this.urlType = urlType;
        this.provider = provider;
        this.unitQuantity = unitQuantity;
        this.price = price;
        this.totalQuantity = totalQuantity;
        this.qualityName = qualityName;
        this.picUrl = picUrl;
    }
}
