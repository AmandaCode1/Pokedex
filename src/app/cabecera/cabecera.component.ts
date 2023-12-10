import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent { 

  //modoOscuro: boolean = false;

  //opciones del spinner (idioma)
  opciones = [
    {valor: 'es', muestra: "Español"},
    {valor: 'en', muestra: "English"}
  ]

  constructor(private translate: TranslateService){}

  //para cuando se seleccione un elemento del spinner (ingles o español)
  idioma(event:Event) {
    const idioma = (event.target as HTMLSelectElement).value;
    this.translate.use(idioma);
  }

  /*cambiarModo() {
    this.modoOscuro = !this.modoOscuro
  }*/

}
