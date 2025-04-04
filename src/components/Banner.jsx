import React from 'react'
import { Link } from 'react-router-dom'
import Container from './Container'


function Banner() {
  // Define the banner object with necessary properties
  const banner = {
    image: "https://via.placeholder.com/400x300?text=Special+Gifts",
    title: "Special Gifts for Special Moments"
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-10 md:py-16">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Special Gifts for Special Moments
            </h2>
            <p className="text-purple-100 text-lg mb-6">
              Discover our premium collection of handcrafted gifts perfect for any occasion.
              Limited time offer - Get 20% off on selected items!
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-purple-100 transition-colors"
            >
              Shop Now
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                // If the image fails to load, use a local fallback image or a data URI
                e.target.onerror = null; // Prevent infinite error loop
                e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-size='24' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23999999'%3ESpecial Gifts%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Banner;