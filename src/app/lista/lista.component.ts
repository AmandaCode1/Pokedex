import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../model/pokemon';


@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  pokemons: Pokemon[] = [];//guardamos la lista original
  copiapokemons: Pokemon[] = [];//copia del primer array en el que haremos las busquedas
  nameP: string = '';
  tipo: string = '';
  inicio: number = 0;
  fin: number = 0;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.pokemonService.getPokemons(493).subscribe((response: Pokemon[]) => {
      this.pokemons = response;
      this.copiapokemons = [...response];
    });
  }

  buscador() {
    if(!this.nameP){
      this.cargar();
    } else {
      const pokemonBuscador = this.pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(this.nameP.toLowerCase()));
      this.pokemons = pokemonBuscador;
    }
  }

  generacion(inicio: number, fin: number) {
    this.inicio = inicio;
    this.fin = fin;
    this.filtrar();
  }

  tipos(tipo: string) {
    this.tipo = tipo;
    this.filtrar();
  }

  /*generacion(inicio: number, fin: number) {
    this.cargarLista();
    const pokemonGeneracion = this.pokemons.slice(inicio, fin);
    this.copiapokemons = pokemonGeneracion;
  }

  tipos(tipo: string) {
    this.cargarLista();
    const pokemonTipo = this.copiapokemons.filter((pokemon) => pokemon.types.includes(tipo));
    this.copiapokemons = pokemonTipo;
  }*/

  filtrar(){
    this.pokemons = [...this.copiapokemons];

    if (this.inicio && this.fin) {
      this.pokemons = this.pokemons.slice(this.inicio, this.fin);
    }
  
    if (this.tipo) {
      this.pokemons = this.pokemons.filter(pokemon => pokemon.types.includes(this.tipo));
    }

  }

  listaPokemon(){
      this.filtrar();
      return this.pokemons;
  }
}
