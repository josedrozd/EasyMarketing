import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { PingService } from '../../services/backend/ping.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.css']
})
export class PingComponent implements OnInit {
  response: string = '';

  constructor(
    private pingService: PingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkPing();
  }

  irAMercadoPago() {
    const timestamp = Date.now();
    this.router.navigate(['/mp'], { queryParams: { t: timestamp } });
  }

  checkPing() {
    this.pingService.getPing().subscribe(data => {
      this.response = data;
    }, error => {
      console.error(error);
      this.response = 'Error al obtener la respuesta';
    });
  }
}
