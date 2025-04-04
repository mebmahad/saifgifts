import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import Container from '../components/Container'

function OrderHistory() {
  const navigate = useNavigate()
  const authStatus = useSelector(state => state.auth.status)
  const userData = useSelector(state => state.auth.userData)
  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authStatus) {
      navigate('/login')
      return
    }
    
    // Fetch user orders
    fetchOrders()
  }, [authStatus, navigate])
  
  const fetchOrders = async () => {
    try {
      setLoading(true)
      // This would fetch orders from your backend
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API delay
      
      const mockOrders = [
        {
          id: 'ORD123456',
          date: '2023-05-15',
          total: 1250,
          status: 'Delivered',
          items: [
            { id: 'item1', name: 'Birthday Gift Box', quantity: 1, price: 850, image: 'https://via.placeholder.com/150?text=Gift+Box' },
            { id: 'item2', name: 'Greeting Card', quantity: 2, price: 200, image: 'https://via.placeholder.com/150?text=Card' }
          ],
          shippingAddress: {
            name: userData?.name || 'User',
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            phone: '9876543210'
          },
          paymentMethod: 'Cash on Delivery',
          deliveryDate: '2023-05-20'
        },
        {
          id: 'ORD789012',
          date: '2023-06-20',
          total: 1800,
          status: 'Processing',
          items: [
            { id: 'item3', name: 'Anniversary Special', quantity: 1, price: 1500, image: 'https://via.placeholder.com/150?text=Anniversary' },
            { id: 'item4', name: 'Gift Wrapping', quantity: 1, price: 300, image: 'https://via.placeholder.com/150?text=Wrapping' }
          ],
          shippingAddress: {
            name: userData?.name || 'User',
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            phone: '9876543210'
          },
          paymentMethod: 'Cash on Delivery',
          deliveryDate: 'Estimated: 2023-06-25'
        },
        {
          id: 'ORD345678',
          date: '2023-07-10',
          total: 950,
          status: 'Shipped',
          items: [
            { id: 'item5', name: 'Chocolate Gift Hamper', quantity: 1, price: 950, image: 'https://via.placeholder.com/150?text=Chocolate' }
          ],
          shippingAddress: {
            name: userData?.name || 'User',
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            phone: '9876543210'
          },
          paymentMethod: 'Cash on Delivery',
          deliveryDate: 'Estimated: 2023-07-15'
        }
      ]
      
      setOrders(mockOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleViewDetails = (orderId) => {
    const order = orders.find(o => o.id === orderId)
    setSelectedOrder(order)
  }
  
  const handleCloseDetails = () => {
    setSelectedOrder(null)
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Shipped':
        return 'bg-blue-100 text-blue-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const handleDownloadInvoice = (orderId) => {
    // This would generate and download an invoice
    alert(`Invoice download for order ${orderId} would be implemented here`)
  }
  
  return (
    <Container>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
          <Link to="/profile" className="text-purple-600 hover:text-purple-700">
            Back to Profile
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-xl font-medium text-gray-900 mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/"
              className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(order.id)}
                          className="text-purple-600 hover:text-purple-900 mr-4"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(order.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                    <p className="text-gray-600">Order ID: {selectedOrder.id}</p>
                  </div>
                  <button
                    onClick={handleCloseDetails}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Order Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Order Date</p>
                          <p className="font-medium">{selectedOrder.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Payment Method</p>
                          <p className="font-medium">{selectedOrder.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Delivery Date</p>
                          <p className="font-medium">{selectedOrder.deliveryDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                      <p>Phone: {selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                <div className="border rounded-lg overflow-hidden mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img 
                                  className="h-10 w-10 rounded-md object-cover" 
                                  src={item.image} 
                                  alt={item.name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/150?text=Product";
                                  }}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{item.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">₹{selectedOrder.total.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-medium">₹50.00</p>
                  </div>
                  <div className="flex justify-between text-base font-medium mt-4">
                    <p>Total</p>
                    <p>₹{(selectedOrder.total + 50).toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => handleDownloadInvoice(selectedOrder.id)}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Download Invoice
                  </button>
                  <button
                    onClick={handleCloseDetails}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

export default OrderHistory