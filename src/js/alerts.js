
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

// MENSAJE BUENO
export function alertSuccess(message) {
    Toast.fire({
      icon: "success",
      title: message,
    });
}

// MENSAJE DE ERROR (ALERT)
export function alertError(message) {
    Toast.fire({
      icon: "error",
      title: message,
    });
}

export async function confirmDelete(message = "¿Seguro que quieres eliminar este producto?") {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  const result = await swalWithBootstrapButtons.fire({
    title: "¿Estás seguro?",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true
  });

  return result;
}
