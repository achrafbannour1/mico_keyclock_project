import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectresourceComponent } from './affectresource.component';

describe('AffectresourceComponent', () => {
  let component: AffectresourceComponent;
  let fixture: ComponentFixture<AffectresourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffectresourceComponent]
    });
    fixture = TestBed.createComponent(AffectresourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
