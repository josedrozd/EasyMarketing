import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { PingService } from '../../services/ping.service';

@Component({
  selector: 'app-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.css']
})
export class PingComponent implements OnInit {
  response: string = '';

  constructor(private pingService: PingService) {}

  ngOnInit(): void {
    this.checkPing();
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
