import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationListComponent } from './affectation-list.component';

describe('AffectationListComponent', () => {
  let component: AffectationListComponent;
  let fixture: ComponentFixture<AffectationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffectationListComponent]
    });
    fixture = TestBed.createComponent(AffectationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
