
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { TimeEntry as TimeEntryType, formatDateForDisplay } from "@/utils/timeUtils";

// Import our components
import DateSelector from "./DateSelector";
import TimeEntry from "./TimeEntry";
import EntryActions from "./EntryActions";
import EntrySummary from "./EntrySummary";
import RecentEntries from "./RecentEntries";
import EntriesTable from "./EntriesTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Local storage key for time entries
const TIME_ENTRIES_STORAGE_KEY = "time_tracker_entries";

const TimeTracker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [entries, setEntries] = useState<TimeEntryType[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntryType | null>(null);
  const [activeTab, setActiveTab] = useState<string>("entry");

  // Load entries from localStorage on component mount
  useEffect(() => {
    const loadEntriesFromStorage = () => {
      try {
        const storedEntries = localStorage.getItem(TIME_ENTRIES_STORAGE_KEY);
        if (storedEntries) {
          // Parse the stored entries and convert date strings back to Date objects
          const parsedEntries: TimeEntryType[] = JSON.parse(storedEntries).map(
            (entry: any) => ({
              ...entry,
              date: new Date(entry.date)
            })
          );
          setEntries(parsedEntries);
          toast.info("Registros de horas cargados");
        }
      } catch (error) {
        console.error("Error loading entries from localStorage:", error);
        toast.error("Error al cargar los registros guardados");
      }
    };

    loadEntriesFromStorage();
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    const saveEntriesToStorage = () => {
      try {
        localStorage.setItem(TIME_ENTRIES_STORAGE_KEY, JSON.stringify(entries));
      } catch (error) {
        console.error("Error saving entries to localStorage:", error);
        toast.error("Error al guardar los registros");
      }
    };

    if (entries.length > 0) {
      saveEntriesToStorage();
    }
  }, [entries]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCalendarOpen(false);
      
      // Check if there's already an entry for this date
      const existingEntryIndex = entries.findIndex(
        (entry) => format(entry.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      );
      
      if (existingEntryIndex >= 0) {
        // Use the existing entry
        setCurrentEntry(entries[existingEntryIndex]);
        toast.info("Registro existente cargado para esta fecha");
      } else {
        // Create a new empty entry
        setCurrentEntry({
          date,
          clockIn: "09:00",
          clockOut: "17:00",
          hoursWorked: 9.6,
          overtimeHours: 0
        });
      }
    }
  };

  const handleEntryChange = (date: Date, clockIn: string, clockOut: string, hoursWorked: number, overtimeHours: number) => {
    const updatedEntry = {
      date,
      clockIn,
      clockOut,
      hoursWorked,
      overtimeHours
    };
    
    setCurrentEntry(updatedEntry);
  };

  const handleSaveEntry = () => {
    if (!currentEntry) return;

    // Check if there's already an entry for this date
    const existingEntryIndex = entries.findIndex(
      (entry) => format(entry.date, "yyyy-MM-dd") === format(currentEntry.date, "yyyy-MM-dd")
    );

    let updatedEntries;
    if (existingEntryIndex >= 0) {
      // Update existing entry
      updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = currentEntry;
    } else {
      // Add new entry
      updatedEntries = [...entries, currentEntry];
    }

    // Sort entries by date (newest first)
    updatedEntries.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    setEntries(updatedEntries);
    toast.success("Registro guardado exitosamente");
    
    // Switch to table view after saving
    setActiveTab("table");
  };

  const handleDeleteEntry = () => {
    if (!currentEntry) return;
    
    const updatedEntries = entries.filter(
      (entry) => format(entry.date, "yyyy-MM-dd") !== format(currentEntry.date, "yyyy-MM-dd")
    );
    
    setEntries(updatedEntries);
    setCurrentEntry({
      date: selectedDate,
      clockIn: "09:00",
      clockOut: "17:00",
      hoursWorked: 9.6,
      overtimeHours: 0
    });
    
    toast.info("Registro eliminado");
  };

  // Find entry for selected date
  const entryExists = entries.some(
    (entry) => format(entry.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  return (
    <div className="time-tracker">
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Registro de Horas</h1>
        
        <Tabs 
          defaultValue="entry" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="entry">Registrar Horas</TabsTrigger>
            <TabsTrigger value="table">Ver Registros</TabsTrigger>
          </TabsList>

          <TabsContent value="entry">
            <DateSelector
              selectedDate={selectedDate}
              calendarOpen={calendarOpen}
              setCalendarOpen={setCalendarOpen}
              onDateSelect={handleDateSelect}
            />
            
            {currentEntry && (
              <>
                <TimeEntry 
                  selectedDate={selectedDate} 
                  onEntryChange={handleEntryChange}
                />

                <EntryActions
                  entryExists={entryExists}
                  onSave={handleSaveEntry}
                  onDelete={handleDeleteEntry}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="table">
            {/* Display entries in organized table */}
            <EntriesTable entries={entries} />

            {/* Show summary and export options */}
            <EntrySummary entries={entries} />
          </TabsContent>
        </Tabs>
        
        {/* Show recent entries in card format on entry tab */}
        {activeTab === "entry" && <RecentEntries entries={entries} />}
      </div>
    </div>
  );
};

export default TimeTracker;
