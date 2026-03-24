"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Download, Eye, MapPin } from "lucide-react"

export default function AdminQRCodesPage() {
  const qrCodes = [
    { id: "qr-1", location: "Naperville Music Store", scans: 247, created: "2025-01-01" },
    { id: "qr-2", location: "Wheaton Community Center", scans: 189, created: "2025-01-05" },
    { id: "qr-3", location: "Aurora Music Academy", scans: 156, created: "2025-01-10" },
    { id: "qr-4", location: "Downers Grove Library", scans: 98, created: "2025-01-12" },
  ]

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="page-container pt-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="mb-1 font-display text-2xl font-medium text-foreground">QR Code Manager</h1>
            <p className="text-sm text-muted-foreground">Distribute and track QR code access points</p>
          </div>
          <Button className="shrink-0">
            <QrCode className="mr-2 h-4 w-4" />
            Generate New QR Code
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <Card className="flex flex-col items-center justify-center p-4">
            <QrCode className="h-5 w-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{qrCodes.length}</p>
            <p className="text-xs text-muted-foreground">QR Codes</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-4">
            <Eye className="h-5 w-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{qrCodes.reduce((sum, qr) => sum + qr.scans, 0)}</p>
            <p className="text-xs text-muted-foreground">Total Scans</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-4">
            <MapPin className="h-5 w-5 text-primary mb-1" />
            <p className="text-2xl font-bold">247</p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </Card>
        </div>

        {/* Distribution Points */}
        <div className="mb-10">
          <h2 className="font-display text-2xl font-medium mb-5">Distribution Points</h2>
          <div className="space-y-3">
            {qrCodes.map((qr) => (
              <Card key={qr.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <QrCode className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{qr.location}</h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {qr.scans} scans
                      </span>
                      <span>Created {new Date(qr.created).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Download
                    </Button>
                    <Button variant="secondary" size="sm" className="h-8 text-xs">
                      Stats
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
