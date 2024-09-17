import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerNumberComponent } from './manager-number.component';

describe('ManagerNumberComponent', () => {
  let component: ManagerNumberComponent;
  let fixture: ComponentFixture<ManagerNumberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerNumberComponent]
    });
    fixture = TestBed.createComponent(ManagerNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
