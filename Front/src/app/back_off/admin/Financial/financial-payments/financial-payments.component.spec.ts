import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPaymentsComponent } from './financial-payments.component';

describe('FinancialPaymentsComponent', () => {
  let component: FinancialPaymentsComponent;
  let fixture: ComponentFixture<FinancialPaymentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialPaymentsComponent]
    });
    fixture = TestBed.createComponent(FinancialPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
