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

  movimientosPokemon(){
    this.ruta.params.subscribe(params => {
      const id = params['id'];

      this.pokemonService.getIdDetallePokemon(id).subscribe((data: any) => {
        this.movesPokemon = data.moves;
        this.nombresMovimientos = this.movesPokemon.map(move => ({
          nombre: move.move.name,
          metodoAprendizaje: move.version_group_details[0].move_learn_method.name
        }));

        //console.log('Datos movimientos: ', this.nombresMovimientos);
        this.nombresMovimientos.forEach(objeto => this.movimientosGeneracion(objeto.nombre, objeto.metodoAprendizaje));
        //console.log('DDDmovimientos: ',this.movimientosNivelOK);
        //console.log('mmmMovimientos por maquina', this.movimientosMaquinaOK);
      });
    });
  }
        
  //para saber de que generacion es el movimiento
  movimientosGeneracion(name: string, learn: string){
    this.pokemonService.getDetalleMovimiento(name).subscribe((data: any) => {
      //console.log('Detalles del movimiento:', data);
      const nombre = data.name;
      const generacion = data.generation.name;
      const tipo = data.type.name;
      const categoria = data.damage_class.name;
      const potencia = data.power;
      //console.log('PPPPP', potencia);
      const precision = data.accuracy;
      //console.log('PPPPP', precision);
      if(generacion == 'generation-i' || generacion == 'generation-ii' || generacion == 'generation-iii' || generacion == 'generation-iv'){
        const interfaz: movimientos = { nombre, tipo, categoria, potencia, precision };

        if(learn == 'level-up'){
          this.movimientosNivelOK.push(interfaz);
        //console.log('datos movimiento', interfaz);
        } else if(learn == 'machine') {
          this.movimientosMaquinaOK.push(interfaz);
        }
      }
    });
  }
    
  evolucionar(){
    console.log('Buscando evolucion');
    this.evolucionaA = [];
    this.todasEvoluciones = [];
    this.triggerElegido = [];
    this.ruta.params.subscribe(params => {
      const id = params['id'];
      //Obtengo url pokemon-species/id
      this.pokemonService.getIdDescripcionPokemon(id).subscribe(
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
        //console.log('trigger', this.evolucionElegida.chain.evolves_to);
        //A evoluciones A que sera el array que contenga los nombres de las evoluciones le añado el pokemon baby
        this.evolucionaA.push(this.evolucionElegida.chain.species);
        this.ObtenerEvoluciones(this.evolucionElegida.chain.evolves_to);
      }
    )
  }

  //los arrays de evolves_to
  ObtenerEvoluciones(array: any[]){
    let evoluciones: any[] = array;
    console.log('evoluciones que llegan: ', evoluciones);
    while(evoluciones.length > 0){
      for(let i = 0; i < evoluciones.length; i++){
        let evolucion = evoluciones[i].species;
        let trigger = evoluciones[i].evolution_details[0].min_level;
        //console.log('trigger', trigger);
        this.evolucionaA.push(evolucion);
        this.triggerElegido.push(trigger);
        if(evoluciones[i].evolves_to){
          evoluciones.push(...evoluciones[i].evolves_to);
        }
      }
      evoluciones = evoluciones.slice(evoluciones.length);
      //triggers = evoluciones.slice(evoluciones.length);

    }
    //console.log('triggersElegido: ', this.triggerElegido);
    //console.log('evolucionaA: ', this.evolucionaA);
    //console.log('trigger', this.triggerElegido);
    this.getTodasEvoluciones();
  }

  //Datos de los pokemon de las evoluciones, lo que cargo
  getTodasEvoluciones(){
    this.evolucionaA.forEach(p => {
      this.pokemonService.getPokemonNombre(p.name).subscribe(
        respuesta => {
          const pokemonInfo = {
            name: respuesta.name,
            nivel: this.triggerElegido,
            img: respuesta.sprites.other.home.front_default,
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
      
}
