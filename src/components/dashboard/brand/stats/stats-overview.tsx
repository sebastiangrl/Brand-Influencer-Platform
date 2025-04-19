// components/dashboard/brand/stats/stats-overview.tsx
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "./stats-dashboard";

// Colores para los gráficos
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

interface StatsOverviewProps {
  stats: {
    totalEvents: number;
    activeEvents: number;
    totalInfluencers: number;
    totalReach: number;
    totalImpressions: number;
    totalEngagement: number;
  };
  eventData: any[];
  reachData: any[];
  platformData: any[];
}

export default function StatsOverview({ 
  stats, 
  eventData, 
  reachData, 
  platformData 
}: StatsOverviewProps) {
  return (
    <>
      {/* Tarjetas de estadísticas generales */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-gray-500">
              {stats.activeEvents} eventos activos actualmente
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Influencers colaborando</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInfluencers}</div>
            <p className="text-xs text-gray-500">
              Influencers que han participado en eventos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alcance total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalReach)}</div>
            <p className="text-xs text-gray-500">
              Personas alcanzadas a través de colaboraciones
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engagement total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalEngagement)}</div>
            <p className="text-xs text-gray-500">
              Interacciones generadas por las colaboraciones
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos principales */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Rendimiento de eventos</CardTitle>
            <CardDescription>
              Eventos y aplicaciones por mes
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={eventData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="eventos" fill="#8884d8" name="Eventos" />
                <Bar dataKey="aplicaciones" fill="#82ca9d" name="Aplicaciones" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribución por plataformas</CardTitle>
            <CardDescription>
              Porcentaje de colaboraciones por red social
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-80 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {platformData.map((entry, index) => (
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
      
      {/* Gráfico de tendencias de alcance */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencias de rendimiento</CardTitle>
          <CardDescription>
            Métricas de alcance, impresiones y engagement en el tiempo
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={reachData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [formatNumber(Number(value)), '']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="alcance" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }}
                name="Alcance" 
              />
              <Line 
                type="monotone" 
                dataKey="impresiones" 
                stroke="#82ca9d"
                name="Impresiones" 
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#ffc658"
                name="Engagement" 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}