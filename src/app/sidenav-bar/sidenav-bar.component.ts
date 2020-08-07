import { Component, OnInit } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-sidenav-bar',
  templateUrl: './sidenav-bar.component.html',
  styleUrls: ['./sidenav-bar.component.scss']
})
export class SidenavBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    // tslint:disable-next-line:only-arrow-functions
    $('.dropdown-toggle').click(function() {
        $(this).parent().siblings().children('.dropdown-toggle').attr('aria-expanded', 'false');
        $(this).parent().siblings().children('ul').removeClass('show');
    });
  }

}
