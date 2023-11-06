import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../model/pokemon';
/*import { LISTA_DE_POKEMON } from 'src/assets/data/lista-de-pokemon';*/

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit{

  pokemons: Pokemon [] = [];

  constructor(private pokemonService: PokemonService){}

  ngOnInit(){
    this.pokemonService.getPokemons(151).subscribe((response:Pokemon[]) =>{
      this.pokemons = response;
      });
  }
}
