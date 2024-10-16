const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const pokemonName = document.getElementById('pokemon-name');
const pokemonImage = document.getElementById('pokemon-image');
const pokemonInfo = document.getElementById('pokemon-info');
const pokemonSound = document.getElementById('pokemon-sound');
const spritesContainer = document.getElementById('sprites-container');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.querySelector('.lightbox .close');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let currentIndex = 0;
let spriteUrls = [];

// Función para buscar el Pokémon por nombre
const searchPokemon = async () => {
    const name = searchInput.value.toLowerCase().trim();

    if (name === "") {
        alert("Por favor, ingresa el nombre de un Pokémon.");
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) throw new Error("Pokémon no encontrado");

        const data = await response.json();

        // Mostrar detalles del Pokémon
        pokemonName.textContent = `${data.name} (#${data.id})`;
        pokemonImage.src = data.sprites.front_default;
        pokemonImage.alt = data.name;
        pokemonInfo.textContent = `Altura: ${data.height} | Peso: ${data.weight} | Tipo: ${data.types.map(type => type.type.name).join(', ')}`;

        // Mostrar los sprites en forma de slider
        displaySprites(data.sprites);

        // Asignar la URL del sonido
        const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${data.id}.ogg`;
        pokemonSound.src = cryUrl;
        pokemonSound.style.display = 'block';

    } catch (error) {
        alert("No se encontró el Pokémon, intenta con otro nombre.");
        resetDetails();
    }
};

// Función para mostrar todos los sprites del Pokémon en forma de slider
const displaySprites = (sprites) => {
    spritesContainer.innerHTML = '';
    spriteUrls = []; // Limpiar los sprites anteriores

    const addSprite = (url, label) => {
        if (url) {
            const img = document.createElement('img');
            img.src = url;
            img.alt = label;
            img.title = label; // Mostrar el nombre al pasar el mouse
            img.addEventListener('click', () => openLightbox(spriteUrls.indexOf(url))); // Al hacer clic, abrir la lightbox con la imagen
            spritesContainer.appendChild(img);
            spriteUrls.push(url); // Agregar URL al array de sprites
        }
    };

    // Mostrar sprites de la versión principal
    addSprite(sprites.front_default, 'front_default');
    addSprite(sprites.back_default, 'back_default');
    addSprite(sprites.front_shiny, 'front_shiny');
    addSprite(sprites.back_shiny, 'back_shiny');

    // Recorrer los sprites por generaciones y versiones
    const versions = sprites.versions;
    for (const generation in versions) {
        const generationData = versions[generation];
        for (const version in generationData) {
            const versionData = generationData[version];
            addSprite(versionData.front_default, `${generation} - ${version} front`);
            addSprite(versionData.back_default, `${generation} - ${version} back`);
            addSprite(versionData.front_shiny, `${generation} - ${version} front shiny`);
            addSprite(versionData.back_shiny, `${generation} - ${version} back shiny`);
        }
    }
};

// Función para abrir la lightbox
const openLightbox = (index) => {
    currentIndex = index;
    lightbox.style.display = 'flex';
    lightboxImg.src = spriteUrls[currentIndex];
};

// Función para cerrar la lightbox
closeLightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
});

// Función para navegar entre imágenes del lightbox
const showNext = () => {
    currentIndex = (currentIndex + 1) % spriteUrls.length;
    lightboxImg.src = spriteUrls[currentIndex];
};

const showPrev = () => {
    currentIndex = (currentIndex - 1 + spriteUrls.length) % spriteUrls.length;
    lightboxImg.src = spriteUrls[currentIndex];
};

nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

// Función para restablecer los detalles si no se encuentra un Pokémon
const resetDetails = () => {
    pokemonName.textContent = '';
    pokemonImage.src = '';
    pokemonImage.alt = '';
    pokemonInfo.textContent = '';
    spritesContainer.innerHTML = '';
    pokemonSound.style.display = 'none';
    spriteUrls = [];
};

// Evento al hacer clic en el botón de búsqueda
searchBtn.addEventListener('click', searchPokemon);

// Evento para que el "Enter" también realice la búsqueda
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchPokemon();
    }
});
