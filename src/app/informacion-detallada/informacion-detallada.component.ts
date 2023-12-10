import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { detallePokemon } from '../model/detallePokemon';
import { evoluciones } from '../model/evoluciones';
import { movimientos } from '../model/movimientos';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import tablaEfectividades from 'src/assets/json/efectividades.json';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-informacion-detallada',
  templateUrl: './informacion-detallada.component.html',
  styleUrls: ['./informacion-detallada.component.css']
})
export class InformacionDetalladaComponent implements OnInit {

  detallePokemon: detallePokemon = {
    descripcion: '',
    vida: 0,
    velocidad: 0,
    ataque: 0,
    ataqueEspecial: 0,
    defensa: 0,
    defensaEspecial: 0,
    id: 0,
    name: '',
    image: '',
    imageShiny: '',
    types: [],
    peso: 0,
    altura: 0
  };
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
  nombresMovimientos: any[] = [];
  movesPokemon: any[] = [];
  movimientosNivelOK: any[] = [];
  movimientosMaquinaOK: any[] = [];
  interfMovimientos: movimientos = {
    nombre: "",
    tipo: '',
    categoria: '',
    potencia: 0,
    precision: 0,
  };
  
  //activateRouter para acceder a la id de la url
  constructor(private ruta: ActivatedRoute, private pokemonService: PokemonService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.cargarDetallesPokemon();
    this.tipoPorId();
    this.movimientosPokemon();
  }
  
  barravida():string{
    const vida = this.detallePokemon.vida*100/255;
    return `${vida}%`;
  }

  barravelocidad():string{
    const velocidad = this.detallePokemon.velocidad*100/255;
    return `${velocidad}%`;
  }
  barraataque():string{
    const ataque = this.detallePokemon.ataque*100/255;
    return `${ataque}%`;
  }
  barraAtaqueespecial():string{
    const ataqueespecial = this.detallePokemon.ataqueEspecial*100/255;
    return `${ataqueespecial}%`;
  }
  barradefensa():string{
    const defensa = this.detallePokemon.defensa*100/255;
    return `${defensa}%`;
  }
  barraDefensaespecial():string{
    const defensaespecial = this.detallePokemon.defensaEspecial*100/255;
    return `${defensaespecial}%`;
  }

////////DETALLES////////

