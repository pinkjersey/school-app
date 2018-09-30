export class RecordActivityRequest {
  enrollmentID: string;
  activities: string[];
  constructor(eid: string, activity: string) {
    this.enrollmentID = eid;
    this.activities = [activity];
  }
}
