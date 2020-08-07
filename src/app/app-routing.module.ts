import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormulationHandbookComponent } from './formulation-handbook/formulation-handbook.component';
import { UsersComponent } from './user-management/users/users.component';
import { UserGroupComponent } from './user-management/user-group/user-group.component';
import { UsersRolesComponent } from './user-management/users-roles/users-roles.component';
import { TableGridComponent } from './table-grid/table-grid.component';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { RawMaterialComponent } from './raw-material/raw-material.component';
import { PigmentationLibraryComponent } from './pigmentation-library/pigmentation-library.component';
import { MsalGuard } from '@azure/msal-angular';
import { AddFormulationProductComponent } from './add-formulation-product/add-formulation-product.component';

const routes: Routes = [
  {path: '', component: UsersComponent},
  {path: 'users', component: UsersComponent},
  {path: 'user-groups', component: UserGroupComponent},
  {path: 'user-roles', component: UsersRolesComponent},
  {path: 'formulation-handbook', component: FormulationHandbookComponent},
  {path: 'table', component: TableGridComponent},
  {path: 'tree', component: TreeViewComponent},
  {path: 'raw-material', component: RawMaterialComponent},
  {path: 'pigmentation-library', component: PigmentationLibraryComponent},
  {path: 'add-formulation-product', component: AddFormulationProductComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
