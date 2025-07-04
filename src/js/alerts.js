
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

// GOOD MESSAGE
export function alertSuccess(message) {
    Toast.fire({
      icon: "success",
      title: message,
    });
}

// ERROR MESSAGE (ALERT)
export function alertError(message) {
    Toast.fire({
      icon: "error",
      title: message,
    });
}

// DELETE MESSAGE
export async function confirmDelete(message = "Are you sure you want to delete this product?") {
  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none',
      cancelButton: 'bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none',
    }
  });

  const result = await swalWithTailwindButtons.fire({
    title: 'Are you sure?',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  });

  return result;
}
