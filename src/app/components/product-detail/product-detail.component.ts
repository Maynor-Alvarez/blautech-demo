import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  form: FormGroup;
  image: string | ArrayBuffer | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<ProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: [data.name, Validators.required],
      price: [data.price, Validators.required],
      type: [data.type, Validators.required]
    });
    this.imagePreview = data.image || null;  // Assign base64 image here
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'image/png') {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        this.image = base64String;
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor selecciona un archivo PNG.');
    }
  }

  save(): void {
    if (this.form.valid && this.image) {
      const productData = { ...this.form.value, image: this.image, id: this.data.id};
      this.dialogRef.close(productData);
    }
  }
}
