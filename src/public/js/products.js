document.addEventListener("DOMContentLoaded", function () {
  const sortSelect = document.getElementById("sort-select");
  sortSelect.addEventListener("change", function () {
    const sortValue = this.value;
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("sort", sortValue);
    window.location.href = currentUrl.toString();
  });
});