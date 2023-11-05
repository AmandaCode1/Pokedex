import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit{

/*dataPokemon: string[] = ['id', 'name', 'image', 'type'];
pokemon: string[] = [];*/

  id: string = '';
  name: string = '';
  image: string = '';
  type: string = '';

  constructor(private pokemonService: PokemonService){}

  ngOnInit(): void {
    this.muestraPokemon();
  }

  muestraPokemon(){
    for(let i = 1 ; i <= 150 ; i++){
      this.pokemonService.getListaPokemon(i).subscribe((data:any) => {
        this.id = data.id,
        this.name = data.species.name,
        this.image = data.sprites.other.dream_world.front_default,
        this.type = data.types.map((tipo: any) => tipo.type.name)
      })

        /*this.dataPokemon.push(data.species.name),
        this.dataPokemon.push(data.id),
        this.dataPokemon.push(data.sprites.other.dream_world.front_default),
        this.dataPokemon.push(data.types.map((tipo: any) => tipo.type.name));
      })*/
    }
    /*this.pokemon.push(this.dataPokemon);*/
  }

 /* muestraPokemon(){
    for(let i = 1 ; i <= 150 ; i++){
      this.pokemonService.getListaPokemon(i).subscribe(
        res => {
          console.log(res);
        }, err =>{

        }
      );
    }
  }*/
  

  
  
}
