import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormulationHandbookComponent, DialogFormulationFilterComponent } from './formulation-handbook/formulation-handbook.component';
import { UsersComponent, DialogEditUserComponent, DialogDeactivateUserComponent } from './user-management/users/users.component';
import { UserGroupComponent } from './user-management/user-group/user-group.component';
import { UsersRolesComponent } from './user-management/users-roles/users-roles.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { TableGridComponent } from './table-grid/table-grid.component';
import { ToastrModule } from 'ngx-toastr';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {StylePaginatorDirective} from './table-grid/style-paginator.directive';
import { FilterTableDataPipe } from './pipes/filter-table-pipe.pipe';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import {ObserversModule} from '@angular/cdk/observers';
import {MatInputModule} from '@angular/material/input';
import { TreeModule } from 'ng2-tree';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { SidenavBarComponent } from './sidenav-bar/sidenav-bar.component';
import { DialogAddUserComponent } from './user-management/users/users.component';
import { DialogAddUsergroupComponent, DialogEditUserGroupComponent } from './user-management/user-group/user-group.component';
// tslint:disable-next-line:max-line-length
import { MatDialog, MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS, MatSelectModule, MatRadioModule , MatTabsModule , MatIconModule, MAT_DIALOG_DATA, MatDialogRef, MatStepperModule, MatFormFieldModule } from '@angular/material';
import {MatTreeModule} from '@angular/material/tree';
// tslint:disable-next-line:max-line-length
import { RawMaterialComponent, DialogAddNewRawMaterialComponent , DialogViewRawMaterialComponent , DialogDeactivateRawMaterialComponent } from './raw-material/raw-material.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Configuration } from 'msal';
import { TreeviewModule } from 'ngx-treeview';
import { RemoveSpecialCharPipe } from './pipes/remove-special-char.pipe';
// tslint:disable-next-line:max-line-length
import { PigmentationLibraryComponent, DialogAddColourGroupComponent, DialogAddNewPigmentationComponent, DialogViewPigmentationComponent, DialogEditNewPigmentationComponent, DialogDeactivatePigmentationComponent } from './pigmentation-library/pigmentation-library.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddFormulationProductComponent } from './add-formulation-product/add-formulation-product.component';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    FormulationHandbookComponent,
    UsersComponent,
    UserGroupComponent,
    UsersRolesComponent,
    HeaderComponent,
    FooterComponent,
    TableGridComponent,
    StylePaginatorDirective,
    FilterTableDataPipe,
    TreeViewComponent,
    SidenavBarComponent,
    DialogAddUserComponent,
    DialogEditUserComponent,
    DialogAddUsergroupComponent,
    DialogEditUserGroupComponent,
    RawMaterialComponent,
    RemoveSpecialCharPipe,
    // DialogAddGroupComponent,
    DialogAddNewRawMaterialComponent,
    PigmentationLibraryComponent,
    DialogViewRawMaterialComponent,
    DialogAddColourGroupComponent,
    DialogAddNewPigmentationComponent,
    DialogViewPigmentationComponent,
    DialogEditNewPigmentationComponent,
    DialogDeactivateRawMaterialComponent,
    DialogFormulationFilterComponent,
    DialogDeactivateUserComponent,
    DialogDeactivatePigmentationComponent,
    AddFormulationProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    ObserversModule,
    MatInputModule,
    TreeModule,
    MatDialogModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    MatTreeModule,
    MatIconModule,
    MatStepperModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    AutocompleteLibModule,
    MatExpansionModule,
    ModalModule.forRoot(),
    MsalModule.forRoot({
      auth: {

        // dev environment
        clientId: 'fc153d2f-ccbe-415b-b9a2-44d1c57262b2', // This is your client ID
        authority: 'https://login.microsoftonline.com/99f50799-af0e-43b6-bbaf-45ca7a794644/',
        redirectUri: 'https://wa0451sadev01.azurewebsites.net'// This is your redirect URI

        // // test environment
        // clientId: '25abe75b-2efb-4870-8943-ebb43cd1975c', // This is your client ID
        // authority: 'https://login.microsoftonline.com/99f50799-af0e-43b6-bbaf-45ca7a794644/',
        // redirectUri: 'https://wa0451satest01.azurewebsites.net'// This is your redirect URI
        // // // redirectUri: 'http://localhost:4200/'// This is your redirect URI
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      },
    }, {
      // popUp: !isIE,
      consentScopes: [
        'user.read',
        'openid',
        'profile',
      ],
      unprotectedResources: [],
      protectedResourceMap: [
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ],
      extraQueryParameters: {}
    }),
    TreeviewModule.forRoot()

  ],
  providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: MatDialogRef, useValue: {}}],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogAddUserComponent,
    DialogAddUsergroupComponent,
    DialogEditUserComponent,
    DialogEditUserGroupComponent,
    // DialogAddGroupComponent,
    DialogAddNewRawMaterialComponent,
    DialogViewRawMaterialComponent,
    DialogAddColourGroupComponent,
    DialogAddNewPigmentationComponent,
    DialogDeactivateRawMaterialComponent,
    DialogViewPigmentationComponent,
    DialogEditNewPigmentationComponent,
    DialogDeactivateRawMaterialComponent,
    DialogFormulationFilterComponent,
    DialogDeactivateUserComponent,
    DialogDeactivatePigmentationComponent
  ]

})
export class AppModule { }
