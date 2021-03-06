import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILocal, IProducto, IStock, IPlainStock } from 'src/app/interfaces';
import { PlainStock, Stock } from 'src/app/entidades';
import { LocalesService } from 'src/app/services/locales.service';
import { ProductosService } from 'src/app/services/productos.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock-baja',
  templateUrl: './stock-baja.component.html',
  styleUrls: ['./stock-baja.component.css']
})
export class StockBajaComponent implements OnInit {

  debug: any;
  loading: boolean;
  messages: string;

  locales: ILocal[] = [];
  productos: IProducto[] = [];
  plainStock: IPlainStock[] = [];

  seleccionado: IPlainStock = new PlainStock();
  stockForm: FormGroup;

  filtroProducto = '';
  filtroLocal = '';
  filteredStock: IPlainStock[];

  constructor(private localesService: LocalesService, private productosService: ProductosService,
    private stockService: StockService) { }

  async ngOnInit() {
    this.loading = true;

    this.stockForm = new FormGroup({
      motivo: new FormControl(''),
      cantidad: new FormControl('')
    });

    try {
      const response = await this.localesService.getLocales();
      console.log('getLocales()', response);

      const response2 = await this.productosService.getProductos();
      console.log('getProductos()', response2);

      const response3 = await this.stockService.getStocks();
      console.log('getStock()', response3);

      this.locales = response;
      this.productos = response2;
      this.buildPlainStockFromResponse(response3);
    }
    catch (error) { this.messages = error; }
    finally { this.loading = false; this.filter(); }

    this.filter();
    this.stockForm.controls.motivo.setValue(0);
  }

  buildPlainStockFromResponse(response: IStock[]) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < response.length; i++) {
      const aux = new PlainStock();
      aux.id = response[i].id;
      aux.localId = response[i].tienda;
      aux.localNombre = this.locales.find(x => x.id === response[i].tienda).nombre;
      aux.productoId = response[i].producto;
      aux.productoNombre = this.productos.find(x => x.id === response[i].producto).nombre;
      aux.cantidad = response[i].cantidad;

      this.plainStock.push(aux);
      console.log('aux', aux);
    }
  }

  select(plainStock: IPlainStock) {
    this.seleccionado = plainStock;
  }

  unselect() {
    this.seleccionado = new PlainStock();
    this.messages = '';

    this.stockForm.controls.motivo.setValue(0);
    this.stockForm.controls.cantidad.setValue('');
  }

  filter() {
    this.filteredStock = this.plainStock.filter(
      x => x.productoNombre.includes(this.filtroProducto) && x.localNombre.includes(this.filtroLocal));
  }

  async delete() {

    if (this.formValidation() === false) { return; }
    if (confirm('Está seguro que desea generar la baja?') === false ) { return; }

    this.loading = true;
    const stock = new Stock(this.seleccionado);
    stock.cantidad -= this.stockForm.controls.cantidad.value;

    try {
      const response = await this.stockService.putStock(stock)
      console.log('putStock()', response);

      this.seleccionado.cantidad = response.cantidad;
      this.unselect();
    }
    catch (error) { this.messages = error; }
    finally { this.loading = false; this.filter(); }
  }

  formValidation(): boolean {
    this.messages = '';

    if (this.seleccionado.id === 0) {
      this.messages += 'Falta elegir el producto a modificar.\n';
    }
    if (this.stockForm.controls.motivo.value === '' || this.stockForm.controls.motivo.value === 0) {
      this.messages += 'Falta elegir el motivo de la baja.\n';
    }
    if (this.stockForm.controls.cantidad.value <= 0) {
      this.messages += 'Falta completar la cantidad.\n';
    }
    if (this.stockForm.controls.cantidad.value > this.seleccionado.cantidad) {
      this.messages += 'La cantidad a dar de baja excede el stock actual.\n';
    }
    if (this.stockForm.controls.cantidad.value % 1 !== 0) {
      this.messages += 'Cantidad inválida. Ingrese un número entero.\n';
    }

    return (this.messages === '') ? true : false;
  }
}
