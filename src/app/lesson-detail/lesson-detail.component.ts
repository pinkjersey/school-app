import {Component, Input, OnInit} from '@angular/core';
import {Lesson} from '../lesson';
import {ActivatedRoute} from '@angular/router';
import {LrsService} from '../lrs.service';
import {RecordActivityRequest} from '../record-activity-request';
import {EnrollmentInfo} from '../enrollment-info';
import {Transfer} from '../transfer';
import {MeService} from '../me.service';
import {Xapi} from '../xapi';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.css']
})
export class LessonDetailComponent implements OnInit {
  @Input() lesson: Lesson;
  schools: string[];
  me: string;
  transferSchool: string;
  xapis: Xapi[];

  constructor(private route: ActivatedRoute, private lrsService: LrsService, private meService: MeService) { }

  ngOnInit(): void {
    this.getLesson();
    this.getXapi();
    this.getSchools();
    this.getMe();
  }

  getLesson(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.lrsService.getLesson(id)
      .subscribe(lesson => this.lesson = lesson);
  }

  getXapi(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.lrsService.getActivity(id)
      .subscribe(xapis => this.xapis = xapis);
  }

  getSchools(): void {
    this.lrsService.getSchools()
      .subscribe(schools => this.schools = schools);
  }

  getMe(): void {
    this.meService.getMe()
      .subscribe(me => this.me = me);
  }

  transferClick(): void {
    console.log('transfer click');
    const tr = new Transfer();
    tr.enrollmentID = this.lesson.enrollmentID;
    if (this.transferSchool === 'SchoolA') {
      tr.otherPartyName = 'O=SchoolA,L=Detroit,C=US';
    } else if (this.transferSchool === 'SchoolB') {
      tr.otherPartyName = 'O=SchoolB,L=New York,C=US';
    } else if (this.transferSchool === 'SchoolC') {
      tr.otherPartyName = 'O=SchoolC,L=Chicago,C=US';
    }


    this.lrsService.transfer(tr).subscribe(eid => console.log(`${eid.enrollmentID} transferred`));
  }

  handleClick(): void {
    console.log('click');
    const xapi = '{"actor":{"mbox":"mailto:bob@bob.com","objectType":"Agent"},"verb":{"id":"http://adlnet.gov/expapi/verbs/completed",' +
      '"display":{"en-US":"completed"}},"object":{"id":"http://adlnet.gov/expapi/activities/example",' +
      '"definition":{"name":{"en-US":"Click"},"description":{"en-US":"Clicked a button"}},"objectType":"Activity"}}';
    const xapiObject = new Xapi();
    xapiObject.xapi = xapi;
    this.xapis.push(xapiObject);
    const rar = new RecordActivityRequest(this.lesson.enrollmentID, xapi);
    this.lrsService.recordActivity(rar).subscribe(eid => console.log(`${eid.enrollmentID} updated`));
  }

  completeClick(): void {
    console.log('complete click');
    const xapi = '{"actor":{"mbox":"mailto:bob@bob.com","objectType":"Agent"},"verb":{"id":"http://adlnet.gov/expapi/verbs/completed",' +
      '"display":{"en-US":"completed"}},"object":{"id":"http://adlnet.gov/expapi/activities/example",' +
      '"definition":{"name":{"en-US":"Course"},"description":{"en-US":"Course Complete"}},"objectType":"Activity"}}';
    const xapiObject = new Xapi();
    xapiObject.xapi = xapi;
    this.xapis.push(xapiObject);
    const rar = new RecordActivityRequest(this.lesson.enrollmentID, xapi);
    this.lrsService.completeLesson(rar).subscribe(eid => console.log(`${eid.enrollmentID} completed`));
    this.lesson.complete = true;
  }
}
