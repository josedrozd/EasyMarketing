import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('vantaRef', { static: true }) vantaRef!: ElementRef;
  vantaEffect: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadVantaEffect();
    }
  }

  async loadVantaEffect() {
    await this.loadScript('https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js');
    await this.waitUntil(() => (window as any).p5, 1000);
    await this.loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.trunk.min.js');
    await this.waitUntil(() => (window as any).VANTA?.TRUNK, 1000);

    this.vantaEffect = (window as any).VANTA.TRUNK({
      el: this.vantaRef.nativeElement,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x4f339d,
      backgroundColor: null,
      chaos: 1.5
    });
  }

  loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`No se pudo cargar el script: ${src}`));
      document.head.appendChild(script);
    });
  }

  private waitUntil(condition: () => boolean, timeout = 2000): Promise<void> {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        if (condition()) {
          resolve();
        } else if (Date.now() - start > timeout) {
          reject(new Error('Timeout esperando que se cumpla condición'));
        } else {
          setTimeout(check, 30);
        }
      };
      check();
    });
  }

  ngOnDestroy(): void {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }
}
