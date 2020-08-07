import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, TemplateRef, ViewChildren, QueryList, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator, MatTable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { fromEvent, Observable } from 'rxjs';
import {FormControl} from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UsersServiceService } from '../services/users-service.service';
import { PeriodicElement } from '../table-grid/table-grid.component';
import { trigger, transition, state, style, animate } from '@angular/animations';
import { basicRawForm, rawAttributes, newGroup } from '../models/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-raw-material',
  templateUrl: './raw-material.component.html',
  styleUrls: ['./raw-material.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RawMaterialComponent implements OnInit {
  rawmaterialdata: any;
  manufactures: any;
  public searchIcon = true;
  public replaceIcon = true;
  public handbookIcon = true;

  constructor(private usersServiceService: UsersServiceService,  private cd: ChangeDetectorRef, public dialog: MatDialog,
              private toastr: ToastrService, private spinner: NgxSpinnerService) {

  }
  public rawMaterialsArr = [];
  public dataSource: any;
  public selection: any = [];
  objectKeys = Object.keys;
  // tslint:disable-next-line:member-ordering
  expandedElement = '';
  public length: number;
  public pageSize = 10;
  public pageSizeOptions = [5, 10, 25, 100];
  public currentPage: number;

  displayedColumns: string[] = ['group_name'];
  // tslint:disable-next-line:max-line-length
  innerDisplayedColumns = ['select', 'rm_no', 'raw_material', 'alpha_group', 'manufacture_name', 'specific_gravity', 'durability', 'active_status'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('filter', {static: true}) filter: ElementRef;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<any>>;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;

  public rawMaterialSelectedRow: any;
  public deactivateIcon = true;
  public editIcon = true;
  public viewIcon = true;
  public addgroup = false;
  public deactivate = false;
  public tableview = true;
  paginationView = false;



  ngOnInit() {
   this.gridUpdation();

  }

  gridUpdation() {
    this.spinner.show();
    this.usersServiceService.getAllRawMaterial().subscribe(res => {
    this.rawmaterialdata = res.data;
    this.paginationView = true;
    this.rawMaterialsArr = [];
    this.rawmaterialdata.forEach(user => {
     if (user.rm_details && Array.isArray(user.rm_details) && user.rm_details.length) {
         this.rawMaterialsArr = [{...user,
         children: new MatTableDataSource(user.rm_details)}, ... this.rawMaterialsArr];
     } else {
       this.rawMaterialsArr = [... this.rawMaterialsArr, user];
     }
   });
   // tslint:disable-next-line:align
   this.rawMaterialsArr.forEach((ele, index) => {
       this.selection[index] = new SelectionModel(true, []);
     });
    this.dataSource = new MatTableDataSource(this.rawMaterialsArr);
    this.expandedElement = this.dataSource.filteredData[0];
   // this.selection = new SelectionModel(true, []);
    this.dataSource.paginator = this.paginator;
    this.length = this.rawMaterialsArr.length;
    this.dataSource.sort = this.sort;
    setTimeout(() => {
      this.nextPageChange(0);
    });
    this.spinner.hide();
   });
    if (this.filter) {
     fromEvent(this.filter.nativeElement, 'keyup')
     .pipe(debounceTime(150),
     distinctUntilChanged()
     ).subscribe(() => {
       if (!this.dataSource) { return; }
       this.dataSource.filter = this.filter.nativeElement.value;
     });
 }}


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
    this.selectedCheckboxLength(ind);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(ind: number, element?: PeriodicElement ): string {
    if (!element) {
      return `${this.isAllSelectedEle(element, ind) ? 'select' : 'deselect'} all`;
    }
    return `${this.selection[ind].isSelected(element, ind) ? 'deselect' : 'select'} element ${element.position + 1}`;
  }
  toggleRow(element: any) {
    // tslint:disable-next-line:max-line-length tslint:disable-next-line:no-unused-expression
    element.children && (element.children as MatTableDataSource<any>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<any>).sort = this.innerSort.toArray()[index]);
  }

 // rawMaterial: string = '';

  onSelect(row: any , i) {
    this.selection[i].toggle(row);
    // this.rawMaterial = row.raw_material ;
    this.rawMaterialSelectedRow = this.selection[i].selected;
    this.selectedCheckboxLength(i);
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
    const part = this.rawMaterialsArr.slice(start, end);
    this.dataSource = part;
  }
  // openAddGroupDialog(): void {
  //   const dialogRef = this.dialog.open(DialogAddGroupComponent, {
  //     width: '417px',
  //     height: '100vh',
  //     panelClass: 'my-dialog-container-class',
  //     data: this.dataSource,
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log('The dialog was closed');
  //     // this.tableUpdation();
  //   });
  // }

  openAddRawMaterialDialog(): void {
    this.addgroup = true;
    this.rawmaterialdata.addgroup = this.addgroup;
    const dialogRef = this.dialog.open(DialogAddNewRawMaterialComponent, {
      width: '782px',
      height: '100vh',
      panelClass: 'my-dialog-container-class',
      data: this.rawmaterialdata,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selection[0].clear();
        this.selectedCheckboxLength(0);
        this.gridUpdation();
        this.toastr.success('Added Successfully');
        console.log('The dialog was closed');
    } else {
    }
    });
  }

  openEditRawMaterialDialog(): void {
    this.tableview = false;
    this.addgroup = false;
    this.rawMaterialSelectedRow.addgroup = this.addgroup;
    const dialogRef = this.dialog.open(DialogAddNewRawMaterialComponent, {
      width: '782px',
      height: '100vh',
      panelClass: 'my-dialog-container-class',
      data: this.rawMaterialSelectedRow,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log({...result});
      if (result) {
        this.selection[0].clear();
        this.selectedCheckboxLength(0);
        this.tableview = true;
        this.gridUpdation();
        this.toastr.success('Updated Successfully');
        console.log('The dialog was closed');
    } else {
      console.log('The dialog was closed');

    }
    });
  }

  selectedCheckboxLength(i: number) {
    if (this.selection[i].selected.length === 1) {
      this.deactivateIcon = false;
      this.editIcon = false;
      this.viewIcon = false;
    } else if (this.selection[i].selected.length > 0) {
      this.deactivateIcon = true;
      this.editIcon = true;
      this.viewIcon = true;
    } else {
      this.deactivateIcon = true;
      this.editIcon = true;
      this.viewIcon = true;
    }
  }


  openViewRawMaterialDialog(): void {
    const dialogRef = this.dialog.open(DialogViewRawMaterialComponent, {
      width: '650px',
      height: '100vh',
      panelClass: 'my-dialog-container-class',
      data: this.rawMaterialSelectedRow,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // this.gridUpdation();
      this.selection[0].clear();
      this.selectedCheckboxLength(0);
      console.log('The dialog was closed');
    });
  }

  deactivateRawMaterial() {
    if (this.deactivateIcon === false) {
      this.confirmDeactivateDialog();
    }
  }

  confirmDeactivateDialog(): void {
    const dialogRef = this.dialog.open(DialogDeactivateRawMaterialComponent, {
      width: '490px',
      height: '400px',
      position: {top: '10%',  bottom : '70%', right : '30%' },
      panelClass: 'my-dialog-container-class',
      data: this.rawMaterialSelectedRow,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.gridUpdation();
      this.selection[0].clear();
      this.selectedCheckboxLength(0);
      console.log('dialog closed');
     });
  }

}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-deactivate-raw-material',
  templateUrl: 'dialog-deactivate-raw-material.component.html',
  providers: [],
})

