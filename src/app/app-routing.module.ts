import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaComponent } from './lista/lista.component';
import { InformacionDetalladaComponent } from './informacion-detallada/informacion-detallada.component';
import { Pagina404Component } from './pagina404/pagina404.component';

const routes: Routes = [
  { path: 'lista', component: ListaComponent },
  { path: 'detalle/:id', component: InformacionDetalladaComponent },
  { path: '', redirectTo: '/lista', pathMatch: 'full' },
  { path: '**', component: Pagina404Component },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
