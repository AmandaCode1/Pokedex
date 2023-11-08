import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../model/pokemon';


@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit{

  pokemons: Pokemon [] = [];

  constructor(private pokemonService: PokemonService){}

  ngOnInit(){
    this.cargar();
  }

   cargar(){
    this.pokemonService.getPokemons(150).subscribe((response:Pokemon[]) =>{
      this.pokemons = response;
    });
    console.log(this.pokemons);
   }

   buscador(){
    
   }
    
}
