import Layout from 'components/Layout';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
const DeleteProduct = () => {
  const Router = useRouter();
  const [productInfo, setProductInfo] = React.useState(null);
  const { id } = Router.query;
  useEffect(() => {
    if (!id) return;
    axios.get(`/api/products?_id=${id}`).then((res) => {
      setProductInfo(res.data);
    });
  }, []);
  function goBack() {
    Router.push('/products');
  }
  function deleteProduct() {
    axios.delete(`/api/products?_id=` + id).then((res) => {
      Router.push('/products');
    });
  }
  return (
    <Layout>
      <div className='flex jutify-center items-center flex-col justify-center h-full -mt-14'>
        <h1>Delete product "{productInfo?.title}"?</h1>
        <div className='mt-2 flex gap-2'>
          <button className='btn-red' onClick={deleteProduct}>
            Yes
          </button>
          <button className='btn-primary' onClick={goBack}>
            Cancel
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DeleteProduct;
