import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BsNavbarComponent } from './bs-navbar/bs-navbar.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';

import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './service/auth.service';

import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';

import { routing } from './routing.service';
import { RegisterComponent } from './register/register.component';
import { AlertComponent } from './alert/alert.component';
import { fakeBackendProvider } from './helper/fake-backend';
import { JwtInterceptor } from './helper/jwt-interceptor';
import { ErrorInterceptor } from './helper/error-interceptor';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { CategoryService } from './service/category.service';
import { RedirectComponent } from './redirect/redirect.component';

/*The app module defines the root module of the application along with metadata about the module. For more info about angular modules check out this page on the official docs site.

This is where the fake backend provider is added to the application, to switch to a real backend simply remove the providers located below the comment // providers used to create fake backend.*/

@NgModule({
  declarations: [
    AppComponent,
    BsNavbarComponent,
    HomeComponent,
    ProductsComponent,
    ShoppingCartComponent,
    CheckOutComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent,
    ProductFormComponent,
    RedirectComponent
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    routing
  ],

providers: [AuthService,
  CategoryService,
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  fakeBackendProvider
],
  bootstrap: [AppComponent]
})
export class AppModule { }
