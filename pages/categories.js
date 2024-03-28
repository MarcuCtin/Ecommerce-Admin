import axios from 'axios';
import Layout from 'components/Layout';
import React, { useEffect } from 'react';
import { withSwal } from 'react-sweetalert2';
const Categories = ({ swal }) => {
  const [editedCategory, setEditedCategory] = React.useState(null);
  const [name, setName] = React.useState('');
  const [categories, setCategories] = React.useState([]);
  const [parentCategory, setParentCategory] = React.useState(null);
  const [properties, setProperties] = React.useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory: parentCategory || undefined,
      properties: properties.map((prop) => {
        return {
          name: prop.name,
          values: prop.values.split(','),
        };
      }),
    };
    if (editedCategory) {
      console.log('muiec coaw');
      await axios.put(`/api/categories`, { ...data, _id: editedCategory._id });
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    setParentCategory(null);
    setProperties([]);
    fetchCategories();
  }
  function fetchCategories() {
    axios.get('/api/categories').then((res) => {
      setCategories(res.data);
    });
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name); // Replace 'name' with 'categoryName'
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(','),
      }))
    );
    setParentCategory(category.parent?._id);
    console.log(editedCategory);
  }
  function deleteCategory(category) {
    swal
      .fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this category!',
        showCancelButton: true,
        cancelButtonTitle: 'Cancel',
        confirmButtonColor: '#d33',
        confirmButtonBorder: 'none',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          await axios.delete(`/api/categories?_id=${category._id}`);
          fetchCategories(); //update categories
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function addProperty() {
    setProperties((oldProperties) => {
      return [
        ...oldProperties,
        {
          name: '',
          values: '',
        },
      ];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((oldProperties) => {
      const newProperties = [...oldProperties];
      newProperties[index].name = newName;
      return newProperties;
    });
  }
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((oldProperties) => {
      const newProperties = [...oldProperties];
      newProperties[index].values = newValues;
      return newProperties;
    });
  }
  function removeProperty(index) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => pIndex !== index);
    });
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : 'Add New Category'}
      </label>
      <form className='' onSubmit={saveCategory}>
        <div className='flex gap-1'>
          <input
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            type='text'
            className=''
            placeholder='category name'
          />
          <select
            className='mb-2'
            value={parentCategory || ''}
            onChange={(ev) => {
              setParentCategory(ev.target.value);
            }}
          >
            <option value=''>No parent Category</option>
            {!!categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className='mb-1'>
          <label className='block'>Properties</label>
          <button
            type='button'
            onClick={addProperty}
            className='btn-default text-sm mb-2'
          >
            Add new property
          </button>
          {properties?.length > 0 &&
            properties.map((property, index) => (
              <div key={property._id} className='flex gap-1 mb-2'>
                <input
                  type='text'
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                  value={property.name}
                  placeholder='name'
                  className='mb-0'
                />
                <input
                  type='text'
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                  value={property.values}
                  placeholder='ex: 1,2,3'
                  className='mb-0'
                />
                <button
                  onClick={() => removeProperty(index)}
                  className='btn-default'
                  type='button'
                >
                  remove
                </button>
              </div>
            ))}
        </div>
        <div className='flex gap-1'>
          {editedCategory && (
            <button
              type='button'
              onClick={() => {
                setEditedCategory(null);
                setParentCategory('');
                setName('');
                setProperties([]);
              }}
              className='btn-red'
            >
              Cancel
            </button>
          )}
          <button className='btn-primary' type='submit'>
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className='basic mt-4'>
          <thead>
            <tr>
              <td>category name</td>
              <td>Parent Category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {!!categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className='mr-1 bg-primary text-white rounded-md px-2 py-1'
                    >
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className='bg-red-400 text-white rounded-md px-2 py-1'
                    >
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
