import { getRandomInt, toTitleCase, getWeaknesses } from "./helpers";

export const pokeReq = async (query = "") => {
  const url = "https://pokeapi.co/api/v2/";
  const response = await fetch(url + query).then((data) => data.json());
  if (query.includes("pokemon/")) {
    return {
      name: response.name,
      id: response.id,
      spriteUrl: response.sprites.front_default,
      types: response.types.map((x) => x.type.name),
      weight: response.weight,
      height: response.height,
      abilities: response.abilities.map((x) => x.ability.name),
      stats: {
        hp: response.stats[0].base_stat,
        atk: response.stats[1].base_stat,
        def: response.stats[2].base_stat,
        spAtk: response.stats[3].base_stat,
        spDef: response.stats[4].base_stat,
        spd: response.stats[5].base_stat
      }
    };
  } else if (query.includes("pokemon-species/")) {
    return {
      captureRate: response.capture_rate,
      descriptions: response.flavor_text_entries.filter(
        (y) => y.language.name === "en" && y.flavor_text
      ),
      evoChainId: response.evolution_chain.url.split("/").slice(-1)
    };
  } else if (query === "pokemon/evolution-chain/") {
    return {
      baby: response.chain.species.name,
      basic: response.chain.evolves_to[0]
        ? response.chain.evolves_to[0].species.name
        : null,
      stage3: response.chain.evolves_to[0].evolves_to[0]
        ? response.chain.evolves_to[0].evolves_to[0].species.name
        : null
    };
  } else {
    return response;
  }
};

// example request
//pokeReq('pokemon/ditto').then((data) => console.log(data));

export const getRandomPokemon = () => {
  let i = getRandomInt(1281);
  pokeReq("pokemon?limit=1281").then((data) => {
    pokeReq("pokemon/" + data.results[i].name).then((x) => {
      console.log(x);
    });
  });
};

export const displayPokedexEntry = (pokemon) => {
  pokeReq("pokemon/" + pokemon).then((allData) => {
    let {
      name,
      id,
      spriteUrl,
      types,
      weight,
      height,
      abilities,
      stats
    } = allData;
    // need to write a function to get the weaknesses

    // get description
    pokeReq("pokemon-species/" + id).then((speciesData) => {
      let { captureRate, descriptions, evoChainId } = speciesData;
      let description =
        descriptions.length > 0 ? descriptions.pop().flavor_text : "";

      // update DOM

      // ID and Name
      document.getElementById(
        "pokeIdName"
      ).innerHTML = `#${id} ${name.toUpperCase()}`;

      // Sprite
      document.getElementById("pokeSprite").src = spriteUrl;

      // Description
      document.getElementById("pokeDesc").innerHTML = description;

      // Types - reset first
      document.getElementById("outputType").innerHTML = "";
      types.forEach((x) => {
        document.getElementById(
          "outputType"
        ).innerHTML += `<span class='type ${x}'>${toTitleCase(x)}</span>`;
      });

      // Weaknesses - reset first
      document.getElementById("outputWeaknesses").innerHTML = "";
      let weaknesses = getWeaknesses(types);
      weaknesses.forEach((x) => {
        document.getElementById("outputWeaknesses").innerHTML += `
        <span class="type ${x}">${x}</span>
        `;
      });

      // Base stats
      document.getElementById("outputStats").innerHTML = `
        <td>
          <span class="base-stat">${stats.hp}</span>
        </td>
        <td>
          <span class="base-stat">${stats.atk}</span>
        </td>
        <td>
          <span class="base-stat">${stats.def}</span>
        </td>
        <td>
          <span class="base-stat">${stats.spAtk}</span>
        </td>
        <td>
          <span class="base-stat">${stats.spDef}</span>
        </td>
        <td>
          <span class="base-stat">${stats.spd}</span>
        </td>
      `;

      // Abilities - reset first
      document.getElementById("abilitiesOutput").innerHTML = "";
      abilities.forEach((x) => {
        document.getElementById("abilitiesOutput").innerHTML += `
          <li>${x}</li>
        `;
      });

      // Height, Weight, Catch %
      document.getElementById("pokeHeight").innerHTML = `${height}"`;
      document.getElementById("pokeWeight").innerHTML = weight;
      document.getElementById("pokeCatch").innerHTML = captureRate;
    });
  });
};

const handleClick = (
  pokeInput = document.getElementById("inputPokemon").value.toLowerCase()
) => {
  // get a random pokemon if no input, else use input
  if (pokeInput === "") {
    let i = getRandomInt(1281);
    pokeReq("pokemon?limit=1281").then((randomPokeData) => {
      let pokemon = randomPokeData.results[i].name;
      displayPokedexEntry(pokemon);
    });
  } else {
    displayPokedexEntry(pokeInput);
  }
};

let buttonEl = document.getElementById("submitBtn");

buttonEl.addEventListener("click", () => handleClick());

document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleClick();
  }
});
