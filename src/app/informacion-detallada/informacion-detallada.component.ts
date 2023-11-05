import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-informacion-detallada',
  templateUrl: './informacion-detallada.component.html',
  styleUrls: ['./informacion-detallada.component.css']
})
export class InformacionDetalladaComponent implements OnInit{

  name: string = '';
  urlImage: string = '';
  tipo: string = '';

  constructor(private pokemonService: PokemonService){}

  ngOnInit(): void {
  }

  cargaPokemon(){
    this.pokemonService.getPokemon(this.name).subscribe((data:any) => {
      this.urlImage = data.sprites.other.dream_world.front_default,
      this.tipo = data.types.map((tipo: any) => tipo.type.name);
    })
  }

}
