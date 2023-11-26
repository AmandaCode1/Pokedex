import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { detallePokemon } from '../model/detallePokemon';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import tablaEfectividades from 'src/assets/json/efectividades.json';

@Component({
  selector: 'app-informacion-detallada',
  templateUrl: './informacion-detallada.component.html',
  styleUrls: ['./informacion-detallada.component.css']
})
export class InformacionDetalladaComponent implements OnInit {

  detallePokemon: detallePokemon | undefined;
  descrip: any;
  Efectividades: any[] = tablaEfectividades;
  efectividadSeleccionada: any[] = [];
  auxMuyEf: any[] = [];
  auxMuyRes: any[] = [];
  tipo: string[] = [];

  constructor(private ruta: ActivatedRoute, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.cargarDetallesPokemon();
    this.tipoPorId();
  }

  tipoPorId(){
    this.ruta.params.subscribe(params => {
      const id = params['id'];

      this.pokemonService.getTipoPorId(id).subscribe(
        tipos => {
          this.tipo = tipos.types;
          console.log('tipos por id', this.tipo);

          this.cargarJson();
        },
        error => {
          console.log('Error obteniendo tipos', error);
        }
      );
    });
  }

  cargarJson(){
    console.log('Este es el resultado de cargar json', this.tipo);
    console.log('Efectividades:', this.Efectividades);
    
    if(this.tipo.length > 1){
      this.efectividadSeleccionada = this.Efectividades.filter(filtro => this.tipo.includes(filtro.id));
      console.log('filtrado en json si hay mas de un tipo', this.efectividadSeleccionada);
      const nuevosEficaces = this.efectividadSeleccionada[0].EficazContra;

      //const nuevaEfectividadSeleccionada = [...this.efectividadSeleccionada];
      for(let i = 0; i < this.efectividadSeleccionada.length; i++){
        for(let j = i + 1; j < this.efectividadSeleccionada.length; j++){
          const tipo1 = this.efectividadSeleccionada[i];
          console.log('Tipo1:', tipo1 );
          const tipo2 = this.efectividadSeleccionada[j];
          console.log('Tipo2:', tipo2 );

          //Comparo elementos de EficazContra
          const nuevosEficaces = [];
          for(let tipo11 of tipo1.EficazContra){
            //let encontrado = false;
            for(let tipo22 of tipo2.EficazContra){
              if(tipo11 === tipo22){
                this.auxMuyEf.push(tipo22);
                //encontrado = true;
                console.log('Elemento del array Muyeficaz: ',tipo11);
                break;//Para que salga del bucle una vez lo encuentre
              } //else {
                //nuevosEficaces.push(tipo22);
              //}
            }
          }
          //Comparo elementos de MuyResistente
          //const nuevosResistentes = [];
          for(let tipo11 of tipo1.DebilContra){
            //let encontrado = false;
            for(let tipo22 of tipo2.DebilContra){
              if(tipo11 === tipo22){
                this.auxMuyRes.push(tipo11);
                //encontrado = true;
                console.log('Elemento del array MuyResis: ',tipo11);
                break;
              } 
            }
          }
        }

      }

      this.efectividadSeleccionada[0].EficazContra.push(...this.efectividadSeleccionada[1].EficazContra);
      console.log('eficazContra antes ', this.efectividadSeleccionada[0].EficazContra);
      const setEficazContra = new Set(this.efectividadSeleccionada[0].EficazContra);
      this.efectividadSeleccionada[0].EficazContra = Array.from(setEficazContra);
      console.log('eficazContra despues ', this.efectividadSeleccionada[0].EficazContra);

      this.efectividadSeleccionada[0].DebilContra.push(...this.efectividadSeleccionada[1].DebilContra);
      console.log('debilContra antes ', this.efectividadSeleccionada[0].DebilContra);
      //Al convertir el array en un conjunto se eliminan los duplicados
      const setDebilContra = new Set(this.efectividadSeleccionada[0].DebilContra);
      //Vuelvo a convertirlo en array
      this.efectividadSeleccionada[0].DebilContra = Array.from(setDebilContra);
      console.log('debilContra despues del set ', this.efectividadSeleccionada[0].DebilContra);

      this.efectividadSeleccionada[0].InmuneA.push(...this.efectividadSeleccionada[1].InmuneA);
      console.log('InmuneA antes ', this.efectividadSeleccionada[0].InmuneA);
      const setInmuneA = new Set(this.efectividadSeleccionada[0].InmuneA);
      this.efectividadSeleccionada[0].InmuneA = Array.from(setInmuneA);
      console.log('InmuneA despues del set ', this.efectividadSeleccionada[0].InmuneA);

      this.efectividadSeleccionada.pop();
      console.log('despues de borrar el segundo tipo',this.efectividadSeleccionada);

    }
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

      //this.pokemonService.getJson()

    /*if(this.detallePokemon && this.detallePokemon.types){
      const tipos = this.detallePokemon.types.map((tipo: any) => tipo.type.name);

      this.pokemonService.getJson().subscribe(data =>{
        this.Efectividades = data;

        this.efectividadSeleccionada = tipos.map(type =>
          this.Efectividades.find(efectividad => efectividad.id === type)
          );
      });
    } else {
      console.log("detallepokemon es undefined")
    }*/
      
  
    /*.subscribe(data => {
      this.efectividades = data;
      this.seCargaJson = true;
    });*/

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
