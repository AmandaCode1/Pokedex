import { Component } from '@angular/core';
import { PokemonService } from './pokemon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pokedex';
  pokemon = '';

  constructor(private pokemonService: PokemonService){}

  cargaPokemon(){
    this.pokemon = 'Cargando pokemon...';
    this.pokemonService.getPokemon().subscribe(
      nuevoPokemon => this.pokemon = nuevoPokemon
      )
  }

}
