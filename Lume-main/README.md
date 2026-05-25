# LUME Atelier 🕯️✨

LUME is a premium, artisanal e-commerce platform that celebrates visual elegance, eco-sustainability, and bespoke craftsmanship. The website features a beautifully curated catalog of hand-poured soy wax candles and houses the **Custom Studio**—a state-of-the-art interactive 3D candle customization workshop.

---

## 🌟 Key Features

### 🎨 1. The Custom Studio (Interactive 3D Atelier)
At the heart of LUME is a custom 3D design studio (built with **React Three Fiber** and **Three.js**):
- **Real-Time 3D Rendering**: Users can rotate, zoom, and interact with a premium 3D candle model in real-time.
- **Bespoke Adjustments**:
  - **The Vessel**: Select artisan shapes (Classic Cylinder, Geometric Prism, Bubble Cube, Rose Ball).
  - **The Hue**: Pick premium wax color bases with live custom hex-color rendering.
  - **The Essence**: Choose organic scent notes (Vanilla, Lavender, Santal & Cardamom, Spiced Chai).
  - **The Scale**: Adjust sizes dynamically (Petite 4oz, Atelier 8oz, Grand 12oz).
- **Dynamic Pricing**: Custom components instantly adjust prices depending on wax weight, scent exclusivity, and vessel complexity.

### 🛍️ 2. Product Catalog
- **Aesthetic Presentation**: Responsive gallery card displays utilizing parallax scrolling, floating background gradients, and smooth entry animations.
- **Tag-Based Filtering**: Easily navigate across curated collections (Signature, Seasonal, Aromatherapy, Decorative).

### 🔐 3. User Authentication & Profile
- **Account Verification**: Registration flow featuring robust OTP email verification via Nodemailer.
- **Role-Based Access**: Specialized administrative dashboards versus customer purchasing views.
- **Purchase History**: Complete client profile layout keeping track of past orders and shipping details.

### 📊 4. Admin Command Center
An expansive panel built for atelier operators:
- **Product CRUD**: Interface to configure names, categories, scent compositions, pricing, burn times, stock, and Base64 images.
- **Custom Atelier Manager**: Instant admin control over color listings, scent availability, pricing adjustments, and default wax base prices without code re-deployments.
- **Order Tracking**: Comprehensive pipeline to oversee, ship, complete, or cancel user orders.

---

## 🛠️ Tech Stack & Database Architecture

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **3D Engine**: Three.js (`react-three-fiber`, `@react-three/drei`)
- **State & Routing**: React Context API & `react-router-dom`

### Backend
- **Framework**: Node.js & Express.js
- **Mailers**: Nodemailer (SMTP Service)
- **Security**: JSON Web Tokens (JWT) for access/refresh sessions & BcryptJS password hashing.

### Database Layer (Migrated)
- **Database Engine**: **Supabase (PostgreSQL)**
- **Cold-Start Optimizations**: Fully stateless client initialization optimized for **Vercel Serverless Functions**.
- **Thread-Safe Sequences**: Native PostgreSQL order number generators (`ORD-XXXX`) avoiding multi-user race conditions.
- **JSONB Structures**: Modern JSON columns to persist nested object structures cleanly.

---

## 🚀 Setup & Installation

### Prerequisite DB Configuration (Supabase)
1. Set up a new project on [Supabase](https://supabase.com/).
2. Navigate to the SQL Editor and execute the contents of the [schema.sql](schema.sql) file located in the root of this project. This initializes all sequences, tables, indexes, and populates the default Custom Studio values.

### Env Configuration (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
ACCESS_TOKEN_SECRET=your_access_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Run Locally
```bash
# Clone the repository
git clone https://github.com/osamaaltaf-pk/LUME-.git

# Install and start the backend
cd LUME-/backend
npm install
npm run dev

# Install and start the frontend
cd ../frontend
npm install
npm run dev
```

---

## 🎨 UI & UX Design Language
LUME features a distinct **glassmorphism** visual theme:
- Curated warm-neutral tone color system (sands, creams, and terracotta shades).
- Subtle, floating micro-animations on interactive items to give a live feeling.
- Responsive design tailored for beautiful mobile, tablet, and desktop viewing.
