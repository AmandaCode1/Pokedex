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

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.pokemonService.getPokemons(493).subscribe((response: Pokemon[]) => {
      this.pokemons = response;
      this.copiapokemons = response;
    });
  }

  buscador() {
    this.cargarLista();
    const pokemonBuscador = this.pokemons.filter((pokemon) => pokemon.name == this.nameP);
    this.copiapokemons = pokemonBuscador;
  }

  generacion(inicio: number, fin: number) {
    //this.cargarLista();
    const pokemonGeneracion = this.pokemons.slice(inicio, fin);
    this.copiapokemons = pokemonGeneracion;
  }

  tipos(tipo: string) {
    //this.cargarLista();
    const pokemonTipo = this.pokemons.filter((pokemon) => pokemon.types.includes(tipo));
    this.copiapokemons = pokemonTipo;
  }

  cargarLista() {//Si la lista esta vacia por haber hecho una busqueda antes, volvemos a cargar los pokemon
    if (this.pokemons.length === 0) {
      this.pokemons = [...this.copiapokemons];
    }
  }


}
