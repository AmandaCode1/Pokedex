import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  [x: string]: any;

  constructor(private translate: TranslateService){
    this.translate.addLangs(['en', 'es']);
    const idioma = this.translate.getBrowserLang();
    if(idioma !== 'en' && idioma !== 'es'){
      this.translate.setDefaultLang('es');
    } else {
      this.translate.use(idioma);
    }
  }

  ngOnInit(){
  }

}
