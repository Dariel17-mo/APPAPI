
import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TimeEntry, formatHours, parseTimeString } from "@/utils/timeUtils";
import { Card } from "./ui/card";

interface EntriesTableProps {
  entries: TimeEntry[];
}

const EntriesTable: React.FC<EntriesTableProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <Card className="p-6 text-center mt-6">
        <p className="text-muted-foreground">No hay entradas de tiempo registradas todavía.</p>
      </Card>
    );
  }

  // Calculate total overtime
  const totalOvertime = entries.reduce(
    (total, entry) => total + entry.overtimeHours,
    0
  );

  return (
    <Card className="mt-6 overflow-hidden">
      <Table>
        <TableCaption>Registro de horas trabajadas para todas las entradas.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora Entrada</TableHead>
            <TableHead>Hora Salida</TableHead>
            <TableHead className="text-right">Horas Trabajadas</TableHead>
            <TableHead className="text-right">Horas Extra</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {format(entry.date, "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {format(parseTimeString(entry.date, entry.clockIn), "h:mm a")}
              </TableCell>
              <TableCell>
                {format(parseTimeString(entry.date, entry.clockOut), "h:mm a")}
              </TableCell>
              <TableCell className="text-right">
                {formatHours(entry.hoursWorked)}
              </TableCell>
              <TableCell className="text-right">
                {entry.overtimeHours > 0
                  ? formatHours(entry.overtimeHours)
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total Horas Extra</TableCell>
            <TableCell colSpan={1} className="text-right"></TableCell>
            <TableCell className="text-right font-medium">
              {formatHours(totalOvertime)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
};

export default EntriesTable;
