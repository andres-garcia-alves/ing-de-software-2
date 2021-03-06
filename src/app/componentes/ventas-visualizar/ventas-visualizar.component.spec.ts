import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentasVisualizarComponent } from './ventas-visualizar.component';

describe('VentasVisualizarComponent', () => {
  let component: VentasVisualizarComponent;
  let fixture: ComponentFixture<VentasVisualizarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasVisualizarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasVisualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
