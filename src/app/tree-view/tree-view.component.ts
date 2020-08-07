import { Component, OnInit } from '@angular/core';
import { UsersServiceService } from '../services/users-service.service';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})

export class TreeViewComponent implements OnInit {
  treeData: any;

  constructor(private usersServiceService: UsersServiceService) {
  }
  ngOnInit() {
    this.usersServiceService.getUserGroupTreeData().subscribe(res => {
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
  //  parentObj.read = true;
   // levelObj.read = true;
 // }
}

}
