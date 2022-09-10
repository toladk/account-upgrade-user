import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwofactorregisterComponent } from './twofactorregister.component';

describe('TwofactorregisterComponent', () => {
  let component: TwofactorregisterComponent;
  let fixture: ComponentFixture<TwofactorregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwofactorregisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwofactorregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
