import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { detallePokemon } from '../model/detallePokemon';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Efectividad } from '../model/efectividades';

@Component({
  selector: 'app-informacion-detallada',
  templateUrl: './informacion-detallada.component.html',
  styleUrls: ['./informacion-detallada.component.css']
})
export class InformacionDetalladaComponent implements OnInit {

  detallePokemon: detallePokemon | undefined;
  descrip: any;
  efectividades: Efectividad | undefined;


  constructor(private ruta: ActivatedRoute, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.cargarDetallesPokemon();
    this.cargarEfectividades();
  }

  cargarDetallesPokemon() {
    //Obtenemos el id de la url que se abre al hacer clic en un pokemon
    this.ruta.params.subscribe(params => {
      const id = params['id'];

      forkJoin({
        detPokemon: this.pokemonService.getIdDetallePokemon(id),
        descrip: this.pokemonService.getIdDescripcionPokemon(id),
        //debilidades: this.pokemonService.getDebilidades(id)
      }).subscribe(
        ({ detPokemon, descrip, /*debilidades*/ }) => {
          this.detallePokemon = this.pokemonService.getDetallePokemon(detPokemon, descrip);
          //this.detallePokemon.debilidades = debilidades;
        },
        (error: any) => {
          console.log('Error obteniendo descripcion del pokemon', error);
        }
      );
      /*//Obtengo los detalles del pokemon
      this.pokemonService.getIdDetallePokemon(id).subscribe(
        (detPokemon: any) => {
          //Obtengo la descripcion del pokemon
          this.pokemonService.getIdDescripcionPokemon(id).subscribe(
            (descrip: any) => {
              //Obtengo detalles
              this.detallePokemon = this.pokemonService.getDetallePokemon(detPokemon, descrip);
            },
            (error: any) => {
              console.log('Error obteniendo descripcion del pokemon', error);
            }
          );
        },
        (error: any) =>{
          console.log('Error obteniendo detalles del pokemon', error);
        }
      );*/
    });
  }


  /*cargaPokemon(){
    this.pokemonService.getPokemon(this.name).subscribe((data:any) => {
      this.urlImage = data.sprites.other.dream_world.front_default,
      this.tipo = data.types.map((tipo: any) => tipo.type.name);
    })
  }*/

  cargarEfectividades() {
    //Obtenemos el id de la url que se abre al hacer clic en un pokemon
    this.ruta.params.subscribe(params => {
      const id = params['id'];

        const efectividades: this.pokemonService.getEfectividades(getTipoPorId(id)),//Aqui quiero pasar como parametro el resultado de la funcion que devuelve los tipos
        }).subscribe(
          
        )
    });

  }

}