export class DialogDeactivateRawMaterialComponent implements OnInit {
  localRawMaterial: any;
  // tslint:disable-next-line:variable-name
  local_data: any;
  // tslint:disable-next-line:variable-name
  local_id: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: RawMaterialComponent,
              private toastr: ToastrService, private usersServiceService: UsersServiceService,
              private spinner: NgxSpinnerService,
              public dialogRef: MatDialogRef<DialogDeactivateRawMaterialComponent> ) {
    this.local_data = data[0];
   // console.log (JSON.stringify(this.local_data)) ;
    this.localRawMaterial = this.local_data.raw_material;
    this.local_id = this.local_data.id;
    // .raw_material
  }


  ngOnInit(): void {
  }

  deactivateRawMaterial() {
    this.spinner.show();
    this.usersServiceService.deactivateRawMaterial(this.local_id).subscribe((res) => {
      if (this.local_data.active_status) {
        this.toastr.success('Deactivated Successfully');
      } else {
        this.toastr.success('Activated Successfully');
      }
      this.dialogRef.close();
      // this.spinner.hide();
      },
      (err) => {
        this.toastr.error(err.error.errorMessage);
        this.toastr.error('Failed');
      }
    );
  }
}

// @Component({
//   // tslint:disable-next-line:component-selector
//   selector: 'dialog-add-group',
//   templateUrl: 'dialog-add-group.component.html',
//   providers: [],
// })

// export class DialogAddGroupComponent implements OnInit {
//   groupname: string;
//   grouptype: string;
//   constructor(
// @Inject(MAT_DIALOG_DATA) public data: RawMaterialComponent,
// private usersServiceService: UsersServiceService,
// private toastr: ToastrService,
// public dialogRef: MatDialogRef<DialogAddGroupComponent>
//   ) {}


//   public newGroup: newGroup = {
//     group_name: 'UnGroup',
//     type_of_name: ''

//   };
// ngOnInit() {
//   }

// saveRawMaterialGroup() {
//     this.newGroup.group_name = this.groupname;
//     this.newGroup.type_of_name = this.grouptype;
//     this.usersServiceService.addRawMaterialGroup(this.newGroup).subscribe(
//       (res) => {
//         console.log('groupData', this.newGroup);
//         this.toastr.success('Added Successfully');
//       },
//       (err) => {
//         this.toastr.error(err.error.errorMessage);
//         this.toastr.error('Failed');
//       }
//     );
//     this.dialogRef.close();

