import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormulationHandbookComponent } from './formulation-handbook/formulation-handbook.component';
import { UsersComponent } from './user-management/users/users.component';
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
import { FormsModule } from '@angular/forms';
import {ObserversModule} from '@angular/cdk/observers';
import {MatInputModule} from '@angular/material/input';
import { TreeModule } from 'ng2-tree';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { SidenavBarComponent } from './sidenav-bar/sidenav-bar.component';
import { DialogAddUser } from './table-grid/table-grid.component';
import { MatDialog, MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS, MatSelectModule, MatRadioModule } from '@angular/material';
import { RawMaterialComponent } from './raw-material/raw-material.component';


@NgModule({
  declarations: [
    AppComponent,
    FormulationHandbookComponent,
    UsersComponent,
    UsersRolesComponent,
    HeaderComponent,
    FooterComponent,
    TableGridComponent,
    StylePaginatorDirective,
    FilterTableDataPipe,
    TreeViewComponent,
    SidenavBarComponent,
    DialogAddUser,
    RawMaterialComponent
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
    FormsModule,
    ObserversModule,
    MatInputModule,
    TreeModule,
    MatDialogModule,
    MatSelectModule,
    MatRadioModule
  ],
  providers:  [ ],
  bootstrap: [AppComponent],
  entryComponents: [DialogAddUser]

})
export class AppModule { }
