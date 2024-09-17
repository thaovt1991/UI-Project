import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCakesComponent } from './manager-cakes.component';

describe('ManagerCakesComponent', () => {
  let component: ManagerCakesComponent;
  let fixture: ComponentFixture<ManagerCakesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerCakesComponent]
    });
    fixture = TestBed.createComponent(ManagerCakesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
