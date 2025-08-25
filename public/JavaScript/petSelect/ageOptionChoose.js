const categorySelect = document.getElementById("category");
const ageGroupSelect = document.getElementById("ageGroup");

const ageOptions = {
  Pas: [
    {
      value: "Štene",
      text: "Štene",
    },
    {
      value: "Odrasli pas",
      text: "Odrasli pas",
    },
  ],
  Mačka: [
    {
      value: "Mače",
      text: "Mače",
    },
    {
      value: "Odrasla mačka",
      text: "Odrasla mačka",
    },
  ],
};

categorySelect.addEventListener("change", function () {
  const selectedCategory = this.value;
  ageGroupSelect.innerHTML =
    '<option value="" selected disabled>Izaberi starost</option>';

  if (selectedCategory && ageOptions[selectedCategory]) {
    ageOptions[selectedCategory].forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.value;
      opt.textContent = option.text;
      ageGroupSelect.appendChild(opt);
    });
  }
});
