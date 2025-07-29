import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectResourcesComponent } from './project-resources.component';

describe('ProjectResourcesComponent', () => {
  let component: ProjectResourcesComponent;
  let fixture: ComponentFixture<ProjectResourcesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectResourcesComponent]
    });
    fixture = TestBed.createComponent(ProjectResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
