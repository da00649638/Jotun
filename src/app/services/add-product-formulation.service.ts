import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddProductFormulationService {

  constructor(private http: HttpClient) {
  }

  // configUrl = 'https://wa0451satest02.azurewebsites.net/api/'; // test environment
  // configUrl = 'https://jotunweb20200604234821.azurewebsites.net/api/';
  configUrl = 'https://wa0451sadev02.azurewebsites.net/api/';
  localUrl = 'http://localhost:3000/';

  public getAddProductDetails(): Observable<any> {
    return this.http.get(this.localUrl + 'addProduct');
  }

  public getproductOfCopy(): Observable<any> {
    return this.http.get(this.localUrl + 'productOfCopy');
  }
  public getcolourGroup(): Observable<any> {
    return this.http.get(this.localUrl + 'colourGroup');
  }
  public getcolourOptions(): Observable<any> {
    return this.http.get(this.localUrl + 'colorOptions');
  }
  public getProductsSteps(): Observable<any> {
    return this.http.get(this.localUrl + 'processSteps');
  }
}

