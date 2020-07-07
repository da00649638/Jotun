import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UsersServiceService } from '../services/users-service.service';
import { PeriodicElement } from '../table-grid/table-grid.component';
import { trigger, transition, state, style, animate } from '@angular/animations';

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
  constructor(private usersServiceService: UsersServiceService) {
  }
  public rawMaterialsArr = [];
  public dataSource: any;
  public selection: any;
  objectKeys = Object.keys;
  // tslint:disable-next-line:member-ordering
  expandedElement = '';
  displayedColumns: string[] = ['select', 'group_name', 'rm_id', 'raw_material', 'aphla_group', 'manufacture'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('filter', {static: true}) filter: ElementRef;

  ngOnInit() {
    this.usersServiceService.rawMaterials().subscribe(res => {
     this.rawMaterialsArr = res;
     this.dataSource = new MatTableDataSource(this.rawMaterialsArr);
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
   /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  removeSpecialSymbol(columnText) {
    debugger
    return columnText.replace('_', ' ');
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
