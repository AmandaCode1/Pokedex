import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Pokemon } from './model/pokemon';
import { detallePokemon } from './model/detallePokemon';
import { Tipos } from './model/tipos';
import { movimientos } from './model/movimientos';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private url: string = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  getJson(): Observable<any[]>{
    return this.http.get<any[]>("../../assets/json/efectividades.json");
  }

  getPokemons(count: number): Observable<Pokemon[]> {
    const requests: Observable<Pokemon>[] = [];

    for (let i = 1; i <= count; i++) {
      const request = this.http.get(`${this.url}/pokemon/${i}`).pipe(
        map((data: any) => ({
          id: data.id,
          name: data.species.name,
          image: data.sprites.other.home.front_default,
          imageShiny: data.sprites.other.home.front_shiny,
          types: data.types.map((tipo: any) => tipo.type.name),
          peso: data.weight,
          altura: data.height,
        }))
      );
      requests.push(request);
    }

    return forkJoin(requests);
  }

  getDetallePokemon(pokemon: any, species?: any): detallePokemon {

    const descripcion = species.flavor_text_entries.find(
      (data: any) => data.language.name === 'es' && data.version.name === 'x').flavor_text;

    return {
      id: pokemon.id,
      name: pokemon.species.name,
      image: pokemon.sprites.other.home.front_default,
      imageShiny: pokemon.sprites.other.home.front_shiny,
      types: pokemon.types.map((tipo: any) => tipo.type.name),
      peso: pokemon.weight,
      altura: pokemon.height,
      descripcion: descripcion,
      vida: pokemon.stats[0].base_stat,
      velocidad: pokemon.stats[5].base_stat,
      ataque: pokemon.stats[1].base_stat,
      ataqueEspecial: pokemon.stats[3].base_stat,
      defensa: pokemon.stats[2].base_stat,
      defensaEspecial: pokemon.stats[4].base_stat,
      //debilidades: esta en https://pokeapi.co/api/v2/type/${tipo}
    };
  }

  //Url para la descripcion
  getIdDescripcionPokemon(id: number): Observable<any> {
    const url = `${this.url}/pokemon-species/${id}`;
    return this.http.get(url);
  }

  //Url para los detalles
  getIdDetallePokemon(id: number): Observable<any> {
    const url = `${this.url}/pokemon/${id}`;
    return this.http.get(url);
  }

  getPokemonNombre(name: string): Observable<any>{
    const url = `${this.url}/pokemon/${name}`;
    return this.http.get(url);
  }

  //Buscar tipo por id 
  getTipoPorId(id: number): Observable<Tipos> {
    return this.http.get(`${this.url}/pokemon/${id}`).pipe(
      map((data: any) => ({
        types: data.types.map((tipo: any) => tipo.type.name),
      }))
    );
  }

  getIdEvolucion(id: number): Observable<any> {
    return this.http.get(`${this.url}/evolution-chain/${id}`);
  }

  getDetalleMovimiento(name: string){
    return this.http.get(`${this.url}/move/${name}`);
  }

  /*getTodosMovimientos(array: string[]): Observable<movimientos>{
    for(let nombre of array){
      const request = this.getDetalleMovimiento(nombre)
    }
    return {
      nombre: data.name,
      tipo: data.type.name,
      categoria: data.demage_class.name,
      potencia: data.power,
      precision: data.accutancy,
    };
  }*/



  /*getEfectividades(tipo: string): Observable<Efectividad> {
    //Obtenemos efectividades de los pokemon desde la api
    return this.http.get(`https://pokeapi.co/api/v2/type/${tipo}`).pipe(
      map((data: any) => ({
        dobleDanoA: data.damage_relations.double_damage_to.map((dano: any) => dano.double_damage_to.name),
        mitadDanoA: data.damage_relations.half_damage_to.map((dano: any) => dano.half_damage_to.name),
        noDanoA: data.damage_relations.no_damage_to.map((dano: any) => dano.no_damage_to.name),
        dobleDanoDesde: data.damage_relations.double_damage_from.map((dano: any) => dano.double_damage_from.name),
        mitadDanoDesde: data.damage_relations.half_damage_from.map((dano: any) => dano.half_damage_from.name),
        noDanoDesde: data.damage_relations.no_damage_from.map((dano: any) => dano.no_damage_from.name),
      }))
    );
  }*/

}
