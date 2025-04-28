
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

// Mock data for units - will be replaced with Supabase integration
const initialUnits = [
  { id: "1", name: "Kg", description: "Kilogram" },
  { id: "2", name: "g", description: "Gram" },
  { id: "3", name: "L", description: "Liter" },
  { id: "4", name: "ml", description: "Milliliter" },
  { id: "5", name: "pcs", description: "Pieces" },
];

export default function Units() {
  const [units, setUnits] = useState(initialUnits);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState({
    id: "",
    name: "",
    description: "",
  });

  const handleAddUnit = () => {
    const newUnit = {
      id: Date.now().toString(),
      name: currentUnit.name,
      description: currentUnit.description,
    };
    setUnits([...units, newUnit]);
    setIsAddDialogOpen(false);
    toast.success("Unit added successfully");
    setCurrentUnit({ id: "", name: "", description: "" });
  };

  const handleEditUnit = () => {
    const updatedUnits = units.map((unit) =>
      unit.id === currentUnit.id ? currentUnit : unit
    );
    setUnits(updatedUnits);
    setIsEditDialogOpen(false);
    toast.success("Unit updated successfully");
    setCurrentUnit({ id: "", name: "", description: "" });
  };

  const handleDeleteUnit = () => {
    const updatedUnits = units.filter((unit) => unit.id !== currentUnit.id);
    setUnits(updatedUnits);
    setIsDeleteDialogOpen(false);
    toast.success("Unit deleted successfully");
    setCurrentUnit({ id: "", name: "", description: "" });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Units</h1>
        <Button
          onClick={() => {
            setCurrentUnit({ id: "", name: "", description: "" });
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Unit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Units of Measurement</CardTitle>
          <CardDescription>
            Manage product units of measurement for your inventory.
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
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell>{unit.description}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentUnit(unit);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentUnit(unit);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Unit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Unit</DialogTitle>
            <DialogDescription>
              Add a new unit of measurement for products.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Unit Name</label>
              <Input
                id="name"
                value={currentUnit.name}
                onChange={(e) =>
                  setCurrentUnit({
                    ...currentUnit,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description">Description</label>
              <Input
                id="description"
                value={currentUnit.description}
                onChange={(e) =>
                  setCurrentUnit({
                    ...currentUnit,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUnit}>Add Unit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Unit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Unit</DialogTitle>
            <DialogDescription>
              Make changes to the unit of measurement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-name">Unit Name</label>
              <Input
                id="edit-name"
                value={currentUnit.name}
                onChange={(e) =>
                  setCurrentUnit({
                    ...currentUnit,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-description">Description</label>
              <Input
                id="edit-description"
                value={currentUnit.description}
                onChange={(e) =>
                  setCurrentUnit({
                    ...currentUnit,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditUnit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Unit Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Unit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this unit?
            </DialogDescription>
          </DialogHeader>
          <p>
            This will permanently delete the "{currentUnit.name}" unit. This
            action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUnit}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
