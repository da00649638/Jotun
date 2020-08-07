import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { UsersRolesComponent } from './users-roles/users-roles.component';
import { UserGroupComponent } from './user-group/user-group.component';

@NgModule({
  declarations: [UsersComponent, UsersRolesComponent, UserGroupComponent],
  imports: [
    CommonModule
  ]
})
export class UserManagementModule { }
