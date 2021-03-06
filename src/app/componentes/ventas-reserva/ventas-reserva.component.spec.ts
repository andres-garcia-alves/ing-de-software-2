import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentasReservaComponent } from './ventas-reserva.component';

describe('VentasReservaComponent', () => {
  let component: VentasReservaComponent;
  let fixture: ComponentFixture<VentasReservaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasReservaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
