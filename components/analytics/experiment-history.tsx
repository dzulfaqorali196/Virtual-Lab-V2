"use client"

import { useEffect, useState } from "react"
import { useExperiments } from "@/hooks/use-experiments"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2 } from "lucide-react"
import { formatDate, formatDuration } from "@/lib/utils"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Match the schema from use-experiments.ts
interface ExperimentParameters {
  length: number
  mass: number
  angle: number
}

interface Experiment {
  _id?: string | any;
  id?: string;
  timestamp: Date | number;
  parameters: ExperimentParameters;
  duration: number;
}

interface ExperimentHistoryRowProps {
  experiment: Experiment
}

function ExperimentHistoryRow({ experiment }: ExperimentHistoryRowProps) {
  const { deleteExperiment } = useExperiments()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (isDeleting) return // Prevent double click
    
    try {
      setIsDeleting(true)
      await deleteExperiment(experiment.id || experiment._id?.toString())
      toast.success('Experiment deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete experiment')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <TableRow>
      <TableCell>
        {new Date(experiment.timestamp).toLocaleDateString()}
      </TableCell>
      <TableCell>
        {experiment.parameters?.length || '-'}
      </TableCell>
      <TableCell>
        {experiment.parameters?.mass || '-'}
      </TableCell>
      <TableCell>
        {experiment.parameters?.angle?.toFixed(1) || '-'}°
      </TableCell>
      <TableCell>{formatDuration(experiment.duration)}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className={cn(
            "h-4 w-4",
            isDeleting ? "animate-spin text-muted-foreground" : "text-destructive"
          )} />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export function ExperimentHistory() {
  const { experiments, isLoading, loadExperiments, exportData } = useExperiments()

  useEffect(() => {
    loadExperiments()
  }, [loadExperiments])

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">Loading experiments...</p>
        </div>
      </Card>
    )
  }

  if (!experiments.length) {
    return (
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Experiment History</h2>
              <p className="text-sm text-muted-foreground">
                Record of your previous experiments
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No experiments recorded yet.</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Experiment History</h2>
            <p className="text-sm text-muted-foreground">
              Record of your previous experiments
            </p>
          </div>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiments.map((experiment) => (
                <ExperimentHistoryRow 
                  key={experiment.id || experiment._id?.toString()}
                  experiment={experiment}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
}