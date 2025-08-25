const breeds = {
  dog: [
    "Mešanac",
    "Ostalo",
    "Nemački ovčar",
    "Labrador retriver",
    "Zlatni retriver",
    "Maltezer",
    "Pudlica",
    "Pomeranac",
    "Čivava",
    "Francuski buldog",
    "Engleski buldog",
    "Rotvajler",
    "Doberman",
    "Pitbul terijer",
    "Američki stafordski terijer",
    "Šarplaninac",
    "Husky",
    "Akita Inu",
    "Shiba Inu",
    "Doga",
    "Beagle",
    "Jack Russell terijer",
    "Koker španijel",
    "Bokser",
    "Dalmatinac",
    "Cane Corso",
    "Bernski planinski pas",
    "Samojed",
    "Baset",
    "Mops",
  ],
  cat: [
    "Mešanac",
    "Ostalo",
    "Sijamska",
    "Persijska",
    "Maine Coon",
    "Britanska kratkodlaka",
    "Bengalska",
    "Sfinks",
    "Ragdoll",
    "Ruska plava",
    "Norveška šumska",
    "Turska angora",
    "Himalajska",
    "Devon Rex",
    "Egipatski Mau",
    "Manx",
  ],
};

const selectCaregory = document.getElementById("category");
const breedSelect = document.getElementById("breed");

selectCaregory.addEventListener("change", () => {
  const selected = selectCaregory.value;
  breedSelect.innerHTML = "<option value=''>Izaberi rasu</option>";

  if (selected === "Pas") {
    breeds.dog.forEach((breed) => {
      const opt = document.createElement("option");
      opt.value = breed;
      opt.textContent = breed;
      breedSelect.appendChild(opt);
    });
  } else if (selected === "Mačka") {
    breeds.cat.forEach((breed) => {
      const opt = document.createElement("option");
      opt.value = breed;
      opt.textContent = breed;
      breedSelect.appendChild(opt);
    });
  }
});
