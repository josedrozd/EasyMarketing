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
import * as THREE from 'three';

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
    await this.loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js');

    setTimeout(() => {
      if ((window as any).VANTA && this.vantaRef?.nativeElement) {
        this.vantaEffect = (window as any).VANTA.NET({
          el: this.vantaRef.nativeElement,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x888888,
          backgroundAlpha: 0.0,
          points: 10.0,
          maxDistance: 25.0,
          spacing: 20.0,
          backgroundColor: 0x000000
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
