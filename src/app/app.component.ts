import {Component, OnInit} from '@angular/core';
import {MeService} from './me.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Team-Blockchain';
  me: string;

  constructor(private meService: MeService) { }

  ngOnInit() {
    this.getMe();
  }

  getMe(): void {
    this.meService.getMe()
      .subscribe(me => this.me = me);
  }
}
