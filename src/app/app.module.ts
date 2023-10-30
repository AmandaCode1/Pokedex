import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { PieDePaginaComponent } from './pie-de-pagina/pie-de-pagina.component';
import { ListaComponent } from './lista/lista.component';
import { InformacionDetalladaComponent } from './informacion-detallada/informacion-detallada.component';

@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    PieDePaginaComponent,
    ListaComponent,
    InformacionDetalladaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
