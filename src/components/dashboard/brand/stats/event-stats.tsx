// components/dashboard/brand/stats/events-stats.tsx
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
  } from "recharts";
  import { Button } from "@/components/ui/button";
  import { Calendar, Users } from "lucide-react";
  import InstagramIcon from "@/components/icons/instagram-icon";
  import TiktokIcon from "@/components/icons/tiktok-icon";
  import { formatNumber } from "./stats-dashboard";
  import { Event } from "@/types/brand";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  // Colores para los gráficos
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];
  
  interface EventsStatsProps {
    events: Event[];
    categoryData: any[];
  }
  
  export default function EventsStats({ events, categoryData }: EventsStatsProps) {
    return (
      <>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Rendimiento por evento</CardTitle>
              <CardDescription>
                Comparativa de métricas por cada evento
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={events.slice(0, 5).map(event => ({
                    name: event.title,
                    alcance: Math.floor(Math.random() * 50000) + 10000,
                    aplicaciones: event._count?.interests || 0
                  }))}
                  margin={{ top: 10, right: 10, left: 50, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value, name) => {
                    if (name === 'alcance') return [formatNumber(Number(value)), 'Alcance'];
                    return [value, 'Aplicaciones'];
                  }} />
                  <Legend />
                  <Bar dataKey="aplicaciones" fill="#8884d8" name="Aplicaciones" />
                  <Bar dataKey="alcance" fill="#82ca9d" name="Alcance estimado" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribución por categorías</CardTitle>
              <CardDescription>
                Distribución de eventos por categoría
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Resumen de eventos recientes</CardTitle>
            <CardDescription>
              Métricas de los últimos eventos realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.slice(0, 5).map((event, index) => (
                <div key={event.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">{event.title}</h3>
                    <span className="text-sm text-gray-500">
                      {event.startDate ? new Date(event.startDate).toLocaleDateString() : "Fecha no definida"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-gray-500" />
                      <span className="text-sm">{event._count?.interests || 0} influencers</span>
                    </div>
                    <div className="flex items-center">
                      <InstagramIcon className="mr-1 h-4 w-4 text-pink-600" />
                      <span className="text-sm">{formatNumber(Math.floor(Math.random() * 30000) + 5000)} alcance</span>
                    </div>
                    <div className="flex items-center">
                      <TiktokIcon className="mr-1 h-4 w-4 text-black" />
                      <span className="text-sm">{formatNumber(Math.floor(Math.random() * 3000) + 500)} engagement</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = "/dashboard/brand/events"}>
              Ver todos los eventos
            </Button>
          </CardFooter>
        </Card>
      </>
    );
  }