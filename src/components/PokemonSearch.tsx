import * as React from 'react';
import { Component } from 'react';
import User from '../interfaces/User.interface';
import { Button } from '@material-ui/core';

interface SearchState{
    error: boolean,
    pokemon: Pokemon,
    allPokemons: Array<AllPokemons>
    
    
} 

interface Pokemon{
    name:string,
    numberofAbilities: number,
    baseExperience: number,
    imageUrl: string
}

interface AllPokemons {
  name:string,
  url: string
}
 
export class PokemonSearch extends Component<User, SearchState> {
    pokemonRef : React.RefObject<HTMLInputElement>;

    constructor(props:User){
        super(props);
        this.state = {
            error: false, 
            pokemon: null,
            allPokemons: null

        }
        this.pokemonRef = React.createRef();
    }
    
  componentDidMount(){
    this.fetchallPokemons();   
  }

    fetchallPokemons = () :void => {
         console.log('called fetchallPokemons');
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=15&offset=20`)
        .then(res => {
            if(res.status !== 200){ 
                this.setState({error:true});
                return;
            };
            res.json().then(data =>{
                this.setState({
                error:false,
                allPokemons:data.results
                })

            })
           
        })
    }

    //function with return type
    onSearchClick = ():void => {

        const inputValue  = this.pokemonRef.current.value;
        
        if(inputValue){
            fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}`)
            .then(res => {
                if(res.status !== 200){
                    this.setState({error:true});
                    return;
                }
                res.json().then(data =>{
                    this.setState({
                        error:false,
                        pokemon:{
                        name:data.name,
                        numberofAbilities:data.abilities.length,
                        baseExperience: data.base_experience,
                        imageUrl:data.sprites.front_default
                        }
                    })
                })
                }
            )
        }else{
            this.setState({error : true});
        }
        
    }

    render() { 

    
    const  {userName, numberofPokemons} = this.props; 

    const { error, pokemon, allPokemons } = this.state;

    let resultMarkup;
    let allpokemonMarkup;
    let allpokemonsNamesMarkup;

    if(error) {
        resultMarkup = <p>Pokemon not found, please try again</p>
        allpokemonMarkup  = <p>Pokemon not found, please try again</p>
    } else if(this.state.pokemon){
      resultMarkup = 
        <div>
        <img src= {pokemon.imageUrl} alt="pokemon" className="pokemon-image" />
        <p>
          {pokemon.name} has {pokemon.numberofAbilities} abilities and {pokemon.baseExperience} base experience  points 
        </p>
        </div>
    } 
    if(this.state.allPokemons){
        const limarkup  = allPokemons.map((poke) => 
        <li key={poke.name}>
         {poke.name}
        </li>
        );
        allpokemonsNamesMarkup = <ul>{limarkup}</ul>
    }
        return (  
        <div>
           {allpokemonsNamesMarkup}
            <p>
                User {userName} {numberofPokemons && <span>has {numberofPokemons} pokemons</span>}    
            </p>
        <input type="text" ref={this.pokemonRef} className="my-input"/ >
        <Button variant ="contained" color="primary" onClick={this.onSearchClick}>Search</Button>
        
        {resultMarkup}
        </div>

        );
    }
}
 
export default PokemonSearch;
 

