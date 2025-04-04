import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function AuthLayout({ children, authentication = false, adminOnly = false }) {
  const navigate = useNavigate()
  const [loader, setLoader] = useState(true)
  const authStatus = useSelector(state => state.auth.status)
  const userData = useSelector(state => state.auth.userData)

  useEffect(() => {
    // If authentication is required and user is not authenticated
    if (authentication && !authStatus) {
      navigate('/login')
    } 
    // If admin access is required and user is not admin
    else if (adminOnly && userData?.role !== 'admin') {
      navigate('/')
    } 
    // If user is authenticated but tries to access login/signup pages
    else if (!authentication && authStatus) {
      navigate('/')
    }
    
    setLoader(false)
  }, [authStatus, navigate, authentication, adminOnly, userData])

  return loader ? (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  ) : (
    <>{children}</>
  )
}

export default AuthLayout