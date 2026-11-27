const express = require("express");
const path = require("path");

const {
  getAnimals,
  getAnimalById
} = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

const SERVER_B_URL =
  process.env.SERVER_B_URL || "http://127.0.0.1:3001";

app.use(express.json());

// Tarjoillaan frontend-tiedostot
app.use(express.static(
  process.env.FRONTEND_DIR || path.join(__dirname, "../frontend")
));

// GET /animals
app.get("/animals", (req, res) => {
  try {
    const animals = getAnimals().filter(a => a.status === "available");
    res.json(animals);
  } catch (error) {
    res.status(500).json({
      error: "Eläinten hakeminen epäonnistui"
    });
  }
});

// GET /animals/:id
app.get("/animals/:id", (req, res) => {
  try {
    const animal = getAnimalById(req.params.id);

    if (!animal) {
      return res.status(404).json({
        error: "Eläintä ei löytynyt"
      });
    }

    res.json(animal);
  } catch (error) {
    res.status(500).json({
      error: "Eläimen hakeminen epäonnistui"
    });
  }
});

// POST /animals/:id/adopt
app.post("/animals/:id/adopt", async (req, res) => {
  try {
    const animal = getAnimalById(req.params.id);

    if (!animal) {
      return res.status(404).json({
        error: "Eläintä ei löytynyt"
      });
    }

    if (animal.status !== "available") {
      return res.status(409).json({
        error: "Eläin ei ole enää adoptoitavissa"
      });
    }

    const { name, email, message } = req.body || {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      (message !== undefined &&
        typeof message !== "string")
    ) {
      return res.status(400).json({
        error: "Tarkista hakemuksen tiedot"
      });
    }

    const response = await fetch(
      `${SERVER_B_URL}/adoptions`,
      {
        method: "POST",
        signal: AbortSignal.timeout(10000),
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          animalId: animal.id,
          name: name.trim(),
          email: email.trim(),
          message: message || ""
        })
      }
    );

    const result = await response.json();

    res.status(response.status).json(result);

  } catch (error) {
    console.error(error);

    res.status(502).json({
      error: "Adoptiopalvelimeen ei saatu yhteyttä"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server A käynnissä portissa ${PORT}`
  );
});
