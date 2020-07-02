import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {BehaviorSubject, Observable, fromEvent, merge} from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

import { UsersServiceService } from '../../services/users-service.service';

export interface PeriodicElement {
  user_id: number;
  user_group: string;
  name: string;
  email_id: string;
  role: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {user_id: 1, user_group: 'Norway Super User', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 2, user_group: 'Helium',  name: 'Donate12', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 3, user_group: 'Lithium', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 4, user_group: 'Beryllium', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 5, user_group: 'Boron', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 6, user_group: 'Carbon', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 7, user_group: 'Nitrogen', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 8, user_group: 'Oxygen', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 9, user_group: 'Fluorine', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 10, user_group: 'Neon', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 11, user_group: 'Sodium', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 12, user_group: 'Magnesium', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 13, user_group: 'Aluminum', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 14, user_group: 'Silicon', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 15, user_group: 'Phosphorus', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 16, user_group: 'Sulfur', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 17, user_group: 'Chlorine', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 18, user_group: 'Argon', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 19, user_group: 'Potassium', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
  {user_id: 20, user_group: 'Calcium', name: 'Donate', email_id: 'donate@jotun.com', role: 'Super User', status: 'Active'},
];

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private toastr: ToastrService, private usersServiceService: UsersServiceService) { }
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('filter', {static: true}) filter: ElementRef;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    fromEvent(this.filter.nativeElement, 'keyup')
    .pipe(debounceTime(150),
    distinctUntilChanged()
    ).subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
