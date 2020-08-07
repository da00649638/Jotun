import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-formulation-handbook',
  templateUrl: './formulation-handbook.component.html',
  styleUrls: ['./formulation-handbook.component.scss']
})
export class FormulationHandbookComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openFilterFormulationDialog(): void {
    const dialogRef = this.dialog.open(DialogFormulationFilterComponent, {
      width: '782px',
      height: '546px',
      panelClass: 'my-dialog-container-class',
      // data: this.viewPigmentation
      data: ''
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
      // this.tableUpdation();
    });
  }
}
@Component({
  selector: 'app-dialog-formulation-filter',
  templateUrl: 'dialog-formulation-filter.component.html',
  providers: [],
})
export class DialogFormulationFilterComponent implements OnInit {
  constructor() { }
  public filterSearch = '';
  public filterObj: {
    filterSearch: '',
  };
  ngOnInit() {
  }
  applyFilter(filterData) {
    console.log('filterData', filterData);
  }
}
