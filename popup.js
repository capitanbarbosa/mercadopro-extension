document.getElementById("getDate").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = new URL(tabs[0].url);
    const regex = /MCO-([0-9]+)/; // Regular expression to match the product ID
    const match = url.pathname.match(regex);
    if (match && match[1]) {
      const productId = match[1];
      fetch(`https://api.mercadolibre.com/items/MCO${productId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.date_created) {
            document.getElementById(
              "result"
            ).innerText = `Date Created: ${data.date_created}`;
          } else {
            document.getElementById("result").innerText =
              "Date created not available for this product.";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          document.getElementById("result").innerText =
            "Failed to fetch product data.";
        });
    } else {
      document.getElementById("result").innerText =
        "Product ID not found in URL.";
    }
  });
});
