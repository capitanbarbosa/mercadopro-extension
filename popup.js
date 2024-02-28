let monthsSincePublishedAccurate = 0; // Define it globally

function fetchProductData() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = new URL(tabs[0].url);
    const regex = /(?:MLA|MLM|MLC|MCO)-([0-9]+)/;
    const match = url.pathname.match(regex);
    if (match && match[1]) {
      const countryId = match[0].substr(0, 3);
      const productId = match[1];
      fetch(`https://api.mercadolibre.com/items/${countryId}${productId}`)
        .then((response) => response.json())
        .then((data) => formatData(data))
        .catch((error) => {
          console.error("Error:", error);
          document.getElementById("title").innerText =
            "Failed to fetch product data.";
        });
    } else {
      document.getElementById("title").innerText =
        "Product ID not found in URL.";
    }
  });
}

function formatData(productData) {
  const dateCreated = new Date(productData.date_created);
  const lastUpdated = new Date(productData.last_updated);
  const now = new Date();

  const timeSincePublishedDays = Math.floor(
    (now - dateCreated) / (1000 * 60 * 60 * 24)
  );
  let yearsDifference = now.getFullYear() - dateCreated.getFullYear();
  let monthsDifference = now.getMonth() - dateCreated.getMonth();
  monthsSincePublishedAccurate = yearsDifference * 12 + monthsDifference;
  if (now.getDate() < dateCreated.getDate()) {
    monthsSincePublishedAccurate--;
  }

  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDateCreated = dateCreated.toLocaleDateString(
    "en-US",
    dateOptions
  );
  const formattedLastUpdated = lastUpdated.toLocaleDateString(
    "en-US",
    dateOptions
  );

  document.getElementById("thumbnail").src = productData.thumbnail;
  document.getElementById("title").innerText = productData.title;
  document.getElementById(
    "dateCreated"
  ).innerText = `Date Created: ${formattedDateCreated} (${timeSincePublishedDays} days ago, ${monthsSincePublishedAccurate} months ago)`;
  document.getElementById("health").innerText = `Health: ${(
    productData.health * 100
  ).toFixed(2)}%`;
  document.getElementById(
    "warranty"
  ).innerText = `Warranty: ${productData.warranty}`;
  document.getElementById(
    "lastUpdated"
  ).innerText = `Last Updated: ${formattedLastUpdated}`;
}

function calculateSalesPerMonth() {
  // Extract months from the dateCreated text
  let dateString = document.getElementById("dateCreated").innerText;
  let regex = /(\d+) months ago/;
  let matches = dateString.match(regex);
  let months = matches && matches.length > 1 ? parseInt(matches[1], 10) : 0;

  const totalSales = parseFloat(document.getElementById("totalSales").value);
  if (!isNaN(totalSales) && months > 0) {
    const salesPerMonth = totalSales / months;
    document.getElementById(
      "salesPerMonth"
    ).innerText = `Sales per Month: ${salesPerMonth.toFixed(2)}`;
  } else {
    document.getElementById("salesPerMonth").innerText =
      "Invalid input or no months data available.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const calculateButton = document.getElementById("calculateButton");
  if (calculateButton) {
    calculateButton.addEventListener("click", () => calculateSalesPerMonth());
  }

  // Add an event listener to the totalSales input field
  const totalSalesInput = document.getElementById("totalSales");
  if (totalSalesInput) {
    totalSalesInput.addEventListener("keypress", function (event) {
      // Check if the pressed key is "Enter"
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default action to avoid submitting a form if it's part of one
        calculateSalesPerMonth(); // Trigger the calculation
      }
    });
  }

  fetchProductData();
});
