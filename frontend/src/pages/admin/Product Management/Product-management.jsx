import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, Plus, X, Save, Upload } from 'lucide-react';
import LoadingCircles from '../../../components/Loading-circles';
import './Product-management.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [Saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        categoryId: '',
        brand: '',
        gender: 'Male',
        type: 'Clothe',
        basePrice: 0,
        images: [],
        isFeatured: false,
        isActive: true
    });
    const [variants, setVariants] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setSaving(true);
            const [prodRes, catRes] = await Promise.all([
                axios.get('http://localhost:8080/api/products/filter?size=100'),
                axios.get('http://localhost:8080/api/categories')
            ]);
            setProducts(prodRes.data.content);
            setCategories(catRes.data);
            setSaving(false);
        } catch (error) {
            console.error("Fetch error:", error);
            setSaving(false);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e, target = 'product', variantIndex = null) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                if (target === 'product') {
                    setFormData(prev => ({ ...prev, images: [...prev.images, base64String] }));
                } else if (target === 'variant' && variantIndex !== null) {
                    const updatedVariants = [...variants];
                    updatedVariants[variantIndex].variantImage = base64String;
                    setVariants(updatedVariants);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeProductImage = (index) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleOpenModal = async (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({ ...product, isFeatured: product.isFeatured || false });
            try {
                const varRes = await axios.get(`http://localhost:8080/api/variants/product/${product.productId}`);
                setVariants(varRes.data);
            } catch (error) { setVariants([]); }
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                categoryId: '',
                brand: '',
                gender: 'Male',
                type: 'Clothe',
                basePrice: 0,
                images: [],
                isFeatured: false,
                isActive: true
            });
            setVariants([]);
        }
        setIsModalOpen(true);
    };

    const removeProduct = async (product) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`http://localhost:8080/api/products/${product.productId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert("Product deleted successfully!");
                await fetchInitialData();
            } catch (err) {
                alert("Forbidden: You don't have permission to delete.");
                console.error("Delete error:", err);
            }
        }
    }

    const addNewVariantRow = () => {
        setVariants([...variants, {
            size: '',
            color: '',
            price: formData.basePrice,
            stock: 0,
            sku: '',
            variantImage: ''
        }]);
    };

    const updateVariantField = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const removeVariant = async (index) => {
        const v = variants[index];
        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        if (v.id && window.confirm("Are you sure you want to delete this variant?")) {
            try {
                await axios.delete(`http://localhost:8080/api/variants/${v.id}`, config);
                setVariants(variants.filter((_, i) => i !== index));
            } catch (error) {
                alert("Could not delete variant. Error 403.");
            }
        } else if (!v.id) {
            setVariants(variants.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            let currentProductId;
            if (editingProduct) {
                await axios.put(`http://localhost:8080/api/products/${editingProduct.productId}`, formData, config);
                currentProductId = editingProduct.productId;
            } else {
                const res = await axios.post('http://localhost:8080/api/products', formData, config);
                currentProductId = res.data.productId;
            }

            const variantPromises = variants.map(v => {
                const payload = {
                    ...v,
                    productId: currentProductId,
                    price: v.price ? parseFloat(v.price) : formData.basePrice,
                    stock: v.stock ? parseInt(v.stock, 10) : 0,
                    id: v.id || null
                };

                if (v.id && v.id !== "") {
                    return axios.put(`http://localhost:8080/api/variants/${v.id}`, payload, config);
                } else {
                    const { id, ...newVariantPayload } = payload;
                    return axios.post(`http://localhost:8080/api/variants`, newVariantPayload, config);
                }
            });

            await Promise.all(variantPromises);
            setIsModalOpen(false);
            alert("Save successfully!");
            await fetchInitialData();
        } catch (error) {
            console.error("Save error:", error.response);
            alert("Error occurred while saving.");
        }
    };

    if (Saving) return <LoadingCircles />;

    return (
        <div className="admin-page">
            <div className="admin-header-section">
                <h1>Product Management</h1>
                <button className="add-button" onClick={() => handleOpenModal()}><Plus size={18} /> Add Product</button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.productId}>
                                <td><img src={p.images?.[0] || 'https://via.placeholder.com/50'} className="admin-thumb" alt="" /></td>
                                <td><div className="prod-name">{p.name}</div></td>
                                <td>{new Intl.NumberFormat('vi-VN').format(p.basePrice)}đ</td>
                                <td>{categories.find(c => c.id === p.categoryId)?.name || 'N/A'}</td>
                                <td className="actions">
                                    <button
                                        className="edit-icon"
                                        onClick={() => handleOpenModal(p)}>
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        className="delete-icon"
                                        onClick={() => removeProduct(p)}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content admin-modal-scroll">
                        <div className="modal-header">
                            <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                            <X className="close-icon" onClick={() => setIsModalOpen(false)} />
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Product Name *</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Slug *</label>
                                    <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Base Price *</label>
                                    <input type="number" value={formData.basePrice} onChange={e => setFormData({ ...formData, basePrice: e.target.value })} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Product Images</label>
                                <div className="upload-box">
                                    <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, 'product')} id="prod-img" hidden />
                                    <label htmlFor="prod-img" className="upload-label"><Upload size={16} /> Click to upload images</label>
                                </div>
                                <div className="image-preview-grid">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="preview-item">
                                            <img src={img} alt="" />
                                            <button type="button" onClick={() => removeProductImage(idx)}><X size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Unisex">Unisex</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} required>
                                        <option value="">-- Select --</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="variants-section">
                                <h3>Product Variants</h3>
                                <table className="variant-form-table">
                                    <thead>
                                        <tr>
                                            <th>Img</th>
                                            <th>Size</th>
                                            <th>Color</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>SKU</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variants.map((v, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="variant-img-cell">
                                                        {v.variantImage ? <img src={v.variantImage} alt="" onClick={() => updateVariantField(index, 'variantImage', '')} />
                                                            : <input type="file" onChange={(e) => handleImageUpload(e, 'variant', index)} />}
                                                    </div>
                                                </td>
                                                <td><input type="text" value={v.size} onChange={e => updateVariantField(index, 'size', e.target.value)} className="small-inp" /></td>
                                                <td><input type="text" value={v.color} onChange={e => updateVariantField(index, 'color', e.target.value)} className="small-inp" /></td>
                                                <td><input type="number" value={v.price} onChange={e => updateVariantField(index, 'price', e.target.value)} className="small-inp" /></td>
                                                <td><input type="number" value={v.stock} onChange={e => updateVariantField(index, 'stock', e.target.value)} className="small-inp" /></td>
                                                <td><input type="text" value={v.sku} onChange={e => updateVariantField(index, 'sku', e.target.value)} className="small-inp" /></td>
                                                <td><button type="button" onClick={() => removeVariant(index)} className="remove-var-button"><X size={16} /></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button type="button" className="add-variant-button" onClick={addNewVariantRow}><Plus size={14} /> Add Row</button>
                            </div>

                            <div className="checkbox-wrapper">
                                <label htmlFor="feat">Featured Product</label>
                                <input
                                    type="checkbox"
                                    id="feat"
                                    checked={formData.isFeatured}
                                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="save-button">
                                <Save size={18} /> Save All Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;