//   }
// radioChange(event) {
//   }
// }
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-add-new-raw-material',
  templateUrl: 'dialog-add-new-raw-material.component.html',
  providers: [],
})

export class DialogAddNewRawMaterialComponent implements OnInit {
  manufactures: any;
  manufacture: any;
  // tslint:disable-next-line:typedef-whitespace
  // tslint:disable-next-line:variable-name
  local_data: any;
  keyword = 'name';
  manufacturename: any;
  testvar: string;
  manufacturer: any;
  gravity: any;
  coordinator: any;
  durabile: any;
  alphaGroups: any;
  groupType: any;
  groupName: null;
  groupId: null;
  carboxylEquivalentWeight: number;
  polyesterWeight: number;
  editRawMaterialGroup: any;
  rawMaterialdata: any;
  modalRef: BsModalRef;
  constructor(@Inject(MAT_DIALOG_DATA) public data: RawMaterialComponent,
              private usersServiceService: UsersServiceService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private modalService: BsModalService,
              public dialogRef: MatDialogRef<DialogAddNewRawMaterialComponent>) {
                this.local_data = data ;
              }

  public isLinear = true;
  // tslint:disable-next-line:semicolon
  public basicRawMaterialObj: basicRawForm = {
    selectGroup: '',
    rmID: null,
    nameRawMaterial: '',
    alphaGroup: '',
    manufacture: '',
    technicalCoordinator: '',
    specialGravity: null,
    durability: '',

  };
  public rawMaterialAttributes: rawAttributes = {
    density: null,
    equivalentWeight: null,
    acidValue: null,
    hydroxylValue: null,
    oilAbsorption: null,
    epoxyEquivalentWeight: null,
    carboxylEquivalentWeight: null,
    aminoHydrogenEquivalentWeight: null,
    polyesterWeight: null,
    hydroxylEquivalentWeight: null,
    ncoEquivalentWeight: null,
    unsaturatedEquivalentWeight: null,
    casNumber: null,
    components: ''
  };
  public rawMaterialGroupExist = false;
  filterednameOptions: Observable<string[]>;
  mynameControl = new FormControl();


  ngOnInit() {
    this.getAllManufactures();
    this.getAllDurability();
    this.getAllCoordinator();
    this.getAllAlhpaGroups();
    this.getAllRawMaterials();
    if (!this.data.addgroup) {
      this.spinner.show();
      const editId = this.local_data[0].id;
      this.usersServiceService.getRawMaterial(editId).subscribe(res => {
          this.editRawMaterialGroup = res.data;
          this.basicRawMaterialObj.selectGroup = this.editRawMaterialGroup.group_id;
          this.basicRawMaterialObj.rmID = this.editRawMaterialGroup.rm_no;
          this.basicRawMaterialObj.nameRawMaterial = this.editRawMaterialGroup.raw_material;
          this.basicRawMaterialObj.alphaGroup = this.editRawMaterialGroup.alpha_group;
          this.basicRawMaterialObj.manufacture = this.getManfactureObj(this.editRawMaterialGroup.manufacture_name);
          this.basicRawMaterialObj.technicalCoordinator = this.editRawMaterialGroup.techcoord_name;
          this.basicRawMaterialObj.specialGravity = this.editRawMaterialGroup.specific_gravity;
          this.basicRawMaterialObj.durability = this.editRawMaterialGroup.durability_ids;
          this.rawMaterialAttributes.density = this.editRawMaterialGroup.density;
          this.rawMaterialAttributes.equivalentWeight = this.editRawMaterialGroup.eq_wt;
          this.rawMaterialAttributes.acidValue = this.editRawMaterialGroup.acid_value;
          this.rawMaterialAttributes.hydroxylValue = this.editRawMaterialGroup.hydroxyl_value;
          this.rawMaterialAttributes.oilAbsorption = this.editRawMaterialGroup.oil_abs;
          this.rawMaterialAttributes.epoxyEquivalentWeight = this.editRawMaterialGroup.epoxy_eq_wt;
          this.rawMaterialAttributes.carboxylEquivalentWeight = this.editRawMaterialGroup.carboxyl_eq_wt;
          this.rawMaterialAttributes.aminoHydrogenEquivalentWeight = this.editRawMaterialGroup.Amino_eq_wt;
          this.rawMaterialAttributes.polyesterWeight = this.editRawMaterialGroup.polyester;
          this.rawMaterialAttributes.hydroxylEquivalentWeight = this.editRawMaterialGroup.hyd_eq_wt;
          this.rawMaterialAttributes.ncoEquivalentWeight = this.editRawMaterialGroup.nco_eq_wt;
          this.rawMaterialAttributes.unsaturatedEquivalentWeight = this.editRawMaterialGroup.unsat_eq_wt;
          this.rawMaterialAttributes.casNumber = this.editRawMaterialGroup.cas_no;
          this.rawMaterialAttributes.components = this.editRawMaterialGroup.components;
          this.spinner.hide();

      });
    }
  }

