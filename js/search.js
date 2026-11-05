// js/search.js
// Builds the programme cards from data, then searches, filters and sorts them.

// Card content. Each object is one card.
const programmes = [
  { title: "Surplus food recovery", category: "Food recovery",
    description: "Edible, in-date surplus food is collected from farmers, manufacturers and retailers before it goes to waste." },
  { title: "Sorting and quality checks", category: "Food recovery",
    description: "Food is inspected and sorted at one of our regional warehouses." },
  { title: "Vetting beneficiary organisations", category: "Distribution",
    description: "Community organisations apply and are verified as registered non-profits." },
  { title: "Warehouse distribution", category: "Distribution",
    description: "Beneficiary organisations collect food regularly from their nearest warehouse." },
  { title: "Soup kitchens and shelters", category: "Who we serve",
    description: "Organisations that provide meals and a safe place for people in need." },
  { title: "Early childhood development centres", category: "Who we serve",
    description: "Centres that feed young children while supporting their early education." },
  { title: "Community feeding schemes", category: "Who we serve",
    description: "Partner organisations that prepare and distribute meals directly in their communities." },
  { title: "Volunteering", category: "Get involved",
    description: "Help us collect, sort and pack food at a warehouse.", link: "enquiry.html" },
  { title: "Donating food or funds", category: "Get involved",
    description: "Support our work with a food or financial donation.", link: "enquiry.html" },
  { title: "Register as a beneficiary organisation", category: "Get involved",
    description: "Apply for your non-profit organisation to join our network.", link: "enquiry.html" }
];

// Find the page elements needed
const searchBox = document.getElementById("search-box");
const categoryFilter = document.getElementById("category-filter");
const sortOrder = document.getElementById("sort-order");
const resultsBox = document.getElementById("directory-results");
const resultCount = document.getElementById("result-count");

// Works out which cards to show and draws them
function renderCards() {
  const term = searchBox.value.trim().toLowerCase();
  const category = categoryFilter.value;

  // Filter cards
  const matches = programmes.filter(function (item) {
    const inCategory = category === "all" || item.category === category;
    const text = (item.title + " " + item.description + " " + item.category).toLowerCase();
    return inCategory && text.includes(term);
  });

  // Sort matches by titles
  matches.sort(function (a, b) {
    if (sortOrder.value === "az") {
      return a.title.localeCompare(b.title);
    }
    return b.title.localeCompare(a.title);
  });

  // Clear old cards and build new ones
  resultsBox.innerHTML = "";

  matches.forEach(function (item) {
    const card = document.createElement("article");
    card.className = "directory-card";

    const tag = document.createElement("span");
    tag.className = "directory-tag";
    tag.textContent = item.category;

    const heading = document.createElement("h3");
    heading.textContent = item.title;

    const text = document.createElement("p");
    text.textContent = item.description;

    card.append(tag, heading, text);

    // Only some cards have a link to enquiry page
    if (item.link) {
      const link = document.createElement("a");
      link.href = item.link;
      link.textContent = "Enquire now \u2192";
      card.appendChild(link);
    }

    resultsBox.appendChild(card);
  });

  //Update the result count or explain when nothing matches
  if (matches.length === 0) {
    resultCount.textContent = "No programmes match your search. Try a different word or category.";
  } else if (matches.length === 1) {
    resultCount.textContent = "Showing 1 programme.";
  } else {
    resultCount.textContent = "Showing " + matches.length + " programmes.";
  }
}

// Update the cards whenever the visitor types or changes a dropdown
searchBox.addEventListener("input", renderCards);
categoryFilter.addEventListener("change", renderCards);
sortOrder.addEventListener("change", renderCards);

// Load all the cards when the page opens
renderCards();