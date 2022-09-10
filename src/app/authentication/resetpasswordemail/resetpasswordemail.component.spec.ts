import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpasswordemailComponent } from './resetpasswordemail.component';

describe('ResetpasswordemailComponent', () => {
  let component: ResetpasswordemailComponent;
  let fixture: ComponentFixture<ResetpasswordemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetpasswordemailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetpasswordemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
