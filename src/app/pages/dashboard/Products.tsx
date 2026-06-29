'use client';

import { useState, useRef, useEffect } from "react";
import { Plus, Search, Edit, Trash2, MoreHorizontal, X, Save, Package } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { ExportButtons, exportToPDF, exportToCSV, printElement } from "../../components/ExportUtils";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  description: string;
  imageUrl: string;
  sku?: string;
  reorderPoint?: number;
  hasVariants: boolean;
  variantOptions?: any;
  createdAt: string;
  updatedAt: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [selectedStockProduct, setSelectedStockProduct] = useState<Product | null>(null);
  const [stockSaving, setStockSaving] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "green",
    price: 0,
    stock: 0,
    description: "",
    imageUrl: "",
    sku: "",
    reorderPoint: 20,
    hasVariants: false,
    status: "In Stock"
  });
  const [stockAdjustment, setStockAdjustment] = useState({
    quantity: 0,
    reason: "",
  });

  const categories = ["All", "green", "black", "herbal", "oolong", "white"];

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data); // The API returns an array directly, not wrapped in { data: ... }
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === "All" || product.category === selectedCategory)
  );

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-[#e8f5ed] text-[#2d5a3d]";
      case "Low Stock":
        return "bg-[#fef3c7] text-[#92400e]";
      case "Out of Stock":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExportPDF = () => {
    if (tableRef.current) {
      exportToPDF(tableRef.current, { filename: "products", title: "Products List" });
    }
  };

  const handleExportCSV = () => {
    const csvData = filteredProducts.map(product => ({
      "Product ID": product.id,
      "Name": product.name,
      "Category": product.category,
      "Price": product.price,
      "Stock": product.stock,
      "Status": product.status,
      "Description": product.description
    }));
    exportToCSV(csvData, { filename: "products" });
  };

  const handlePrint = () => {
    if (tableRef.current) {
      printElement(tableRef.current, { title: "Products List" });
    }
  };

  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.imageUrl || newProduct.price <= 0) {
      toast.error("Please fill in all required fields (Name, Description, Image URL, Price)");
      return;
    }
    const status = newProduct.stock === 0 ? "Out of Stock" : newProduct.stock <= 30 ? "Low Stock" : "In Stock";
    
    try {
      setSaving(true);
      if (editingProduct) {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newProduct, status })
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error updating product:", errorData);
          throw new Error(errorData.error || "Failed to update product");
        }
        toast.success("Product updated successfully!");
      } else {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newProduct, status })
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error adding product:", errorData);
          throw new Error(errorData.error || "Failed to add product");
        }
        toast.success("Product added successfully!");
      }
      await fetchProducts(); // Refresh the list
      setIsAddDialogOpen(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error("Error saving product", error);
      toast.error(error instanceof Error ? error.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      category: "green",
      price: 0,
      stock: 0,
      description: "",
      imageUrl: "",
      sku: "",
      reorderPoint: 20,
      hasVariants: false,
      status: "In Stock"
    });
  };

  const handleAdjustStock = async () => {
    if (!selectedStockProduct || stockAdjustment.quantity === 0 || !stockAdjustment.reason) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setStockSaving(true);
      const newStock = selectedStockProduct.stock + stockAdjustment.quantity;
      const status = newStock === 0 ? "Out of Stock" : newStock <= 30 ? "Low Stock" : "In Stock";
      
      const response = await fetch(`/api/products/${selectedStockProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock, status })
      });
      if (!response.ok) throw new Error("Failed to update stock");
      
      // Also create an inventory transaction!
      await fetch("/api/inventory/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedStockProduct.id,
          productName: selectedStockProduct.name,
          type: stockAdjustment.quantity > 0 ? "IN" : "OUT",
          quantity: Math.abs(stockAdjustment.quantity),
          previousStock: selectedStockProduct.stock,
          newStock,
          reason: stockAdjustment.reason,
        })
      });

      toast.success("Stock updated successfully!");
      await fetchProducts();
      setIsStockDialogOpen(false);
      setSelectedStockProduct(null);
      setStockAdjustment({ quantity: 0, reason: "" });
    } catch (error) {
      console.error("Error updating stock", error);
      toast.error("Failed to update stock");
    } finally {
      setStockSaving(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      imageUrl: product.imageUrl,
      sku: product.sku || "",
      reorderPoint: product.reorderPoint || 20,
      hasVariants: product.hasVariants,
      status: product.status
    });
    setIsAddDialogOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete product");
      toast.success("Product deleted successfully!");
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#78746e]">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1c1917]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Products
          </h1>
          <p className="text-[#78746e] mt-1">Manage your tea products and inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButtons 
            onExportPDF={handleExportPDF} 
            onExportCSV={handleExportCSV} 
            onPrint={handlePrint}
          />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2d5a3d] hover:bg-[#234832] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                <DialogDescription>
                  {editingProduct ? "Update product details" : "Add a new tea product to your inventory"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g., Premium Green Tea"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c !== "All").map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (Rs.)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      placeholder="249"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      placeholder="100"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      placeholder="TEA-001"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Product description"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => {
                  setIsAddDialogOpen(false);
                  setEditingProduct(null);
                  resetForm();
                }} disabled={saving}>
                  Cancel
                </Button>
                <Button className="bg-[#2d5a3d] hover:bg-[#234832]" onClick={handleSaveProduct} disabled={saving}>
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saving ? "Saving..." : "Save Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#2d5a3d]/5 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78746e]" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.filter(c => c !== "All").map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#2d5a3d]/5 overflow-hidden">
        <div className="overflow-x-auto" ref={tableRef}>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[#78746e] bg-[#f9f7f4] border-b border-[#2d5a3d]/5">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d5a3d]/5">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-[#f9f7f4] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#2d5a3d]/10">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#2d5a3d] to-[#0b7c33] flex items-center justify-center text-white">
                            🍃
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#1c1917]">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-[#78746e] truncate max-w-[200px]">{product.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#78746e]">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[#1c1917]">Rs.{product.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#1c1917]">{product.stock} units</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog open={isStockDialogOpen && selectedStockProduct?.id === product.id} onOpenChange={setIsStockDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedStockProduct(product);
                              setIsStockDialogOpen(true);
                            }}
                            className="hover:bg-[#f0ede8]"
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Adjust Stock for {selectedStockProduct?.name}</DialogTitle>
                            <DialogDescription>
                              Current stock: {selectedStockProduct?.stock} units
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="quantity">Quantity (positive to add, negative to remove)</Label>
                              <Input
                                id="quantity"
                                type="number"
                                value={stockAdjustment.quantity}
                                onChange={(e) =>
                                  setStockAdjustment({ ...stockAdjustment, quantity: Number(e.target.value) })
                                }
                                placeholder="e.g., 50 or -10"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="reason">Reason</Label>
                              <Textarea
                                id="reason"
                                value={stockAdjustment.reason}
                                onChange={(e) =>
                                  setStockAdjustment({ ...stockAdjustment, reason: e.target.value })
                                }
                                placeholder="e.g., Restock from supplier, Return, etc."
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setIsStockDialogOpen(false);
                                setSelectedStockProduct(null);
                                setStockAdjustment({ quantity: 0, reason: "" });
                              }}
                              disabled={stockSaving}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-[#2d5a3d] hover:bg-[#234832]"
                              onClick={handleAdjustStock}
                              disabled={stockSaving}
                            >
                              {stockSaving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              ) : (
                                <Save className="h-4 w-4 mr-2" />
                              )}
                              {stockSaving ? "Saving..." : "Save"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="hover:bg-[#f0ede8]"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-red-600">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#78746e]">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
