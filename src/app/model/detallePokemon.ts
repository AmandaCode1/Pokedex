import { Pokemon } from "./pokemon";

export interface detallePokemon extends Pokemon{
    descripcion: string;
    vida: number;
    velocidad: number;
    ataque: number;
    ataqueEspecial: number;
    defensa: number;
    defensaEspecial: number;
    //debilidades: string[];
}