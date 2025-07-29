import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavclComponent } from './navcl.component';

describe('NavclComponent', () => {
  let component: NavclComponent;
  let fixture: ComponentFixture<NavclComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavclComponent]
    });
    fixture = TestBed.createComponent(NavclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
