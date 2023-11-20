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
  tipo: string[] = [];
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
    this.filtrar();
  }

  /*buscador() {
    if(!this.nameP){
      this.cargar();
    } else {
      const pokemonBuscador = this.copiapokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(this.nameP.toLowerCase()));
      this.pokemons = pokemonBuscador;
    }
  }*/

  generacion(inicio: number, fin: number) {
    this.inicio = inicio;
    this.fin = fin;
    this.filtrar();
  }

  tipos(tipo: string) {
    //Verifica si el tipo ya está seleccionado
    const indice = this.tipo.indexOf(tipo);
  
    if (indice !== -1) {
      //Si el tipo ya esta seleccionado lo quitamos
      this.tipo.splice(indice, 1);
    } else {
      //Si no lo agregamos
      this.tipo.push(tipo);
    }
  
    this.filtrar();
  }
  

  /*tipos(tipo: string) {
    this.tipo = tipo;
    this.filtrar();
  }*/

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

    if ((this.inicio || this.inicio === 0) && this.fin) {
      this.pokemons = this.pokemons.slice(this.inicio, this.fin);
    }
  
    if (this.tipo.length > 0) {
      this.pokemons = this.pokemons.filter(pokemon => this.tipo.some(tip => pokemon.types.includes(tip)));
    }

    if(!this.nameP){
      //this.cargar();
    } else {
      this.pokemons = this.pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(this.nameP.toLowerCase()));
    }

  }

  /*listaPokemon(){
      this.filtra();
      return this.pokemons;
  }*/

  reset(){
    this.cargar();
    this.nameP = '';
    this.tipo = [];
    this.inicio = 0;
    this.fin = 493;
    this.filtrar();
  }
}
