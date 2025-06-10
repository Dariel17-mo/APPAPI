
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { parseTimeString, calculateHours, calculateOvertimeHours, formatHours } from "@/utils/timeUtils";
import { Clock } from "lucide-react";

interface TimeEntryProps {
  selectedDate: Date;
  onEntryChange: (date: Date, clockIn: string, clockOut: string, hoursWorked: number, overtimeHours: number) => void;
}

const TimeEntry: React.FC<TimeEntryProps> = ({ selectedDate, onEntryChange }) => {
  const [clockIn, setClockIn] = useState<string>("09:00");
  const [clockOut, setClockOut] = useState<string>("17:00");
  const [hoursWorked, setHoursWorked] = useState<number>(10.6);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);

  // Calculate hours whenever clock-in or clock-out changes
  useEffect(() => {
    if (clockIn && clockOut) {
      try {
        const clockInDate = parseTimeString(selectedDate, clockIn);
        const clockOutDate = parseTimeString(selectedDate, clockOut);
        
        // Handle overnight shifts if clock-out is earlier than clock-in
        let calculatedHours = calculateHours(clockInDate, clockOutDate);
        if (calculatedHours < 0) {
          calculatedHours += 24; // Add 24 hours for overnight shifts
        }
        
        const calculatedOvertimeHours = calculateOvertimeHours(calculatedHours);
        
        setHoursWorked(calculatedHours);
        setOvertimeHours(calculatedOvertimeHours);
        
        // Notify parent component of the change
        onEntryChange(selectedDate, clockIn, clockOut, calculatedHours, calculatedOvertimeHours);
      } catch (error) {
        console.error("Error al calcular las horas:", error);
      }
    }
  }, [clockIn, clockOut, selectedDate, onEntryChange]);

  const handleClockInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClockIn(e.target.value);
  };

  const handleClockOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClockOut(e.target.value);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Registro de Tiempo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="date" className="mb-2 block">
              Fecha Seleccionada
            </Label>
            <div className="border rounded-md p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                className="mx-auto"
                disabled={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="clockIn" className="mb-2 block">
                Hora de Entrada
              </Label>
              <Input
                type="time"
                id="clockIn"
                value={clockIn}
                onChange={handleClockInChange}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="clockOut" className="mb-2 block">
                Hora de Salida
              </Label>
              <Input
                type="time"
                id="clockOut"
                value={clockOut}
                onChange={handleClockOutChange}
                className="w-full"
              />
            </div>
          </div>

          <Separator className="my-2" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hoursWorked" className="mb-2 block">
                Horas Trabajadas
              </Label>
              <Input
                type="text"
                id="hoursWorked"
                value={formatHours(hoursWorked)}
                disabled
                className="w-full bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="overtimeHours" className="mb-2 block">
                Horas Extra
              </Label>
              <Input
                type="text"
                id="overtimeHours"
                value={formatHours(overtimeHours)}
                disabled
                className="w-full bg-muted"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeEntry;
