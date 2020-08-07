import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})

export class RawServicesService {

  constructor(private http: HttpClient) {
  }

  // configUrl = 'https://wa0451satest02.azurewebsites.net/api/'; // test environment
  // configUrl = 'https://jotunweb20200604234821.azurewebsites.net/api/';
  configUrl = 'https://wa0451sadev02.azurewebsites.net/api/';
  localUrl = 'http://localhost:3000/';

  public getPigmentationGroupOptions(): Observable<any> {
    return this.http.get(this.configUrl + 'PigmentationMaster/Pigment');
  }
  public getPigmentationData(): Observable<any> {
    return this.http.get(this.configUrl + 'Pigmentation');
  }
  public addNewPigment(newPigment): Observable<any> {
    return this.http.post(this.configUrl + 'Pigmentation', newPigment, httpOptions);
  }
  public getEditpigmentation(id): Observable<any> {
    return this.http.get(this.configUrl + 'Pigmentation/' + id);
  }
  public postEditPigment(data): Observable<any> {
    return this.http.put(this.configUrl + 'Pigmentation/' + data.id, data.allData, httpOptions);
  }
  public deactivateColourcode(id): Observable<any> {
    return this.http.delete(this.configUrl + 'Pigmentation/' + id, httpOptions);
  }
  public getAllColourPigmentTreeData(): Observable<any> {
    return this.http.get(this.configUrl + 'ProductLevel/ColorPigmentation');
  }

}
