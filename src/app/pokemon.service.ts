import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Pokemon } from './model/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private url: string = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

   /*getPokemons(count: number): Observable<Pokemon[]> {
    
   const requests: Observable<Pokemon>[] = [];
    
    for(let i = 1 ; i <= 150 ; i++){
      this.http.get(`${this.url}/${i}`).pipe(map((data: any) => {
        return {
          id: data.id,
          name: data.species.name,
          image: data.sprites.other.dream_world.front_default,
          types: data.types.map((tipo: any) => tipo.type.name),
          peso: data.weight,
          altura: data.height
        }
      }))

      requests.push(request);
    }
    
    return forkJoin(requests);
  }*/

  getPokemons(count: number): Observable<Pokemon[]> {
    const requests: Observable<Pokemon>[] = [];
  
    for (let i = 1; i <= count; i++) {
      const request = this.http.get(`${this.url}/${i}`).pipe(
        map((data: any) => ({
          id: data.id,
          name: data.species.name,
          image: data.sprites.other.dream_world.front_default,
          types: data.types.map((tipo: any) => tipo.type.name),
          peso: data.weight,
          altura: data.height
        }))
      );
      requests.push(request);
    }
  
    return forkJoin(requests);
  }
  
}
