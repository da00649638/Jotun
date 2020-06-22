import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { UsersRolesComponent } from './users-roles/users-roles.component';



@NgModule({
  declarations: [UsersComponent, UsersRolesComponent],
  imports: [
    CommonModule
  ]
})
export class UserManagementModule { }
