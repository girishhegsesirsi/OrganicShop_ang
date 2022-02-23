import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoryService } from 'src/app/service/category.service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { AuthService } from 'src/app/service/auth.service';
import { User } from 'src/app/models/user';
import { ProductService } from 'src/app/service/product.service';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/service/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import {take } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories$:Observable<Category[]>;
  isSubmitted : boolean;
  //categories: Category[];
  users:User[];
  editedProduct:Product= new Product();
  id;


  constructor(private formBuilder: FormBuilder, categoryService:CategoryService, authService:AuthService,
    private productService: ProductService, private router: Router, private alertService: AlertService,private route: ActivatedRoute) { 

    this.categories$=  categoryService.getCategories();

    this.id = this.route.snapshot.paramMap.get('p');
    console.log(" title received at ProductFormComponent :" + this.id);
    if(this.id){
      console.log(" making call to backend to fetch : " + this.id +" Details");
    //Operator take is used to get one value emitted by Observble and then unsubscribe the Observable
    this.productService.getProduct(this.id).pipe(take(1)).subscribe(p=> {
      this.editedProduct=p;
   console.log("data returned from backend :" +this.editedProduct.title)
  }
    );
  }

    //console.log("data returned from backend :" +this.editedProduct.title)
    /*this.categories$.subscribe((cat : Category[])=>{
this.categories = cat;
console.log("categories available : " +this.categories);
    });
    this.route.params.subscribe(params => {
      if(!params)
      {
    this.editedProduct.title = params.title;
    this.editedProduct.price =params.price;
    this.editedProduct.category = params.category;
    this.editedProduct.imageUrl = params.imageUrl;
    console.log("editedProduct :"+this.editedProduct.title);
    }
    });*/
  }

  ngOnInit() {

    this.productForm = this.formBuilder.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      imageUrl: ['', Validators.required]
  });
 
  }
  onReset() {
    this.isSubmitted = false;
    this.productForm.reset();
}

get form() { 
  return this.productForm.controls; 
}

create() {
  this.isSubmitted = true;

   // stop here if form is invalid
   if (this.productForm.invalid) {
    console.log("invalid form");
      return;
  } 
if(this.id){
  this.productService.updateProduct(this.id, this.editedProduct)
  .subscribe(
    data => {
        this.alertService.success('product  successfully updated', true);
        console.log("product  successfully updated");
       // this.router.navigate(['/login']);
    },
    error => {
        this.alertService.error(error);
      //  this.loading = false;
    });
} else{
 

  // display form values on success
  //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.productForm.value, null, 4));

  this.productService.saveProduct(this.productForm.value)
  .pipe(first())
  .subscribe(
      data => {
          this.alertService.success('product saved successfully', true);
         // this.router.navigate(['/login']);
      },
      error => {
          this.alertService.error(error);
        //  this.loading = false;
      });
      }
      this.router.navigate(['/admin/products']);
}
delete(){
  if(confirm('Are you sure you want to delete this product?')){
    this.productService.deleteProduct(this.id).pipe(first())
    .subscribe(
        data => {
            this.alertService.success('product deleted successfully', true);
           
        },
        error => {
            this.alertService.error(error);
          
        });
        }
     // this.router.navigate(['/admin/products']);
  }

  }

