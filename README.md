
# Vaasan Eläinsuoja ry – Adoptiojärjestelmä

## Projektin kuvaus

Tämä projekti on Vaasan Eläinsuojalle suunniteltu
web-sovellus, jonka tarkoituksena on helpottaa
eläinten adoptiota.

Käyttäjä voi tutustua adoptoitaviin eläimiin,
katsoa eläinten kuvia ja tietoja sekä lähettää
adoptiohakemuksen sähköisesti.

## Toiminnot

- Adoptoitavien eläinten selaaminen
- Eläinten kuvat ja yksityiskohtaiset tiedot
- Sähköinen adoptiohakemus
- Hakemuksen tallentaminen
- Vahvistus hakemuksen lähettämisestä
- Päällekkäisten adoptiohakemusten estäminen

## Käytetyt teknologiat

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- REST API
- JSON
- Docker

## Sivuston käynnistäminen

### 1. Vaatimukset

Tietokoneelle tulee olla asennettuna:

- Node.js (versio 20 tai uudempi)
- Visual Studio Code
- Git

### 2. Projektin lataaminen

Avaa terminaali ja suorita:

    git clone https://github.com/deadeye2069-commits/Vaasaadoptias.git
    cd Vaasaadoptias
    code .

### 3. Server A:n käynnistäminen

Avaa VS Codessa terminaali ja suorita:

    cd serverA
    npm install
    npm start

Server A toimii portissa 3000.

### 4. Server B:n käynnistäminen

Avaa toinen terminaali projektin pääkansiossa
ja suorita:

    cd serverB
    npm install
    npm start

Server B toimii portissa 3001.

Molempien palvelimien tulee olla käynnissä
samanaikaisesti.

### 5. Sivuston avaaminen

Avaa selaimessa:

http://localhost:3000

Sivusto on nyt käyttövalmis.

## Palvelimien tehtävät

### Server A

- Käyttöliittymän tarjoaminen
- Eläinten tietojen hakeminen
- API Gateway
- Hakemusten välittäminen Server B:lle

### Server B

- Adoptiohakemusten vastaanottaminen
- Hakemusten tarkistaminen
- Hakemusten tallentaminen JSON-tiedostoon

## Testihakemusten nollaaminen

Avaa data/adoptions.json ja korvaa sisältö
tyhjällä JSON-taulukolla:

    []

Varmista myös, että eläimen status on
animals.json-tiedostossa "available".

Päivitä tämän jälkeen sivusto.

Huom! Tämä poistaa kaikki tallennetut hakemukset.
Käytä nollausta vain testiympäristössä.

## Projektin tavoite

Projektin tavoitteena on luoda helppokäyttöinen
digitaalinen adoptiojärjestelmä, joka helpottaa
eläinsuojan ja adoptoijien toimintaa.


## Tekijät

Om Sharma