  getManfactureObj(id) {


    const results = this.manufactures.filter((e) => {
      return e.id === id;
  });
  console.log('results', results)
  }

  selectEvent(item) {
  }

onChangeSearch(search: string) {
  }

saveRawMaterialData(basicFormData) {
    this.spinner.show();
    let manfactureId;
    let manfacturerName;
    if (basicFormData.manufacture && basicFormData.manufacture.name) {
      manfactureId = basicFormData.manufacture.id;
      manfacturerName = basicFormData.manufacture.name;
    } else if (basicFormData.manufacture) {
      manfactureId = 0;
      manfacturerName = basicFormData.manufacture;
    } else {
      manfactureId = null;
      manfacturerName = null;
    }

    let coordinatorId;
    let coordinatorNameval;
    if (basicFormData.technicalCoordinator && basicFormData.technicalCoordinator.name) {
      coordinatorId = basicFormData.technicalCoordinator.id;
      coordinatorNameval = basicFormData.technicalCoordinator.name;
    } else if (basicFormData.technicalCoordinator) {
      coordinatorId = 0;
      coordinatorNameval = basicFormData.technicalCoordinator;
    } else {
      coordinatorId = null;
      coordinatorNameval = null;
    }

    let alphaGroupId;
    let alphaGroupNameval;
    if (basicFormData.alphaGroup && basicFormData.alphaGroup.name) {
      alphaGroupId = basicFormData.alphaGroup.id;
      alphaGroupNameval = basicFormData.alphaGroup.name;
    } else if (basicFormData.alphaGroup) {
      alphaGroupId = 0;
      alphaGroupNameval = basicFormData.alphaGroup;
    } else {
      alphaGroupId = null;
      alphaGroupNameval = null;
    }

    let groupId;
    if (basicFormData.selectGroup) {
      groupId = basicFormData.selectGroup;
    } else if (this.groupName) {
      groupId = 0;
    } else {
      groupId = null;
    }
    if (this.rawMaterialAttributes.acidValue) {
      this.carboxylEquivalentWeight = 56100 / this.rawMaterialAttributes.acidValue;
      this.rawMaterialAttributes.carboxylEquivalentWeight = this.carboxylEquivalentWeight;
    } else {
      this.carboxylEquivalentWeight = null;
    }

    if (this.rawMaterialAttributes.hydroxylValue) {
      this.polyesterWeight = 56100 / this.rawMaterialAttributes.hydroxylValue;
      this.rawMaterialAttributes.polyesterWeight = this.polyesterWeight;
    } else {
      this.polyesterWeight = null;
    }


    const saveRamMaterialObj = {
      group_id: groupId,
      group_name: this.groupName,
      // tslint:disable-next-line:radix
      type_of_group_id: parseInt(this.groupType),
      group_no: this.groupId,
      raw_material: this.basicRawMaterialObj.nameRawMaterial,
      manufacture_name: manfacturerName,
      manufacture_id: manfactureId,
      techcoord_name: coordinatorNameval,
      techcoord_id: coordinatorId,
      rm_no: basicFormData.rmId,
      alpha_group_id: alphaGroupId,
      alpha_group: alphaGroupNameval,
      specific_gravity: basicFormData.specialGravity ,
      acid_value: this.rawMaterialAttributes.acidValue ,
      components: this.rawMaterialAttributes.components,
      cas_no: this.rawMaterialAttributes.casNumber,
      unsat_eq_wt: this.rawMaterialAttributes.unsaturatedEquivalentWeight ,
      nco_eq_wt: this.rawMaterialAttributes.ncoEquivalentWeight ,
      hyd_eq_wt: this.rawMaterialAttributes.hydroxylEquivalentWeight ,
      polyester: this.polyesterWeight,
      Amino_eq_wt: this.rawMaterialAttributes.aminoHydrogenEquivalentWeight,
      carboxyl_eq_wt: this.carboxylEquivalentWeight,
      epoxy_eq_wt: this.rawMaterialAttributes.epoxyEquivalentWeight,
      oil_abs: this.rawMaterialAttributes.oilAbsorption ,
      hydroxyl_value: this.rawMaterialAttributes.hydroxylValue ,
      eq_wt: this.rawMaterialAttributes.equivalentWeight ,
      density: this.rawMaterialAttributes.density,
      active_status: true,
      id: 0,
      durability_ids: this.basicRawMaterialObj.durability ? this.basicRawMaterialObj.durability : []
    };
    this.usersServiceService.addRawMaterialGroup(saveRamMaterialObj).subscribe(
      (res) => {
      this.dialogRef.close(true);

        // this.spinner.hide();
        // this.toastr.success('Added Successfully');
      },
      (err) => {
        this.toastr.error(err.error.errorMessage);
        this.spinner.hide();
        this.toastr.error(err.error.errorMessage);
        // this.dialogRef.close(false);

      }
    );
  }
  valid(e) {
    const t = e.target.value;
    e.target.value = (t.indexOf('.') >= 0) ? (t.substr(0, t.indexOf('.')) + t.substr(t.indexOf('.'), 4)) : t;
    // tslint:disable-next-line:radix
    // let sg: number = parseInt(this.basicRawMaterialObj.specialGravity);
    // this.basicRawMaterialObj.specialGravity = parseFloat(this.basicRawMaterialObj.specialGravity).toFixed(2);
}

updateRawMaterialData(basicFormData) {
    this.spinner.show();
    let manfactureId;
    let manfacturerName;
    if (basicFormData.manufacture && basicFormData.manufacture.name) {
      manfactureId = basicFormData.manufacture.id;
      manfacturerName = basicFormData.manufacture.name;
    } else if (basicFormData.manufacture) {
      manfactureId = 0;
      manfacturerName = basicFormData.manufacture;
    } else {
      manfactureId = null;
      manfacturerName = null;
    }

    let coordinatorId;
    let coordinatorNameval;
    if (basicFormData.technicalCoordinator && basicFormData.technicalCoordinator.name) {
      coordinatorId = basicFormData.technicalCoordinator.id;
      coordinatorNameval = basicFormData.technicalCoordinator.name;
    } else if (basicFormData.technicalCoordinator) {
      coordinatorId = 0;
      coordinatorNameval = basicFormData.technicalCoordinator;
    } else {
      coordinatorId = null;
      coordinatorNameval = null;
    }

    let alphaGroupId;
    let alphaGroupNameval;
    if (basicFormData.alphaGroup && basicFormData.alphaGroup.name) {
      alphaGroupId = basicFormData.alphaGroup.id;
      alphaGroupNameval = basicFormData.alphaGroup.name;
    } else if (basicFormData.alphaGroup) {
      alphaGroupId = 0;
      alphaGroupNameval = basicFormData.alphaGroup;
    } else {
      alphaGroupId = null;
      alphaGroupNameval = null;
    }

    let groupId;
    if (basicFormData.selectGroup) {
      groupId = basicFormData.selectGroup;
    } else {
      groupId = 0;
    }
    if (this.rawMaterialAttributes.acidValue) {
      this.carboxylEquivalentWeight = 56100 / this.rawMaterialAttributes.acidValue;
      this.rawMaterialAttributes.carboxylEquivalentWeight = this.carboxylEquivalentWeight;
    } else {
      this.carboxylEquivalentWeight = null;
    }

    if (this.rawMaterialAttributes.hydroxylValue) {
      this.polyesterWeight = 56100 / this.rawMaterialAttributes.hydroxylValue;
      this.rawMaterialAttributes.polyesterWeight = this.polyesterWeight;
    } else {
      this.polyesterWeight = null;
    }


    const updateRamMaterialObj = {
      group_id: groupId,
      raw_material: this.basicRawMaterialObj.nameRawMaterial,
      manufacture_name: manfacturerName,
      manufacture_id: manfactureId,
      techcoord_name: coordinatorNameval,
      techcoord_id: coordinatorId,
      rm_no: this.basicRawMaterialObj.rmID,
      alpha_group_id: this.editRawMaterialGroup.alpha_group_id,
      alpha_group: this.editRawMaterialGroup.alpha_group,
      specific_gravity: basicFormData.specialGravity ,
      acid_value: this.rawMaterialAttributes.acidValue ,
      components: this.rawMaterialAttributes.components,
      cas_no: this.rawMaterialAttributes.casNumber,
      unsat_eq_wt: this.rawMaterialAttributes.unsaturatedEquivalentWeight ,
      nco_eq_wt: this.rawMaterialAttributes.ncoEquivalentWeight ,
      hyd_eq_wt: this.rawMaterialAttributes.hydroxylEquivalentWeight ,
      polyester: this.polyesterWeight,
      Amino_eq_wt: this.rawMaterialAttributes.aminoHydrogenEquivalentWeight,
      carboxyl_eq_wt: this.carboxylEquivalentWeight,
      epoxy_eq_wt: this.rawMaterialAttributes.epoxyEquivalentWeight,
      oil_abs: this.rawMaterialAttributes.oilAbsorption ,
      hydroxyl_value: this.rawMaterialAttributes.hydroxylValue ,
      eq_wt: this.rawMaterialAttributes.equivalentWeight ,
      density: this.rawMaterialAttributes.density,
      active_status: true,
      id: this.editRawMaterialGroup.id,
      durability_ids: this.basicRawMaterialObj.durability ? this.basicRawMaterialObj.durability : []
    };
    console.log(updateRamMaterialObj);
    this.usersServiceService.updateRawMaterial(updateRamMaterialObj).subscribe(
      (res) => {
        // this.spinner.hide();
        this.dialogRef.close(true);

      },
      (err) => {
        // this.dialogRef.close(false );
        this.spinner.hide();
        this.toastr.error(err.error.errorMessage);
        this.toastr.error(err.error.errorMessage);

      }
    );

  }

rawMaterialData(formdata) {
  if (this.data.addgroup) {
    this.saveRawMaterialData(formdata);
  } else {
    this.updateRawMaterialData(formdata);
  }
}

closeDialog() {
  this.dialogRef.close(false);
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

getAllAlhpaGroups() {
    this.usersServiceService.getAllAlhpaGroups().subscribe(
      (res) => {
        this.alphaGroups = res.data;
      },
      (err) => {
        this.toastr.error(err.error.errorMessage);
        this.toastr.error(err.error.errorMessage);

      }
    );
  }

rawMaterialGroupExists() {
    this.rawMaterialGroupExist = !this.rawMaterialGroupExist;
  }

onFocused(e) {
    // do something
  }

getAllManufactures() {
    this.usersServiceService.getAllManufactures().subscribe(
      (res) => {
        this.manufactures = res.data;
      },
      (err) => {
        this.toastr.error(err.error.errorMessage);
      }
    );
  }


  getAllCoordinator()  {
    this.usersServiceService.getAllTechnicalCoordinators().subscribe(
      (res) => {
        this.coordinator = res.data;
      },
      (err) => {
        this.toastr.error(err.error.errorMessage);
      }
    );
  }

getAllDurability() {
    this.usersServiceService.getAllDurability().subscribe(
      (res) => {
        this.durabile = res.data;
      },
      (err) => {
        this.toastr.error(err.error.errorMessage);
      }
    );
  }
  getAllRawMaterials() {
    this.usersServiceService.getAllRawMaterialGroups().subscribe(
      (res) => {
        this.rawMaterialdata = res.data;
      },
      (err) => {
        this.toastr.error(err.error.errorMessage);
      }
    );
  }
}

// Raw-Material View

import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-view-raw-material',
  templateUrl: 'dialog-view-raw-material.component.html',
  providers: [],
})

