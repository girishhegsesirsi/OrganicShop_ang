import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Product } from '../models/product';


/*The fake backend provider enables the example to run without a backend / backendless, it uses HTML5 local storage for storing registered user data and provides fake implementations for authentication and CRUD methods, these would be handled by a real api and database in a production application.

It's implemented using the HttpInterceptor class that was introduced in Angular 4.3 as part of the new HttpClientModule. By extending the HttpInterceptor class you can create a custom interceptor to modify http requests before they get sent to the server. In this case the FakeBackendInterceptor intercepts certain requests based on their URL and provides a fake response instead of going to the server.*/



// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

// array in local storage for registered products
let products = JSON.parse(localStorage.getItem('products')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("request object to intercept() of FakeBackendInterceptor : "+request);
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                case url.endsWith('/products/saveProduct') && method === 'POST':
                    return saveProduct();
                case url.endsWith('/products/updateProduct') && method === 'POST':
                    return updateProduct();
                case url.endsWith('/products/getProducts') && method === 'GET':
                        return getProducts();
                case url.includes('/products/deleteProduct') && method === 'DELETE':
                    return deleteProduct();
                case url.includes('/products/getProduct') && method === 'GET':
                            return getProductByTitle();
                default:
                    // pass through any requests not handled above
                    console.log("fakeBackend: Default");
                    return next.handle(request);
            }    
        }
function saveProduct(){
    const product = body;
    console.log("saveProduct() : product data in fake backend : "+product.title+ " "+product.price+" "+product.category);
    
    if (products.find(x => x.title === product.title)) {
        return error('product "' + product.title + '" is already taken')
    }
    products.push(product);
    console.log("products[] after saving : "+products)
    localStorage.setItem('products', JSON.stringify(products));
    return ok();
}

function updateProduct(){
       console.log("updateProduct() : product data in fake backend ");
let data = body;
let oldTitle=data.oldTitle;
let product:Product=data.newObject;
    console.log("old Title: "+oldTitle);
    console.log("new Object : "+product.title);
    
    let prodIndex = products.indexOf(x => x.title === oldTitle);
    if (products.find(x => x.title === oldTitle)) {
        products.update(product);
    }

    
    console.log("products[] after updating : "+products)
    localStorage.setItem('products', JSON.stringify(products));
    return ok();
}

function deleteProduct() {
            if (!isLoggedIn()) return unauthorized();

    localStorage.setItem('products', JSON.stringify(products));
    products = products.filter(x => x.title !== titleFromUrl());
            localStorage.setItem('products', JSON.stringify(products));
            return ok();
        }

function getProducts() {
    console.log("getProducts ()");
    return ok(products);
}

function getProductByTitle() {
  
    let title = titleFromUrl();

    console.log("getProductByTitle ()" +title);
    const product = products.find(x => x.title == titleFromUrl());
    console.log("product from fake backend:" +product.title);
    return ok(product);
}
function titleFromUrl() {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
}
        // route functions

        function register() {
            const user = body;
            const { firstName, lastName,username, password } = user;
            console.log("firstname : "+firstName +" "+"lastname : "+lastName +" "+"username : "+username +" " + "password : "+password);
            console.log("inside register() of FakeBackendInterceptor"+request.body);
            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }
            console.log("user to be registered : "+user);
            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            console.log("users[] after registering : "+users)
            localStorage.setItem('users', JSON.stringify(users));
            
            return ok();
        }

        function authenticate() {
            console.log("inside authenticate() of FakeBackendInterceptor");
            const { username, password } = body;
            console.log("username : "+username +" " + "password : "+password);
            console.log("users list : "+users);
            const user = users.find(x => x.username === username && x.password === password);
            console.log("User data from local Storage: " + user.username+ " "+user.password)
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

        function getUsers() {
            console.log("getUsers ()");
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.find(x => x.id == idFromUrl());
            return ok(user);
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }


    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};