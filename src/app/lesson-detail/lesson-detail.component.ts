import {Component, Input, OnInit} from '@angular/core';
import {Lesson} from '../lesson';
import {ActivatedRoute} from '@angular/router';
import {LrsService} from '../lrs.service';
import {RecordActivityRequest} from '../record-activity-request';
import {EnrollmentInfo} from '../enrollment-info';
import {Transfer} from '../transfer';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.css']
})
export class LessonDetailComponent implements OnInit {
  @Input() lesson: Lesson;

  constructor(private route: ActivatedRoute, private lrsService: LrsService) { }

  ngOnInit(): void {
    this.getLesson();
  }

  getLesson(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.lrsService.getLesson(id)
      .subscribe(lesson => this.lesson = lesson);
  }

  transferClick(): void {
    console.log('transfer click');
    const tr = new Transfer();
    tr.enrollmentID = this.lesson.enrollmentID;
    tr.otherPartyName = 'O=SchoolA,L=Detroit,C=US';
    this.lrsService.transfer(tr).subscribe(eid => console.log(`${eid.enrollmentID} transferred`));
  }

  handleClick(): void {
    console.log('click');
    const rar = new RecordActivityRequest(this.lesson.enrollmentID, 'xapi');
    this.lrsService.recordActivity(rar).subscribe(eid => console.log(`${eid.enrollmentID} updated`));
  }

  completeClick(): void {
    console.log('complete click');
    const ei = new EnrollmentInfo();
    ei.enrollmentID = this.lesson.enrollmentID;
    // const rar = new RecordActivityRequest(this.lesson.enrollmentID, 'xapi');
    this.lrsService.completeLesson(ei).subscribe(eid => console.log(`${eid.enrollmentID} completed`));
    this.lesson.complete = true;
  }
}
