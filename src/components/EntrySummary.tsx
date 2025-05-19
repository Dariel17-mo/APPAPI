import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeEntry, formatHours, calculateTotalOvertime } from "@/utils/timeUtils";
import { generatePDF } from "@/utils/pdfGenerator";
import { Download, Printer } from "lucide-react";

interface EntrySummaryProps {
  entries: TimeEntry[];
}

const EntrySummary: React.FC<EntrySummaryProps> = ({ entries }) => {
  const totalOvertime = calculateTotalOvertime(entries);
  const totalRegularHours = entries.reduce((total, entry) => 
    total + (entry.hoursWorked - entry.overtimeHours), 0);

  const handleGeneratePDF = () => {
    generatePDF(entries, totalOvertime);
  };

  return (
    <Card className="shadow-md mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Resumen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Entradas</p>
            <p className="text-2xl font-bold">{entries.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Horas Regulares</p>
            <p className="text-2xl font-bold">{formatHours(totalRegularHours)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Horas Extra</p>
            <p className="text-2xl font-bold text-blue-600">{formatHours(totalOvertime)}</p>
          </div>
        </div>
        
        <Button
          onClick={handleGeneratePDF}
          className="w-full mt-4"
          disabled={entries.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Generar Reporte PDF
        </Button>
      </CardContent>
    </Card>
  );
};

export default EntrySummary;