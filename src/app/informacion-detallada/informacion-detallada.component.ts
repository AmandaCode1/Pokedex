import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { detallePokemon } from '../model/detallePokemon';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, map } from 'rxjs';
import { Efectividad } from '../model/efectividades';
import tablaEfectividades from 'src/assets/json/efectividades.json';

@Component({
  selector: 'app-informacion-detallada',
  templateUrl: './informacion-detallada.component.html',
  styleUrls: ['./informacion-detallada.component.css']
})
export class InformacionDetalladaComponent implements OnInit {

  detallePokemon: detallePokemon | undefined;
  descrip: any;
  //efectividades: Efectividad | undefined;
  Efectividades: any = tablaEfectividades;



  constructor(private ruta: ActivatedRoute, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.cargarDetallesPokemon();
    //this.cargarEfectividades();
  }

  cargarDetallesPokemon() {
    //Obtenemos el id de la url que se abre al hacer clic en un pokemon
    this.ruta.params.subscribe(params => {
      const id = params['id'];
      //manejamos dos respuestas cn el forkjoin
      forkJoin({
        detPokemon: this.pokemonService.getIdDetallePokemon(id),
        descrip: this.pokemonService.getIdDescripcionPokemon(id)
      }).subscribe(
        ({ detPokemon, descrip }) => {
          this.detallePokemon = this.pokemonService.getDetallePokemon(detPokemon, descrip);
        },
        (error: any) => {
          console.log('Error obteniendo descripcion del pokemon', error);
        }
      );
    });
  }

  /*cargarEfectividades() {
    //Obtenemos el id de la url que se abre al hacer clic en un pokemon
    this.ruta.params.subscribe(params => {
      const id = params['id'];
      
      this.pokemonService.getTipoPorId(id).subscribe(
        (tipos: string[]) => {
          this.pokemonService.getEfectividades(tipos[0]).subscribe(
            (efectividades: Efectividad) => {
              console.log('Respuesta del servicio:', efectividades);
              this.efectividades = efectividades;
            },
            error => {
              console.log('Error al cargar efectividades', error);
            }
          );
          },
          error => {
            console.log('Error al obtener tipos', error);
          }
        );
    });
  }*/

      
}
