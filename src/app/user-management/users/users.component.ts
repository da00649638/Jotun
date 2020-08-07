import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  Optional,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  startWith,
} from 'rxjs/operators';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import { UsersServiceService } from '../../services/users-service.service';
import { userDetails, search, changestatus } from 'src/app/models/models';
import { Validators, FormControl, Form } from '@angular/forms';

import { StylePaginatorDirective } from '../../table-grid/style-paginator.directive';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit  {
  public users: any = [];
  public dataSource: any;
  public selection: any;
  public selectedRow: any;
  public userGroups: any;
  public deactivateIcon = true;
  public editIcon = true;
  public enableSearch = false;
  public selectRole = [];
  public searchDetails: any;
  mynameControl = new FormControl();
  myemailControl = new FormControl();
  filterednameOptions: Observable<string[]>;
  filteredemailOptions: Observable<string[]>;
  UserName: string;
  ngForm: Form;
  // tslint:disable-next-line:variable-name
  Email_Id: string;
  // tslint:disable-next-line:variable-name
  User_Role: string;
  searchname: string;
  email: string;
  role: string;
  // tslint:disable-next-line:variable-name
  Access_Level: string;
  // tslint:disable-next-line:variable-name
  access_levels: string;
  status: boolean;
  country: any;
  namesearch: string[];
  newStatus: changestatus;
  accessLevels: any;
  countries: any;
  userRoles: any;
  emailSearchId: any;
  searchData: any;
  paginationView = false;
  searchName: string;
  searchEmailId: string[];
  constructor(private toastr: ToastrService, private usersServiceService: UsersServiceService, public dialog: MatDialog,
              private spinner: NgxSpinnerService) {
   }
  displayedColumns: string[] = ['select', 'userName', 'emailId', 'roleName', 'accessLevel', 'userGroup', 'countryName', 'active_status'];
  public length: number;
  public pageSize = 10;
  public pageSizeOptions = [5, 10, 25, 100];
  public currentPage: number;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('filter', {static: true}) filter: ElementRef;
  @ViewChild(StylePaginatorDirective, {static: true}) pageDirective;
  selectedText = 'Select User group';

  ngOnInit() {
    this.getUserGroups();
    this.getAccessLevels();
    this.getCountry();
    this.getUserRoles();
    this.filterednameOptions = this.mynameControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filtername(value))
    );
    this.filteredemailOptions = this.myemailControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteremail(value))
    );
    this.tableUpdation();
  }

  private _filtername(value: string): string[] {
    const filternameValue = value.toLowerCase();
    if (filternameValue) {
      return this.users.filter(option => option.userName.toLowerCase().indexOf(filternameValue) === 0);
    }
  }
  private _filteremail(value: string): string[] {
    const filteremailValue = value.toLowerCase();

    return this.users.filter(
      (option) => option.emailId.toLowerCase().indexOf(filteremailValue) === 0
    );
  }

  tableUpdation() {
    this.spinner.show();
    this.usersServiceService.getAllUsers().subscribe((res) => {
      const userInfo = res.data;
      this.paginationView =  true;
      userInfo.forEach((element, index) => {
        userInfo[index].countryName = element.countryInfo ? element.countryInfo.name : '';
        userInfo[index].roleName = element.roleInfo ? element.roleInfo.name : '';
      });
      this.users = userInfo;
      this.dataSource = new MatTableDataSource(this.users);
      this.selection = new SelectionModel(true, []);
      this.dataSource.paginator = this.paginator;
      this.length = this.users.length;
      this.dataSource.sort = this.sort;
      // this.pageDirective.buildPageNumbers();
      // this.nextPageChange(0);

      // setTimeout(() => {
      //   this.nextPageChange(0);
      //   console.log('set timeout');
      // });
      this.users.filter((val) => {
        this.selectRole.push(val.role);
      });

      this.spinner.hide();

      // disabling the deactivating after deactivated the user
      this.deactivateIcon = true;
      this.editIcon = true;
    });
    if (this.filter) {
      fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(debounceTime(150),
      distinctUntilChanged()
      ).subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
    }


  }

  getUserGroups() {
    this.usersServiceService.getAllUsergroups().subscribe(
      (res) => {
        this.userGroups = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAccessLevels() {
    this.usersServiceService.getAccessLevels().subscribe(
      (res) => {
        this.accessLevels = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCountry() {
    this.usersServiceService.getAllCountries().subscribe(
      (res) => {
        this.countries = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getUserRoles() {
    this.usersServiceService.getAllUserRoles().subscribe(
      (res) => {
        this.userRoles = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.length;
    // this.dataSource.data.length
    return numSelected === numRows;
  }

  nextPageChange = (event: any) => {
    this.currentPage = event;
    this.iterator();
  }

  changePageSize(event) {
    this.pageSize = event.pageSize;
  }

  iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.users.slice(start, end);
    this.dataSource = part;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
    this.selectedCheckboxLength();
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      width: '782px',
      height: '100vh',
      panelClass: 'my-dialog-container-class',
      data: this.userGroups.user_group_details,
    });
    dialogRef.afterClosed().subscribe((result) => {
     // console.log('The dialog was closed');
      setTimeout (() => {
        console.log('setTimeout');
        this.tableUpdation();
     }, 2000);
    });
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(DialogEditUserComponent, {
      width: '782px',
      height: '100vh',
      panelClass: 'my-dialog-container-class',
      data: this.selectedRow,
    });
    dialogRef.afterClosed().subscribe((result) => {
      setTimeout (() => {
        this.selection.clear();
        this.selectedCheckboxLength();
       // console.log('setTimeout');
        this.tableUpdation();
     }, 5000);
      console.log('The dialog was closed');
    });
  }

  confirmDeactivateDialog(): void {
    const dialogRef = this.dialog.open(DialogDeactivateUserComponent, {
      width: '450px',
      height: '250px',
      position: {top: '10%',  bottom : '70%', right : '30%' },
      panelClass: 'my-dialog-container-class',
      data: this.selection.selected,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.tableUpdation();
      this.selection.clear();
      this.selectedCheckboxLength();
      console.log('dialog closed');
     });
  }

  addUserRoles() {
    this.usersServiceService.addUserRoles().subscribe((res) => {
      // this.moleculeId = res.id;
      // this.drugProceedBtnDisable = false;
      // this.spinner.hide();
    });
  }

  onSelect(row) {
    this.selection.toggle(row);
    this.selectedRow = this.selection.selected[0];
    this.selectedCheckboxLength();
  }

  selectedCheckboxLength() {
    if (this.selection.selected.length === 1) {
      this.deactivateIcon = false;
      this.editIcon = false;
    } else if (this.selection.selected.length > 1) {
      this.deactivateIcon = false;
      this.editIcon = true;
    } else {
      this.deactivateIcon = true;
      this.editIcon = true;
    }
  }

  // changeStatus() {
  //   const result = this.selection.selected.map(({id, active_status}) => {
  //     return {id, active_status};
  //   });
  //   // tslint:disable-next-line:prefer-for-of
  //   for (let i = 0; i < result.length; i++) {
  //     if (result[i].active_status) {
  //       result[i].active_status = false;
  //     } else {
  //       result[i].active_status = true;
  //     }
  //   }
  //   const deactivate = JSON.stringify(result);

  //   this.usersServiceService.deactivateUser(deactivate).subscribe(
  //     (res) => {
  //       this.toastr.success('Status updated Successfully');
  //       this.tableUpdation();
  //     },
  //     (err) => {
  //       this.toastr.error(err.error.errorMessage);
  //     }
  //   );
  // }

  searchEnable() {
    this.enableSearch = !this.enableSearch;
  }

  cancelSearch() {
    this.searchEnable();
    this.tableUpdation();
  }



  clearSearch() {
    this.searchName = '';
    this.searchEmailId = [];
    this.status = false;
    this.filterednameOptions = this.mynameControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filtername(value))
    );
    this.filteredemailOptions = this.myemailControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteremail(value))
    );

    // // this.tableUpdation();`
    // this.dataSource = new MatTableDataSource(this.users);
    // this.selection = new SelectionModel(true, []);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // this.length = this.users.length;
    // setTimeout(() => {
    //   this.nextPageChange(0);
    // });
  }

  functionCheck(value) {
    return (value === undefined) ? null : value;
}
  functionStatus(value) {
    return (value === 'false') ? false : true;
  }
  // tslint:disable-next-line:member-ordering
  // pageNumberSearch: number;
  search() {
    this.paginationView =  false;
    this.spinner.show();
    this.searchDetails = new search();
    this.searchDetails.name = this.functionCheck(this.searchname);
    this.searchDetails.email = this.functionCheck(this.emailSearchId);
    this.searchDetails.status = this.functionStatus(this.status);
    this.usersServiceService.searchData(this.searchDetails).subscribe(
      (res) => {
        const userInfo = res.data;
        userInfo.forEach((element, index) => {
          userInfo[index].countryName = element.countryInfo ? element.countryInfo.name : '';
          userInfo[index].roleName = element.roleInfo ? element.roleInfo.name : '';
        });
        this.searchData = userInfo;
        this.dataSource = new MatTableDataSource(this.searchData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = userInfo.length;
        this.paginationView =  true;
        // setTimeout(() => {
        //   this.nextPageChange(0);
        // });
        // this.pageDirective.buildPageNumbers();
        this.spinner.hide();
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
        this.toastr.error(err.error.errorMessage);
      }
    );
  }

  onBookChange(value) {
    this.emailSearchId = value;
  }
  onChangeName(value) {
    this.searchname = value;
  }
}

import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { format } from 'url';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-adduser',
  templateUrl: 'dialog-adduser.component.html',
  styleUrls: ['./users.component.scss'],

  providers: [],
})
// tslint:disable-next-line:component-class-suffix
export class DialogAddUserComponent implements OnInit {
  productLevels: any = [];
  userRoles: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UsersComponent,
    private usersServiceService: UsersServiceService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<DialogAddUserComponent>,
    private spinner: NgxSpinnerService
  ) {}
  tabs: any;
  public email: any;
  public role: any;
  public ji: string;
  public country: string;
  userName: any;
  newUser: any;
  countries: any;
  accessLevel = '';
  formControl = new FormControl('', [Validators.required, Validators.email]);
  // tree data
  items: TreeviewItem[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 338,
  });
  changeValue: any;
 // tabTextValue: string;
  currentTabData: any;
  selectedArray: any;
  treeData = [];
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    console.log(this.data);
    this.getAllTreeData();
    this.getAllCountries();
    this.getTreeData(0);
    this.getUserRoles();
  }

  getAllTreeData() {
    this.usersServiceService.getAllTreeData().subscribe((res) => {
      this.tabs = res.data;
    });
  }

  changeTabData(event: any) {
    this.currentTabData = this.productLevels[event.index];
  }


