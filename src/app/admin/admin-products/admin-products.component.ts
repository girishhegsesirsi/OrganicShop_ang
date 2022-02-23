import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import { AlertService } from 'src/app/service/alert.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
products$ :Observable<Product[]>;
  constructor(private productService: ProductService,  private alertService: AlertService) { }

  ngOnInit() {
    this.getAll();
  }
getAll(){
  this.products$=this.productService.getAll();
}
}
