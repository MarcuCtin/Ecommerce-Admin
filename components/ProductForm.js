/* eslint-disable react/jsx-key */
import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Spinner from './Spinner';
import { ReactSortable } from 'react-sortablejs';
import Sortable from 'react-sortablejs';
const ProductForm = ({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: ExistingImages,
  category: assignedCategory,
  properties: ExistingProperties,
}) => {
  const [title, setTitle] = React.useState(existingTitle);
  const [description, setDescription] = React.useState(existingDescription);
  const [price, setPrice] = React.useState(existingPrice);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  let [images, setImages] = useState(ExistingImages || []);
  const [properties, setProperties] = useState([]);
  const router = useRouter();
  const [productProps, setProductProps] = useState(ExistingProperties || {});
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(assignedCategory || null);
  useEffect(() => {
    axios.get('/api/categories').then((res) => {
      setCategories(res.data);
    });
  }, [images]);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProps,
    };
    if (_id) {
      //update
      await axios.put(`/api/products`, { ...data, _id });
    } else {
      //create
      await axios.post('/api/products', data);
    }
    setGoToProducts(true);
  }

  async function uploadImages(ev) {
    console.log(ev);
    const files = ev.target?.files;
    if (files.length > 0) {
      setIsUploading(true);
      const formData = new FormData();
      for (let file of files) {
        formData.append('file', file);
      }
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data];
      });
      setIsUploading(false);
    }
  }

  function updateImagesOrder(newImages) {
    setImages(newImages);
  }
  let propertiesToFill = [];
  if (categories.length > 0 && category) {
    let selectedCat = categories.find(({ _id }) => _id === category);
    console.log(selectedCat.properties);
    if (selectedCat) propertiesToFill.push(...selectedCat.properties); //add all properties of the selected category
    while (selectedCat?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === selectedCat?.parent._id
      ); //find the parent category of the selected category
      if (parentCat) propertiesToFill.push(...parentCat.properties); //add all properties
      selectedCat = parentCat;
    }
  }

  function updateProductProps(name, value) {
    setProductProps((prev) => ({ ...prev, [name]: value }));
  }

  if (goToProducts) {
    router.push('/products');
  } else {
    return (
      <form onSubmit={saveProduct}>
        <label className=''>name</label>
        <input
          type='text'
          placeholder='Product name'
          className='px-2'
          onChange={(ev) => setTitle(ev.target.value)}
          value={title}
        />
        <label className=''>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Uncategorized</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
        props
        <div>
          {propertiesToFill.length > 0 &&
            propertiesToFill.map((property) => (
              <div className=''>
                <label className=''>{property.name}</label>
                <div>
                  <select
                    className='mb-0'
                    value={productProps[property.name] || property.values[0]}
                    onChange={(ev) =>
                      updateProductProps(property.name, ev.target.value)
                    }
                  >
                    {property.values.map((value) => (
                      <option value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
        </div>
        <label>Photos</label>
        <div className='mb-2 font-bold flex flex-wrap gap-2'>
          <ReactSortable
            list={images}
            setList={updateImagesOrder}
            className='flex gap-2 flex-wrap'
          >
            {!!images?.length &&
              images.map((link) => (
                <div
                  key={link}
                  className='h-24 border-gray-200 border border-md rounded-lg'
                >
                  <img src={link} className='h-full rounded-lg' />
                </div>
              ))}
          </ReactSortable>
          {isUploading && (
            <div className='h-12 p-1 flex items-center my-auto'>
              <Spinner />
            </div>
          )}
          <label className='w-24 cursor-pointer h-24 flex flex-col text-sm border border-primary rounded-lg bg-gray-100 text-primary border-primary items-center justify-center '>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5'
              />
            </svg>
            <div>Upload</div>
            <input
              type='file'
              multiple
              className='hidden'
              onChange={uploadImages}
            />
          </label>
          {!images?.length && <div>No images</div>}
        </div>
        <label className=''>description</label>
        <textarea
          className='rounded-lg px-2 py-2 mb-1'
          placeholder='Product description'
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        ></textarea>
        <label className=''>price(usd)</label>
        <input
          type='text'
          placeholder='Product price'
          className='px-2'
          onChange={(ev) => setPrice(ev.target.value)}
          value={price}
        />
        <button type='submit' className='btn-primary'>
          Save
        </button>
      </form>
    );
  }
};

export default ProductForm;
