import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostToBlogDialogComponent } from './post-to-blog-dialog.component';

describe('PostToBlogDialogComponent', () => {
  let component: PostToBlogDialogComponent;
  let fixture: ComponentFixture<PostToBlogDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostToBlogDialogComponent]
    });
    fixture = TestBed.createComponent(PostToBlogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
