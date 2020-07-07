import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersServiceService {

  configUrl = 'http://localhost:3000/';
  constructor(private http: HttpClient) {
  }

  public getAllUserRoles(): Observable<any> {
    return this.http.get(this.configUrl + 'getAllUserRoles');
  }
  public updateUserRoles(): Observable<any> {
    return this.http.get(this.configUrl + 'updateUserRoles');
  }

  public getAllUsers(): Observable<any> {
    return this.http.get(this.configUrl + 'user_details');
  }

  public addUserRoles(): Observable<any> {
    return this.http.get(this.configUrl + 'addUserRoles');
  }

  public updateUsers(): Observable<any> {
    return this.http.get(this.configUrl + 'updateUsers');
  }
  public rawMaterials(): Observable<any> {
    return this.http.get(this.configUrl + 'raw_materials');
  }
}
