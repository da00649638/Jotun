import { Component, OnInit } from '@angular/core';
import { UsersServiceService } from '../../services/users-service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private usersServiceService: UsersServiceService) { }

  ngOnInit() {
  }

  getAllUsers() {
    this.usersServiceService.getAllUsers().subscribe(res => {
      // this.moleculeId = res.id;
      // this.drugProceedBtnDisable = false;
      // this.spinner.hide();
   });
  }
  addUserRoles() {
    this.usersServiceService.addUserRoles().subscribe(res => {
      // this.moleculeId = res.id;
      // this.drugProceedBtnDisable = false;
      // this.spinner.hide();
   });
  }

  updateUsers() {
  this.usersServiceService.updateUsers().subscribe(res => {
    // this.moleculeId = res.id;
    // this.drugProceedBtnDisable = false;
    // this.spinner.hide();
  });
  }

}
