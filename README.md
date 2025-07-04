# Product Manager
Web application for product management using **JSON Server**, **Fetch API**, and **Tailwind CSS**. Allows you to easily create, list, edit, and delete products.

## Features

- Register new products with name, category, price, quantity, and description.
- Edit and delete existing products.
- Field validation and visual notifications with SweetAlert2.
- Modern and responsive interface thanks to Tailwind CSS.
- Data persistence using JSON Server as a mock REST API.

## Installation

1. Clone this repository:
```sh
git clone https://github.com/Nikotastic/Interaccion-con-Servidores-y-Consumo-de-APIs.git
cd gestion-productos
```

2. Install the dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

4. In another terminal, start JSON Server:
```sh
npx json-server public/database.json
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.


## Project structure
```
product-management/
├── node_modules/
├── public/
│ ├── database.json
│ └── favicon.ico
├── src/
│ ├── css/
│ │ └── styles.css
│ └── js/
│ ├── alerts.js
│ └── management_api.js
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md
```
## Main Dependencies

- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SweetAlert2](https://sweetalert2.github.io/)
- [JSON Server](https://github.com/typicode/json-server)

## Author

# Coder Information

Name: Nikol Velasquez

Clan: Sierra

Email: velasqueznikol10@gmail.com

---

© 2025 Nikol Velasquez. All rights reserved