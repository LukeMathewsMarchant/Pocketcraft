const pokemonContainer = document.getElementById('pokemon-container');
const gameSelector = document.getElementById('game-selector'); // Dropdown for selecting the generation

// Global variable to store pre-fetched Pokémon data
let allPokemonData = [];

// Function to prefetch all Pokémon data
async function prefetchAllPokemonData() {
    const maxPokemon = 898; // Total number of Pokémon
    const promises = [];

    for (let i = 1; i <= maxPokemon; i++) {
        promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then((res) => res.json()));
    }

    allPokemonData = await Promise.all(promises);
    console.log("All Pokémon data pre-fetched!");
}

// Function to filter Pokémon based on generation
function getPokemonByGeneration(genNumber) {
    const generationRanges = {
        1: [1, 151],
        2: [152, 251],
        // 3: [252, 289][63, 65][290, 297][118, 121][129, 130][298][183, 184][72, 76][299, 301][41, 42][169][302, 312][65, 68][81, 82][100, 101][313, 348][43, 45][182][84, 85][218, 219][88, 89][109, 110][27, 28][227][174][39, 40][349, 359][361, 370][37, 38][172][25, 26][54, 55][360][202][177, 178][231, 232][127][214][111, 112][116, 117][230][371, 386],
        3: [252, 386],
        4: [387, 493],
        5: [494, 649],
        6: [650, 721],
        7: [722, 809],
        8: [810, 898],
        9: [899, 1010], // Adjust range if additional Pokémon are added
    };

    // let's update this to show the ranges of pokemon for each game we can probably simplify it a little bit since some games are the same
    // 1: [1, 151]
    // 2: [152, 251][1, 151],
    // 3: [252, 289][63, 65][290, 297][118, 121][129, 130][298][183, 184][72, 76][299, 301][41, 42][169][302, 312][65, 68][81, 82][100, 101][313, 348][43, 45][182][84, 85][218, 219][88, 89][109, 110][27, 28][227][174][39, 40][349, 359][361, 370][37, 38][172][25, 26][54, 55][360][202][177, 178][231, 232][127][214][111, 112][116, 117][230][371, 386]

    if (genNumber === "all") {
        return allPokemonData; // Return all Pokémon
    }

    const [start, end] = generationRanges[genNumber];
    return allPokemonData.filter((pokemon) => {
        const id = pokemon.id;
        return id >= start && id <= end;
    });
}

// Function to display a single Pokémon
function displayPokemon(pokemon) {
    const pokemonDiv = document.createElement('div');
    pokemonDiv.classList.add('pokemon');

    const pokemonImg = document.createElement('img');
    pokemonImg.src = ''; // Leave blank initially for lazy loading
    pokemonImg.alt = pokemon.name;
    pokemonImg.dataset.src = pokemon.sprites.front_default; // Use `data-src` for lazy loading
    pokemonImg.classList.add('lazy-load');

    const pokemonName = document.createElement('p');
    pokemonName.textContent = pokemon.name;

    pokemonDiv.appendChild(pokemonImg);
    pokemonDiv.appendChild(pokemonName);
    pokemonContainer.appendChild(pokemonDiv);

    pokemonDiv.addEventListener('click', function () {
        add_team(pokemon);
    });
}

// Lazy-load images when they appear in the viewport
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy-load');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src; // Set the actual image source
                img.classList.remove('lazy-load');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach((img) => observer.observe(img));
}

// Function to load and display Pokémon for a selected generation
async function loadPokemonByGeneration(genNumber) {
    // Clear the container
    pokemonContainer.innerHTML = '';

    // Filter Pokémon data by generation
    const filteredPokemon = getPokemonByGeneration(genNumber);

    // Display filtered Pokémon
    filteredPokemon.forEach(displayPokemon);

    // Setup lazy loading for the displayed images
    setupLazyLoading();
}

// Function to handle generation selection from the dropdown
function handleGenerationChange() {
    const selectedGeneration = gameSelector.value; // Value of the selected option
    loadPokemonByGeneration(selectedGeneration);
}

// Initialize the page
async function init() {
    // Prefetch all Pokémon data
    await prefetchAllPokemonData();

    // Load all Pokémon by default on page load
    loadPokemonByGeneration('all');

    // Add event listener for generation selection dropdown
    gameSelector.addEventListener('change', handleGenerationChange);
}

init(); // Run the initialization function

// Add-to-team and remove functionality (unchanged from your original code)
function add_team(pokemon) {
    const slots = [
        document.getElementById('slot1'),
        document.getElementById('slot2'),
        document.getElementById('slot3'),
        document.getElementById('slot4'),
        document.getElementById('slot5'),
        document.getElementById('slot6')
    ];

    for (let slot of slots) {
        if (slot.src.includes('pokeball')) {
            slot.src = pokemon.sprites.front_default;
            slot.classList.add('wiggle-element');
            break;
        }
    }

    slots.forEach(slot => {
        if (!slot.classList.contains('listener-added')) {
            slot.addEventListener("click", function () {
                remove_pokemon(slot);
            });
            slot.classList.add('listener-added');
        }
    });
}

function remove_pokemon(slot) {
    slot.src = 'assets/pokeball.webp';
    slot.classList.remove('wiggle-element');
}



