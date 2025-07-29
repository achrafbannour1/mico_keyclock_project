import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPayementComponent } from './history-payement.component';

describe('HistoryPayementComponent', () => {
  let component: HistoryPayementComponent;
  let fixture: ComponentFixture<HistoryPayementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryPayementComponent]
    });
    fixture = TestBed.createComponent(HistoryPayementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
