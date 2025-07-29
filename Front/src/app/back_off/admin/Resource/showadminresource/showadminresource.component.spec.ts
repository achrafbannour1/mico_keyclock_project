import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowadminresourceComponent } from './showadminresource.component';

describe('ShowadminresourceComponent', () => {
  let component: ShowadminresourceComponent;
  let fixture: ComponentFixture<ShowadminresourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowadminresourceComponent]
    });
    fixture = TestBed.createComponent(ShowadminresourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
