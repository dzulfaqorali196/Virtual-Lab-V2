"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, FileJson } from "lucide-react"
import { useExperiments } from "@/hooks/use-experiments"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DataExport() {
  const { experiments, exportData } = useExperiments()
  const [timeRange, setTimeRange] = useState("all")
  const [dataPoints, setDataPoints] = useState("all")
  const [format, setFormat] = useState<"csv" | "json">("csv")

  const handleExport = async () => {
    await exportData({
      timeRange,
      dataPoints,
      format
    })
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Export Data</h2>
          <p className="text-sm text-muted-foreground">
            Download your experiment data in various formats
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Time Range</h3>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Data Points</h3>
            <Select value={dataPoints} onValueChange={setDataPoints}>
              <SelectTrigger>
                <SelectValue placeholder="Select data points" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data</SelectItem>
                <SelectItem value="summary">Summary Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={format === "csv" ? "default" : "outline"}
                onClick={() => setFormat("csv")}
                className="w-full"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button
                variant={format === "json" ? "default" : "outline"}
                onClick={() => setFormat("json")}
                className="w-full"
              >
                <FileJson className="mr-2 h-4 w-4" />
                JSON
              </Button>
            </div>
            <Button 
              onClick={handleExport}
              className="w-full"
              disabled={!experiments.length}
            >
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}