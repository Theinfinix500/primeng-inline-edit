import { ProductService } from './services/products.service';
import { Product } from './models/Product';
import { Component, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent {
  @ViewChild('table') table: Table;
  productForm: FormGroup;

  products1: Product[];

  products2: Product[];

  statuses: SelectItem[];

  clonedProducts: { [s: string]: Product } = {};
  editingRowKeys: { [s: string]: boolean } = {};

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  get tableRowArray(): FormArray {
    return this.productForm.get('tableRowArray') as FormArray;
  }

  ngOnInit() {
    this.createForm();
    this.productService
      .getProductsSmall()
      .subscribe((data) => (this.products1 = data));
    this.productService.getProductsSmall().subscribe((data) => {
      let editingRowKeys = { '0': true };
      this.products2 = data;
      this.dataToFormGroups(data);
      data.forEach((item) => (editingRowKeys[item.id] = true));
      this.editingRowKeys = editingRowKeys;
      console.log(editingRowKeys);
    });

    this.statuses = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' },
    ];
  }

  createForm() {
    this.productForm = this.fb.group({
      tableRowArray: this.fb.array([]),
    });
  }

  createTableRow(row: Product = null) {
    if (row) {
      return this.fb.group({
        id: this.fb.control(row.id),
        code: this.fb.control(row.code),
        name: this.fb.control(row.name),
        category: this.fb.control(row.category),
        quantity: this.fb.control(row.quantity),
      });
    }
  }

  dataToFormGroups(data: Array<Product>) {
    // this.productForm
    //   .get('tableRowArray')
    //   .setValue();

    data.forEach((item) => this.tableRowArray.push(this.createTableRow(item)));
    console.log(this.productForm);
  }

  addNewRow() {
    // this.tableRowArray.push(this.createTableRow());
    let group: FormGroup = this.fb.group({
      id: this.fb.control('0'),
      code: this.fb.control('fes23234'),
      name: this.fb.control('abdelali'),
      category: this.fb.control('fdfgfdg'),
      quantity: this.fb.control('333'),
    });

    this.tableRowArray.insert(0, group);
  }

  saveData() {
    console.log(this.productForm.get('tableRowArray').value);
  }

  onDeleteRow(index: number) {
    this.tableRowArray.removeAt(index);
  }

  onRowEditInit(product: Product) {
    this.clonedProducts[product.id] = { ...product };
  }

  onRowEditSave(product: Product) {
    if (product.price > 0) {
      console.log(this.table.value);
      delete this.clonedProducts[product.id];
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product is updated',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid Price',
      });
    }
  }

  onRowEditCancel(product: Product, index: number) {
    this.products2[index] = this.clonedProducts[product.id];
    delete this.products2[product.id];
  }
}
