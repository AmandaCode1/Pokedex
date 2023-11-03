import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit{

  name: string = '';
  urlImage: string = '';

  constructor(private pokemonService: PokemonService){}

  ngOnInit(): void {
  }

  cargaPokemon(){
    this.pokemonService.getPokemon(this.name).subscribe((data:any) => {
      this.urlImage = data.sprites.front_default
    })
  }
}
