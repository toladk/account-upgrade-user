import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/authentication/services/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
  }

  logout(): void{
    this.tokenService.logout();
  }

}
