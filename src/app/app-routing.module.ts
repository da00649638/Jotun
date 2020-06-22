import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormulationHandbookComponent } from './formulation-handbook/formulation-handbook.component';
import { UsersComponent } from './user-management/users/users.component';
import { UsersRolesComponent } from './user-management/users-roles/users-roles.component';


const routes: Routes = [
  {path: '', component: FormulationHandbookComponent},
  {path: 'users', component: UsersComponent},
  {path: 'userRoles', component: UsersRolesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