getTreeData(index: any) {
    this.usersServiceService.getAllTreeData().subscribe((res) => {
      this.currentTabData = res.data[index];
      this.productLevels = res.data;
      this.treeData = res.data;
  });

  }
treeNodeSelection(parentObj, chkType, chkevent) {
  if (parentObj.children && parentObj.children.length > 0 ) {
    parentObj.children.forEach((level1Arry) => {
     this.checkSelectedNode(level1Arry, parentObj, chkType, chkevent);
     if (level1Arry.children && level1Arry.children.length > 0) {
        level1Arry.children.forEach(level2Arry => {
          this.checkSelectedNode(level2Arry, level1Arry, chkType, chkevent);
          if (level2Arry.children && level2Arry.children.length > 0) {
            level2Arry.children.forEach(level3Arry => {
              this.checkSelectedNode(level3Arry, level2Arry, chkType, chkevent);
            });
          }
        });
    }
   });
  }

 }

checkSelectedNode(parentObj, levelObj, chkType, chkevent) {
  parentObj[chkType] = levelObj[chkType];

  // if (chkType === 'write' && chkevent) {
  //   parentObj.read = true;
  //  // levelObj.read = true;
  // }
}


addDates(data) {
    return {
      ...data,
      created_date: new Date().toISOString(),
      created_by: 0,
      modified_date: new Date().toISOString(),
      modified_by: 0,
    };
  }
