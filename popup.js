function fetchProductData() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = new URL(tabs[0].url);
    const regex = /MCO-([0-9]+)/; // Regular expression to match the product ID
    const match = url.pathname.match(regex);
    if (match && match[1]) {
      const productId = match[1];
      fetch(`https://api.mercadolibre.com/items/MCO${productId}`)
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
  // Convert date strings to Date objects
  const dateCreated = new Date(productData.date_created);
  const lastUpdated = new Date(productData.last_updated);
  const now = new Date();

  // Calculate time since published
  const timeSincePublished = Math.floor(
    (now - dateCreated) / (1000 * 60 * 60 * 24)
  );

  // Format dates
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

  // Insert the formatted data into the HTML
  document.getElementById("title").innerText = productData.title;
  document.getElementById(
    "dateCreated"
  ).innerText = `Date Created: ${formattedDateCreated} (${timeSincePublished} days ago)`;
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

// Execute the function immediately
fetchProductData();
