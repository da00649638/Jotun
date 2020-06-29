import { Component, OnInit } from '@angular/core';
import { TreeModel } from 'ng2-tree';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})

export class TreeViewComponent implements OnInit {

  public tree: TreeModel = {
    value: 'Programming languages by programming paradigm',
    children: [
      {
        value: 'Object-oriented programming',
        children: [{ value: 'Java' }, { value: 'C++' }, { value: 'C#' }]
      },
      {
        value: 'Prototype-based programming',
        children: [{ value: 'JavaScript' }, { value: 'CoffeeScript' }, { value: 'Lua' }]
      }
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
