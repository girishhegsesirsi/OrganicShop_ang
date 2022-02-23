import { Injectable } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { LoginComponent } from './login/login.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { RegisterComponent } from './register/register.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';

/*The app routing file defines the routes of the application, each route contains a path and associated component. The home route is secured by passing the AuthGuard to the canActivate property of the route.*/
const appRoutes : Routes = [
  {path:'home',component:HomeComponent,canActivate: [AuthGuard] },
  {path:'products',component:ProductsComponent},
  {path:'shopping-cart',component:ShoppingCartComponent},
  {path:'check-out',component:CheckOutComponent},
  {path:'my/orders',component:MyOrdersComponent},
  {path:'order-success',component:OrderSuccessComponent},
  {path:'login',component:LoginComponent},
  {path:'',component:HomeComponent,canActivate: [AuthGuard] },
  {path:'admin/orders',component:AdminOrdersComponent,canActivate:[AuthGuard]},
  {path:'login-success',component:HomeComponent},
  {path:'register',component:RegisterComponent},
  {path:'admin/products/new',component:ProductFormComponent, canActivate:[AuthGuard]},
  {path:'admin/products/:p',component:ProductFormComponent, canActivate:[AuthGuard]},
  {path:'admin/products',component:AdminProductsComponent, canActivate:[AuthGuard]},
  {path: '**', redirectTo: ''}
  
];
export const routing = RouterModule.forRoot(appRoutes)