  //Obtengo los detalles del pokemon y la descripcion
  cargarDetallesPokemon() {
    //Obtenemos el id de la url que se abre al hacer clic en un pokemon
    this.ruta.params.subscribe(params => {
      const id = params['id'];
      //manejamos dos respuestas cn el forkjoin
      forkJoin({
        //los detalles
        detPokemon: this.pokemonService.getIdDetallePokemon(id),
        //la descripcion (en una url distinta)
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

///////EFECTIVIDADES////////

  //Obtengo tipo o tipos del pokemon
  tipoPorId(){
    //Obtengo la id de la url del pokemon
    this.ruta.params.subscribe(params => {
      const id = params['id'];
      //para obtener el tipo/s del pokemon
      this.pokemonService.getTipoPorId(id).subscribe(
        tipos => {
          this.tipo = tipos.types;
          this.cargarJson();
        },
        error => {
          console.log('Error obteniendo tipos', error);
        }
      );
    });
  }

  //Leo json de efectividades creado y segun el tipo/s del pokemon, filtro el json y obtengo efectividades segun el tipo
  cargarJson(){
    //si el pokemon es de un tipo, filtro el json por ese tipo y obtengo efectividades
    if(this.tipo.length == 1){
      this.efectividadSeleccionada = this.Efectividades.filter(filtro => this.tipo.includes(filtro.id));
      //si es de dos tipos, filtro el json 
    } else {
      this.efectividadSeleccionada = this.Efectividades.filter(filtro => this.tipo.includes(filtro.id));
      //separo los tipos
      for(let i = 0; i < this.efectividadSeleccionada.length; i++){
        for(let j = i + 1; j < this.efectividadSeleccionada.length; j++){
          const tipo1 = this.efectividadSeleccionada[i];
          console.log('Tipo1:', tipo1 );
          const tipo2 = this.efectividadSeleccionada[j];
          console.log('Tipo2:', tipo2 );

          //Comparo elementos de EficazContra de los dos tipos
          for(let tipo11 of tipo1.EficazContra){
            for(let tipo22 of tipo2.EficazContra){
              //si el elemento de un tipo es igual a otro, agrego ese elemento a un array nuevo auxMuyEficaz
              if(tipo11 === tipo22){
                this.auxMuyEf.push(tipo22);
                break;//Para que salga del bucle una vez lo encuentre
              }
            }
          }
          //Comparo elementos de DebilContra de los dos tipos
          for(let tipo11 of tipo1.DebilContra){
            for(let tipo22 of tipo2.DebilContra){
              //si el elemento de un tipo es igual a otro, agrego ese elemento a un array nuevo auxMuyRes
              if(tipo11 === tipo22){
                this.auxMuyRes.push(tipo11);
                break;//Para que salga del bucle una vez lo encuentre
              } 
            }
          }
        }

      }

      //paso al array de eficazContra del primer tipo todos los elementos de eficazContra del segundo tipo
      this.efectividadSeleccionada[0].EficazContra.push(...this.efectividadSeleccionada[1].EficazContra);
      //convierto el array a conjunto (set) el array para que automaticamente elimine los duplicados
      const setEficazContra = new Set(this.efectividadSeleccionada[0].EficazContra);
      //convierto el set a array
      this.efectividadSeleccionada[0].EficazContra = Array.from(setEficazContra);

      //paso al array de debilContra del primer tipo todos los elementos de debilContra del segundo tipo
      this.efectividadSeleccionada[0].DebilContra.push(...this.efectividadSeleccionada[1].DebilContra);
      //convierto el array a conjunto (set) el array para que automaticamente elimine los duplicados
      const setDebilContra = new Set(this.efectividadSeleccionada[0].DebilContra);
      //convierto el set a array
      this.efectividadSeleccionada[0].DebilContra = Array.from(setDebilContra);

      //paso al array de inmuneA del primer tipo todos los elementos de inmuneA del segundo tipo
      this.efectividadSeleccionada[0].InmuneA.push(...this.efectividadSeleccionada[1].InmuneA);
      //convierto el array a conjunto (set) el array para que automaticamente elimine los duplicados
      const setInmuneA = new Set(this.efectividadSeleccionada[0].InmuneA);
      //convierto el set a array
      this.efectividadSeleccionada[0].InmuneA = Array.from(setInmuneA);

      //Borro el segundo tipo, me quedo con el primer tipo con los elementos del primer y segundo tipo
      this.efectividadSeleccionada.pop();
    }
  }

  

//////EVOLUCIONES///////

  //Obtengo el id de la cadena de evolucion del pokemon de la id de la url
  evolucionar(){
    console.log('Buscando evolucion');
    //Doy valores iniciales a los arrays para borrar los datos que puedan tener
    this.evolucionaA = [];
    this.todasEvoluciones = [];
    this.triggerElegido = [];
    //Obtengo la id de la url
    this.ruta.params.subscribe(params => {
      const id = params['id'];
      //Obtengo url pokemon-species/id, donde esta el id de la cadena de evolucion del pokemon
      this.pokemonService.getIdDescripcionPokemon(id).subscribe(
        respuesta=>{
          this.especieElegida = respuesta;
          //Trocea la url para conseguir el id de evolucion
          let trozosUrl = this.especieElegida.evolution_chain.url.split('/');
          this.idEvolucion = trozosUrl[trozosUrl.length - 2];//-2 porque es la penultima parte
          //paso a la funcion la id de la evolucion
          this.getEvolucion(this.idEvolucion);
        }
      );
    }
    );
  }

  //Obtengo el nombre del pokemon baby de la evolucion y los datos de la cadena evolutiva
  getEvolucion(idEvo:number) {
    //Obtengo todos los datos de la evolucion
    this.pokemonService.getIdEvolucion(idEvo).subscribe(
      respuesta=>{
        this.evolucionElegida = respuesta;
        //A evolucionesA que sera el array que contenga los nombres de las evoluciones, le añado el pokemon baby
        this.evolucionaA.push(this.evolucionElegida.chain.species);
        //filtro todos los datos para obtener solo la cadena evolutiva
        this.ObtenerEvoluciones(this.evolucionElegida.chain.evolves_to);
      }
    )
  }

  //
  ObtenerEvoluciones(array: any[]){
    //cadena evolutiva
    let evoluciones: any[] = array;
    //filtro datos para obtener solo el nombre de las evoluciones y los niveles a los que evoluciona
    while(evoluciones.length > 0){
      for(let i = 0; i < evoluciones.length; i++){
        //obtengo el nombre de las evoluciones y lo añado al array
        let evolucion = evoluciones[i].species;
        this.evolucionaA.push(evolucion);
        //obtengo los niveles a los que evoluciona y los añado al array
        let trigger = evoluciones[i].evolution_details[0].min_level;
        this.triggerElegido.push(trigger);
        //Si hay mas evoluciones, las añado al array para procesarlas en las iteracciones
        if(evoluciones[i].evolves_to){
          evoluciones.push(...evoluciones[i].evolves_to);
        }
      }
      //vacio el array
      evoluciones = [];
    }
    this.getTodasEvoluciones();
  }

  //Nombre e imagen de los pokemon de las evoluciones, lo que cargo
  getTodasEvoluciones(){
    //recorro el array de evoluciones y filtro para obtener solo el nombre y la imagen.
    //el nivel es el array (nivel al que evoluciona) obtenido anteriormente
    this.evolucionaA.forEach(p => {
      this.pokemonService.getPokemonNombre(p.name).subscribe(
        respuesta => {
          const pokemonInfo = {
            name: respuesta.name,
            nivel: this.triggerElegido,
            img: respuesta.sprites.other.home.front_default,
          };
          //array de interfaces, le añado los datos de cada evolucion
          this.todasEvoluciones.push(pokemonInfo);
        }
      );
    });
  }

//////MOVIMIENTOS///////

  //todos los movimientos del pokemon de la id de la url
  movimientosPokemon(){
    this.ruta.params.subscribe(params => {
      const id = params['id'];

      this.pokemonService.getIdDetallePokemon(id).subscribe((data: any) => {
        //todos los movimientos del pokemon
        this.movesPokemon = data.moves;
        //filtro para obtener el nombre y el metodo de aprendizaje solo
        this.nombresMovimientos = this.movesPokemon.map(move => ({
          //nombre del movimiento
          nombre: move.move.name,
          //metodo de aprendizaje(para separar por nivel o por maquina)
          metodoAprendizaje: move.version_group_details[0].move_learn_method.name
        }));
        //Llamo a la funcion para filtrar los movimientos y que aparezcan hasta los de 4 generacion
        this.nombresMovimientos.forEach(objeto => this.movimientosGeneracion(objeto.nombre, objeto.metodoAprendizaje));
      });
    });
  }
        
  //para saber de que generacion es el movimiento y que solo agregue al array los que sean hasta la 4 generacion
  movimientosGeneracion(name: string, learn: string){
    //obtengo los datos del movimiento y los filtro para obtener solo los datos que quiero
    this.pokemonService.getDetalleMovimiento(name).subscribe((data: any) => {
      const nombre = data.name;
      const generacion = data.generation.name;
      const tipo = data.type.name;
      const categoria = data.damage_class.name;
      const potencia = data.power;
      const precision = data.accuracy;
      //filtro para que solo me coja los que sean de 1, 2, 3 y 4 generacion
      if(generacion == 'generation-i' || generacion == 'generation-ii' || generacion == 'generation-iii' || generacion == 'generation-iv'){
        const interfaz: movimientos = { nombre, tipo, categoria, potencia, precision };
        //separo segun el metodo de aprendizaje (por nivel o por maquina)
        if(learn == 'level-up'){
          this.movimientosNivelOK.push(interfaz);
        } else if(learn == 'machine') {
          this.movimientosMaquinaOK.push(interfaz);
        }
      }
    });
  }
      
}
