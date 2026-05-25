import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import NavBar from './components/NavBar.jsx'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Products from './pages/Products.jsx'
import Customize from './pages/Customize.jsx'
import Cart from './pages/Cart.jsx'
import UserRoutes from './components/UserRoutes.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import Profile from './pages/Profile.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Footer from './components/Footer.jsx'
import { CartProvider } from './context/CartContext.jsx'
import AdminOrders from './pages/AdminOrders';


function App() {
  const [userState, setUserState] = useState(false)

  return (
    <>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>

            <NavBar />

            <Routes>

              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Signup />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />

              <Route path='/profile' element={
                <UserRoutes>
                  <Profile />
                </UserRoutes>
              } />

              <Route path='/dashboard' element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />

              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path='/' element={<Home />} />
              <Route path='/products' element={<Products />} />
              <Route path='/customize' element={<Customize />} />
              <Route path='/cart' element={<Cart />} />

            </Routes>

            <Footer />

          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default App