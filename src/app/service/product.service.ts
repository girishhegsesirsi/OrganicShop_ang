import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private currentObjectSubject: BehaviorSubject<Product>;
  public currentObject: Observable<Product>;

  constructor(private http: HttpClient,private router: Router) { }


  saveProduct(product: Product) {
    console.log("product data in product service : "+product.title+ " "+product.price+" "+product.category);
    return this.http.post(`http://localhost:4200/products/saveProduct`, product);
}

getAll():Observable<Product[]>{
  return this.http.get<Product[]>('http://localhost:4200/products/getProducts');
}

getProduct(title:string):Observable<Product>{
  return this.http.get<Product>(`http://localhost:4200/products/getProduct/${title}`);
}
updateProduct(oldTitle: string, product : Product){
console.log ("productService:updateProduct() oldTile : "+oldTitle + "newvalue : "+product.title);
 return this.http.post('http://localhost:4200/products/updateProduct', {oldTitle:oldTitle, newObject:product} );

} 

deleteProduct(title: string) {
  console.log ("productService:deleteProduct() deleting the product with the title : "+title); 
  return this.http.delete(`http://localhost:4200/products/deleteProduct/${title}`);
}
}
