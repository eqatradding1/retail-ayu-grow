import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Plus, Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Unit {
  id: string;
  name: string;
  description: string;
}

const Units = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data for units
    const mockUnits = [
      { id: "1", name: "pcs", description: "Pieces" },
      { id: "2", name: "kg", description: "Kilograms" },
      { id: "3", name: "g", description: "Grams" },
      { id: "4", name: "l", description: "Liters" },
      { id: "5", name: "ml", description: "Milliliters" },
    ];
    setUnits(mockUnits);
  }, []);

  const handleCreate = () => {
    if (!name || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    // In a real app, this would save to a database
    const newUnit = {
      id: Date.now().toString(),
      name,
      description,
    };
    setUnits([...units, newUnit]);
    toast.success("Unit created successfully!");
    handleCloseDialog();
  };

  const handleUpdate = () => {
    if (!name || !description || !selectedUnit) {
      toast.error("Please fill in all fields");
      return;
    }

    // In a real app, this would update the database
    const updatedUnits = units.map((unit) =>
      unit.id === selectedUnit.id ? { ...unit, name, description } : unit
    );
    setUnits(updatedUnits);
    toast.success("Unit updated successfully!");
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    // In a real app, this would delete from the database
    setUnits(units.filter((unit) => unit.id !== id));
    toast.success("Unit deleted successfully!");
  };

  const handleOpenDialog = (unit: Unit | null = null) => {
    setSelectedUnit(unit);
    if (unit) {
      setName(unit.name);
      setDescription(unit.description);
      setIsEditMode(true);
    } else {
      setName("");
      setDescription("");
      setIsEditMode(false);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUnit(null);
    setName("");
    setDescription("");
  };

  // Add navigation function to go back to Products page
  const handleBackToProducts = () => {
    navigate('/products');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product Units</h1>
          <p className="text-muted-foreground">
            Manage your product units of measurement here.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleBackToProducts}>
            Back to Products
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>Add Unit</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Units List</CardTitle>
          <CardDescription>
            View and manage your product units.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell>{unit.description}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(unit)}>
                      <Pencil className="h-4 w-4 mr-2" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(unit.id)}>
                      <Trash className="h-4 w-4 mr-2" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Unit" : "Create Unit"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update your unit here." : "Add a new unit to the list."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button type="submit" onClick={isEditMode ? handleUpdate : handleCreate}>
              {isEditMode ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Units;
