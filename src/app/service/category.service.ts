import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError, Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories():Observable<Category[]>{
   return this.http.get<Category[]>("/assets/category.json").pipe(
    catchError( err => {
      console.log(" error "+err);
      if (err.status == 401) {
       console.log("401 error");
          return EMPTY;
      } else {
          return throwError(err);
      }
 }
  ));
  }
}