deleteUnwantedData(data) {
    return {
      value: data.value,
      text: data.text,
      parent_level_id: data.parent_level_id,
      checked: data.internalChecked,
      active_status: data.active_status,
      children: data.children,
    };
  }
save() {
    this.spinner.show();
    this.newUser = new userDetails();
    this.newUser.id = 0;
    this.newUser.UserName = 'abc';
    this.newUser.emailId = this.email;
    this.newUser.roleInfo = {id: this.role};
    this.newUser.userGroup = {id: this.ji};
    this.newUser.active_status = true;
    this.newUser.countryInfo = {id: this.country };
    this.newUser.productLevels =  this.treeData;
    this.newUser.accessLevel = this.accessLevel.slice(1);
    this.usersServiceService.addUser(this.newUser).subscribe(
      (res) => {
        // this.spinner.hide();
        this.toastr.success('Added Successfully');
        this.dialogRef.close();
      },
      (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.errorMessage);
      }
    );
    // this.updateTable();
  }

  // recipeResponsibleData() {
  //   return {
  //     ...this.currentTabData,
  //     children: this.filterItems(this.ngxTreeViewData),
  //   };
  // }
onValidate() {}
  // getUserNames() {
  //   //this.spinner.show();
  //   this.usersServiceService.getUserName().subscribe(
  //     res => {
  //       this.userName = res;
  //       console.log(this.userName);
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   );
  // }

