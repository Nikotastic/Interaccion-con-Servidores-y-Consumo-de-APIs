import { alertError, alertSuccess, confirmDelete } from "./alerts";
const endpointProducts = "http://localhost:3000/products";

// Elementos del DOM
const $name = document.getElementById("name");
const $category = document.getElementById("category");
const $price = document.getElementById("price");
const $quantity = document.getElementById("quantity");
const $description = document.getElementById("description");
const $idEdit = document.getElementById("idEdit");
const $form = document.querySelector("form");
const $productsShow = document.getElementById("productsShow");

// Evento del formulario
$form.addEventListener("submit", (event) => {
  event.preventDefault();
  createOrUpdateProduct(); // Decide si crear o actualizar
});


// READ
async function listProducts() {
  try {
    const response = await fetch(endpointProducts);
    const products = await response.json();

    $productsShow.innerHTML = "";

    if (products.length === 0) {
      $productsShow.innerHTML = "<p>No hay productos registrados.</p>";
      return;
    }

    for (let product of products) {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      productCard.innerHTML = `
        <h3>Nombre: ${product.name}</h3>
        <p><strong>Categoría:</strong> ${product.category}</p>
        <p><strong>Precio:</strong> $${product.price}</p>
        <p><strong>Cantidad:</strong> ${product.quantity}</p>
        <p><strong>Descripción:</strong> ${product.description}</p>
        <button data-id="${product.id}" class="btn-edit">Editar</button>
        <button data-id="${product.id}" class="btn-delete">Eliminar</button>
      `;

      $productsShow.appendChild(productCard);
    }

    setEventListeners(); // Vincular eventos a botones
  } catch (e) {
    console.error("Error al listar productos:", e);
    $productsShow.innerHTML = "<p>Error al cargar productos.</p>";
  }
}


//  CREATE OR UPDATE
async function createOrUpdateProduct() {
  const id = $idEdit.value;
  const productData = {
    name: $name.value.trim(),
    category: $category.value.trim(),
    price: parseFloat($price.value),
    quantity: parseInt($quantity.value),
    description: $description.value.trim(),
  };

  // Validaciones
  if (!productData.name || !productData.category || !productData.description) {
    return alertError("Todos los campos de texto son obligatorios.");
  }
  if (isNaN(productData.price) || productData.price <= 0) {
    return alertError("El precio debe ser un número mayor que 0.");
  }
  if (isNaN(productData.quantity) || productData.quantity < 0) {
    return alertError("La cantidad debe ser un número entero mayor o igual a 0.");
  }

  try {
    if (id) {
      //  UPDATE 
      const response = await fetch(`${endpointProducts}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Error al actualizar");
      alertSuccess("Producto actualizado correctamente.");
    } else {
      //  CREATE 
      const checkResponse = await fetch(`${endpointProducts}?nameLike=^${productData.name}$`);
      const existingProducts = await checkResponse.json();

      const duplicate = existingProducts.find(
        (p) => p.name.toLowerCase() === productData.name.toLowerCase()
      );

      if (duplicate) {
        return alertError(`El producto "${productData.name}" ya existe.`);
      }

      const response = await fetch(endpointProducts, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Error al crear");
      alertSuccess("Producto creado exitosamente.");
    }

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


// DELETE 
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

listProducts();
