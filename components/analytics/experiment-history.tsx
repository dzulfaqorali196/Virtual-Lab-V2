"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const experimentHistory = [
  {
    id: 1,
    date: "2024-03-20",
    length: 1.0,
    mass: 0.5,
    initialAngle: 45,
    duration: "00:02:30",
    status: "Completed",
  },
  {
    id: 2,
    date: "2024-03-19",
    length: 1.5,
    mass: 1.0,
    initialAngle: 30,
    duration: "00:01:45",
    status: "Completed",
  },
  {
    id: 3,
    date: "2024-03-18",
    length: 0.8,
    mass: 0.3,
    initialAngle: 60,
    duration: "00:03:15",
    status: "Completed",
  },
]

export function ExperimentHistory() {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Experiment History</h2>
          <p className="text-sm text-muted-foreground">
            Record of your previous experiments
          </p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Length (m)</TableHead>
                <TableHead>Mass (kg)</TableHead>
                <TableHead>Initial Angle (°)</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experimentHistory.map((experiment) => (
                <TableRow key={experiment.id}>
                  <TableCell>{experiment.date}</TableCell>
                  <TableCell>{experiment.length}</TableCell>
                  <TableCell>{experiment.mass}</TableCell>
                  <TableCell>{experiment.initialAngle}</TableCell>
                  <TableCell>{experiment.duration}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{experiment.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
}