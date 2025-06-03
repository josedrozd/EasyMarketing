import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { OrderDataService } from '../../../../services/order-data.service';
import { OrderLayoutComponent } from '../order-layout/order-layout.component';
import { filter, Subscription, take } from 'rxjs';
import { TreeNode } from '../../../panel/tree-node/tree-node.component';
import { Router } from '@angular/router';
import { ServicesService } from '../../../../services/backend/services/services.service';
import { PlatformNode, QualityNode, QuantityNode, ServiceNode } from '../../../../core/models/panel-nodes';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsernameCheckService } from '../../../../services/backend/instagram/username-check.service';
import { platform } from 'os';
import { IGMediaService } from '../../../../services/backend/instagram/retrieve-media.service';
import { IGClipsService, IGReelClipDTO } from '../../../../services/backend/instagram/retrieve-reels.service';
import { environment } from '../../../../../environments/environment';

type FormDataKeys = 'username' | 'mail' | 'name' | 'lastname';

@Component({
  selector: 'app-order-data',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './order-data.component.html',
  styleUrls: ['./order-data.component.css', '../order-layout/order-layout.component.css']
})
export class OrderDataComponent {

  serviceRef: string | null = null;
  productRef: string | null = null;
  qualityRef: string | null = null;
  quantityRef: string | null = null;
  product!: ServiceNode | null;
  quantity!: QuantityNode | null;
  quantities!: QuantityNode[];
  private orderSub!: Subscription;
  @ViewChild('customSelect') customSelectRef!: ElementRef;
  @ViewChild('recaptchaContainer', { static: true }) recaptchaElement!: ElementRef;

  dropdownOpen = false;
  isInstagram: boolean = false;
  recaptchaOk = false;
  recaptchaToken: string = '';
  isScrapping: boolean = false;
  isProduction: boolean = environment.production;

  formData: { [key in FormDataKeys]: string } = {
    username: '',
    mail: '',
    name: '',
    lastname: ''
  };

  constructor(
    private servicesService: ServicesService,
    private orderDataService: OrderDataService,
    private usernameCheckService: UsernameCheckService,
    private igMediaService: IGMediaService,
    private igClipsService: IGClipsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.orderSub = this.orderDataService.orderData$.subscribe(data => {
      this.formData.mail = data.mail ?? '';
      this.formData.name = data.name ?? '';
      this.formData.lastname = data.lastname ?? '';
      this.serviceRef = data.serviceId;
      this.productRef = data.productId;
      this.qualityRef = data.qualityId;
      this.quantityRef = data.quantityId;
      if (this.serviceRef && this.productRef && this. qualityRef && this.quantityRef) {
        this.loadService();
      } else {
        this.router.navigate(['']);
      }
    });
    if (typeof window !== 'undefined') {
      (window as any)['recaptchaResolved'] = (token: string) => {
        this.recaptchaToken = token;
        this.recaptchaOk = true;
      };
    }
  }

  ngOnDestroy() {
    if (this.orderSub) {
      this.orderSub.unsubscribe();
    }
    this.isScrapping = false;
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.loadRecaptchaScript().then(() => {
        if ((window as any).grecaptcha) {
          (window as any).grecaptcha.render(this.recaptchaElement.nativeElement, {
            sitekey: '6LctlksrAAAAAKArc4eeiYd5g1TiSWtwj3e8O_UK',
            callback: (token: string) => {
              this.recaptchaToken = token;
              this.recaptchaOk = true;
            },
            'expired-callback': () => {
              this.recaptchaToken = '';
              this.recaptchaOk = false;
            }
          });
        } else {
          console.warn('⚠️ grecaptcha todavía no está listo');
        }
      });
    }
  }

  loadRecaptchaScript(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).grecaptcha) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  checkAndSubmit(f: NgForm) {
    this.isScrapping = true;
    if (this.isProduction && !this.recaptchaOk) {
      alert('Por favor, verifica el captcha.');
      this.isScrapping = false;
      return;
    }
    const formEl = document.querySelector('.order-form') as HTMLFormElement;
    if (!formEl.reportValidity()) {
      this.isScrapping = false;
      return;
    }
    if (!this.validateCustomFields()) {
      this.isScrapping = false;
      return;
    }

    const saveAndContinue = () => {
      this.orderDataService.setAll({
        username: this.formData.username,
        mail: this.formData.mail,
        name: this.formData.name,
        lastname: this.formData.lastname,
        platform: this.isInstagram ? "instagram" : "other"
      });
      this.orderDataService.orderData$.pipe(take(1))
        .subscribe(() => {this.router.navigate(['/ordenes/detalles']);});
    }

    if (this.isInstagram) {
      this.usernameCheckService.checkIGUsername(this.formData.username).subscribe(userInfo => {
        if (!userInfo.id || userInfo.isPrivate) {
          alert('El usuario no es válido o es privado.');
          this.isScrapping = false;
          return;
        }
        try {
          if (this.product?.type == "POST") {
            this.igMediaService.getMediaByUserId(Number(userInfo.id));
          } else if (this.product?.type == "REEL") {
            this.igClipsService.getReelsByUserId(Number(userInfo.id));
          }
          saveAndContinue();
        } catch(error) {
          console.error(error);
          this.router.navigate(['/']);
        }
      }, error => {
        console.error('Error al verificar el usuario:', error);
        alert('No se pudo verificar el usuario.');
      });
    } else {
      saveAndContinue();
    }
  }

  loadService() {
    this.servicesService.getServices().subscribe(tree => {
      const platformGroup = tree[0];
      const foundService = platformGroup.children!.find(child => child.refId === this.serviceRef);
      const serviceGroup = foundService?.children![0];
      const foundProduct = serviceGroup?.children!.find(child => child.refId === this.productRef);
      const qualityGroup = foundProduct?.children![0];
      const foundQuality = qualityGroup?.children!.find(child => child.refId === this.qualityRef);
      const quantityGroup = foundQuality?.children![0];
      const foundQuantity = quantityGroup?.children!.find(child => child.refId === this.quantityRef);

      if (!foundService || !foundProduct || !foundQuality || !foundQuantity) {
        this.router.navigate(['/404']);
        return;
      }

      this.isInstagram = (foundService as PlatformNode).platform === "INSTAGRAM";
      this.product = foundProduct as ServiceNode;
      this.quantity = foundQuantity as QuantityNode;
      this.quantities = (foundQuality.children![0].children as QuantityNode[]).sort((a, b) => a.quantity - b.quantity);
    });
  }

  onQuantityChange(selectedQuantity: TreeNode) {
    this.quantity = selectedQuantity as QuantityNode;
    this.orderDataService.setQuantityRefId(selectedQuantity.refId);
  }

  validateCustomFields(): boolean {
    for (const key of ['username', 'mail', 'name', 'lastname'] as FormDataKeys[]) {
      if (/\s/.test(this.formData[key])) {
        const inputEl = document.querySelector(`input[name="${key}"]`) as HTMLInputElement;
        inputEl.setCustomValidity('No debe tener espacios.');
        inputEl.reportValidity();
        return false;
      } else {
        const inputEl = document.querySelector(`input[name="${key}"]`) as HTMLInputElement;
        inputEl.setCustomValidity('');
      }
    }
    return true;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectQuantity(q: QuantityNode) {
    this.quantity = q;
    this.orderDataService.setQuantityRefId(q.refId);
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.customSelectRef) return;
    const clickedInside = this.customSelectRef.nativeElement.contains(event.target);
    if (!clickedInside && this.dropdownOpen) {
      this.dropdownOpen = false;
    }
  }

}
