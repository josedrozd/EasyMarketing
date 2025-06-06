import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  length: number; 
}

@Component({
  selector: 'app-particles',
  templateUrl: './particles.component.html',
  styleUrls: ['./particles.component.css']
})
export class ParticlesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasRef', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  particles: Particle[] = [];
  animationFrameId = 0;
  resizeListener = this.resizeCanvas.bind(this);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;
    this.ctx = context;

    this.resizeCanvas();

    window.addEventListener('resize', this.resizeListener);

    this.createParticles(100);
    this.animate();
  }

  resizeCanvas() {
    const canvas = this.canvasRef?.nativeElement;
    const message = document.querySelector('.welcome-container') as HTMLElement;
    if (!canvas || !message) return;

    const rect = message.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  createParticles(count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 3.5 + 1.0,
        opacity: Math.random() * 0.5 + 0.5,
        length: Math.random() * 300 + 50 
      });
    }
  }

  animate = () => {
    if (!this.ctx) return;
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.particles.forEach(p => {
      p.y -= p.speed;
      if (p.y < 0) p.y = canvas.height;

      this.ctx.beginPath();
      this.ctx.strokeStyle = `rgba(155, 89, 182, ${p.opacity})`;
      this.ctx.shadowColor = 'rgba(155, 89, 182, 0.8)';
      this.ctx.shadowBlur = 10;
      this.ctx.lineWidth = 0.5;

      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x, p.y - p.length);

      this.ctx.stroke();

    });

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      cancelAnimationFrame(this.animationFrameId);
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}
