import React from 'react'
import Layout from 'components/Layout'
import ProductForm from 'components/ProductForm';

const NewProduct = () => {
  return (
    <Layout>
       <h1>Add a new product</h1>
       <ProductForm />  
    </Layout>
  )
}

export default NewProduct