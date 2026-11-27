
const fs = require("fs");
const path = require("path");

const dataDir = process.env.DATA_DIR ||
  path.join(__dirname, "../data");

const animalsFile = path.join(dataDir, "animals.json");
const adoptionsFile = path.join(dataDir, "adoptions.json");

function getAnimals() {
  const animals = JSON.parse(
    fs.readFileSync(animalsFile, "utf8")
  );

  const adoptions = fs.existsSync(adoptionsFile)
    ? JSON.parse(fs.readFileSync(adoptionsFile, "utf8"))
    : [];

  return animals.map(animal => {
    const hasApplication = adoptions.some(
      a => Number(a.animalId) === Number(animal.id)
    );

    if (hasApplication && animal.status === "available") {
      return {
        ...animal,
        status: "reserved"
      };
    }

    return animal;
  });
}

function getAnimalById(id) {
  return getAnimals().find(
    animal => animal.id === Number(id)
  );
}

module.exports = {
  getAnimals,
  getAnimalById
};

