// components/dashboard/brand/stats/influencers-stats.tsx
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
  import { Users, TrendingUp, Calendar } from "lucide-react";
  import { formatNumber } from "./stats-dashboard";
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
  
  interface InfluencersStatsProps {
    platformData: any[];
  }
  
  export default function InfluencersStats({ platformData }: InfluencersStatsProps) {
    return (
      <>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top influencers por engagement</CardTitle>
              <CardDescription>
                Influencers con mayor tasa de engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { name: "Ana García", engagement: 8.2 },
                    { name: "Luis Martínez", engagement: 7.5 },
                    { name: "Carmen Rodríguez", engagement: 6.9 },
                    { name: "Pablo Sánchez", engagement: 6.4 },
                    { name: "Laura Gómez", engagement: 5.8 },
                  ]}
                  margin={{ top: 10, right: 10, left: 80, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => [`${value}%`, 'Tasa de engagement']} />
                  <Legend />
                  <Bar dataKey="engagement" fill="#8884d8" name="Tasa de engagement (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribución por plataforma</CardTitle>
              <CardDescription>
                Plataformas más utilizadas por los influencers
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
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
        
        <Card>
          <CardHeader>
            <CardTitle>Influencers más activos</CardTitle>
            <CardDescription>
              Influencers que más han colaborado con tu marca
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, name: "Ana García", events: 5, followers: 125000, engagement: 8.2 },
                { id: 2, name: "Luis Martínez", events: 4, followers: 98000, engagement: 7.5 },
                { id: 3, name: "Carmen Rodríguez", events: 3, followers: 210000, engagement: 6.9 },
                { id: 4, name: "Pablo Sánchez", events: 3, followers: 75000, engagement: 6.4 },
                { id: 5, name: "Laura Gómez", events: 2, followers: 145000, engagement: 5.8 },
              ].map((influencer) => (
                <div key={influencer.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">{influencer.name}</h3>
                    <span className="text-sm text-gray-500">
                      {influencer.events} eventos
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-gray-500" />
                      <span className="text-sm">{formatNumber(influencer.followers)} seguidores</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                      <span className="text-sm">{influencer.engagement}% engagement</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-blue-600" />
                      <span className="text-sm">{influencer.events} colaboraciones</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = "/dashboard/brand/influencers"}>
              Ver todos los influencers
            </Button>
          </CardFooter>
        </Card>
      </>
    );
  }