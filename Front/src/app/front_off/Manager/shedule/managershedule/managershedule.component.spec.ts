import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagersheduleComponent } from './managershedule.component';

describe('ManagersheduleComponent', () => {
  let component: ManagersheduleComponent;
  let fixture: ComponentFixture<ManagersheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagersheduleComponent]
    });
    fixture = TestBed.createComponent(ManagersheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
