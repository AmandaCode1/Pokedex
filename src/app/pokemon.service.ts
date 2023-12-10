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

  //json de efectividades
  getJson(): Observable<any[]>{
    return this.http.get<any[]>("../../assets/json/efectividades.json");
  }

  //Obtengo datos de los pokemon de la lista, count es el limite de los pokemon que quiero
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

  //Obtengo detalles del pokemon
  getDetallePokemon(pokemon: any, species?: any): detallePokemon {

    //la descripcion esta en una url distinta, filtro la busqueda para obtener la descripcion en español
    const descripcion = species.flavor_text_entries.find(
      (data: any) => data.language.name === 'es' && data.version.name === 'x').flavor_text;

    //datos de los detalles del pokemon
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
    };
  }

  //Url para la descripcion pasando como parametro la id del pokemon
  getIdDescripcionPokemon(id: number): Observable<any> {
    const url = `${this.url}/pokemon-species/${id}`;
    return this.http.get(url);
  }

  //Url para los detalles pasando como parametro la id del pokemon
  getIdDetallePokemon(id: number): Observable<any> {
    const url = `${this.url}/pokemon/${id}`;
    return this.http.get(url);
  }

  //Url para los detalles pasando como parametro el nombre del pokemon (para el buscador)
  getPokemonNombre(name: string): Observable<any>{
    const url = `${this.url}/pokemon/${name}`;
    return this.http.get(url);
  }

  //Buscar tipo pasando como parametro la id del pokemon
  getTipoPorId(id: number): Observable<Tipos> {
    return this.http.get(`${this.url}/pokemon/${id}`).pipe(
      map((data: any) => ({
        types: data.types.map((tipo: any) => tipo.type.name),
      }))
    );
  }

  //Url de la cadena evolutiva pasando como parametro la id de la cadena evolutiva
  getIdEvolucion(id: number): Observable<any> {
    return this.http.get(`${this.url}/evolution-chain/${id}`);
  }

  //Url del movimiento de un pokemon pasando como parametro el nombre del movimiento
  getDetalleMovimiento(name: string){
    return this.http.get(`${this.url}/move/${name}`);
  }

}
