import { useEffect, useState } from "react";
import { PokemonCards } from "./PokemonCards";

const Pokemon = () => {

    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const API = "https://pokeapi.co/api/v2/pokemon?limit=124";

    const fetchPokemon = async () => {
        setLoading(true);
        setError(null);

        try{
            const res = await fetch(API);
            const data = await res.json();

            console.log("pokemon data: ", data);

            const detailedPokmonData = data.results.map( async (curPok) => {

                const curRes = await fetch(curPok.url);
                const curData = await curRes.json();

                return curData;

            });

            console.log("detailedPokmonData",detailedPokmonData);

            const detailedResponses = await Promise.all(detailedPokmonData);
            console.log(detailedResponses);

            setPokemon(detailedResponses);

        }
        catch(err){
            console.log(err);
            setError(err);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchPokemon();
    },[]);

    const searchData = pokemon.filter((curPokemon) =>
        curPokemon.name.toLowerCase().includes(search.toLowerCase())
      );

    if (loading) {
        return (
          <div>
            <h1>Loading....</h1>
          </div>
        );
    }
    
    if (error) {
        return (
          <div>
            <h1>{error.message}</h1>
          </div>
        );
    }

  return (
    <>

    <section className="container">
        <header>
          <h1> Lets Catch Pokémon</h1>
        </header>
        <div className="pokemon-search">
          <input
            type="text"
            placeholder="search Pokemon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <ul className="cards">

            {searchData.map((curPokemon) => {
              return (
                <PokemonCards key={curPokemon.id} pokemonData={curPokemon} />
              );
            })}
          </ul>
        </div>
    </section>

    </>
  )
}

export default Pokemon