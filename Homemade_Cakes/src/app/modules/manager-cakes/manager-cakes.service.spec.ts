import { TestBed } from '@angular/core/testing';

import { ManagerCakesService } from './manager-cakes.service';

describe('ManagerCakesService', () => {
  let service: ManagerCakesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerCakesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
