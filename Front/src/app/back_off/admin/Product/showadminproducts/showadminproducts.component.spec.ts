import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowadminproductsComponent } from './showadminproducts.component';

describe('ShowadminproductsComponent', () => {
  let component: ShowadminproductsComponent;
  let fixture: ComponentFixture<ShowadminproductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowadminproductsComponent]
    });
    fixture = TestBed.createComponent(ShowadminproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
