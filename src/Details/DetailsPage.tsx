import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './DetailsPage.module.css';

interface PokemonDetails {
    name: string;
    image: string;
    abilities: string[];
    species: string;
    stats: { name: string; value: number }[];
    types: string[];
}

const DetailsPage: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [details, setDetails] = useState<PokemonDetails | null>(null);
    const [filteredPokemon, setFilteredPokemon] = useState<string[]>([]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
                const data = response.data;
                const abilities = data.abilities.map((ability: { ability: { name: string } }) => ability.ability.name);
                const species = data.species.name;
                const stats = data.stats.map((stat: { stat: { name: string }; base_stat: number }) => ({
                    name: stat.stat.name,
                    value: stat.base_stat,
                }));
                const types = data.types.map((type: { type: { name: string } }) => type.type.name);

                setDetails({
                    name: data.name,
                    image: data.sprites.front_default,
                    abilities,
                    species,
                    stats,
                    types,
                });
            } catch (error) {
                console.error('Error fetching Pokémon details:', error);
            }
        };

        fetchDetails();
    }, [name]);

    useEffect(() => {
        // Extract filtered Pokémon list from location state
        if (location.state && location.state.filteredPokemon) {
            setFilteredPokemon(location.state.filteredPokemon);
        }
    }, [location.state]);

    const handleNavigation = (direction: 'prev' | 'next') => {
        if (!details || filteredPokemon.length === 0) return;
        const currentIndex = filteredPokemon.indexOf(details.name);
        const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;

        if (newIndex >= 0 && newIndex < filteredPokemon.length) {
            navigate(`/details/${filteredPokemon[newIndex]}`, {
                state: { filteredPokemon },
            });
        }
    };

    if (!details) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.detailsContainer}>
            <div className={styles.navigationBar}>
                <button onClick={() => handleNavigation('prev')} disabled={filteredPokemon.indexOf(details.name) === 0}>
                    ← Previous
                </button>
                <h2>{details.name}</h2>
                <button onClick={() => handleNavigation('next')} disabled={filteredPokemon.indexOf(details.name) === filteredPokemon.length - 1}>
                    Next →
                </button>
            </div>
            <div className={styles.detailsBox}>
                <img src={details.image} alt={details.name} className={styles.pokemonImage} />
                <p><strong>Species:</strong> {details.species}</p>
                <p><strong>Abilities:</strong> {details.abilities.join(', ')}</p>
                <h3>Stats:</h3>
                <ul>
                    {details.stats.map((stat, index) => (
                        <li key={index}><strong>{stat.name}:</strong> {stat.value}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DetailsPage;