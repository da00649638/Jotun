import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { userDetails, userGroup, country, changestatus } from '../models/models';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class UsersServiceService {
  constructor(private http: HttpClient) {
  }

  // configUrl = 'https://wa0451satest02.azurewebsites.net/api/'; // test environment
  configUrl = 'https://wa0451sadev02.azurewebsites.net/api/'; // dev environment
  // configUrl = 'https://jotunweb20200604234821.azurewebsites.net/api/';
  localUrl = 'http://localhost:3000/';

  public getAllUserRoles(): Observable<any> {
    return this.http.get(this.configUrl + 'Role');
  }
  public updateUserRoles(): Observable<any> {
    return this.http.get(this.localUrl + 'updateUserRoles');
  }

  public getAllUsers(): Observable<any> {
    // return this.http.get(this.localUrl + 'user_details1');
    return this.http.get(this.configUrl + 'UserRole');
  }

  public addUserRoles(): Observable<any> {
    return this.http.get(this.localUrl + 'addUserRoles');
  }

  public getAllTreeData(): Observable<any> {
    return this.http.get(this.configUrl + 'ProductLevel');
    // return this.http.get(this.configUrl + 'master_product_levels_3');
  }

  public getAllRawMaterailTreeData(): Observable<any> {
    return this.http.get(this.configUrl + 'ProductLevel/RawMaterials');
    // return this.http.get(this.configUrl + 'master_product_levels_3');
  }

  public getAllRawMaterial(): Observable<any> {
    // return this.http.get(this.localUrl + 'rawMaterialData');
    return this.http.get(this.configUrl + 'RawMaterial');
  }

  public getAllRawMaterialGroups(): Observable<any> {
    // return this.http.get(this.localUrl + 'rawMaterialData');
    return this.http.get(this.configUrl + 'RawMaterialMaster/RawMaterialGroup');
  }

  public getRawMaterial(id: number): Observable<any> {
    return this.http.get(this.configUrl + 'RawMaterial/' + id);
  }

  public updateRawMaterial(materialGroup): Observable<any> {
    return this.http.put(this.configUrl + 'RawMaterial/' + materialGroup.id, materialGroup, httpOptions);
  }

  public addRawMaterialGroup(materialGroup): Observable<any> {
    return this.http.post(this.configUrl + 'RawMaterial', materialGroup, httpOptions);
  }


  public updateUser(user: userDetails): Observable<any> {
    return this.http.put(this.configUrl + 'UserRole/' + user.id, user, httpOptions);
  }

  public addUser(user: userDetails): Observable<any> {
    return this.http.post(this.configUrl + 'UserRole', user, httpOptions);
  }

  public getUser(id: number): Observable<any> {
    return this.http.get(this.localUrl + 'user_details');
  }

  public getAllUsergroups(): Observable<any> {
    // return this.http.get(this.configUrl + 'user_groups');
    return this.http.get(this.configUrl + 'UserGroup');
  }

  public getAllCountries(): Observable<any> {
    // return this.http.get(this.configUrl + 'countries');
    return this.http.get<country[]>(this.configUrl + 'Country');
  }

  public addUserGroup(group: userGroup): Observable<any> {
    return this.http.post(this.configUrl + 'UserGroup', group, httpOptions);
  }

  public deactivateUser(status: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: status
    };
    return this.http.delete(this.configUrl + 'UserRole', options);
  }

  public deactivateUsergroup(status: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: status
    };
    return this.http.delete(this.configUrl + 'UserGroup', options);
  }

  public deactivateRawMaterial(id): Observable<any> {
    return this.http.delete(this.configUrl + 'RawMaterial/' + id, httpOptions);
  }


  public getUserGroupTreeData(): Observable<any> {
    return this.http.get(this.configUrl + 'ProductLevel');
   // return this.http.get(this.localUrl + 'treeDataRead');
  }

  public updateUserGroup(group: userGroup): Observable<any> {
    return this.http.put(this.configUrl + 'UserGroup/' + group.id, group, httpOptions);
  }

  public getAccessLevels(): Observable<any> {
    return this.http.get(this.configUrl + 'Level0');
  }

  public searchData(data): Observable<any> {
    return this.http.post(this.configUrl + 'UserRole/Search', data, httpOptions);
  }

  public editUserById(id: number): Observable<any> {
    return this.http.get(this.configUrl + 'UserRole/GetUser?id=' + id);
  }

  public editUserGroupById(id: number): Observable<any> {
    return this.http.get(this.configUrl + 'UserGroup/' + id);
    //  return this.http.get(this.configUrl + 'getById_UserGroup');
  }

  public getPigmentationData(): Observable<any> {
    return this.http.get(this.configUrl + 'Pigmentation');
  }

  public getAllManufactures(): Observable<any> {
    return this.http.get(this.configUrl + 'RawMaterialMaster/Manufacturer');
  }

  public getAllTechnicalCoordinators(): Observable<any> {
    return this.http.get(this.configUrl + 'RawMaterialMaster/TechnicalCoordinator');
  }

  public getAllAlhpaGroups(): Observable<any> {
    return this.http.get(this.configUrl + 'RawMaterialMaster/AlphaGroup');
  }

  public getAllDurability(): Observable<any> {
    return this.http.get(this.configUrl + 'RawMaterialMaster/Durability');
  }

  public getAllColourGroups(): Observable<any> {
    return this.http.get(this.configUrl + 'PigmentationMaster/ColorGroup');
  }

  public getAllColours(): Observable<any> {
    return this.http.get(this.configUrl + 'PigmentationMaster/Color');
  }
}
