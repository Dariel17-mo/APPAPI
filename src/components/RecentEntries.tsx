import React from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { TimeEntry as TimeEntryType, parseTimeString } from "@/utils/timeUtils";

interface RecentEntriesProps {
  entries: TimeEntryType[];
}

const RecentEntries: React.FC<RecentEntriesProps> = ({ entries }) => {
  if (entries.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Entradas Recientes</h2>
      <div className="space-y-3">
        {entries.slice(0, 3).map((entry, index) => (
          <Card key={index} className="p-3 hover:bg-muted/30 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {format(entry.date, "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(parseTimeString(entry.date, entry.clockIn), "hh:mm a")} - 
                  {format(parseTimeString(entry.date, entry.clockOut), "hh:mm a")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{entry.hoursWorked.toFixed(2)} horas</p>
                {entry.overtimeHours > 0 && (
                  <p className="text-sm text-blue-600 font-medium">
                    +{entry.overtimeHours.toFixed(2)} horas extra
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentEntries;