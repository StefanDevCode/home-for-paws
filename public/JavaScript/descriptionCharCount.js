const description = document.getElementById("description");
const charCount = document.getElementById("charCount");
const maxLength = description.getAttribute("maxlength");

description.addEventListener("input", () => {
  const remaining = maxLength - description.value.length;
  charCount.textContent = `Preostalo karaktera: ${remaining}`;
});
