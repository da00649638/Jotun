// tslint:disable-next-line:max-line-length
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewChildren, QueryList, ɵLocaleDataIndex, Inject, TemplateRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator, MatTable, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UsersServiceService } from '../services/users-service.service';
import { PeriodicElement } from '../table-grid/table-grid.component';
import { trigger, transition, state, style, animate } from '@angular/animations';
import { pigmentationForm, newColourGroup } from '../models/models';
import { RawServicesService } from '../services/raw-services.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import {MAT_DIALOG_DATA} from '@angular/material';
import { DialogAddNewRawMaterialComponent } from '../raw-material/raw-material.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-pigmentation-library',
  templateUrl: './pigmentation-library.component.html',
  styleUrls: ['./pigmentation-library.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class PigmentationLibraryComponent implements OnInit {
  selectedRow: any;
  ParentselectedRow: any;

  // tslint:disable-next-line:max-line-length
  constructor(private usersServiceService: UsersServiceService,  private cd: ChangeDetectorRef, public dialog: MatDialog, private toastr: ToastrService, private rawServiceService: RawServicesService, private spinner: NgxSpinnerService) {
  }
  public pigmentationArr = [];
  public dataSource: any;
  public selection = [];
  public viewIcon = true;
  public deactivateIcon = true;
  public editIcon = true;
  public viewPigmentation: {};
  public checkedRowobj = {};
  objectKeys = Object.keys;
  // tslint:disable-next-line:member-ordering
  expandedElement = '';
  public length: number;
  public pageSize = 10;
  public pageSizeOptions = [5, 10, 25, 100];
  public currentPage: number;
  public objKeys = [];
  public parentSelection: any;
  public parentEditIcon = false;

  public objKeysLength = [];
  public removeArray = [];
  displayedColumns: string[] = ['select', 'color_group'];
  // tslint:disable-next-line:max-line-length
  innerDisplayedColumns = ['select', 'Color', 'pig_grp_1', 'amount_1', 'pig_grp_2', 'amount_2', 'pig_grp_3', 'amount_3', 'pig_grp_4', 'amount_4', 'pig_grp_5', 'amount_5', 'pig_grp_6', 'amount_6', 'durability', 'active_status'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('filter', {static: true}) filter: ElementRef;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<any>>;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;

  ngOnInit() {
    this.tableUpdation();
  }
  tableUpdation() {
    this.spinner.show();
    this.usersServiceService.getPigmentationData().subscribe(res => {
      this.pigmentationArr = [];
      res.data.forEach((element, index) => {
        element.children.forEach((innerelement, i) => {
          element.children[i].pig_grp_1 = innerelement.pig_grp_1 === '' ? '-' : innerelement.pig_grp_1;
          element.children[i].amount_1 = innerelement.amount_1 === 0 ? '-' : innerelement.amount_1;
          element.children[i].pig_grp_2 = innerelement.pig_grp_2 === '' ? '-' : innerelement.pig_grp_2;
          element.children[i].amount_2 = innerelement.amount_2 === 0 ? '-' : innerelement.amount_2;
          element.children[i].pig_grp_3 = innerelement.pig_grp_3 === '' ? '-' : innerelement.pig_grp_3;
          element.children[i].amount_3 = innerelement.amount_3 === 0 ? '-' : innerelement.amount_3;
          element.children[i].pig_grp_4 = innerelement.pig_grp_4 === '' ? '-' : innerelement.pig_grp_4;
          element.children[i].amount_4 = innerelement.amount_4 === 0 ? '-' : innerelement.amount_4;
          element.children[i].pig_grp_5 = innerelement.pig_grp_5 === '' ? '-' : innerelement.pig_grp_5;
          element.children[i].amount_5 = innerelement.amount_5 === 0 ? '-' : innerelement.amount_5;
          element.children[i].pig_grp_6 = innerelement.pig_grp_6 === '' ? '-' : innerelement.pig_grp_6;
          element.children[i].amount_6 = innerelement.amount_6 === 0 ? '-' : innerelement.amount_6;
        });
      });
      res.data.forEach(user => {
        if (user.children && Array.isArray(user.children) && user.children.length) {
          user.children.forEach(item => {
            this.objKeys = Object.keys(item);
          });
          // user.children.forEach(item => {
          //   this.objKeysLength.push(item.pigment_group.length);
          //   if (item.pigment_group && Array.isArray(item.pigment_group) && item.pigment_group.length) {
          //     item.pigment_group.forEach(innerItem => {
          //       this.objKeys = Object.keys(innerItem);
          //     });
          //   }
          // });
          this.pigmentationArr = [{...user,
            children: new MatTableDataSource(user.children)}, ... this.pigmentationArr];
        } else {
          this.pigmentationArr = [... this.pigmentationArr, user];
        }
      });
      // tslint:disable-next-line:max-line-length
      // const removeArray = ['color_name', 'pvc_Min', 'pvc_Max', 'filler_Min', 'filler_max', 'filler_to_Max', 'filler_To_Min', 'id', 'name', 'created_date', 'created_by', 'modified_date', 'modified_by'];
      // tslint:disable-next-line:only-arrow-functions
      // this.objKeys = this.objKeys.filter( function( el ) {
      //   return removeArray.indexOf( el ) < 0;
      // });
      // console.log(this.pigmentationArr, 'this.pigmentationArr');
      // this.innerDisplayedColumns = this.innerDisplayedColumns.concat(this.objKeys);
      // const highestValue = this.objKeysLength.reduce((a, b) => Math.max(a, b));
      // for (let i = 0; i < highestValue; i++) {
      //   this.innerDisplayedColumns = this.innerDisplayedColumns.concat(this.objKeys);
      // }
      // console.log(this.innerDisplayedColumns, 'this.innerDisplayedColumns');
      // this.innerDisplayedColumns;
      this.pigmentationArr.forEach((ele, index) => {
        this.selection[index] = new SelectionModel(true, []);
      });
      this.dataSource = new MatTableDataSource(this.pigmentationArr);
      this.expandedElement = this.dataSource.filteredData[0];
      this.parentSelection = new SelectionModel<PeriodicElement>(true, []);
      this.dataSource.paginator = this.paginator;
      this.length = this.pigmentationArr.length;
      this.dataSource.sort = this.sort;
      setTimeout(() => {
        this.nextPageChange(0);
      });
      this.spinner.hide();
    });
    // if (this.filter) {
    fromEvent(this.filter.nativeElement, 'keyup')
    .pipe(debounceTime(150),
    distinctUntilChanged()
    ).subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
    // }
  }

  isAllParentSelected() {
    const numSelected = this.parentSelection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterParentToggle() {
    this.isAllParentSelected() ?
        this.parentSelection.clear() :
        this.dataSource.data.forEach(row => this.parentSelection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxParentLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllParentSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.parentSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  removeSpecialSymbol(columnText) {
    return columnText.replace('_', ' ');
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  /** Whether the number of selected elements matches the total number of rows. */

  isAllSelectedEle(element, ind) {
    const numSelected = this.selection[ind].selected.length;
    const numRows = element.children.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(element, ind) {

    this.isAllSelectedEle(element, ind) ?
        this.selection[ind].clear() :
        element.children.data.forEach(row => this.selection[ind].select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(ind: number, element?: PeriodicElement ): string {
    if (!element) {
      return `${this.isAllSelectedEle(element, ind) ? 'select' : 'deselect'} all`;
    }
    return `${this.selection[ind].isSelected(element, ind) ? 'deselect' : 'select'} element ${element.position + 1}`;
  }
  toggleRow(element: any) {
    // tslint:disable-next-line:max-line-length
    element.children && (element.children as MatTableDataSource<any>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<any>).sort = this.innerSort.toArray()[index]);
  }

  // applyFilter(filterValue:) {
  //   this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<any>).filter = filterValue.trim().toLowerCase());
  // }
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
    const part = this.pigmentationArr.slice(start, end);
    this.dataSource = part;
  }

  openViewPigmentationDialog(): void {
    const dialogRef = this.dialog.open(DialogViewPigmentationComponent, {
      width: '782px',
      height: '100vh',
      panelClass: 'my-dialog-container-class',
      // data: this.viewPigmentation
      data: this.selectedRow
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
      // this.tableUpdation();
    });
  }
  openAddGroupDialog(): void {
    const dialogRef = this.dialog.open(DialogAddColourGroupComponent, {
      width: '417px',
      height: '100vh',
      panelClass: 'my-dialog-container-class',
      data: this.dataSource,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
          this.selection[0].clear();
          this.toastr.success('Added Successfully');
          this.tableUpdation();
          console.log('The dialog was closed');
      } else {}
      // console.log('The dialog was closed');
      // this.tableUpdation();
    });
  }

  openEditPigmentationDialog(): void {
    const dialogRef = this.dialog.open(DialogEditNewPigmentationComponent, {
      width: '417px',
      height: '100vh',
      panelClass: 'my-dialog-container-class',
      data: this.selectedRow,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
          this.selection[0].clear();
          this.toastr.success('Updated Successfully');
          this.tableUpdation();
          console.log('The dialog was closed');
      } else {}
      // console.log('The dialog was closed');
      // this.tableUpdation();
    });
  }

  confirmDeactivateDialog(): void {
    const dialogRef = this.dialog.open(DialogDeactivatePigmentationComponent, {
      width: '490px',
      height: '400px',
      position: {top: '10%',  bottom : '70%', right : '30%' },
      panelClass: 'my-dialog-container-class',
      data: this.selectedRow[0],
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.viewIcon = true;
      this.deactivateIcon = true;
      this.editIcon = true;
      this.tableUpdation();
      this.selection[0].clear();
      console.log('dialog closed');
     });
  }

  openAddPigmentationDialog(): void {
    // console.log( parentEditIcon, 'editFormView, parentEditIcon');
    // if (parentEditIcon) {
    //   const dialogRef = this.dialog.open(DialogAddColourGroupComponent, {
    //     width: '417px',
    //     height: '100vh',
    //     panelClass: 'my-dialog-container-class',
    //     data: { dialogForm : parentEditIcon, dialogSelectedRow: this.checkedRowobj}
    //   });
    //   dialogRef.afterClosed().subscribe((result) => {
    //     // console.log('The dialog was closed');
    //     this.tableUpdation();
    //   });
    // } else {
      const dialogRef = this.dialog.open(DialogAddNewPigmentationComponent, {
        width: '417px',
        height: '100vh',
        panelClass: 'my-dialog-container-class',
        // data: { dialogForm : dialogSelectedRow: this.checkedRowobj}
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
            this.selection[0].clear();
            this.toastr.success('Added Successfully');
            this.tableUpdation();
            console.log('The dialog was closed');
        } else {
          console.log('Failed');
        }
        // this.tableUpdation();
      });
    // }
  }
  onSelect(row: any , i) {
    this.selection[i].toggle(row);
    // this.rawMaterial = row.raw_material ;
    this.selectedRow = this.selection[i].selected;
    this.selectedCheckboxLength(row, i);
  }
  onSelectParent(row: any) {
     this.parentSelection.toggle(row);
     this.ParentselectedRow = this.parentSelection.selected;
    //  this.selectedParentCheckboxLength();
  }
  // selectedParentCheckboxLength() {
  //   if (this.parentSelection.selected.length === 1) {
  //     this.editIcon = false;
  //     this.parentEditIcon = true;
  //     // this.viewPigmentation = element;
  //     // this.checkedRowobj = element;
  //   } else {
  //     this.editIcon = true;
  //     this.parentEditIcon = false;
  //   }
  // }
  // onRowSelect(row: any, i) {
  //   debugger
  //   this.selection[i].toggle(row);
  //   this.selectedRow = this.selection[i].selected;
  //   console.log(this.selectedRow);
  //   this.selectedCheckboxLength(row, i);
  // }
  selectedCheckboxLength(row, i) {
    if (this.selection[i].selected.length === 1) {
      this.viewIcon = false;
      this.editIcon = false;
      this.deactivateIcon = false;
      this.parentEditIcon = false;
      this.viewPigmentation = row;
      this.checkedRowobj = row;
    } else {
      this.viewIcon = true;
      this.deactivateIcon = true;
      this.editIcon = true;
    }
  }

  // changeStatus() {
  //   this.spinner.show();
  //   console.log(this.selectedRow[0], 'this.selectedRow');
  //   const id = this.selectedRow[0].id;
  //   this.rawServiceService.deactivateColourcode(id).subscribe(
  //     (res) => {
  //       if (this.selectedRow[0].active_status) {
  //         this.toastr.success('Deactivated Successfully');
  //       } else {
  //         this.toastr.success('Activated Successfully');
  //       }
  //       this.viewIcon = true;
  //       this.deactivateIcon = true;
  //       this.editIcon = true;
  //       this.tableUpdation();
  //     },
  //     (err) => {
  //       this.toastr.error(err.error.errorMessage);
  //     }
  //   );
  // }
}

@Component({
  selector: 'app-dialog-add-colour-group',
  templateUrl: 'dialog-add-colour-group.component.html',
  providers: [],
})

export class DialogAddColourGroupComponent implements OnInit {
  constructor() {}
  public newGroup: newColourGroup = {
    groupName: ''

  };

  ngOnInit() {

  }
  saveGroup(groupData) {
    console.log('groupData', groupData);
  }

  radioChange(event) {
  }
}

@Component({
  selector: 'app-dialog-add-new-pigmentation',
  templateUrl: 'dialog-add-new-pigmentation.component.html',
  providers: [],
})

export class DialogAddNewPigmentationComponent implements OnInit {
  pigmentationErrorMessage: string;
  // tslint:disable-next-line:max-line-length
  constructor(  public dialogRef: MatDialogRef<DialogEditNewPigmentationComponent>,
                private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any,
                private usersServiceService: UsersServiceService,
                private modalService: BsModalService,
                private rawServiceService: RawServicesService,
                private spinner: NgxSpinnerService) {}
  public isLinear = true;
  public durabile: any;
  public addGroup = false;
  public addpigmentBtn = false;
  public editForm;
  public selectedRow;
  modalRef: BsModalRef;

  // tslint:disable-next-line:semicolon
  public pigmentationObj: pigmentationForm = {
    colourGroupId: 0,
    colourGroupName: null,
    colourId: 0,
    colorName: '',
    colourCode: '',
    pigmentGroup: {
        groupID: null,
        groupName: ''
      },
      pvcMin: null,
      pvcMax: null,
      fillerMin: null,
      fillerMax: null,
      fillerToMin: null,
      fillerToMax: null,
    amount: null,
    durabilityId: []
  };
  public pigmentationGroupData = [];
  public groupName = '';
  public selectGroupOPtions = [];
  public pigmentGroupTemp = [];
  public selectedOption: any;
  public selectedColourGroupOption: any;
  public colourGroups: any;
  public colours: any;
  public enablePigmentTable = false;
  public saveAddPigmentationDataEnable = false;
  ngOnInit() {
    this.getAllDurability();
    this.getColourGroups();
    this.getColours();
    setTimeout(() => {
      this.getAllSelectGroup();
    }, 15);
    // this.selectedRow = this.data.dialogSelectedRow;
    console.log('this.data', this.data);
  }
  getAllDurability() {
    this.usersServiceService.getAllDurability().subscribe(
      (res) => {
        this.durabile = res.data;
        // console.log(this.durabile);
      },
      (err) => {
        this.toastr.error(err.error.errorMessage);
      }
    );
  }
  getColourGroups() {
    this.usersServiceService.getAllColourGroups().subscribe(
      (res) => {
        this.colourGroups = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getColours() {
    this.usersServiceService.getAllColours().subscribe(
      (res) => {
        this.colours = res.data;
      },
      (err) => {
        this.toastr.error(err.error.errorMessage);
      }
    );
  }
  getAllSelectGroup() {
    this.rawServiceService.getPigmentationGroupOptions().subscribe(res => {
      this.selectGroupOPtions = res.data;
      this.pigmentGroupTemp = this.pigmentGroupTemp.concat(this.selectGroupOPtions);
    });
  }
  saveBasicData(basicFormData) {
    delete  basicFormData.amount;
    delete  basicFormData.pigmentGroup;
    if (this.pigmentationGroupData.length > 0) {
      this.spinner.show();
      if (this.selectedColourGroupOption && this.selectedColourGroupOption.name) {
        basicFormData.colourGroupName = this.selectedColourGroupOption.name;
      } else {
        basicFormData.colourGroupName = basicFormData.colourGroupName;
      }
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.pigmentationGroupData.length; i++) {
        swap(this.pigmentationGroupData[i], 'id', this.pigmentationGroupData[i], 'rmGroupId');
      }
      function swap(sourceObj, sourceKey, targetObj, targetKey) {
          const temp = sourceObj[sourceKey];
          sourceObj[sourceKey] = targetObj[targetKey];
          targetObj[targetKey] = temp;
      }
      basicFormData.pigmentationGroupData = this.pigmentationGroupData;
      this.pigmentationErrorMessage = '';
      this.rawServiceService.addNewPigment(basicFormData).subscribe(
        (res) => {
          // this.toastr.success('Pigmentation Created Successfully');
          this.dialogRef.close(true);
          // this.tableUpdation();
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.errorMessage);
          // this.dialogRef.close(false);
        }
      );
    } else {
      this.pigmentationErrorMessage = 'Please click on the add pigment link to save the data';
      // this.dialogRef.close();

    }
    // if (this.selectedColourGroupOption.name) {
    //   basicFormData.colourGroup = this.selectedColourGroupOption;
    //   basicFormData.pigmentationGroupData = this.pigmentationGroupData;
    // } else {
    //   basicFormData.pigmentationGroupData = this.pigmentationGroupData;
    // }
  }
  saveRAwAttributesData(attributesData) {
    // console.log('basicFormData', attributesData);
  }
  closeDialog() {
    this.dialogRef.close(false);
  }
  onChangepigmentGroup(value) {
    this.selectedOption = value;
    // console.log('selectedOption', this.selectedOption);
  }
  onChangeColourGroup(value) {
    console.log(value, 'value-value');
    this.selectedColourGroupOption = value;
  }
  valid(e) {
    // e.target.value = (t.indexOf('.') >= 0) ? (t.substr(0, t.indexOf('.')) + t.substr(t.indexOf('.'), 4)) : t;
    const t = e.target.value;
    let resultData;
    const splitArr = e.target.value.split('.');
    if (splitArr.length > 1) {
      if (splitArr[1].length > 3) {
        splitArr[1] = splitArr[1].slice(0, 3);
      }
      resultData = splitArr[0] + '.' + splitArr[1];
    }
    if (resultData) {
      e.target.value = resultData.slice(0, 10);
    } else {
      e.target.value = e.target.value.slice(0, 10);
    }
  }
  enablePigmentTableBlock() {
    // tslint:disable-next-line:no-conditional-assignment
    if (this.pigmentationGroupData.length <= 6) {
      // this.selectPigmentOption = true;
      // tslint:disable-next-line:prefer-const
      // tslint:disable-next-line:max-line-length
      if ((this.pigmentationObj.pigmentGroup.name !== '') && (this.pigmentationObj.pigmentGroup.id != null) && (this.pigmentationObj.amount !== null)) {
        this.pigmentationErrorMessage = '';
        // tslint:disable-next-line:prefer-const
        for (let i = 0; i < this.pigmentGroupTemp.length; i++) {
          // tslint:disable-next-line:max-line-length
          if ((this.pigmentGroupTemp[i].rmGroupId === this.pigmentationObj.pigmentGroup.rmGroupId) && (this.pigmentGroupTemp[i].name === this.pigmentationObj.pigmentGroup.name)) {
            this.pigmentGroupTemp.splice(i, 1);
          }
        }
        let pigmentationOptionobj = {
          id: null,
          amount: null
        };
        this.enablePigmentTable = true;
        // tslint:disable-next-line:radix
        delete  this.pigmentationObj.pigmentGroup.colorCode;
        delete  this.pigmentationObj.pigmentGroup.pigmentNo;
        delete  this.pigmentationObj.pigmentGroup.colorId;
        pigmentationOptionobj  = this.pigmentationObj.pigmentGroup;
        // tslint:disable-next-line:radix
        pigmentationOptionobj.amount = Number(this.pigmentationObj.amount);
        console.log(pigmentationOptionobj.amount, 'pigmentationOptionobj.amount');
        this.pigmentationGroupData.push(pigmentationOptionobj);
      } else {
        this.pigmentationErrorMessage = 'Please select Pigment Group and enter Amount';
      }
      this.pigmentationObj.pigmentGroup = {
        groupID: null,
        groupName: ''
      };
      this.pigmentationObj.amount = null;
    }
  }
  deletedPigmentationOption(item, index) {
    this.pigmentationGroupData.splice(index, 1);
    this.pigmentGroupTemp.push(item);
    if (this.pigmentationGroupData.length === 0) {
      this.enablePigmentTable = false;
    }
  }
  addColourGroup() {
    this.selectedColourGroupOption = {
        name: null,
        id: 0
    };
    this.pigmentationObj.colourGroupId = 0;
    this.pigmentationObj.colourGroupName = null;
    this.addGroup = !this.addGroup;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.closeDialog();
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }
}

@Component({
  selector: 'app-dialog-edit-new-pigmentation',
  templateUrl: 'dialog-edit-new-pigmentation.component.html',
  providers: [],
})

export class DialogEditNewPigmentationComponent implements OnInit {
  pigmentationErrorMessage: string;
  // tslint:disable-next-line:max-line-length
  constructor(  public dialogRef: MatDialogRef<DialogEditNewPigmentationComponent>,
                private toastr: ToastrService,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private usersServiceService: UsersServiceService,
                private rawServiceService: RawServicesService,
                private modalService: BsModalService,
                private spinner: NgxSpinnerService) {}
  public isLinear = true;
  modalRef: BsModalRef;
  public durabile: any;
  public addGroup = false;
  public addpigmentBtn = false;
  public editForm;
  public selectedRow;
  // tslint:disable-next-line:semicolon
  public pigmentationObj: pigmentationForm = {
    colourGroupId: 0,
    colourGroupName: null,
    colourId: 0,
    colorName: '',
    colourCode: '',
    pigmentGroup: {
      groupID: null,
      groupName: ''
    },
    pvcMin: null,
    pvcMax: null,
    fillerMin: null,
    fillerMax: null,
    fillerToMin: null,
    fillerToMax: null,
    amount: null,
    durabilityId: []
  };
  public pigmentationGroupData = [];
  public groupName = '';
  public selectGroupOPtions = [];
  public pigmentGroupTemp = [];
  public selectedOption: any;
  public selectedColourGroupOption: any;
  public colourGroups: any;
  public colours: any;
  public enablePigmentTable = false;
  public saveAddPigmentationDataEnable = false;
  public editPigmentationData: any;
  ngOnInit() {
    this.getEditpigmentationData(this.data[0].id);
    this.getAllDurability();
    this.getColourGroups();
    this.getColours();
    setTimeout(() => {
      this.getAllSelectGroup();
    }, 15);
    // this.selectedRow = this.data.dialogSelectedRow;
  }
  getEditpigmentationData(id) {
    this.spinner.show();
    this.rawServiceService.getEditpigmentation(id).subscribe(
      (res) => {
        this.spinner.hide();
        this.pigmentationObj = res.data;
        this.pigmentationGroupData = res.data.pigmentationGroupData;
        if (this.pigmentationGroupData.length > 0) {
          this.enablePigmentTable = true;
        }
      },
      (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.errorMessage);
      }
    );
  }
  getAllDurability() {
    this.usersServiceService.getAllDurability().subscribe(
      (res) => {
        this.durabile = res.data;
        // console.log(this.durabile);
      },
      (err) => {
        this.toastr.error(err.error.errorMessage);
      }
    );
  }
  getColourGroups() {
    this.usersServiceService.getAllColourGroups().subscribe(
      (res) => {
        this.colourGroups = res.data;
      },
      (err) => {
        this.toastr.error(err.error.errorMessage);
      }
    );
  }
  getColours() {
    this.usersServiceService.getAllColours().subscribe(
      (res) => {
        this.colours = res.data;
      },
      (err) => {
        this.toastr.error(err.error.errorMessage);
      }
    );
  }
  getAllSelectGroup() {
    this.rawServiceService.getPigmentationGroupOptions().subscribe(res => {
      this.selectGroupOPtions = res.data;
      this.pigmentGroupTemp = this.pigmentGroupTemp.concat(this.selectGroupOPtions);
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
  updateBasicData(basicFormData) {
    delete  basicFormData.amount;
    delete  basicFormData.pigmentGroup;
    delete  basicFormData.active_status;
    this.spinner.show();
    if (this.pigmentationGroupData.length > 0) {
      this.pigmentationErrorMessage = '';
      basicFormData.colourGroupName = this.selectedColourGroupOption.name;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.pigmentationGroupData.length; i++) {
        if (this.pigmentationGroupData[i].name) {
          swap(this.pigmentationGroupData[i], 'id', this.pigmentationGroupData[i], 'rmGroupId');
        }
      }
      function swap(sourceObj, sourceKey, targetObj, targetKey) {
          const temp = sourceObj[sourceKey];
          sourceObj[sourceKey] = targetObj[targetKey];
          targetObj[targetKey] = temp;
      }
      basicFormData.pigmentationGroupData = this.pigmentationGroupData;
      this.pigmentationErrorMessage = '';
      const postData = {
        id: this.data[0].id,
        allData: basicFormData
      };
      this.rawServiceService.postEditPigment(postData).subscribe(
        (res) => {
          // this.toastr.success('Pigmentation Created Successfully');
          this.dialogRef.close(true);
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.errorMessage);
          // this.dialogRef.close();
  }
      );
    } else {
      this.spinner.hide();
      this.pigmentationErrorMessage = 'Please click on the Add Pigment LInk to Save the data';
      // this.dialogRef.close();
    }
    // if (this.selectedColourGroupOption.name) {
    //   basicFormData.colourGroup = this.selectedColourGroupOption;
    //   basicFormData.pigmentationGroupData = this.pigmentationGroupData;
    // } else {
    //   basicFormData.pigmentationGroupData = this.pigmentationGroupData;
    // }
  }
  tableUpdation() {
    throw new Error('Method not implemented.');
  }
  saveRAwAttributesData(attributesData) {
    // console.log('basicFormData', attributesData);
  }
  onChangepigmentGroup(value) {
    this.selectedOption = value;
  }
  onChangeColourGroup(value) {
    this.selectedColourGroupOption = value;
  }
  valid(e) {
    // e.target.value = (t.indexOf('.') >= 0) ? (t.substr(0, t.indexOf('.')) + t.substr(t.indexOf('.'), 4)) : t;
    const t = e.target.value;
    let resultData;
    const splitArr = e.target.value.split('.');
    if (splitArr.length > 1) {
      if (splitArr[1].length > 3) {
        splitArr[1] = splitArr[1].slice(0, 3);
      }
      resultData = splitArr[0] + '.' + splitArr[1];
    }
    if (resultData) {
      e.target.value = resultData.slice(0, 10);
    } else {
      e.target.value = e.target.value.slice(0, 10);
    }
  }
  enablePigmentTableBlock() {
    // this.selectPigmentOption = true;
    // tslint:disable-next-line:prefer-const
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:max-line-length
    if ((this.pigmentationObj.pigmentGroup.name !== '') && (this.pigmentationObj.pigmentGroup.id != null) && (this.pigmentationObj.amount !== null)) {
      this.pigmentationErrorMessage = '';
      // tslint:disable-next-line:prefer-const
      for (let i = 0; i < this.pigmentGroupTemp.length; i++) {
        // tslint:disable-next-line:max-line-length
        if ((this.pigmentGroupTemp[i].rmGroupId === this.pigmentationObj.pigmentGroup.rmGroupId) && (this.pigmentGroupTemp[i].name === this.pigmentationObj.pigmentGroup.name)) {
          this.pigmentGroupTemp.splice(i, 1);
        }
      }
      let pigmentationOptionobj = {
        id: null,
        amount: null
      };
      this.enablePigmentTable = true;
      // tslint:disable-next-line:radix
      delete  this.pigmentationObj.pigmentGroup.colorCode;
      delete  this.pigmentationObj.pigmentGroup.pigmentNo;
      delete  this.pigmentationObj.pigmentGroup.colorId;
      pigmentationOptionobj  = this.pigmentationObj.pigmentGroup;
      // tslint:disable-next-line:radix
      pigmentationOptionobj.amount = Number(this.pigmentationObj.amount);
      console.log(pigmentationOptionobj.amount, 'pigmentationOptionobj.amount');
      this.pigmentationGroupData.push(pigmentationOptionobj);
    } else {
      this.pigmentationErrorMessage = 'Select Pigment Group and Enter Amount';
    }
    this.pigmentationObj.pigmentGroup = {
      groupID: null,
      groupName: ''
    };
    this.pigmentationObj.amount = null;
  }
  deletedPigmentationOption(item, index) {
    this.pigmentationGroupData.splice(index, 1);
    this.pigmentGroupTemp.push(item);
    if (this.pigmentationGroupData.length === 0) {
      this.enablePigmentTable = false;
    }
  }
  addColourGroup() {
    this.selectedColourGroupOption = {
        name: null,
        id: 0
    };
    this.pigmentationObj.colourGroupId = 0;
    this.pigmentationObj.colourGroupName = null;
    this.addGroup = !this.addGroup;
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.closeDialog();
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }
}

@Component({
  selector: 'app-dialog-view-pigmentation',
  templateUrl: 'dialog-view-pigmentation.component.html',
  providers: [],
})
export class DialogViewPigmentationComponent implements OnInit {
  items: TreeviewItem[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 338,
  });
  currentTabData: any;
  productLevels: any = [] ;
  tabs: any ;
  selectedRawMaterial: any;
  localRawMaterial: any;
  selectedColor: string;
  // tslint:disable-next-line:variable-name
  local_data: any;


  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private rawServiceService: RawServicesService ) {
    this.local_data = data[0];
   // console.log (JSON.stringify(this.local_data)) ;
    this.localRawMaterial = this.local_data.raw_material;
    // .raw_material
  }

  ngOnInit() {
    this.selectedColor = this.data[0].Color;
    this.getAllTreeData();
    this.getTreeData(0);
  }

  getAllTreeData() {
    this.rawServiceService.getAllColourPigmentTreeData().subscribe((res) => {
      // tslint:disable-next-line:no-string-literal
      this.tabs = res.data;
    });
  }

  changeTabData(event: any) {
    // tslint:disable-next-line:no-string-literal
    this.currentTabData = this.productLevels[event.index];
    if (this.currentTabData) {
    this.items = [new TreeviewItem(this.currentTabData)];
  }}
   onSelectedChange(items: any, index) {
    this.productLevels[index] = items[0];
  }

onFilterChange(event) {
    console.log('=======onFilterChange=======', event);
  }
getTreeData(index: any) {
    this.rawServiceService.getAllColourPigmentTreeData().subscribe((res) => {
      // tslint:disable-next-line:no-string-literal
      this.currentTabData = res.data[index];
      // tslint:disable-next-line:no-string-literal
      this.productLevels = res.data;
      this.items = [new TreeviewItem(res.data[index])];
  });

  }
}

@Component({
  selector: 'app-dialog-deactivate-pigmentation',
  templateUrl: 'dialog-deactivate-pigmentation.component.html',
  providers: [],
})

export class DialogDeactivatePigmentationComponent implements OnInit {
  pigmentationErrorMessage: string;
  // tslint:disable-next-line:variable-name
  local_data: any;
  // tslint:disable-next-line:variable-name
  local_name: any;
  // tslint:disable-next-line:variable-name
  local_id: any;
  constructor(  public dialogRef: MatDialogRef<DialogDeactivatePigmentationComponent>,
                private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any,
                private usersServiceService: UsersServiceService,
                private rawServiceService: RawServicesService,
                private spinner: NgxSpinnerService) {
                  this.local_data = data;
                  this.local_name = data.color_name;
                  this.local_id = data.Color;
                }


ngOnInit(): void {
  console.log(this.local_id);
}
changeStatus() {
  this.spinner.show();
  const id = this.local_data.id;
  this.rawServiceService.deactivateColourcode(id).subscribe(
    (res) => {
      if (this.local_data.active_status) {
        this.toastr.success('Deactivated Successfully');
      } else {
        this.toastr.success('Activated Successfully');
      }
      this.dialogRef.close();
    },
    (err) => {
      this.toastr.error(err.error.errorMessage);
    }
  );
}

}
