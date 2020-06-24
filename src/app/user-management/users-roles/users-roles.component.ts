import { Component, OnInit } from '@angular/core';
import { UsersServiceService } from '../../services/users-service.service';

@Component({
  selector: 'app-users-roles',
  templateUrl: './users-roles.component.html',
  styleUrls: ['./users-roles.component.css']
})
export class UsersRolesComponent implements OnInit {

  constructor(private usersServiceService: UsersServiceService) { }

  ngOnInit() {
  }

  getAllUserRoles() {
        this.usersServiceService.getAllUserRoles().subscribe(res => {
          // this.moleculeId = res.id;
          // this.drugProceedBtnDisable = false;
          // this.spinner.hide();
       });

  }

  updateRoles() {
    this.usersServiceService.updateUserRoles().subscribe(res => {
      // this.moleculeId = res.id;
      // this.drugProceedBtnDisable = false;
      // this.spinner.hide();
   });
  }
}
