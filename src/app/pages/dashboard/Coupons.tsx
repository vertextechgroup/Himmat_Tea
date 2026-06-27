import React, { useState } from "react";
import { useStore } from "../../../context/StoreContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Trash2, Edit2, Plus, Copy, CheckCircle2, XCircle, Calendar, Tag } from "lucide-react";
import { Switch } from "../../components/ui/switch";

const Coupons = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage" as const,
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    validFrom: new Date().toISOString().split("T")[0],
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    usageLimit: 100,
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCoupon) {
      updateCoupon(editingCoupon.id, formData);
    } else {
      addCoupon(formData);
    }
    resetForm();
    setIsAddDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscount: 0,
      validFrom: new Date().toISOString().split("T")[0],
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      usageLimit: 100,
      isActive: true,
    });
    setEditingCoupon(null);
  };

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setFormData(coupon);
    setIsAddDialogOpen(true);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const getStatusBadge = (coupon: any) => {
    const isExpired = new Date(coupon.validTo) < new Date();
    if (!coupon.isActive) {
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    }
    if (isExpired) {
      return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1c1917]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Coupons
          </h1>
          <p className="text-[#78746e]">Create and manage discount coupons</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2d5a3d] hover:bg-[#0b7c33]">
              <Plus className="h-4 w-4 mr-2" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCoupon ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Coupon Code</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., WELCOME10"
                    required
                  />
                </div>
                <div>
                  <Label>Discount Type</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value: any) => setFormData({ ...formData, discountType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Discount Value</Label>
                  <Input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    placeholder={formData.discountType === "percentage" ? "10" : "50"}
                    required
                  />
                </div>
                <div>
                  <Label>Maximum Discount</Label>
                  <Input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                    placeholder="200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Minimum Order Amount</Label>
                  <Input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    placeholder="500"
                  />
                </div>
                <div>
                  <Label>Usage Limit</Label>
                  <Input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    placeholder="100"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Valid From</Label>
                  <Input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Valid To</Label>
                  <Input
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label>Active</Label>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="ghost" onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#2d5a3d] hover:bg-[#0b7c33]">
                  {editingCoupon ? "Update" : "Create"} Coupon
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {coupons.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-[#78746e]">
              <p>No coupons yet. Create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          coupons.map((coupon) => (
            <Card key={coupon.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#c8a96e] to-[#a08050] flex items-center justify-center">
                        <Tag className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-[#1c1917] font-mono">{coupon.code}</h3>
                          {getStatusBadge(coupon)}
                        </div>
                        <p className="text-sm text-[#78746e]">
                          {coupon.discountType === "percentage" 
                            ? `${coupon.discountValue}% off` 
                            : `₹${coupon.discountValue} off`}
                          {coupon.minOrderAmount > 0 && ` on orders over ₹${coupon.minOrderAmount}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(coupon.code)}
                      title="Copy code"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(coupon)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCoupon(coupon.id)}
                      className="text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-[#78746e]">Usage</p>
                    <p className="font-semibold text-[#1c1917]">{coupon.usedCount}/{coupon.usageLimit}</p>
                  </div>
                  <div>
                    <p className="text-[#78746e]">Max Discount</p>
                    <p className="font-semibold text-[#1c1917]">₹{coupon.maxDiscount}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-[#78746e]" />
                    <div>
                      <p className="text-[#78746e]">Valid From</p>
                      <p className="font-semibold text-[#1c1917]">{new Date(coupon.validFrom).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-[#78746e]" />
                    <div>
                      <p className="text-[#78746e]">Valid To</p>
                      <p className="font-semibold text-[#1c1917]">{new Date(coupon.validTo).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Coupons;
