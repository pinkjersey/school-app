import { Component, OnInit } from '@angular/core';
import {LrsService} from '../lrs.service';
import {Lesson} from '../lesson';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  lessons: Lesson[];
  constructor(private lrsService: LrsService) { }

  ngOnInit() {
    this.getLessons();
  }

  getLessons(): void {
    this.lrsService.getLessons()
      .subscribe(lessons => this.lessons = lessons);
  }
}
