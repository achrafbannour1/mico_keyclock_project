import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowClientProductComponent } from './show-client-product.component';

describe('ShowClientProductComponent', () => {
  let component: ShowClientProductComponent;
  let fixture: ComponentFixture<ShowClientProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowClientProductComponent]
    });
    fixture = TestBed.createComponent(ShowClientProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
