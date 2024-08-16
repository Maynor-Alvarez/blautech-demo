import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductCreateComponent } from '../product-create/product-create.component';
import { ConfirmDialogComponent } from "../../utils/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['name', 'price', 'type', 'actions'];

  totalProducts = 0;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productService: ProductService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProducts(0, this.pageSize);
  }

  ngAfterViewInit(): void {

    this.paginator.page.subscribe(() => {
      this.loadProducts(this.paginator.pageIndex, this.paginator.pageSize);
    });
  }

  loadProducts(pageIndex: number, pageSize: number): void {
    this.productService.getProducts(pageIndex, pageSize).subscribe(data => {
      if (data) {
        this.totalProducts = data.totalElements;
        this.dataSource.data = data.content;
        if (this.paginator) {
          this.paginator.pageIndex = pageIndex;
          this.paginator.pageSize = pageSize;
          this.paginator.length = this.totalProducts;
        }
      } else {
        this.dataSource.data = [];
        this.totalProducts = 0;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
          this.paginator.pageSize = pageSize;
          this.paginator.length = 0;
        }
      }
    });
  }

  openDetail(product: any): void {
    const dialogRef = this.dialog.open(ProductDetailComponent, {
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.updateProduct(result).subscribe(() => {
          this.loadProducts(this.paginator.pageIndex, this.paginator.pageSize);
        });
      }
    });
  }

  deleteProduct(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(id).subscribe(() => {
          this.loadProducts(this.paginator.pageIndex, this.paginator.pageSize);
        });
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductCreateComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.createProduct(result).subscribe(() => {
          this.loadProducts(this.paginator.pageIndex, this.paginator.pageSize);
        });
      }
    });
  }
}
