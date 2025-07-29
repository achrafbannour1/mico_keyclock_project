import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectToolMaterialComponent } from './affect-tool-material.component';

describe('AffectToolMaterialComponent', () => {
  let component: AffectToolMaterialComponent;
  let fixture: ComponentFixture<AffectToolMaterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffectToolMaterialComponent]
    });
    fixture = TestBed.createComponent(AffectToolMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
