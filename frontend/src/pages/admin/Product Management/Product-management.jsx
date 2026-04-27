import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, Plus, X, Save } from 'lucide-react';
import LoadingCircles from '../../../components/Loading-circles';
import './Product-management.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [categories, setCategories] = useState([]);

    // State cho Product
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

    // State cho danh sách Variants của sản phẩm đang chọn
    const [variants, setVariants] = useState([]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get('http://localhost:8080/api/products/filter?size=100'),
                axios.get('http://localhost:8080/api/categories')
            ]);
            setProducts(prodRes.data.content);
            setCategories(catRes.data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = async (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                ...product,
                categoryId: product.categoryId || '',
                isFeatured: product.isFeatured || false
            });

            // Tải danh sách variants của sản phẩm này từ backend
            try {
                const varRes = await axios.get(`http://localhost:8080/api/variants/product/${product.productId}`);
                setVariants(varRes.data);
            } catch (error) {
                setVariants([]);
            }
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

    // --- Logic xử lý Variant trên UI ---
    const addNewVariantRow = () => {
        setVariants([...variants, { size: '', color: '', price: formData.basePrice, stock: 0, sku: '' }]);
    };

    const updateVariantField = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const removeVariant = async (index) => {
        const variantToDelete = variants[index];
        // Nếu biến thể đã tồn tại trên DB (có id), phải gọi API xóa
        if (variantToDelete.id) {
            if (window.confirm("Xóa vĩnh viễn biến thể này khỏi hệ thống?")) {
                try {
                    await axios.delete(`http://localhost:8080/api/variants/${variantToDelete.id}`);
                } catch (e) { alert("Error while deleting variant!"); return; }
            }
        }
        setVariants(variants.filter((_, i) => i !== index));
    };

    // --- Submit tổng thể ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let currentProductId;

            // 1. Lưu/Cập nhật Product
            if (editingProduct) {
                await axios.put(`http://localhost:8080/api/products/${editingProduct.productId}`, formData);
                currentProductId = editingProduct.productId;
            } else {
                const res = await axios.post('http://localhost:8080/api/products', formData);
                currentProductId = res.data.productId;
            }

            // 2. Lưu/Cập nhật danh sách Variants
            const variantPromises = variants.map(v => {
                const payload = { ...v, productId: currentProductId };
                if (v.id) {
                    return axios.put(`http://localhost:8080/api/variants/${v.id}`, payload);
                } else {
                    return axios.post(`http://localhost:8080/api/variants`, payload);
                }
            });

            await Promise.all(variantPromises);

            setIsModalOpen(false);
            fetchInitialData();
            alert("Save product successfully!");
        } catch (error) {
            console.error(error);
            alert("Error while saving data. Please check again!");
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Deleting this product will not automatically delete its variants. Continue?")) {
            try {
                await axios.delete(`http://localhost:8080/api/products/${id}`);
                setProducts(products.filter(p => p.productId !== id));
            } catch (error) { alert("Failed to delete product!"); }
        }
    };

    if (loading) return <LoadingCircles />;

    return (
        <div className="admin-page">
            <div className="admin-header-section">
                <h1>Product Management</h1>
                <button className="add-button" onClick={() => handleOpenModal()}>
                    <Plus size={18} /> Add Product
                </button>
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
                        {products.map(product => (
                            <tr key={product.productId}>
                                <td><img src={product.images?.[0] || 'https://via.placeholder.com/50'} className="admin-thumb" alt="" /></td>
                                <td>
                                    <div className="prod-name">{product.name}</div>
                                    <div className="prod-slug">{product.slug}</div>
                                </td>
                                <td>{new Intl.NumberFormat('vi-VN').format(product.basePrice)}đ</td>
                                <td>{categories.find(c => c.id === product.categoryId)?.name || 'N/A'}</td>
                                <td className="actions">
                                    <button className="edit-icon" onClick={() => handleOpenModal(product)}><Edit size={18} /></button>
                                    <button className="delete-icon" onClick={() => handleDeleteProduct(product.productId)}><Trash2 size={18} /></button>
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
                            <h2>{editingProduct ? "Edit Product & Variants" : "Add New Product"}</h2>
                            <X className="close-icon" onClick={() => setIsModalOpen(false)} />
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            {/* --- PHẦN THÔNG TIN CHUNG --- */}
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
                                    <label>Type</label>
                                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="Clothe">Clothe</option>
                                        <option value="Shoes">Shoes</option>
                                        <option value="Backpack">Backpack</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} required>
                                    <option value="">-- Select Category --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* --- PHẦN BIẾN THỂ (VARIANTS) --- */}
                            <div className="variants-section">
                                <h3>Product Variants (Sizes & Stock)</h3>
                                <div className="variant-table-wrapper">
                                    <table className="variant-form-table">
                                        <thead>
                                            <tr>
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
                                                    <td><input type="text" value={v.size} onChange={e => updateVariantField(index, 'size', e.target.value)} placeholder="42" /></td>
                                                    <td><input type="text" value={v.color} onChange={e => updateVariantField(index, 'color', e.target.value)} placeholder="Black" /></td>
                                                    <td><input type="number" value={v.price} onChange={e => updateVariantField(index, 'price', e.target.value)} /></td>
                                                    <td><input type="number" value={v.stock} onChange={e => updateVariantField(index, 'stock', e.target.value)} /></td>
                                                    <td><input type="text" value={v.sku} onChange={e => updateVariantField(index, 'sku', e.target.value)} placeholder="SKU..." /></td>
                                                    <td><button type="button" onClick={() => removeVariant(index)} className="remove-var-button"><X size={16} /></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button type="button" className="add-variant-button" onClick={addNewVariantRow}>
                                    <Plus size={14} /> Add new variant
                                </button>
                            </div>

                            <div className="checkbox-wrapper">
                                <label htmlFor="isFeatured">Featured Product</label>
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                                />
                            </div>

                            <button type="submit" className="save-button"><Save size={18} /> Save All Changes</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;