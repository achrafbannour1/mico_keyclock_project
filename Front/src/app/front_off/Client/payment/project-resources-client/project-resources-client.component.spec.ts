import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectResourcesClientComponent } from './project-resources-client.component';

describe('ProjectResourcesClientComponent', () => {
  let component: ProjectResourcesClientComponent;
  let fixture: ComponentFixture<ProjectResourcesClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectResourcesClientComponent]
    });
    fixture = TestBed.createComponent(ProjectResourcesClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
