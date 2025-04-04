import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import { login, logout } from './store/authSlice'

// Components
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Container from './components/Container'
import AuthLayout from './components/AuthLayout'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import UserProfile from './pages/UserProfile'
import OrderHistory from './pages/OrderHistory'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => setLoading(false))
  }, [dispatch])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {loading ? (
          <Container>
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          </Container>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route 
              path="/admin" 
              element={
                <AuthLayout authentication={true} adminOnly={true}>
                  <AdminDashboard />
                </AuthLayout>
              } 
            />
          </Routes>
        )}
      </main>
      
      <Footer />
    </div>
  )
}

export default App
