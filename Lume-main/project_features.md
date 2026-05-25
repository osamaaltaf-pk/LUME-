# LUME Website Documentation

## Project Overview
**LUME** is a premium, artisanal candle e-commerce platform that emphasizes aesthetics, sustainability, and user interactivity. The website offers a curated collection of hand-poured soy wax candles and a unique "Custom Studio" feature that allows users to design their own bespoke candles using an interactive 3D interface.

## Technology Stack
- **Frontend**: React (Vite), Tailwind CSS, Three.js (`react-three-fiber`, `@react-three/drei`) for 3D rendering.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (likely using Mongoose).
- **State Management**: React Context API (`AuthContext`, `CartContext`).
- **Routing**: `react-router-dom`.

---

## Key Features

### 1. The Custom Studio (3D Customization)
A flagship feature accessible via `/customize`, allowing users to become the artisan.
- **Interactive 3D Preview**: A real-time 3D rendered candle that users can rotate and view from different angles.
- **Step-by-Step Customization**:
  - **The Vessel**: Select shape (Classic, Geometric, Bubble, Rose Ball).
  - **The Hue**: Select wax color (e.g., Warm Sand, Sage Green).
  - **Essence**: Select scent profile (e.g., Vanilla, Lavender).
  - **Scale**: Select size (Petite, Medium, Grand).
- **Dynamic Pricing**: The total price updates instantly based on selected customizations (e.g., adding +Rs. 500 for a larger size or unique shape).
- **Backend Integration**: All customization options (colors, scents, prices) are fetched dynamically from the backend, allowing admins to update available options without code changes.

### 2. Product Catalog (`/products`)
- **Collection Gallery**: A grid layout displaying pre-made candle collections.
- **Filtering System**: Users can filter products by category:
  - Signature
  - Seasonal
  - Aromatherapy
  - Decorative
  - All
- **Aesthetic Presentation**: Uses parallax banners, floating background elements, and fade-in animations for a premium feel.

### 3. User Authentication & Profile
- **Secure Access**: Dedicated pages for Login, Registration, and Password Recovery.
- **Role-Based Access**:
  - **Customers**: Can shop, customize candles, and manage their cart.
  - **Admins**: Access to a dedicated dashboard for site management.
- **Profile Management**: Users can view their details and order history (via `/profile`).

### 4. Admin Dashboard (`/dashboard`)
A comprehensive control panel for store owners.
- **Product Management**:
  - **Add/Edit Products**: Full form to create products with details including Name, Description, Category, Scent Profile, Burn Time, and Stock.
  - **Image Management**: Support for uploading and previewing multiple product images (handled via Base64).
  - **Inventory Control**: Update stock quantities.
- **Customization Atelier**:
  - **Manage Variants**: Admins can Add or Delete options for Colors, Scents, Sizes, and Shapes.
  - **Pricing Rules**: Set specific utility prices for each customization option (e.g., charging extra for premium scents).
  - **Base Price Control**: Update the starting price for all custom candles.

### 5. Shopping Experience
- **Cart System**: Real-time management of selected items.
- **Seamless Checkout**: Integration (implied) for processing orders.
- **Order Management**:
  - **User Side**: View past orders.
  - **Admin Side**: Admin-specific view (`/admin/orders`) to track and fulfill customer orders.

### 6. Design & UX
The website features a distinct "Lume" design language:
- **Visuals**: Clean, minimalist UI with "Glassmorphism" (frosted glass) effects.
- **Animations**: 
  - Floating background orbs and blobs.
  - Smooth parallax scrolling.
  - Aesthetic ticker/marquee.
  - Hover effects on cards and buttons.
- **Educational Content**: "Olfactory Notes" section explaining the top, heart, and base notes of fragrances.
