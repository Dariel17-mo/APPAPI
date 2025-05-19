
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Trash, Table } from "lucide-react";

interface EntryActionsProps {
  entryExists: boolean;
  onSave: () => void;
  onDelete: () => void;
}

const EntryActions: React.FC<EntryActionsProps> = ({ 
  entryExists, 
  onSave, 
  onDelete 
}) => {
  return (
    <div className="flex space-x-2 mt-4">
      <Button className="flex-1" onClick={onSave}>
        <Save className="w-4 h-4 mr-2" />
        {entryExists ? "Actualizar Entrada" : "Guardar Entrada"}
      </Button>
      
      {entryExists && (
        <Button variant="destructive" onClick={onDelete}>
          <Trash className="w-4 h-4 mr-2" />
          Eliminar
        </Button>
      )}
    </div>
  );
};

export default EntryActions;
