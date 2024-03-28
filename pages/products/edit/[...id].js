import Layout from 'components/Layout';
import React from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProductForm from 'components/ProductForm';
const EditProduct = () => {
  const [productInfo, setProductInfo] = React.useState(null);
  const router = useRouter();
  const { id } = router.query;
  React.useEffect(() => {
    if (!id) return;
    axios.get(`/api/products?_id=${id}`).then((res) => {
      setProductInfo(res.data);
      console.log(res.data);
    });
  }, []);
  return (
    <Layout>
      <h1>Edit a product</h1>
      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  );
};

export default EditProduct;
