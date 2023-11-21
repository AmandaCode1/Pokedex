import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap, tap } from 'rxjs';
import { Pokemon } from './model/pokemon';
import { detallePokemon } from './model/detallePokemon';
import { Efectividad } from './model/efectividades';
@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private url: string = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  getPokemons(count: number): Observable<Pokemon[]> {
    const requests: Observable<Pokemon>[] = [];

    for (let i = 1; i <= count; i++) {
      const request = this.http.get(`${this.url}/${i}`).pipe(
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

  getDetallePokemon(pokemon: any, species: any): detallePokemon {

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
    const url = `${this.url}-species/${id}`;
    return this.http.get(url);
  }

  //Url para los detalles
  getIdDetallePokemon(id: number): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.get(url);
  }

  //Url para los tipos
  getTipoEfectividades(tipo: string): Observable<any> {
    const url = `https://pokeapi.co/api/v2/type/${tipo}`;
    return this.http.get(url);
  }

  //Buscar tipo por id //Si hay dos tipos como la modifico?
  getTipoPorId(id: number): Observable<string[]> {
    return this.getIdDetallePokemon(id).pipe(
      map((pokemon: any) => pokemon.types.map((tipo: any) => tipo.type.name))
    );
    
  }

  

  getEfectividades(tipo: string): Observable<Efectividad> {
    //Obtenemos efectividades de los pokemon desde la api
    return this.http.get(`https://pokeapi.co/api/v2/type/${tipo}`).pipe(
      map((data: any) => ({
        dobleDañoA: data.damage_relations.double_damage_to.map((daño: any) => daño.double_damage_to.name),
        mitadDañoA: data.damage_relations.half_damage_to.map((daño: any) => daño.half_damage_to.name),
        noDañoA: data.damage_relations.no_damage_to.map((daño: any) => daño.no_damage_to.name),
        dobleDañoDesde: data.damage_relations.double_damage_from.map((daño: any) => daño.double_damage_from.name),
        mitadDañoDesde: data.damage_relations.half_damage_from.map((daño: any) => daño.half_damage_from.name),
        noDañoDesde: data.damage_relations.no_damage_from.map((daño: any) => daño.no_damage_from.name),
      }))
    );
  }

  /*getEfectividadesPokemon(data: any, tipo: any): Efectividad{

    let tipos = [data.types[0].type.name];
    if(data.types[1]){
      tipos.push(data.types[1].type.name);
    }

    const tipo: string[] = this.getIdDetallePokemon(id).pipe(
      map((pokemon: any) => {
        //Tipo del pokemon de la id
        const tipos = pokemon.types.map((tipo: any) => tipo.type.name);
        //Efectividades por tipo
        const arrayEfectividades: Observable<any>[] = tipos.map(tipo => this.getTipoEfectividades(tipo));
        return forkJoin(arrayEfectividades);
      }),
      map(arrayEfectividades =>{
        return {
          
        }
      })
      )
    );
  }*/

}
