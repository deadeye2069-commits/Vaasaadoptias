const homeView = document.getElementById("home-view");
const detailsView = document.getElementById("details-view");
const thankYouView = document.getElementById("thank-you-view");

const animalsContainer =
  document.getElementById("animals-container");

const animalDetails =
  document.getElementById("animal-details");

const placeholder =
  "/images/placeholder.svg";

function showView(view) {
  homeView.hidden = view !== "home";
  detailsView.hidden = view !== "details";
  thankYouView.hidden = view !== "thanks";
}

function createImage(animal) {
  const img = document.createElement("img");
  img.src = animal.imageUrl || placeholder;
  img.alt = animal.name;
  img.className = "animal-image";

  img.onerror = () => {
    img.onerror = null;
    img.src = placeholder;
  };

  return img;
}

async function loadAnimals() {
  showView("home");
  animalsContainer.textContent = "Ladataan eläimiä...";

  try {
    const response = await fetch("/animals");

    if (!response.ok) {
      throw new Error("Eläimiä ei voitu hakea");
    }

    const animals = await response.json();
    animalsContainer.replaceChildren();
    if (animals.length === 0) {
      animalsContainer.textContent = "Ei adoptoitavia eläimiä tällä hetkellä.";
      return;
    }

    for (const animal of animals) {
      const card = document.createElement("article");
      card.className = "animal-card";

      const info = document.createElement("div");
      info.className = "animal-info";

      const title = document.createElement("h3");
      title.textContent = animal.name;

      const description = document.createElement("p");
      description.textContent =
        `${animal.type} · ${animal.age} vuotta`;

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Katso lisää";
      button.addEventListener("click", () => {
        showAnimal(animal.id);
      });

      info.append(title, description, button);
      card.append(createImage(animal), info);
      animalsContainer.append(card);
    }

  } catch (error) {
    animalsContainer.textContent =
      "Eläinten lataaminen epäonnistui.";
  }
}

async function showAnimal(id) {
  showView("details");
  animalDetails.textContent = "Ladataan tietoja...";

  try {
    const response = await fetch(`/animals/${id}`);

    if (!response.ok) {
      throw new Error("Eläintä ei löytynyt");
    }

    const animal = await response.json();
    animalDetails.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = animal.name;

    const type = document.createElement("p");
    type.textContent = `Eläin: ${animal.type}`;

    const age = document.createElement("p");
    age.textContent = `Ikä: ${animal.age} vuotta`;

    const breed = document.createElement("p");
    breed.textContent = `Rotu: ${animal.breed}`;

    const description = document.createElement("p");
    description.textContent = animal.description;

    animalDetails.append(
      createImage(animal),
      title,
      type,
      age,
      breed,
      description
    );

    if (animal.status !== "available") {
      const notice = document.createElement("p");
      notice.textContent =
        "Tästä eläimestä on jo jätetty hakemus tai eläin ei ole enää adoptoitavissa.";
      animalDetails.append(notice);
      return;
    }

    const heading = document.createElement("h3");
    heading.textContent = "Adoptiohakemus";

    const form = document.createElement("form");
    form.className = "adoption-form";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Nimi";
    nameInput.required = true;
    nameInput.setAttribute("aria-label", "Nimi");

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "Sähköposti";
    emailInput.required = true;
    emailInput.setAttribute("aria-label", "Sähköposti");

    const messageInput = document.createElement("textarea");
    messageInput.setAttribute("aria-label", "Perustelut");
    messageInput.placeholder =
      "Kerro, miksi haluaisit adoptoida eläimen";

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Adoptoi minut";

    const errorMessage = document.createElement("p");
    errorMessage.setAttribute("role", "alert");

    form.append(
      nameInput,
      emailInput,
      messageInput,
      submitButton,
      errorMessage
    );

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      submitButton.disabled = true;
      submitButton.textContent = "Lähetetään...";
      errorMessage.textContent = "";

      try {
        const response = await fetch(
          `/animals/${animal.id}/adopt`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: nameInput.value,
              email: emailInput.value,
              message: messageInput.value
            })
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || "Hakemuksen lähetys epäonnistui"
          );
        }

        showView("thanks");

      } catch (error) {
        errorMessage.textContent = error.message;
        submitButton.disabled = false;
        submitButton.textContent = "Adoptoi minut";
      }
    });

    animalDetails.append(heading, form);

  } catch (error) {
    animalDetails.textContent = error.message;
  }
}

document.getElementById("back-button")
  .addEventListener("click", loadAnimals);

document.getElementById("home-button")
  .addEventListener("click", loadAnimals);

loadAnimals();

