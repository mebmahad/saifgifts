import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import service from '../../appwrite/config'
import { ID } from 'appwrite'  // Add this import

function ProductForm({ product, onSubmit, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(product?.featuredimage || '')
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: product || {}
  })

  // Add this function to handle image changes
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const [imagesPreviews, setImagesPreviews] = useState(product?.images || []);
  
  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      if (!product) {
        data.id = ID.unique()
      }

      // Convert numeric fields to float/integer
      data.purchaserate = parseFloat(data.purchaserate)
      data.salerate = parseFloat(data.salerate)
      data.quantity = parseInt(data.quantity)

      // Handle single image upload
      if (data.image && data.image.length > 0) {
        const file = data.image[0]
        const uploadedFile = await service.uploadFile(file)
        if (uploadedFile) {
          data.featuredimage = uploadedFile.$id
        }
      }

      // Handle multiple images upload
      if (data.images && data.images.length > 0) {
        const files = Array.from(data.images)
        const uploadedFiles = await service.uploadMultipleFiles(files)
        data.images = uploadedFiles // This will be an array of file IDs
      } else {
        data.images = [] // Ensure images is always an array
      }

      await onSubmit(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImagesChange = (e) => {
    const files = e.target.files;
    if (files) {
      const previews = Array.from(files).map(file => URL.createObjectURL(file));
      setImagesPreviews(prev => [...prev, ...previews]);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            {...register("name", { required: "Product name is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Short Description</label>
          <input
            type="text"
            {...register("shortdescription", { required: "Short description is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Long Description</label>
          <textarea
            {...register("longdescription")}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase Rate</label>
          <input
            type="number"
            step="0.01"
            {...register("purchaserate", { required: "Purchase rate is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sale Rate</label>
          <input
            type="number"
            step="0.01"
            {...register("salerate", { required: "Sale rate is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            {...register("quantity", { required: "Quantity is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-lg" />
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          {...register("images")}
          onChange={handleImagesChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
        <div className="mt-2 grid grid-cols-3 gap-2">
          {imagesPreviews.map((preview, index) => (
            <img 
              key={index}
              src={preview}
              alt={`Preview ${index + 1}`}
              className="h-24 w-24 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
    </form>
  )
}

export default ProductForm