import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerMeetingComponent } from './manager-meeting.component';

describe('ManagerMeetingComponent', () => {
  let component: ManagerMeetingComponent;
  let fixture: ComponentFixture<ManagerMeetingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerMeetingComponent]
    });
    fixture = TestBed.createComponent(ManagerMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
