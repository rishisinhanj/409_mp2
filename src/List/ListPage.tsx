import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './ListPage.module.css';

interface Pokemon {
    name: string;
    image: string;
    baseStat: number;
}

const ListPage: React.FC = () => {
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<'name' | 'stats'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
                const results = response.data.results;
                const pokemonData = await Promise.all(
                    results.map(async (poke: { name: string; url: string }) => {
                        const pokeDetails = await axios.get(poke.url);
                        return {
                            name: poke.name,
                            image: pokeDetails.data.sprites.front_default,
                            baseStat: pokeDetails.data.stats[0].base_stat, // Example: using the first stat
                        };
                    })
                );
                setPokemon(pokemonData);
            } catch (error) {
                console.error('Error fetching Pokémon:', error);
            }
        };

        fetchPokemon();
    }, []);

    const filteredPokemon = pokemon
        .filter(poke => poke.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortField === 'name') {
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else if (sortField === 'stats') {
                return sortOrder === 'asc'
                    ? a.baseStat - b.baseStat
                    : b.baseStat - a.baseStat;
            }
            return 0;
        });

    return (
        <div className={styles.listContainer}>
            <h2>List Page</h2>
            <div className={styles.searchSortBox}>
                <input
                    type="text"
                    placeholder="Search Pokémon"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchBar}
                />
                <div className={styles.sortBar}>
                    <label>Sort by:</label>
                    <button
                        className={sortField === 'name' ? styles.activeButton : ''}
                        onClick={() => setSortField('name')}
                    >
                        Name
                    </button>
                    <button
                        className={sortField === 'stats' ? styles.activeButton : ''}
                        onClick={() => setSortField('stats')}
                    >
                        Stats
                    </button>
                </div>
                <div className={styles.orderBar}>
                    <button
                        className={sortOrder === 'asc' ? styles.activeButton : ''}
                        onClick={() => setSortOrder('asc')}
                    >
                        Ascending
                    </button>
                    <button
                        className={sortOrder === 'desc' ? styles.activeButton : ''}
                        onClick={() => setSortOrder('desc')}
                    >
                        Descending
                    </button>
                </div>
            </div>
            <ul>
                {filteredPokemon.map((poke, index) => (
                    <li key={index} className={styles.listItem}>
                        <Link to={`/details/${poke.name}`} state={{ filteredPokemon: filteredPokemon.map(p => p.name) }} className={styles.listItem}>
                            <img src={poke.image} alt={poke.name} />
                            <p>{poke.name}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListPage;