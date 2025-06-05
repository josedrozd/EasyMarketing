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
    await this.loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.trunk.min.js');

    setTimeout(() => {
      if ((window as any).VANTA && this.vantaRef?.nativeElement) {
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
          backgroundColor: 0x242226,
          chaos: 1.5
        });
      }
    }, 50);
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

  ngOnDestroy(): void {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }
}
