import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) { }

  getPokemon(): Observable<string> {
    return this.http.get('https://pokeapi.co/api/v2/pokemon/ditto').pipe(map((respuesta: any) => respuesta.value));
  }
}
