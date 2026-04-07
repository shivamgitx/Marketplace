# Jharkhand Tribal Products Marketplace

This repository hosts the source code for Jharkhand Tribal Products Marketplace, a dynamic e-commerce platform built with the MERN Stack. It offers a user-friendly platform for purchasing authentic Jharkhand tribal crafts and products.

## Demo

- User Panel: [https://jharkhand-marketplace-frontend.onrender.com/](https://jharkhand-marketplace-frontend.onrender.com/)
- Admin Panel: [https://jharkhand-marketplace-admin.onrender.com/](https://jharkhand-marketplace-admin.onrender.com/)

## Features

- User Panel for browsing and purchasing tribal products
- Admin Panel for product management
- JWT Authentication
- Password Hashing with Bcrypt
- Stripe Payment Integration
- Login/Signup
- Logout
- Add to Cart
- Place Order
- Order Management
- Products Management
- Filter Tribal Products by Category
- Login/Signup
- Authenticated APIs
- REST APIs
- Role-Based Identification
- Beautiful Alerts



## GitHub Repository Structure

This project follows a monorepo structure with three main applications:

- `backend/` - Node.js/Express server with MongoDB integration
- `frontend/` - User-facing React application
- `admin/` - Admin panel React application for product management

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB (local instance or cloud database like MongoDB Atlas)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/jharkhand-tribal-marketplace.git
cd jharkhand-tribal-marketplace
```

2. Install dependencies for all applications:

```bash
npm run install-all
```

This command will install dependencies for the root, backend, frontend, and admin applications.

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
JWT_SECRET=your_jwt_secret_here
SALT=10
MONGO_URI=your_mongodb_connection_string_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
PORT=4000
```

### Environment Variables Explanation

- `JWT_SECRET`: Secret key for JWT token generation (use a strong, random string)
- `SALT`: Salt rounds for bcrypt password hashing (default: 10)
- `MONGO_URI`: MongoDB connection string (e.g., mongodb+srv://username:password@cluster.mongodb.net/database_name)
- `STRIPE_SECRET_KEY`: Stripe API secret key for payment processing
- `PORT`: Port number for the backend server (default: 4000)

## Running the Application

### Development Mode

To run all applications simultaneously in development mode:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:4000`
- Frontend on `http://localhost:5173`
- Admin panel on `http://localhost:5174`

### Individual Applications

To run individual applications:

- Backend only: `npm run server`
- Frontend only: `npm run frontend`
- Admin only: `npm run admin`

## Deployment

### GitHub Actions (Recommended)

1. Create a new repository on GitHub and push this code:

```bash
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

2. Set up secrets in your GitHub repository settings:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
   - `SALT`: Salt rounds for bcrypt
   - `STRIPE_SECRET_KEY`: Your Stripe secret key

3. Configure deployment workflows for your hosting platform (Render, Vercel, Heroku, etc.)

### Manual Deployment

1. Build the frontend and admin applications:

```bash
npm run build
```

2. Deploy the `backend/` directory to your Node.js hosting platform
3. Deploy the `frontend/dist` directory to your static hosting platform
4. Deploy the `admin/dist` directory to your static hosting platform

## Project Structure

```
jharkhand-tribal-marketplace/
├── backend/                  # Node.js/Express server
│   ├── config/              # Database configuration
│   ├── controllers/         # API controllers
│   ├── middleware/          # Authentication and other middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes (created)
│   ├── uploads/             # Product images (not in repo)
│   ├── .env                 # Environment variables (not in repo)
│   ├── server.js            # Main server file
│   └── package.json
├── frontend/                # User-facing React app
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── admin/                   # Admin panel React app
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env                     # Environment variables (not in repo)
├── .gitignore
├── package.json             # Root package with scripts
└── README.md
```

## Tech Stack
* [React](https://reactjs.org/)
* [Node.js](https://nodejs.org/en)
* [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Stripe](https://stripe.com/)
* [JWT-Authentication](https://jwt.io/introduction)
* [Multer](https://www.npmjs.com/package/multer)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

Project Link: [https://github.com/your-username/jharkhand-tribal-marketplace](https://github.com/your-username/jharkhand-tribal-marketplace)

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration for Jharkhand tribal art and crafts
- Dependencies used in the project
