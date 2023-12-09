import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent { 

  opciones = [
    {valor: 'es', muestra: "Español"},
    {valor: 'en', muestra: "English"}
  ]

  constructor(private translate: TranslateService){}

  idioma = (event:Event) => {
    const idioma = (event.target as HTMLSelectElement).value;
    this.translate.use(idioma);
  }

}
