/**
 * VehicleForm Component
 * Form thêm/sửa xe với upload nhiều ảnh
 */

import { useEffect, useState } from "react";
import {
  Vehicle,
  CreateVehicleDto,
  UpdateVehicleDto,
  FuelType,
  TransmissionType,
} from "@shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VehicleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle | null;
  onSubmit: (data: CreateVehicleDto | UpdateVehicleDto) => Promise<void>;
}

export default function VehicleForm({
  open,
  onOpenChange,
  vehicle,
  onSubmit,
}: VehicleFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    model: "",
    brand: "",
    year: new Date().getFullYear(),
    license_plate: "",
    color: "",
    seats: 5,
    transmission: "automatic" as TransmissionType,
    fuel_type: "electric" as FuelType,
    price_per_hour: 0,
    price_per_day: 0,
    price_per_week: 0,
    battery_capacity: 0,
    range: 0,
    charging_time: 0,
    engine_power: 0,
    max_speed: 0,
    fuel_consumption: 0,
    mileage: 0,
    features: [] as string[],
    description: "",
    stationid: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (vehicle) {
        setFormData({
          name: vehicle.name,
          model: vehicle.model,
          brand: vehicle.brand,
          year: vehicle.year,
          license_plate: vehicle.license_plate,
          color: vehicle.color,
          seats: vehicle.seats,
          transmission: vehicle.transmission,
          fuel_type: vehicle.fuel_type,
          price_per_hour: vehicle.price_per_hour,
          price_per_day: vehicle.price_per_day,
          price_per_week: vehicle.price_per_week,
          battery_capacity: vehicle.battery_capacity || 0,
          range: vehicle.range || 0,
          charging_time: vehicle.charging_time || 0,
          engine_power: vehicle.engine_power || 0,
          max_speed: vehicle.max_speed || 0,
          fuel_consumption: vehicle.fuel_consumption || 0,
          mileage: vehicle.mileage,
          features: vehicle.features || [],
          description: vehicle.description || "",
          stationid: vehicle.stationid,
        });
        setImagePreviews(vehicle.images || []);
      } else {
        setFormData({
          name: "",
          model: "",
          brand: "",
          year: new Date().getFullYear(),
          license_plate: "",
          color: "",
          seats: 5,
          transmission: "automatic",
          fuel_type: "electric",
          price_per_hour: 0,
          price_per_day: 0,
          price_per_week: 0,
          battery_capacity: 0,
          range: 0,
          charging_time: 0,
          engine_power: 0,
          max_speed: 0,
          fuel_consumption: 0,
          mileage: 0,
          features: [],
          description: "",
          stationid: "",
        });
        setImagePreviews([]);
      }
      setErrors({});
    }
  }, [open, vehicle]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.model) newErrors.model = "Model is required";
    if (!formData.license_plate)
      newErrors.license_plate = "License plate is required";
    if (formData.year < 2000 || formData.year > new Date().getFullYear() + 1)
      newErrors.year = "Invalid year";
    if (formData.price_per_day <= 0)
      newErrors.price_per_day = "Price must be > 0";
    if (!formData.stationid) newErrors.stationid = "Station is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const submitData: any = { ...formData };
      // Remove empty optional fields
      Object.keys(submitData).forEach((key) => {
        if (submitData[key] === 0 || submitData[key] === "") {
          if (
            [
              "battery_capacity",
              "range",
              "charging_time",
              "engine_power",
              "max_speed",
              "fuel_consumption",
              "description",
            ].includes(key)
          ) {
            delete submitData[key];
          }
        }
      });

      await onSubmit(submitData);
      toast({
        title: vehicle ? "Vehicle Updated" : "Vehicle Created",
        description: "Operation successful",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
          </DialogTitle>
          <DialogDescription>
            Fill in the vehicle information below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="specs">Specs</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Vehicle Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                <div>
                  <Label>Brand *</Label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => handleChange("brand", e.target.value)}
                    className={errors.brand ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label>Model *</Label>
                  <Input
                    value={formData.model}
                    onChange={(e) => handleChange("model", e.target.value)}
                    className={errors.model ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label>Year *</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      handleChange("year", parseInt(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label>License Plate *</Label>
                  <Input
                    value={formData.license_plate}
                    onChange={(e) =>
                      handleChange("license_plate", e.target.value)
                    }
                    className={errors.license_plate ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <Input
                    value={formData.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Seats *</Label>
                  <Select
                    value={formData.seats.toString()}
                    onValueChange={(val) =>
                      handleChange("seats", parseInt(val))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 seats</SelectItem>
                      <SelectItem value="4">4 seats</SelectItem>
                      <SelectItem value="5">5 seats</SelectItem>
                      <SelectItem value="7">7 seats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Station ID *</Label>
                  <Input
                    value={formData.stationid}
                    onChange={(e) => handleChange("stationid", e.target.value)}
                    placeholder="station-uuid"
                    className={errors.stationid ? "border-red-500" : ""}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Specs Tab */}
            <TabsContent value="specs" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Transmission *</Label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(val) => handleChange("transmission", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fuel Type *</Label>
                  <Select
                    value={formData.fuel_type}
                    onValueChange={(val) => handleChange("fuel_type", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.fuel_type === "electric" && (
                  <>
                    <div>
                      <Label>Battery Capacity (kWh)</Label>
                      <Input
                        type="number"
                        value={formData.battery_capacity}
                        onChange={(e) =>
                          handleChange(
                            "battery_capacity",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label>Range (km)</Label>
                      <Input
                        type="number"
                        value={formData.range}
                        onChange={(e) =>
                          handleChange("range", parseFloat(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <Label>Charging Time (hours)</Label>
                      <Input
                        type="number"
                        value={formData.charging_time}
                        onChange={(e) =>
                          handleChange(
                            "charging_time",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label>Engine Power (HP)</Label>
                  <Input
                    type="number"
                    value={formData.engine_power}
                    onChange={(e) =>
                      handleChange("engine_power", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label>Max Speed (km/h)</Label>
                  <Input
                    type="number"
                    value={formData.max_speed}
                    onChange={(e) =>
                      handleChange("max_speed", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label>Mileage (km)</Label>
                  <Input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) =>
                      handleChange("mileage", parseFloat(e.target.value))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Price per Hour (₫) *</Label>
                  <Input
                    type="number"
                    value={formData.price_per_hour}
                    onChange={(e) =>
                      handleChange("price_per_hour", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label>Price per Day (₫) *</Label>
                  <Input
                    type="number"
                    value={formData.price_per_day}
                    onChange={(e) =>
                      handleChange("price_per_day", parseFloat(e.target.value))
                    }
                    className={errors.price_per_day ? "border-red-500" : ""}
                  />
                  {errors.price_per_day && (
                    <p className="text-sm text-red-500">
                      {errors.price_per_day}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Price per Week (₫)</Label>
                  <Input
                    type="number"
                    value={formData.price_per_week}
                    onChange={(e) =>
                      handleChange("price_per_week", parseFloat(e.target.value))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-4 mt-4">
              <div>
                <Label>Vehicle Images</Label>
                <div className="mt-2 grid grid-cols-4 gap-4">
                  {imagePreviews.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt=""
                        className="w-full h-24 object-cover rounded"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="h-24 border-2 border-dashed rounded flex items-center justify-center hover:bg-gray-50"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                  </button>
                </div>
              </div>

              <div>
                <Label>Features</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add feature"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddFeature())
                    }
                  />
                  <Button type="button" onClick={handleAddFeature}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((f, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {f}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveFeature(idx)}
                      />
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {vehicle ? "Update" : "Create"} Vehicle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
