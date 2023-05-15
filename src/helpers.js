export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const effectiveness = {
  normal: {
    weaknesses: ["fighting"],
    resistances: [],
    immunities: ["ghost"]
  },
  fighting: {
    weaknesses: ["flying", "psychic", "fairy"],
    resistances: ["bug", "rock", "dark"],
    immunities: []
  },
  flying: {
    weaknesses: ["electric", "rock", "ice"],
    resistances: ["grass", "fighting", "bug"],
    immunities: ["ground"]
  },
  poison: {
    weaknesses: ["ground", "psychic"],
    resistances: ["fighting", "poison", "bug", "grass", "fairy"],
    immunities: []
  },
  ground: {
    weaknesses: ["water", "grass", "ice"],
    resistances: ["poison", "rock"],
    immunities: ["electric"]
  },
  rock: {
    weaknesses: ["water", "grass", "fighting", "ground", "steel"],
    resistances: ["normal", "flying", "poison", "fire"],
    immunities: []
  },
  bug: {
    weaknesses: ["flying", "rock", "fire"],
    resistances: ["fighting", "ground", "grass"],
    immunities: []
  },
  ghost: {
    weaknesses: ["ghost", "dark"],
    resistances: ["poison", "bug"],
    immunities: ["normal", "fighting"]
  },
  steel: {
    weaknesses: ["fighting", "ground", "fire"],
    resistances: [
      "normal",
      "flying",
      "rock",
      "bug",
      "steel",
      "grass",
      "psychic",
      "ice",
      "dragon",
      "fairy"
    ],
    immunities: ["poison"]
  },
  fire: {
    weaknesses: ["water", "ground", "rock"],
    resistances: ["bug", "steel", "fire", "grass", "ice", "fairy"],
    immunities: []
  },
  water: {
    weaknesses: ["electric", "grass"],
    resistances: ["steel", "fire", "water", "ice"],
    immunities: []
  },
  grass: {
    weaknesses: ["flying", "poison", "bug", "fire", "ice"],
    resistances: ["ground", "water", "grass", "electric"],
    immunities: []
  },
  electric: {
    weaknesses: ["ground"],
    resistances: ["flying", "steel", "electric"],
    immunities: []
  },
  psychic: {
    weaknesses: ["bug", "ghost", "dark"],
    resistances: ["fighting", "psychic"],
    immunities: []
  },
  ice: {
    weaknesses: ["fighting", "rock", "steel", "fire"],
    resistances: ["ice"],
    immunities: []
  },
  dragon: {
    weaknesses: ["ice", "dragon", "fairy"],
    resistances: ["water", "electric", "fire", "grass"],
    immunities: []
  },
  dark: {
    weaknesses: ["fighting", "bug", "fairy"],
    resistances: ["ghost", "dark"],
    immunities: ["psychic"]
  },
  fairy: {
    weaknesses: ["poison", "steel"],
    resistances: ["fighting", "bug", "dark"],
    immunities: ["dragon"]
  }
};

export function getWeaknesses(types) {
  let totalWeaknesses = {
    normal: 1,
    fighting: 1,
    flying: 1,
    poison: 1,
    ground: 1,
    rock: 1,
    bug: 1,
    ghost: 1,
    steel: 1,
    fire: 1,
    water: 1,
    grass: 1,
    electric: 1,
    psychic: 1,
    ice: 1,
    dragon: 1,
    dark: 1,
    fairy: 1
  };

  let immunities = [];

  for (let i in types) {
    let type = types[i];
    // increase for each weakness
    for (let attackerTypeIndex in effectiveness[type].weaknesses) {
      let attackerType = effectiveness[type].weaknesses[attackerTypeIndex];
      totalWeaknesses[attackerType] += 1;
    }

    // decrease for each resistance
    for (let attackerTypeIndex in effectiveness[type].resistances) {
      let attackerType = effectiveness[type].resistances[attackerTypeIndex];
      totalWeaknesses[attackerType] -= 1;
    }

    // set immunities
    for (let attackerTypeIndex in effectiveness[type].immunities) {
      let attackerType = effectiveness[type].immunities[attackerTypeIndex];
      immunities.push(attackerType);
    }
  }

  // set immunities to -100
  immunities.forEach((im) => {
    totalWeaknesses[im] = -100;
  });

  // returns all over 1x
  let weaknessArr = [];

  Object.keys(totalWeaknesses).forEach((key) => {
    if (totalWeaknesses[key] > 1) {
      weaknessArr.push(key);
    }
  });

  return weaknessArr;
}
