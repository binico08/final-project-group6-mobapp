import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Equipment {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  photoUri?: string | null;
}

interface EquipmentContextType {
  equipmentList: Equipment[];
  addEquipment: (equipment: Equipment) => void;
  updateEquipment: (equipment: Equipment) => void;
  deleteEquipment: (id: string) => void;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);

  const addEquipment = (newEquipment: Equipment) => {
    setEquipmentList(prev => [...prev, newEquipment]);
  };

  const updateEquipment = (updatedEquipment: Equipment) => {
    setEquipmentList(prev =>
      prev.map(equip => (equip.id === updatedEquipment.id ? updatedEquipment : equip))
    );
  };

  const deleteEquipment = (id: string) => {
    setEquipmentList(prev => prev.filter(equip => equip.id !== id));
  };

  return (
    <EquipmentContext.Provider
      value={{ equipmentList, addEquipment, updateEquipment, deleteEquipment }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
};
