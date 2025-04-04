import React, { useState, useEffect } from 'react'
import { ID } from 'appwrite' // Add this import
import service from '../../appwrite/config'
import ProductForm from './ProductForm'
import conf from '../../conf/conf'

function ProductsTab() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await service.getProducts([])
      console.log('Products:', response.documents)  // Add this line
      setProducts(response.documents || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (productData) => {
    try {
      await service.createProduct(productData)
      setShowForm(false)
      fetchProducts()
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }
  
  const handleEditProduct = async (productData) => {
    try {
      await service.updateProduct(editingProduct.$id, productData)
      setEditingProduct(null)
      fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }
  
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const product = products.find(p => p.$id === productId)
        if (product && product.featuredimage) {
          await service.deleteFile(product.featuredimage)
        }
        await service.deleteProduct(productId)
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {(showForm || editingProduct) ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <ProductForm
            product={editingProduct}
            onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
            onCancel={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Add New Product
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.$id} className="bg-white rounded-lg shadow overflow-hidden">
            {product.featuredimage ? (
              <img
                src={service.getFilePreview(product.featuredimage)}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  console.log('Image load error for:', product.name)
                }}
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
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600 mt-1">{product.shortdescription}</p>
              <div className="mt-2 space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  ₹{product.salerate}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.quantity}
                </span>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="px-3 py-1 text-sm text-purple-600 border border-purple-600 rounded hover:bg-purple-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.$id)}
                  className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductsTab