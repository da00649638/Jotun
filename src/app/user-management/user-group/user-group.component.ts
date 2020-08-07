import { Component, OnInit, ViewChild, ElementRef, Inject , Injectable, Optional} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {BehaviorSubject, Observable, fromEvent, merge} from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import { UsersServiceService } from '../../services/users-service.service';
import { Router } from '@angular/router';
import { userGroup, country, search, changestatus } from 'src/app/models/models';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.scss']
})
export class UserGroupComponent implements OnInit {

  public usergroups: any = [];
  public dataSource: any;
  public selection: any;
  public countries: any;
  public selectedRow: any;
  public deactivateIcon = true;
  public editIcon = true;
  enableSearch: boolean;
  searchDetails: search;
  // tslint:disable-next-line:variable-name
  access_levels: any;
  country: any;
  status: any;
  usergroup: string;
  newStatus: any;
  paginationView =  false;
  constructor(private toastr: ToastrService, private usersServiceService: UsersServiceService, public dialog: MatDialog,
              private spinner: NgxSpinnerService) { }
  displayedColumns: string[] = ['select', 'usergroup_name', 'countryName', 'access_levels', 'active_status'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('filter', {static: true}) filter: ElementRef;
  selectedText = 'Select User group';
  public length: number;
  public pageSize = 10;
  public pageSizeOptions = [5, 10, 25, 100];
  public currentPage: number;

  ngOnInit() {
    this.getAllCountries();
    this.tableUpdation();
  }

  tableUpdation() {
    this.spinner.show();
    this.usersServiceService.getAllUsergroups().subscribe(res => {
      const userGroupInfo = res.data.user_group_details;
      this.paginationView =  true;
      userGroupInfo.forEach((element, index) => {
        userGroupInfo[index].countryName = element.country.name;
      });

      this.usergroups = userGroupInfo;
      this.dataSource = new MatTableDataSource(this.usergroups);
      this.selection = new SelectionModel(true, []);
      this.dataSource.paginator = this.paginator;
      this.length = this.usergroups.length;
      this.dataSource.sort = this.sort;
      setTimeout(() => {
        this.nextPageChange(0);
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows =  this.length;
    // this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
    this.selectedCheckboxLength();
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getAllCountries() {
    this.usersServiceService.getAllCountries().subscribe(
      res => {
        this.countries = res.data;
      },
      error => {
        console.log(error);
      }
    );
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
    const part = this.usergroups.slice(start, end);
    this.dataSource = part;
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

  changeStatus() {
    const result = this.selection.selected.map(({id, active_status}) => {
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
    // const jsonResult = JSON.stringify(result);
    // const jsonChanged = JSON.parse(jsonResult);
    // console.log(jsonChanged, 'jsonResult');
    this.usersServiceService.deactivateUsergroup(result).subscribe(
      res => {
        this.toastr.success('Deactivated Successfully');
        this.tableUpdation();
    },
    err => {
      console.log(err);
      this.toastr.error(err.error.errorMessage);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddUsergroupComponent, {
      width: '782px',
      height: '100vh',
      panelClass: 'my-dialog-container-class',
      data: this.countries
    });
    dialogRef.afterClosed().subscribe(result => {
      this.tableUpdation();
      this.selection.clear();
      this.selectedCheckboxLength();
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  openEditDialog(): void {
    const dialogRef = this.dialog.open(DialogEditUserGroupComponent, {
      width: '782px',
      height: '100vh',
      panelClass: 'my-dialog-container-class',
      data: this.selectedRow
    });
    dialogRef.afterClosed().subscribe(result => {
      this.tableUpdation();
      this.selection.clear();
      this.selectedCheckboxLength();
    });
  }

  searchEnable() {
    this.enableSearch = !this.enableSearch;
  }

  search() {
    this.searchDetails = new search();
    this.searchDetails.usergroup = this.usergroup;
    this.searchDetails.access_levels = this.access_levels;
    this.searchDetails.country = this.country;
    this.searchDetails.status = this.status;
   // console.log(this.searchDetails);
  }

}



@Component({
  selector: 'app-dialog-addusergroup',
  templateUrl: 'dialog-addusergroup.component.html',
})

export class DialogAddUsergroupComponent implements OnInit {
  newGroup: any;
  groupname: string;
  country: any;
  tabs: any;
  // tree data
  items: TreeviewItem[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 340,
  });
    changeValue: any;
    tabTextValue: string;
    currentTabData: any;

  selectedCountry: country;
  countrySelected: country;
  productLevels: any = [];
  accessLevel = '';
    constructor(@Inject(MAT_DIALOG_DATA) public data: UserGroupComponent,
                private usersServiceService: UsersServiceService,
                private router: Router, private toastr: ToastrService,
                public dialogRef: MatDialogRef<DialogAddUsergroupComponent>,
                private spinner: NgxSpinnerService
              // tslint:disable-next-line:variable-name
             ) {
  }
  ngOnInit() {
    this.getAllTreeData();
    this.getTreeData(0);
  }
  saveGroup() {
      this.spinner.show();
      this.newGroup = new userGroup();
      this.newGroup.usergroup_name = this.groupname;
      // this.countrySelected = new country();
      // this.countrySelected.id = this.country;
      this.newGroup.country = {id: this.country};
      this.newGroup.active_status = true;
      this.newGroup.id = 0;
      // this.newGroup.access_levels = this.currentTabData.text;
      this.newGroup.access_level = this.accessLevel.slice(1);
      this.newGroup.productlevels = this.formatPostPayload(this.productLevels);
      console.log(this.newGroup);
      this.usersServiceService.addUserGroup(this.newGroup).subscribe(
        res => {
          this.spinner.hide();
          this.toastr.success(this.newGroup.usergroup_name + '\xa0\xa0\xa0' + 'Added Successfully');
          this.dialogRef.close();
      },
      err => {
        this.toastr.error(err.error.errorMessage);
      });

      this.dialogRef.afterClosed().subscribe(result => {
        this.tableUpdation();
      });
  }
  tableUpdation() {
    throw new Error('Method not implemented.');
  }

  getAllTreeData() {
    this.usersServiceService.getAllTreeData().subscribe((res) => {
      this.tabs = res.data;
      });
  }
  changeTabData(event: any) {
    // tslint:disable-next-line:no-string-literal
    this.currentTabData = this.productLevels[event.index];
    if (this.currentTabData) {
    this.items = [new TreeviewItem(this.currentTabData)];
    }
  }
  onSelectedChange(items: any, index) {
    this.productLevels[index] = items[0];
  }
  onFilterChange(event) {
   // console.log('=======onFilterChange=======', event);
  }
  getTreeData(index: any) {
    this.usersServiceService.getAllTreeData().subscribe((res) => {
      this.currentTabData = res.data[index];
      this.productLevels = res.data;
      this.items = [new TreeviewItem(res.data[index])];
    });
  }

  formatPostPayload(data) {
   // console.log(' =====================getter=', data);
    // console.log("=====================productLevels=",this.productLevels);

    const productLevelsPayLoad = data.map((firstLevelData, index) => {
      const filteredFirstLeveldata = this.deleteUnwantedData(firstLevelData);
      if (filteredFirstLeveldata.children && filteredFirstLeveldata.children.length > 0 ) {
      const secondLevel = filteredFirstLeveldata.children.map(
        (secondLevelData) => {
          const filteredSecondLeveldata = this.deleteUnwantedData(
            secondLevelData
          );
          if (filteredSecondLeveldata.children && filteredSecondLeveldata.children.length > 0) {
          const thirdLevel = filteredSecondLeveldata.children.map(
            (thirdLevelData) => {
              const filteredThirdLeveldata = this.deleteUnwantedData(
                thirdLevelData
              );
              if (filteredThirdLeveldata.children && filteredThirdLeveldata.children.length > 0) {
              const fourthLevel = filteredThirdLeveldata.children.map(
                (fourthLevelData) => {
                  let fifthLevel;
                  let filteredFourthLeveldata;
                  if (fourthLevelData.children && fourthLevelData.children.length > 0) {
                    filteredFourthLeveldata = this.deleteUnwantedData(
                      fourthLevelData
                    );
                   // this.prepareAccessLevels(filteredFourthLeveldata, index);
                    fifthLevel = filteredFourthLeveldata.children.map(
                      (fifthLevelData) => {
                        const finalLeveldata = {
                          ...this.deleteUnwantedData(fifthLevelData),
                        };
                        return this.addDates(finalLeveldata);
                      }
                    );
                  }

                  return { ...filteredFourthLeveldata, children: fifthLevel };
                }
              );
              return { ...filteredThirdLeveldata, children: fourthLevel };
           }
          }
          );
          return { ...filteredSecondLeveldata, children: thirdLevel };
         }
      }
      );
      return { ...filteredFirstLeveldata, children: secondLevel };
       }

    });
      // console.log(
    //   '===========productLevelsPayLoad=============',
    //   productLevelsPayLoad
    // );
    // console.log('========== this.accessLevel=========', this.accessLevel);
    return productLevelsPayLoad;
  }

// prepareAccessLevels(data, index) {
//     // console.log("this.data",data);
//     // console.log("this.currentTabData",this.currentTabData);
//     const internalCheckedArray = data.children.map(
//       (obj) => obj.internalChecked
//     );
//     if (internalCheckedArray.includes(true) && !this.accessLevel.includes(this.tabs[index].text)) {
//       this.accessLevel = this.accessLevel + ',' + this.tabs[index].text;
//     }
//   }

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

}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-dialog-editgroup',
  templateUrl: 'dialog-editusergroup.component.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogEditUserGroupComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  local_data: any;
  editGroup: any;
  countries: any;
  // tslint:disable-next-line:variable-name
  local_country: any;
  editCountry: country;
  // tree data
  tabs: any;
  items: TreeviewItem[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 340,
  });
    changeValue: any;
    currentTabData: any;
    productLevels: any = [];
    accessLevel = '';
    userGroupById: number;
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: UserGroupComponent, private usersServiceService: UsersServiceService,
              private toastr: ToastrService, public dialogRef: MatDialogRef<DialogEditUserGroupComponent>,
              private spinner: NgxSpinnerService ) {
      this.local_data = { ...data };
      this.local_country = this.local_data.country.id;
      this.userGroupById = this.local_data.id;
     // console.log(this.local_data, 'this.local_data');
    }

    ngOnInit() {
      this.getAllCountries();
      this.getAllUserGroupTreeData();
      this.editUserGroupData(0);
      console.log(this.local_country.name);
    }

    updateGroup() {
      this.spinner.show();
      this.editCountry = new country();
      this.editCountry.id = this.local_country;
      this.editGroup = new userGroup();
      this.editGroup.usergroup_name = this.local_data.usergroup_name;
      this.editGroup.country = this.editCountry;
      this.editGroup.active_status = true;
      this.editGroup.id = this.local_data.id;
      // this.editGroup.access_levels = this.currentTabData.text;
      this.editGroup.accessLevel = this.accessLevel.slice(1);
      this.editGroup.productLevels = this.formatPostPayload(this.productLevels);

      console.log(this.editGroup, 'this.editGroup');
      this.usersServiceService.updateUserGroup(this.editGroup).subscribe(
        res => {
          this.spinner.hide();
          this.toastr.success('Updated Successfully');
          this.dialogRef.close();
      },
      (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.errorMessage);
      });

      this.dialogRef.afterClosed().subscribe(result => {
        this.tableUpdation();
      });
    }
  tableUpdation() {
    throw new Error('Method not implemented.');
  }
  // onNoClick(): void {
  //   this.dialogRef.close();
  // }
  getAllCountries() {
    this.usersServiceService.getAllCountries().subscribe(
      res => {
        this.countries = res.data;
      },
      error => {
        console.log(error);
      }
    );
  }

  getAllUserGroupTreeData() {
    this.usersServiceService.editUserGroupById(this.userGroupById).subscribe((res) => {
      // tslint:disable-next-line:no-string-literal
      this.tabs = res.data['productlevels'];
      });
  }
  changeTabData(event: any) {
    // tslint:disable-next-line:no-string-literal
    this.currentTabData = this.productLevels[event.index];
    if (this.currentTabData) {
    this.items = [new TreeviewItem(this.currentTabData)];
    }
  }
  onSelectedChange(items: any, index) {
    this.productLevels[index] = items[0];
  }
  onFilterChange(event) {
    console.log('=======onFilterChange=======', event);
  }

  formatPostPayload(data) {
   // console.log(' =====================getter=', data);
    // console.log("=====================productLevels=",this.productLevels);

    const productLevelsPayLoad = data.map((firstLevelData, index) => {
      const filteredFirstLeveldata = this.deleteUnwantedData(firstLevelData);
      if (filteredFirstLeveldata.children && filteredFirstLeveldata.children.length > 0 ) {
      const secondLevel = filteredFirstLeveldata.children.map(
        (secondLevelData) => {
          const filteredSecondLeveldata = this.deleteUnwantedData(
            secondLevelData
          );
          if (filteredSecondLeveldata.children && filteredSecondLeveldata.children.length > 0) {
          const thirdLevel = filteredSecondLeveldata.children.map(
            (thirdLevelData) => {
              const filteredThirdLeveldata = this.deleteUnwantedData(
                thirdLevelData
              );
              if (filteredThirdLeveldata.children && filteredThirdLeveldata.children.length > 0) {
              const fourthLevel = filteredThirdLeveldata.children.map(
                (fourthLevelData) => {
                  let fifthLevel;
                  let filteredFourthLeveldata;
                  if (fourthLevelData.children && fourthLevelData.children.length > 0) {
                    filteredFourthLeveldata = this.deleteUnwantedData(
                      fourthLevelData
                    );
                   // this.prepareAccessLevels(filteredFourthLeveldata, index);
                    fifthLevel = filteredFourthLeveldata.children.map(
                      (fifthLevelData) => {
                        const finalLeveldata = {
                          ...this.deleteUnwantedData(fifthLevelData),
                        };
                        return this.addDates(finalLeveldata);
                      }
                    );
                  }

                  return { ...filteredFourthLeveldata, children: fifthLevel };
                }
              );
              return { ...filteredThirdLeveldata, children: fourthLevel };
           }
          }
          );
          return { ...filteredSecondLeveldata, children: thirdLevel };
         }
      }
      );
      return { ...filteredFirstLeveldata, children: secondLevel };
       }

    });
      // console.log(
    //   '===========productLevelsPayLoad=============',
    //   productLevelsPayLoad
    // );
    // console.log('========== this.accessLevel=========', this.accessLevel);
    return productLevelsPayLoad;
  }

  // prepareAccessLevels(data, index) {
  //   const internalCheckedArray = data.children.map(
  //     (obj) => obj.internalChecked
  //   );
  //   if (internalCheckedArray.includes(true) && !this.accessLevel.includes(this.tabs[index].text)) {
  //     this.accessLevel = this.accessLevel + ',' + this.tabs[index].text;
  //   }
  // }

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

  editUserGroupData(index: any) {
    this.spinner.show();
    this.usersServiceService.editUserGroupById(this.userGroupById).subscribe((res) => {
      // tslint:disable-next-line:no-string-literal
      this.spinner.hide();
      // tslint:disable-next-line:no-string-literal
      this.currentTabData = res.data['productlevels'][index];
      // tslint:disable-next-line:no-string-literal
      this.productLevels = res.data['productlevels'];
      // tslint:disable-next-line:no-string-literal
      this.items = [new TreeviewItem(this.productLevels[index])];
    },
    (err) => {
      this.spinner.hide();
      this.toastr.error(err.error.errorMessage);
    });
  }
}
