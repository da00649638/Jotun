import { Component, OnInit } from '@angular/core';
import { AddProductFormulationService } from '../services/add-product-formulation.service';

@Component({
  selector: 'app-add-formulation-product',
  templateUrl: './add-formulation-product.component.html',
  styleUrls: ['./add-formulation-product.component.scss']
})
export class AddFormulationProductComponent implements OnInit {
  public addProductArr = [];
  public productDetailsObj = {
    productName: '',
    productCopy: '',
    status: '',
    productId: '',
    standardId: '',
    version: '',
    color: '',
    colorGroup: '',
    totalBinder: '',
    scallingFactor: ''
  };
  public productCopyOptions = [];
  public colorOptions = [];
  public colorGroupOptions = [];
  public processStepsArr = [];
  public hideProcessSteps = false;
  constructor( private productFormulation: AddProductFormulationService) { }

  ngOnInit() {
    this.productFormulation.getAddProductDetails().subscribe(res => {
      this.addProductArr = res;
      console.log(res, 'response');
    });
    this.productFormulation.getproductOfCopy().subscribe(res => {
      this.productCopyOptions = res;
      console.log(res, 'response');
    });
    this.productFormulation.getcolourGroup().subscribe(res => {
      this.colorGroupOptions = res;
      console.log(res, 'response');
    });
    this.productFormulation.getcolourOptions().subscribe(res => {
      this.colorOptions = res;
      console.log(res, 'response');
    });
    this.productFormulation.getProductsSteps().subscribe(res => {
      this.processStepsArr = res;
      console.log(res, 'response');
    });
  }
  lockProductData(Productdata) {
    console.log('Productdata', Productdata);
  }
  openProcessSteps() {
    this.hideProcessSteps = true;
  }
}
