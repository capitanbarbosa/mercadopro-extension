## to-do : agregarle ventas por mes, seleccionando el div de unidades vendidas y diviendo por los meses pasados desde start_time.
## agregarle la primera imagen del producto. 
## agregarle logo de la extension

## Installation
- Load your extension into Chrome: Open Chrome, navigate to chrome://extensions/, enable "Developer mode", click "Load unpacked", and select your extension's directory.

## Usage
Navigate to a product page on MercadoLibre: For example, use the URL you provided.
Click your extension's icon and then click "Get Date Created". The extension should display the creation date of the product.



## Extra
4. Handling Permissions
Ensure your manifest.json file has the necessary permissions to access tab URLs and make network requests. The "activeTab" permission lets you access the URL of the current tab. If you're making cross-origin requests to the MercadoLibre API, you might also need to declare the host permission for api.mercadolibre.com in your manifest.json.

5. Publish Your Extension
Once your extension works as expected, you can publish it to the Chrome Web Store. You'll need to zip your extension's directory and upload it through the Chrome Web Store Developer Dashboard.

