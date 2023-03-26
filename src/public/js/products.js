document.addEventListener("DOMContentLoaded", function () {
  const sortingForm = document.getElementById("sorting-form");
  const sortSelect = document.getElementById("sort-select");
  const limitInput = document.getElementById("limit-input");
  const queryInput = document.getElementById("query-input");

  sortingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const currentUrl = new URL(window.location.href);
    const sortValue = sortSelect.value;
    const limitValue = limitInput.value;
    const queryValue = queryInput.value;

    if (sortValue) {
      currentUrl.searchParams.set("sort", sortValue);
    }
    if (limitValue) {
      currentUrl.searchParams.set("limit", limitValue);
    }
    if (queryValue) {
      currentUrl.searchParams.set("query", queryValue);
    }
    window.location.href = currentUrl.toString();
  });

  const gotoPageBtn = document.getElementById("goto-page-btn");
  gotoPageBtn.addEventListener("click", function () {
    const gotoPageInput = document.getElementById("goto-page-input");
    const pageNumber = gotoPageInput.value;
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("page", pageNumber);
    window.location.href = currentUrl.toString();
  });
});