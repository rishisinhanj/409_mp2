import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './GalleryPage.module.css';

interface Pokemon {
    name: string;
    image: string;
    types: string[];
}

const GalleryPage: React.FC = () => {
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [types, setTypes] = useState<string[]>([]);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
                const results = response.data.results;
                const pokemonData = await Promise.all(
                    results.map(async (poke: { name: string; url: string }) => {
                        const pokeDetails = await axios.get(poke.url);
                        const pokeTypes = pokeDetails.data.types.map((type: { type: { name: string } }) => type.type.name);
                        return {
                            name: poke.name,
                            image: pokeDetails.data.sprites.front_default,
                            types: pokeTypes,
                        };
                    })
                );
                setPokemon(pokemonData);

                // Extract unique types
                const allTypes = Array.from(new Set(pokemonData.flatMap(poke => poke.types)));
                setTypes(allTypes);
            } catch (error) {
                console.error('Error fetching Pokémon:', error);
            }
        };

        fetchPokemon();
    }, []);

    const filteredPokemon = selectedType
        ? pokemon.filter(poke => poke.types.includes(selectedType))
        : pokemon;

    return (
        <div>
            <div className={styles.typeFilterContainer}>
                {types.map((type, index) => (
                    <button
                        key={index}
                        className={
                            selectedType === type
                                ? `${styles.typeFilter} ${styles.activeType}`
                                : styles.typeFilter
                        }
                        onClick={() => setSelectedType(selectedType === type ? null : type)}
                    >
                        {type}
                    </button>
                ))}
            </div>
            <div className={styles.galleryContainer}>
                {filteredPokemon.map((poke, index) => (
                    <Link to={`/details/${poke.name}`} state={{ filteredPokemon: filteredPokemon.map(p => p.name) }} key={index} className={styles.galleryItem}>
                        <img src={poke.image} alt={poke.name} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default GalleryPage;