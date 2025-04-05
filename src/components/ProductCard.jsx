import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import service from '../appwrite/config'

function ProductCard({ product }) {
  const dispatch = useDispatch()
  
  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }))
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/product/${product.$id}`}>  {/* Changed from /product/id to use actual product.$id */}
      {product.featuredimage ? (
              <img
                src={service.getFilePreview(product.featuredimage)}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            ) : product.images && product.images.length > 0 ? (
              <div className="relative w-full h-48">
                <img
                  src={service.getMultipleFilesPreviews(product.images)[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                    +{product.images.length - 1}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No images available</span>
              </div>
            )}
        
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.$id}`}>  {/* Changed from product.id to product.$id */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-purple-600">{product.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.shortdescription}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-purple-600 font-bold">₹{product.salerate}</span>
            {product.purchaserate > product.salerate && (
              <span className="text-gray-400 line-through text-sm ml-2">₹{product.purchaserate}</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleAddToCart}
              className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard