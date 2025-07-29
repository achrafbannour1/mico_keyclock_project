import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceadmindetailsComponent } from './resourceadmindetails.component';

describe('ResourceadmindetailsComponent', () => {
  let component: ResourceadmindetailsComponent;
  let fixture: ComponentFixture<ResourceadmindetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceadmindetailsComponent]
    });
    fixture = TestBed.createComponent(ResourceadmindetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
