import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProductDetailsComponent } from './client-product-details.component';

describe('ClientProductDetailsComponent', () => {
  let component: ClientProductDetailsComponent;
  let fixture: ComponentFixture<ClientProductDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientProductDetailsComponent]
    });
    fixture = TestBed.createComponent(ClientProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
