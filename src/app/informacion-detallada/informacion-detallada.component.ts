import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { detallePokemon } from '../model/detallePokemon';
import { evoluciones } from '../model/evoluciones';
//import { evoluciones } from '../model/evoluciones';
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
  especieElegida: any;
  idEvolucion: number = 0;
  evolucionElegida: any;
  triggerElegido: any[] = [];
  evolucionaA: any[] = [];
  todasEvoluciones: evoluciones[] = [];
  //todosTriggers: trigger[] = [];
  listaMovimientos: any[] = [];
  movimGeneracion: any[] = [];
  nombresMovimientos: string[] = [];
  movesPokemon: any[] = [];
  movimientosOK: string[] = [];


  constructor(private ruta: ActivatedRoute, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.cargarDetallesPokemon();
    this.tipoPorId();
    //this.getTodasEvoluciones();
    //this.getTodosTriggers();
    //this.movimientos();
    this.movimientosPokemon();
    //this.movimientosGeneracion('terrain-pulse');
  }

  /*movimientos(){
    this.pokemonService.getMovimientos().subscribe((data: any) => {
      //console.log('movimientos: ', data);
      this.listaMovimientos = data.results;
      console.log('movimientos: ', this.listaMovimientos);

      this.listaMovimientos.forEach((movimiento) => {
        const nombre = movimiento.name;
        this.nombresMovimientos.push(nombre);
        console.log(this.nombresMovimientos);
      });
    });
  }*/

  movimientosPokemon(){
    this.ruta.params.subscribe(params => {
      const id = params['id'];

      this.pokemonService.getIdDetallePokemon(id).subscribe((data: any) => {
        this.movesPokemon = data.moves;
        console.log('Movimientos de este pokemon: ', this.movesPokemon);
        this.nombresMovimientos = this.movesPokemon.map(move => move.move.name);
        //console.log('Nombres movimientos: ', this.nombresMovimientos);
        this.nombresMovimientos.forEach(nombre => this.movimientosGeneracion(nombre));
        console.log('Resultado filtro por generaciones', this.movimientosOK);
      });
    });
  }
  
  //para saber de que generacion es el movimiento
  movimientosGeneracion(name: string){
    this.pokemonService.getDetalleMovimiento(name).subscribe((data: any) => {
      console.log('Detalles del movimiento:', data);
      const nombre = data.name;
      //categoria = demage_class.name = "status"
      //tipo = type.name = "normal"
      //potencia(fuerza) = power = 40
      //precision(exactitud) = accurancy = 100
      //como se obtiene
      const generacion = data.generation.name;
      //console.log('La generacion del movimiento ', nombre,' es ', generacion);
      if(generacion == 'generation-i' || generacion == 'generation-ii' || generacion == 'generation-iii' || generacion == 'generation-iv'){
        this.movimientosOK.push(nombre);
      }
      //console.log(this.movimientosOK);
    })
  }
      /*const generaciones = ['generation-i', 'generation-ii', 'generation-iii', 'generation-iv'];

      this.movimGeneracion = this.listaMovimientos.filter((move) => {
        return generaciones.some((generation) => move.generation.name == generation);
      });*/
    

  evolucionar(){
    console.log('Buscando evolucion');
    this.ruta.params.subscribe(params => {
      const id = params['id'];
      //Obtengo url pokemon-species/id
      const urlEvo = this.pokemonService.getIdDescripcionPokemon(id).subscribe(
        respuesta=>{
          this.especieElegida = respuesta;
          console.log('especie: ', this.especieElegida);
          console.log('cadena evolucion: ', this.especieElegida.evolution_chain.url);
          //Trocea la url para conseguir el id de evolucion
          let trozosUrl = this.especieElegida.evolution_chain.url.split('/');
          this.idEvolucion = trozosUrl[trozosUrl.length - 2];//-2 porque es la penultima parte
          console.log('id evolucion', this.idEvolucion);
          this.getEvolucion(this.idEvolucion);
        }
      );
    }
    );
  }

  //parte evolucion a, de la url de evoluciones por especie
  getEvolucion(idEvo:number) {
    this.pokemonService.getIdEvolucion(idEvo).subscribe(
      respuesta=>{
        this.evolucionElegida = respuesta;
        console.log('evolucion elegida: ', this.evolucionElegida);
        console.log('array evoluciones: ', this.evolucionElegida.chain.evolves_to);
        //this.triggerElegido = this.evolucionElegida.chain.evolves_to.;
        //this.triggerElegido.push(this.evolucionElegida.chain.evolution_details);
        //console.log("triggerElegido: ", this.evolucionElegida.chain.evolves_to);
        this.ObtenerEvoluciones(this.evolucionElegida.chain.evolves_to);
      }
    )
  }

  //Datos de los triggers de las evoluciones, lo cargo
  //los elementos de 
  getTodosTriggers(){
    
  }

  //los arrays de evolves_to
  ObtenerEvoluciones(array: any[]){
    let evoluciones: any[] = array;
    //let triggers: any[] = array;
    //this.evolucionaA = [];
    while(evoluciones.length > 0){
      for(let i = 0; i < evoluciones.length; i++){
        let evolucion = evoluciones[i].species;
        //let trigger = evoluciones[i].evolution_details[0];
        this.evolucionaA.push(evolucion);
        //this.triggerElegido.push(trigger);
        if(evoluciones[i].evolves_to){
          evoluciones.push(...evoluciones[i].evolves_to);
        }
        //if(evoluciones[i].evolution_details[0]){
          //triggers.push(...evoluciones[i].evolution_details[0]);
        //}
      }
      evoluciones = evoluciones.slice(evoluciones.length);
      //triggers = evoluciones.slice(evoluciones.length);


      //for Recorre todas las posiciones del array, no solo la 0
      /*let evolucion = evoluciones[0].species;//Aqui cojo solo la posicion 0 del array, y en el caso de evee hay 8
      this.evolucionaA.push(evolucion);
      evoluciones = evoluciones[0].evolves_to;*/
    }
    console.log('triggersElegido: ', this.triggerElegido);
    console.log('evolucionaA: ', this.evolucionaA);
    this.getTodasEvoluciones();
  }

  //Datos de los pokemon de las evoluciones, lo que cargo
  getTodasEvoluciones(){
    this.evolucionaA.forEach(p => {
      this.pokemonService.getPokemonNombre(p.name).subscribe(
        respuesta => {
          const pokemonInfo = {
            name: respuesta.name,
            img: respuesta.sprites.front_default
          };
          this.todasEvoluciones.push(pokemonInfo);
        }
      );
    });
    console.log('Evoluciones final: ', this.todasEvoluciones);
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
    
    if(this.tipo.length == 1){
      this.efectividadSeleccionada = this.Efectividades.filter(filtro => this.tipo.includes(filtro.id));
      console.log('filtrado en json si hay mas de un tipo', this.efectividadSeleccionada);
    } else {
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
