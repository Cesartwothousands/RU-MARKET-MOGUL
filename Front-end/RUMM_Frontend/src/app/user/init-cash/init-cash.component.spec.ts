import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitCashComponent } from './init-cash.component';

describe('InitCashComponent', () => {
  let component: InitCashComponent;
  let fixture: ComponentFixture<InitCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitCashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
