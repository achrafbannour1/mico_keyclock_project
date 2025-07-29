import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFinancialsComponent } from './project-financials.component';

describe('ProjectFinancialsComponent', () => {
  let component: ProjectFinancialsComponent;
  let fixture: ComponentFixture<ProjectFinancialsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectFinancialsComponent]
    });
    fixture = TestBed.createComponent(ProjectFinancialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
