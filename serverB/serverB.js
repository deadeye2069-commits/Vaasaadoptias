const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const dataDir = process.env.DATA_DIR ||
  path.join(__dirname, "../data");

const animalsFile = path.join(dataDir, "animals.json");
const adoptionsFile = path.join(dataDir, "adoptions.json");
console.log("Hakemukset tallennetaan:", adoptionsFile);

// Luodaan datakansio tarvittaessa
fs.mkdirSync(dataDir, { recursive: true });

// Alustetaan hakemustiedosto
if (!fs.existsSync(adoptionsFile)) {
  fs.writeFileSync(adoptionsFile, "[]");
}

function readJSON(file) {
  return JSON.parse(
    fs.readFileSync(file, "utf8")
  );
}

function writeJSON(file, data) {
  const tempFile = file + ".tmp";

  fs.writeFileSync(
    tempFile,
    JSON.stringify(data, null, 2)
  );

  fs.renameSync(tempFile, file);
}

// Yksinkertainen käsittelyjono
// Estää päällekkäiset hakemuskäsittelyt
let processing = Promise.resolve();

function withLock(task) {
  const next = processing.then(task);
  processing = next.catch(() => {});
  return next;
}

// POST /adoptions
app.post("/adoptions", async (req, res) => {
  try {
    const result = await withLock(async () => {
      const { animalId, name, email, message } = req.body || {};

      if (
        !Number.isInteger(Number(animalId)) ||
        typeof name !== "string" ||
        !name.trim() ||
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        (message !== undefined &&
          typeof message !== "string")
      ) {
        return {
          status: 400,
          body: { error: "Virheelliset hakemustiedot" }
        };
      }

      const animals = readJSON(animalsFile);
      const adoptions = readJSON(adoptionsFile);

      const existingAdoption = adoptions.find(
  a => Number(a.animalId) === Number(animalId)
);

if (existingAdoption) {
  return {
    status: 409,
    body: {
      error: "Tästä eläimestä on jo jätetty adoptiohakemus."
    }
  };
}

      const animal = animals.find(
        a => a.id === Number(animalId)
      );

      if (!animal) {
        return {
          status: 404,
          body: { error: "Eläintä ei löytynyt" }
        };
      }

      if (animal.status !== "available") {
        return {
          status: 409,
          body: {
            error: "Eläin ei ole enää adoptoitavissa"
          }
        };
      }

      const adoption = {
        id: Date.now().toString() +
          "-" + Math.random().toString(36).slice(2),
        animalId: animal.id,
        animalName: animal.name,
        name: name.trim(),
        email: email.trim(),
        message: message || "",
        status: "pending",
        createdAt: new Date().toISOString()
      };

      adoptions.push(adoption);

      writeJSON(adoptionsFile, adoptions);

      return {
        status: 201,
        body: {
          success: true,
          message: "Adoptiohakemus vastaanotettu!",
          adoptionId: adoption.id
        }
      };
    });

    res.status(result.status).json(result.body);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Hakemuksen tallennus epäonnistui"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server B käynnissä portissa ${PORT}`
  );
});
