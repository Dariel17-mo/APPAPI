
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateForDisplay } from "@/utils/timeUtils";

interface DateSelectorProps {
  selectedDate: Date;
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
  onDateSelect: (date: Date | undefined) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  calendarOpen,
  setCalendarOpen,
  onDateSelect,
}) => {
  return (
    <Card className="shadow-md mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Seleccionar Fecha</CardTitle>
      </CardHeader>
      <CardContent>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                formatDateForDisplay(selectedDate)
              ) : (
                <span>Elegir una fecha</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
};

export default DateSelector;