export class DialogViewRawMaterialComponent implements OnInit {

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
  // tslint:disable-next-line:variable-name
  local_data: any;


  constructor( @Inject(MAT_DIALOG_DATA) public data: RawMaterialComponent, private usersServiceService: UsersServiceService ) {
    this.local_data = data[0];
   // console.log (JSON.stringify(this.local_data)) ;
    this.localRawMaterial = this.local_data.raw_material;
    // .raw_material
  }

  ngOnInit() {
    this.getAllTreeData();
    this.getTreeData(0);
  }

  getAllTreeData() {
    this.usersServiceService.getAllRawMaterailTreeData().subscribe((res) => {
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
    this.usersServiceService.getAllRawMaterailTreeData().subscribe((res) => {
      // tslint:disable-next-line:no-string-literal
      this.currentTabData = res.data[index];
      // tslint:disable-next-line:no-string-literal
      this.productLevels = res.data;
      this.items = [new TreeviewItem(res.data[index])];
  });

  }

}


// @Component({
//   // tslint:disable-next-line:component-selector
//   selector: 'dialog-edit-group',
//   templateUrl: 'dialog-edit-group.component.html',
//   providers: [],
// })

// export class DialogEditRawMaterialComponent implements OnInit {
//   groupname: string;
//   grouptype: string;
//   // tslint:disable-next-line:variable-name
//   local_data: any;
//   manufactures: any;
//   manufacture: any;
//   // tslint:disable-next-line:typedef-whitespace
//   keyword = 'name';
//   manufacturename: any;
//   testvar: string;
//   manufacturer: any;
//   gravity: any;
//   coordinator: any;
//   durabile: any;
//   alphaGroups: any;
//   groupType: any;
//   groupName: null;
//   groupId: null;
//   carboxylEquivalentWeight: number;
//   polyesterWeight: number;
//   editRawMaterialGroup: any;
//   rawMaterialdata: any;
//   constructor(
//       @Inject(MAT_DIALOG_DATA) public data: RawMaterialComponent,
//       private usersServiceService: UsersServiceService,
//       private toastr: ToastrService,
//       private spinner: NgxSpinnerService,
//       public dialogRef: MatDialogRef<DialogAddGroupComponent>
//   ) {this.local_data = data ; }

//   public isLinear = true;
//   // tslint:disable-next-line:semicolon
//   public basicRawMaterialObj: basicRawForm = {
//     selectGroup: '',
//     rmID: null,
//     nameRawMaterial: '',
//     alphaGroup: '',
//     manufacture: '',
//     technicalCoordinator: '',
//     specialGravity: null,
//     durability: '',

//   };
//   public rawMaterialAttributes: rawAttributes = {
//     density: null,
//     equivalentWeight: null,
//     acidValue: null,
//     hydroxylValue: null,
//     oilAbsorption: null,
//     epoxyEquivalentWeight: null,
//     carboxylEquivalentWeight: null,
//     aminoHydrogenEquivalentWeight: null,
//     polyesterWeight: null,
//     hydroxylEquivalentWeight: null,
//     ncoEquivalentWeight: null,
//     unsaturatedEquivalentWeight: null,
//     casNumber: null,
//     components: ''
//   };
//   public rawMaterialGroupExist = false;
//   filterednameOptions: Observable<string[]>;
//   mynameControl = new FormControl();


//   ngOnInit() {
//     this.getAllManufactures();
//     this.getAllDurability();
//     this.getAllCoordinator();
//     this.getAllAlhpaGroups();
//     this.getAllRawMaterials();
//     const editId = this.local_data.selected[0].id;
//     this.usersServiceService.getRawMaterial(editId).subscribe(res => {
//       this.editRawMaterialGroup = res.data;
//       this.basicRawMaterialObj.selectGroup = this.editRawMaterialGroup.group_id;
//       this.basicRawMaterialObj.rmID = this.editRawMaterialGroup.rm_no;
//       this.basicRawMaterialObj.nameRawMaterial = this.editRawMaterialGroup.raw_material;
//       this.basicRawMaterialObj.alphaGroup = this.editRawMaterialGroup.alpha_group;
//       this.basicRawMaterialObj.manufacture = this.editRawMaterialGroup.manufacture_name;
//       this.basicRawMaterialObj.technicalCoordinator = this.editRawMaterialGroup.techcoord_name;
//       this.basicRawMaterialObj.specialGravity = this.editRawMaterialGroup.specific_gravity;
//       this.basicRawMaterialObj.durability = this.editRawMaterialGroup.durability;
//       this.rawMaterialAttributes.density = this.editRawMaterialGroup.density;
//       this.rawMaterialAttributes.equivalentWeight = this.editRawMaterialGroup.eq_wt;
//       this.rawMaterialAttributes.acidValue = this.editRawMaterialGroup.acid_value;
//       this.rawMaterialAttributes.hydroxylValue = this.editRawMaterialGroup.hydroxyl_value;
//       this.rawMaterialAttributes.oilAbsorption = this.editRawMaterialGroup.oil_abs;
//       this.rawMaterialAttributes.epoxyEquivalentWeight = this.editRawMaterialGroup.epoxy_eq_wt;
//       this.rawMaterialAttributes.carboxylEquivalentWeight = this.editRawMaterialGroup.carboxyl_eq_wt;
//       this.rawMaterialAttributes.aminoHydrogenEquivalentWeight = this.editRawMaterialGroup.Amino_eq_wt;
//       this.rawMaterialAttributes.polyesterWeight = this.editRawMaterialGroup.polyester;
//       this.rawMaterialAttributes.hydroxylEquivalentWeight = this.editRawMaterialGroup.hyd_eq_wt;
//       this.rawMaterialAttributes.ncoEquivalentWeight = this.editRawMaterialGroup.nco_eq_wt;
//       this.rawMaterialAttributes.unsaturatedEquivalentWeight = this.editRawMaterialGroup.unsat_eq_wt;
//       this.rawMaterialAttributes.casNumber = this.editRawMaterialGroup.cas_no;
//       this.rawMaterialAttributes.components = this.editRawMaterialGroup.components;
//   });
//   }


//   selectEvent(item) {
//    // this.manufacture = item.id;
//     // do something with selected item
//   }

//   onChangeSearch(search: string) {
//    // this.testvar = search;
//     // fetch remote data from here
//     // And reassign the 'data' which is binded to 'data' property.
//   }

//   updateRawMaterialData(basicFormData) {
//     this.spinner.show();
//     console.log('basicFormData', basicFormData);
//     console.log('grouptype', this.basicRawMaterialObj.selectGroup);

//     let manfactureId;
//     let manfacturerName;
//     if (basicFormData.manufacture && basicFormData.manufacture.name) {
//       manfactureId = basicFormData.manufacture.id;
//       manfacturerName = basicFormData.manufacture.name;
//     } else if (basicFormData.manufacture) {
//       manfactureId = 0;
//       manfacturerName = basicFormData.manufacture;
//     } else {
//       manfactureId = null;
//       manfacturerName = null;
//     }

//     let coordinatorId;
//     let coordinatorNameval;
//     if (basicFormData.technicalCoordinator && basicFormData.technicalCoordinator.name) {
//       coordinatorId = basicFormData.technicalCoordinator.id;
//       coordinatorNameval = basicFormData.technicalCoordinator.name;
//     } else if (basicFormData.technicalCoordinator) {
//       coordinatorId = 0;
//       coordinatorNameval = basicFormData.technicalCoordinator;
//     } else {
//       coordinatorId = null;
//       coordinatorNameval = null;
//     }

//     let alphaGroupId;
//     let alphaGroupNameval;
//     if (basicFormData.alphaGroup && basicFormData.alphaGroup.name) {
//       alphaGroupId = basicFormData.alphaGroup.id;
//       alphaGroupNameval = basicFormData.alphaGroup.name;
//     } else if (basicFormData.alphaGroup) {
//       alphaGroupId = 0;
//       alphaGroupNameval = basicFormData.alphaGroup;
//     } else {
//       alphaGroupId = null;
//       alphaGroupNameval = null;
//     }

//     let groupId;
//     if (basicFormData.selectGroup) {
//       groupId = basicFormData.selectGroup;
//     } else {
//       groupId = 0;
//     }
//     if (this.rawMaterialAttributes.acidValue) {
//       this.carboxylEquivalentWeight = 56100 / this.rawMaterialAttributes.acidValue;
//       this.rawMaterialAttributes.carboxylEquivalentWeight = this.carboxylEquivalentWeight;
//     } else {
//       this.carboxylEquivalentWeight = null;
//     }

//     if (this.rawMaterialAttributes.hydroxylValue) {
//       this.polyesterWeight = 56100 / this.rawMaterialAttributes.hydroxylValue;
//       this.rawMaterialAttributes.polyesterWeight = this.polyesterWeight;
//     } else {
//       this.polyesterWeight = null;
//     }


//     const updateRamMaterialObj = {
//       group_id: groupId,
//       raw_material: this.basicRawMaterialObj.nameRawMaterial,
//       manufacture_name: manfacturerName,
//       manufacture_id: manfactureId,
//       techcoord_name: coordinatorNameval,
//       techcoord_id: coordinatorId,
//       rm_no: basicFormData.rmId,
//       alpha_group_id: alphaGroupId,
//       alpha_group: alphaGroupNameval,
//       specific_gravity: basicFormData.specialGravity ,
//       acid_value: this.rawMaterialAttributes.acidValue ,
//       components: this.rawMaterialAttributes.components,
//       cas_no: this.rawMaterialAttributes.casNumber,
//       unsat_eq_wt: this.rawMaterialAttributes.unsaturatedEquivalentWeight ,
//       nco_eq_wt: this.rawMaterialAttributes.ncoEquivalentWeight ,
//       hyd_eq_wt: this.rawMaterialAttributes.hydroxylEquivalentWeight ,
//       polyester: this.polyesterWeight,
//       Amino_eq_wt: this.rawMaterialAttributes.aminoHydrogenEquivalentWeight,
//       carboxyl_eq_wt: this.carboxylEquivalentWeight,
//       epoxy_eq_wt: this.rawMaterialAttributes.epoxyEquivalentWeight,
//       oil_abs: this.rawMaterialAttributes.oilAbsorption ,
//       hydroxyl_value: this.rawMaterialAttributes.hydroxylValue ,
//       eq_wt: this.rawMaterialAttributes.equivalentWeight ,
//       density: this.rawMaterialAttributes.density,
//       active_status: true,
//       id: this.editRawMaterialGroup.id,
//       durability_ids: this.basicRawMaterialObj.durability ? this.basicRawMaterialObj.durability : []
//     };
//     this.usersServiceService.updateRawMaterial(updateRamMaterialObj).subscribe(
//       (res) => {
//         this.spinner.hide();
//         this.toastr.success('Added Successfully');
//       },
//       (err) => {
//         this.toastr.error(err.error.errorMessage);
//         this.toastr.error('Failed');
//       }
//     );

//     this.dialogRef.close();

//   }

//   getAllAlhpaGroups() {
//     this.usersServiceService.getAllAlhpaGroups().subscribe(
//       (res) => {
//         this.alphaGroups = res.data;
//       },
//       (err) => {
//         this.toastr.error(err.error.errorMessage);
//       }
//     );
//   }

//   rawMaterialGroupExists() {
//     this.rawMaterialGroupExist = !this.rawMaterialGroupExist;
//   }

//   onFocused(e) {
//     // do something
//   }

//   getAllManufactures() {
//     this.usersServiceService.getAllManufactures().subscribe(
//       (res) => {
//         this.manufactures = res.data;
//       },
//       (err) => {
//         this.toastr.error(err.error.errorMessage);
//       }
//     );
//   }


//   getAllCoordinator() {
//     this.usersServiceService.getAllTechnicalCoordinators().subscribe(
//       (res) => {
//         this.coordinator = res.data;
//       },
//       (err) => {
//         this.toastr.error(err.error.errorMessage);
//       }
//     );
//   }

//   getAllRawMaterials() {
//     this.usersServiceService.getAllRawMaterial().subscribe(
//       (res) => {
//         this.rawMaterialdata = res.data;
//       },
//       (err) => {
//         this.toastr.error(err.error.errorMessage);
//       }
//     );
//   }


//   getAllDurability() {
//     this.usersServiceService.getAllDurability().subscribe(
//       (res) => {
//         this.durabile = res.data;
//       },
//       (err) => {
//         this.toastr.error(err.error.errorMessage);
//       }
//     );
//   }
// }

