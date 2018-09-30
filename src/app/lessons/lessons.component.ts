import { Component, OnInit } from '@angular/core';
import {Lesson} from '../lesson';
import {LrsService} from '../lrs.service';
import {Student} from '../student';
import {Router} from '@angular/router';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {

  selectedLesson: Lesson;
  lessons: Lesson[];

  // form inputs
  name: string;
  lastName: string;

  isWarning = LessonsComponent.isWarning;
  isDanger = LessonsComponent.isDanger;
  isSuccessful = LessonsComponent.isSuccessful;

  static isWarning(lesson: Lesson): boolean {
    return false;
  }

  static isDanger(lesson: Lesson): boolean {
    return false;
  }

  static isSuccessful(lesson: Lesson): boolean {
    return false;
  }

  constructor(private router: Router, private lrsService: LrsService) { }

  ngOnInit() {
    this.getLessons();
  }

  getLessons(): void {
    this.lrsService.getLessons()
      .subscribe(lessons => this.lessons = lessons);
  }

  onSelect(lesson: Lesson): void {
    this.selectedLesson = lesson;
  }

  enrollStudent(): void {
    const e = new Lesson();
    e.student = new Student();
    e.student.lastName = this.lastName;
    e.student.name = this.name;
    e.lessonName = 'lesson';
    this.lrsService.enrollStudent(e)
      .subscribe(enrollment => {
        if (enrollment != null) {
          this.lessons.push(enrollment);
        }
      });
  }

  gotoDetail(): void {
    this.router.navigate(['/lesson-details', this.selectedLesson.enrollmentID]);
  }

}
