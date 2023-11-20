import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, tap } from 'rxjs';
import { Pokemon } from './model/pokemon';
import { detallePokemon } from './model/detallePokemon';
//import { detallePokemon } from './model/detallePokemon';

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

  getIdDescripcionPokemon(id: number): Observable<any> {
    const url = `${this.url}-species/${id}`;
    return this.http.get(url).pipe(
      tap((response: any) => {
        console.log('Respuesta de la API:', response);
      })
    );
  }



  getIdDetallePokemon(id: number): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.get(url).pipe(
      tap((response: any) => {
        console.log('Respuesta de la API:', response);
      })
    );
  }

  /*getDebilidadesTipo(tipo: string): Observable<any> {
    const url = `https://pokeapi.co/api/v2/type/${tipo}`;
    return this.http.get(url).pipe(
      tap((response: any) => {
        console.log('Respuesta de la API de debilidades:', response);
      })
    );
  }

  getDebilidades(id: number): Observable<any> {
    return this.getIdDetallePokemon(id).pipe(
      switchMap((pokemon: any) => {
        //Obtenemos los tipos del Pokémon
        const tipos = pokemon.types.map((tipo: any) => tipo.type.name);

        //Obtenemos sus debilidades
        const debilidades = tipos.map((tipo: string) => this.getDebilidadesTipo(tipo));

        return forkJoin(debilidades);
      })
    );
  }*/


}

