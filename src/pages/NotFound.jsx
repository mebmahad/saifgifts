import React from 'react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'

function NotFound() {
  return (
    <Container>
      <div className="py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-9xl font-bold text-purple-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </Container>
  )
}

export default NotFound