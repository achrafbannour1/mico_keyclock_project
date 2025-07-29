import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavManagerComponent } from './nav-manager.component';

describe('NavManagerComponent', () => {
  let component: NavManagerComponent;
  let fixture: ComponentFixture<NavManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavManagerComponent]
    });
    fixture = TestBed.createComponent(NavManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
