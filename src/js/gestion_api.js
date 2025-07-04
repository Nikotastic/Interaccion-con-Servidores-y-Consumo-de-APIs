import { alertError, alertSuccess, confirmDelete } from "./alerts";

// JSON Server endpoint URL
const endpointProducts = "http://localhost:3000/products";
const $name = document.getElementById("name");
const $category = document.getElementById("category");
const $price = document.getElementById("price");
const $quantity = document.getElementById("quantity");
const $description = document.getElementById("description");
const $idEdit = document.getElementById("idEdit");
const $form = document.querySelector("form");
const $productsShow = document.getElementById("productsShow");

// Form event: decides whether to create or update a product
$form.addEventListener("submit", (event) => {
  event.preventDefault();
  createOrUpdateProduct();
});

// READ
async function listProducts() {
  try {
    const response = await fetch(endpointProducts);
    const products = await response.json();

    $productsShow.innerHTML = ""; // Clean before

    if (products.length === 0) {
      $productsShow.innerHTML = `
  <p class="col-span-full w-full text-center text-gray-500  mt-6">
    There are no registered products
  </p>
`;

      return;
    }

    // Create card for each product
    for (let product of products) {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      // Card structure in the form of a mini table
      productCard.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow-md w-10/12 mx-auto">
          <h3 class="text-xl font-semibold text-blue-700 mb-4 text-center">${product.name}</h3>
          <table class="table-auto w-full text-left text-gray-700">
            <tbody>
              <tr><th class="pr-4">Category:</th><td>${product.category}</td></tr>
              <tr><th class="pr-4">Price:</th><td>$${product.price}</td></tr>
              <tr><th class="pr-4">Quantity:</th><td>${product.quantity} unidades</td></tr>
              <tr><th class="pr-4">Description:</th><td>${product.description}</td></tr>
            </tbody>
          </table>
          <div class="flex justify-center gap-3 mt-4">
            <button class="w-1/5 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition btn-edit" data-id="${product.id}">Edit</button>
            <button class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition btn-delete" data-id="${product.id}">Remove</button>
          </div>
        </div>
      `;

      $productsShow.appendChild(productCard);
    }

    setEventListeners(); // Assign events to the new buttons
  } catch (e) {
    console.error("Error al listar productos:", e);
    $productsShow.innerHTML = "<p>Error al cargar productos.</p>";
  }
}

// CREATE / UPDATE
async function createOrUpdateProduct() {
  const id = $idEdit.value;

  // Get the values ​​from the form
  const productData = {
    name: $name.value.trim(),
    category: $category.value.trim(),
    price: parseFloat($price.value),
    quantity: parseInt($quantity.value),
    description: $description.value.trim(),
  };

  // Field validations
  if (!productData.name || !productData.category || !productData.description) {
    return alertError("Todos los campos de texto son obligatorios.");
  }

  if (isNaN(productData.price) || productData.price <= 0) {
    return alertError("El precio debe ser un número mayor que 0.");
  }

  if (isNaN(productData.quantity) || productData.quantity < 0) {
    return alertError(
      "La cantidad debe ser un número entero mayor o igual a 0."
    );
  }

  try {
    if (id) {
      // UPDATE - If there is an ID, the product is updated
      const response = await fetch(`${endpointProducts}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Error al actualizar");
      alertSuccess("Producto actualizado correctamente.");
    } else {
      // CREATE - If there is an ID, the product is updated

      // Check for duplicate by name
      const checkResponse = await fetch(
        `${endpointProducts}?nameLike=^${productData.name}$`
      );
      const existingProducts = await checkResponse.json();

      const duplicate = existingProducts.find(
        (p) => p.name.toLowerCase() === productData.name.toLowerCase()
      );

      if (duplicate) {
        return alertError(`El producto "${productData.name}" ya existe.`);
      }

      // Create product
      const response = await fetch(endpointProducts, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Error al crear");
      alertSuccess("Producto creado exitosamente.");
    }

    // Clear form and load list
    $form.reset();
    $idEdit.value = "";
    listProducts();
  } catch (error) {
    alertError("Error en la operación.");
    console.error(error);
  }
}

// EDIT

async function editProduct(id) {
  try {
    const response = await fetch(`${endpointProducts}/${id}`);
    const product = await response.json();

    // Load data into the form
    $name.value = product.name;
    $category.value = product.category;
    $price.value = product.price;
    $quantity.value = product.quantity;
    $description.value = product.description;
    $idEdit.value = product.id;

    alertSuccess("Producto cargado para editar.");
  } catch (e) {
    alertError("Error al cargar producto para editar.");
    console.error(e);
  }
}

// DELETE - Eliminar producto con confirmación

async function deleteProduct(id) {
  const result = await confirmDelete();

  if (result.isConfirmed) {
    try {
      await fetch(`${endpointProducts}/${id}`, {
        method: "DELETE",
      });
      alertSuccess("Producto eliminado correctamente.");
      listProducts();
    } catch (e) {
      alertError("No se pudo eliminar el producto.");
      console.error(e);
    }
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    alertError("Eliminación cancelada.");
  }
}

// Assign events to the edit and delete buttons
function setEventListeners() {
  const deleteButtons = document.querySelectorAll(".btn-delete");
  const editButtons = document.querySelectorAll(".btn-edit");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      deleteProduct(id);
    });
  });

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      editProduct(id);
    });
  });
}

// Call the function to load products on startup
listProducts();
