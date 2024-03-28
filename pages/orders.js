import Layout from 'components/Layout';
import React, { useEffect } from 'react';
import axios from 'axios';
const OrdersPage = () => {
  const [orders, setOrders] = React.useState([]);
  useEffect(() => {
    axios.get('/api/orders').then((res) => {
      setOrders(res.data);
    });
  }, []);
  return (
    <Layout>
      <h1>Orders Page</h1>
      <table className='basic'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Name</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders?.length &&
            orders.map((order) => (
              <tr key={order._id} className='border border-b'>
                <td>{order.createdAt.replace('T', ' ').substring(0, 19)}</td>
                <td className={order.paid ? 'text-green-600' : 'text-red-400'}>
                  {order.paid ? 'yes' : 'no'}
                </td>
                <td>
                  {order.name} {order.email} <br />
                  {order.city} {order.postalCode} {order.country}
                  <br />
                  {order.address}
                </td>
                <td>
                  {order.lineItems?.map((item) => (
                    <>
                      {item.price_data.product_data.name} | {item.quantity}
                      <br />
                    </>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default OrdersPage;
