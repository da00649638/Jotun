import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {BehaviorSubject, Observable, fromEvent, merge} from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { UsersServiceService } from '../../services/users-service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  public users: any = [];
  public dataSource: any;
  public selection: any;
  constructor(private toastr: ToastrService, private usersServiceService: UsersServiceService, public dialog: MatDialog) { }
  displayedColumns: string[] = ['select', 'user_group', 'name', 'email_id', 'role', 'status'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('filter', {static: true}) filter: ElementRef;
  public selectionOptions = [
    {label: 'Norway Super User', value: 'Norway Super User'},
    {label: 'Norway Super User', value: 'Norway Super User'},
    {label: 'Pakistan RM', value: 'Pakistan RM'},
    {label: 'China Chemist', value: 'China Chemist'},
    {label: 'China Chemist', value: 'China Chemist'},
    {label: 'China Chemist', value: 'China Chemist'}
  ];
  selectedText = 'Select User group';

  ngOnInit() {
    this.usersServiceService.getAllUsers().subscribe(res => {
      this.users = res;
      this.dataSource = new MatTableDataSource(this.users);
      this.selection = new SelectionModel(true, []);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddUser, {
      width: '417px',
      height: '100vh',
      panelClass: 'my-dialog-container-class',
      data: this.selectionOptions
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
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

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-adduser',
  templateUrl: 'dialog-adduser.component.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogAddUser {
  // dialogRef: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: UsersComponent) {}

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

}