getAllCountries() {
    this.usersServiceService.getAllCountries().subscribe(
      (res) => {
        this.countries = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
getUserRoles() {
    this.usersServiceService.getAllUserRoles().subscribe(
      (res) => {
        this.userRoles = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-edituser',
  templateUrl: 'dialog-edituser.component.html',
  styleUrls: ['./users.component.scss'],

})
// tslint:disable-next-line:component-class-suffix
export class DialogEditUserComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  local_data: any;
  editUser: any;
  countries: any;
  userGroups: any;
  userRoles: any;
  // tslint:disable-next-line:variable-name
  local_country: any;
  // tslint:disable-next-line:variable-name
  local_role: any;
  // tslint:disable-next-line:variable-name
  local_group: any;
  tabs: any;
  items: TreeviewItem[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 338,
  });
  changeValue: any;
 // tabTextValue: string;
  currentTabData: any;
  productLevels: any = [];
  accessLevel = '';
  localDataId: number;
  treeData = [];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersComponent,
    private usersServiceService: UsersServiceService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<DialogEditUserComponent>,
    private spinner: NgxSpinnerService
  ) {
    this.local_data = { ...data };
    this.local_country = this.local_data.countryInfo.id;
    this.local_role = this.local_data.roleInfo.id;
    if (this.local_data.userGroup) {
      this.local_group = this.local_data.userGroup.id;
    }
    this.localDataId = this.local_data.id;
  }

  ngOnInit() {
    this.getAllCountries();
    this.getUserGroups();
    this.getUserRoles();
    this.getAllUserTreeData();
    this.editUserData(0);
  }

  update() {
    this.spinner.show();
    this.editUser = new userDetails();
    this.editUser.emailId = this.local_data.emailId;
    this.editUser.roleInfo = {id: this.local_role};
    this.editUser.countryInfo = {id: this.local_country};
    if (this.local_role === 2) {
      this.editUser.userGroup = {id: this.local_group};
    } else {
      this.editUser.userGroup = null;
    }
    this.editUser.active_status = true;
    this.editUser.id = this.local_data.id;

    // this.editUser.accessLevel = this.currentTabData.text;
    this.editUser.accessLevel = this.accessLevel.slice(1);
    this.editUser.productLevels = this.treeData; // this.formatPostPayload(this.productLevels);

    console.log(this.editUser);
    this.usersServiceService.updateUser(this.editUser).subscribe((res) => {
      // this.spinner.hide();
      this.toastr.success('Updated Successfully');
      this.dialogRef.close();
    },
    (err) => {
      this.spinner.hide();
      this.toastr.error(err.error.errorMessage);
    });

  }
  getAllCountries() {
    this.usersServiceService.getAllCountries().subscribe(
      (res) => {
        this.countries = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }


treeNodeSelection(parentObj, chkType, chkevent) {
  if (parentObj.children && parentObj.children.length > 0 ) {
    parentObj.children.forEach((level1Arry) => {
     this.checkSelectedNode(level1Arry, parentObj, chkType, chkevent);
     if (level1Arry.children && level1Arry.children.length > 0) {
        level1Arry.children.forEach(level2Arry => {
          this.checkSelectedNode(level2Arry, level1Arry, chkType, chkevent);
          if (level2Arry.children && level2Arry.children.length > 0) {
            level2Arry.children.forEach(level3Arry => {
              this.checkSelectedNode(level3Arry, level2Arry, chkType, chkevent);
            });
          }
        });
    }
   });
  }

 }

checkSelectedNode(parentObj, levelObj, chkType, chkevent) {
  parentObj[chkType] = levelObj[chkType];

  // if (chkType === 'write' && chkevent) {
  //   parentObj.read = true;
  //  // levelObj.read = true;
  // }
}


  getUserGroups() {
    this.usersServiceService.getAllUsergroups().subscribe(
      (res) => {
        this.userGroups = res.data.user_group_details;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getUserRoles() {
    this.usersServiceService.getAllUserRoles().subscribe(
      (res) => {
        this.userRoles = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  changeTabData(event: any) {
    // tslint:disable-next-line:no-string-literal
    // this.tabTextValue = this.tabs[event.index]['text'];
    this.currentTabData = this.productLevels[event.index];
    this.items = [new TreeviewItem(this.currentTabData)];
  }

  getAllUserTreeData() {
    this.usersServiceService.editUserById(this.localDataId).subscribe((res) => {
      // tslint:disable-next-line:no-string-literal
      this.tabs = res.data['productLevels'];
    });
  }

  prepareAccessLevels(data, index) {
    const internalCheckedArray = data.children.map(
      (obj) => obj.internalChecked
    );
    if (internalCheckedArray.includes(true) && !this.accessLevel.includes(this.tabs[index].text)) {
      this.accessLevel = this.accessLevel + ',' + this.tabs[index].text;
    }
  }

  addDates(data) {
    return {
      ...data,
      created_date: new Date().toISOString(),
      created_by: 0,
      modified_date: new Date().toISOString(),
      modified_by: 0,
    };
  }
deleteUnwantedData(data) {
    return {
      value: data.value,
      text: data.text,
      parent_level_id: data.parent_level_id,
      checked: data.checked,
      active_status: data.active_status,
      children: data.children,
    };
  }

  editUserData(index: any) {
    this.spinner.show();
    this.usersServiceService.editUserById(this.localDataId).subscribe((res) => {
     // tslint:disable-next-line:no-string-literal
     this.currentTabData = res.data['productLevels'][index];
     // tslint:disable-next-line:no-string-literal
     this.productLevels = res.data['productLevels'];
     this.treeData      =  res.data.productLevels;
     // tslint:disable-next-line:no-string-literal
     this.items = [new TreeviewItem(this.productLevels[index])];
     this.spinner.hide();
    },
    (err) => {
      this.spinner.hide();
      this.toastr.error(err.error.errorMessage);
    });
  }

}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-deactivateuser',
  templateUrl: 'dialog-deactivateuser.component.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogDeactivateUserComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  local_data: any;
  // tslint:disable-next-line:variable-name
  local_email: any;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersComponent,
    private usersServiceService: UsersServiceService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<DialogDeactivateUserComponent>,
    private spinner: NgxSpinnerService
  ) {
    this.local_data = data;
  }
ngOnInit() {
}
changeStatus() {
  const result = this.local_data.map(({id, active_status}) => {
    return {id, active_status};
  });
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < result.length; i++) {
    if (result[i].active_status) {
      result[i].active_status = false;
    } else {
      result[i].active_status = true;
    }
  }
  const deactivate = JSON.stringify(result);

  this.usersServiceService.deactivateUser(deactivate).subscribe(
    (res) => {
      this.toastr.success('Status updated Successfully');
      this.dialogRef.close();

      // this.tableUpdation();
    },
    (err) => {
      this.toastr.error(err.error.errorMessage);
    }
  );
}

}
