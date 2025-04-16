// components/dashboard/brand/profile/brand-profile-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { BrandProfile, User } from "@/types/brand";
import { SubscriptionPlan } from "@/lib/constants";
import BrandNavigation from "@/components/dashboard/brand/navigation";
import { Badge } from "@/components/ui/badge";
import { Building, CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const brandProfileSchema = z.object({
  companyName: z.string().min(2, {
    message: "El nombre de la empresa debe tener al menos 2 caracteres.",
  }),
  website: z.string().url({
    message: "Por favor ingresa una URL válida.",
  }).optional().or(z.literal("")),
  industry: z.string().min(2, {
    message: "La industria debe tener al menos 2 caracteres.",
  }).optional().or(z.literal("")),
  location: z.string().min(2, {
    message: "La ubicación debe tener al menos 2 caracteres.",
  }).optional().or(z.literal("")),
  contactPhone: z.string().min(5, {
    message: "El teléfono debe tener al menos 5 caracteres.",
  }).optional().or(z.literal("")),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }).optional().or(z.literal("")),
});

type BrandProfileFormValues = z.infer<typeof brandProfileSchema>;

interface BrandProfileFormProps {
  profile: BrandProfile;
}

export default function BrandProfileForm({ profile }: BrandProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BrandProfileFormValues>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: {
      companyName: profile.companyName,
      website: profile.website || "",
      industry: profile.industry || "",
      location: profile.location || "",
      contactPhone: profile.contactPhone || "",
      description: profile.description || "",
    },
  });

  async function onSubmit(values: BrandProfileFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/brand/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Algo salió mal");
      }

      toast.success("Perfil actualizado con éxito");
      router.refresh();
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      toast.error(error instanceof Error ? error.message : "Error al actualizar el perfil");
    } finally {
      setIsSubmitting(false);
    }
  }

  const getSubscriptionBadge = (subscription: SubscriptionPlan) => {
    switch (subscription) {
      case SubscriptionPlan.FREE:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Gratuito</Badge>;
      case SubscriptionPlan.BASIC:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Básico</Badge>;
      case SubscriptionPlan.PREMIUM:
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Premium</Badge>;
      case SubscriptionPlan.ENTERPRISE:
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Empresarial</Badge>;
      default:
        return <Badge variant="outline">{subscription}</Badge>;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BrandNavigation />
      <div className="flex-1 p-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Perfil de Marca
        </h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Información de Perfil</TabsTrigger>
            <TabsTrigger value="subscription">Plan y Suscripción</TabsTrigger>
            <TabsTrigger value="account">Cuenta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Empresa</CardTitle>
                <CardDescription>
                  Actualiza la información de tu empresa que verán los influencers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de la empresa*</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu empresa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sitio web</FormLabel>
                          <FormControl>
                            <Input placeholder="https://tuempresa.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industria</FormLabel>
                            <FormControl>
                              <Input placeholder="Ejemplo: Moda, Alimentos, Tecnología" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ubicación</FormLabel>
                            <FormControl>
                              <Input placeholder="Ciudad, País" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono de contacto</FormLabel>
                          <FormControl>
                            <Input placeholder="+1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción de la empresa</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe brevemente a qué se dedica tu empresa..."
                              className="h-32 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Guardando..." : "Guardar cambios"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Plan de Suscripción</CardTitle>
                <CardDescription>
                  Información sobre tu plan actual y opciones para mejorar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 rounded-lg border p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Plan Actual</h3>
                    {getSubscriptionBadge(profile.subscription)}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarDays className="h-4 w-4" />
                      <span>Inicio: {formatDate(profile.subscriptionStartDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarDays className="h-4 w-4" />
                      <span>Vencimiento: {formatDate(profile.subscriptionEndDate)}</span>
                    </div>
                  </div>
                  
                  {profile.subscription === SubscriptionPlan.FREE && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm text-gray-600">
                        Mejora tu plan para acceder a más funcionalidades:
                      </p>
                      <ul className="ml-5 list-disc text-sm text-gray-600">
                        <li>Crea más eventos simultáneamente</li>
                        <li>Accede a filtros avanzados para encontrar influencers</li>
                        <li>Obtén estadísticas detalladas de tus campañas</li>
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <Card className="border-2 border-gray-100 transition-all hover:border-gray-200">
                    <CardHeader>
                      <CardTitle>Básico</CardTitle>
                      <CardDescription>Para pequeñas empresas</CardDescription>
                      <div className="mt-2 text-2xl font-bold">$29<span className="text-sm font-normal text-gray-500">/mes</span></div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Hasta 3 eventos activos</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Filtros básicos de búsqueda</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Métricas básicas</span>
                        </li>
                      </ul>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Button className="w-full" variant="outline">
                        Actualizar Plan
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="border-2 border-primary shadow-md">
                    <CardHeader>
                      <div className="absolute -right-1 -top-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Popular</div>
                      <CardTitle>Premium</CardTitle>
                      <CardDescription>Para empresas en crecimiento</CardDescription>
                      <div className="mt-2 text-2xl font-bold">$79<span className="text-sm font-normal text-gray-500">/mes</span></div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Hasta 10 eventos activos</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Filtros avanzados</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Estadísticas completas</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Soporte prioritario</span>
                        </li>
                      </ul>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Button className="w-full">
                        Actualizar Plan
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="border-2 border-gray-100 transition-all hover:border-gray-200">
                    <CardHeader>
                      <CardTitle>Empresarial</CardTitle>
                      <CardDescription>Para grandes empresas</CardDescription>
                      <div className="mt-2 text-2xl font-bold">$199<span className="text-sm font-normal text-gray-500">/mes</span></div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Eventos ilimitados</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Acceso a todos los influencers</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Analítica avanzada</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Gestor de cuenta dedicado</span>
                        </li>
                      </ul>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Button className="w-full" variant="outline">
                        Contactar Ventas
                      </Button>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Cuenta</CardTitle>
                <CardDescription>
                  Ver y actualizar la información de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 rounded-lg border p-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-medium">Detalles de usuario</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-600">Nombre:</span>
                          <span>{profile.user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-600">Email:</span>
                          <span>{profile.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-600">Fecha de registro:</span>
                          <span>{formatDate(profile.user.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 font-medium">Información de contacto</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-600">Ubicación:</span>
                          <span>{profile.location || "No especificada"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-600">Teléfono:</span>
                          <span>{profile.contactPhone || "No especificado"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 md:flex-row">
                    <Button variant="outline">Cambiar contraseña</Button>
                    <Button variant="outline" className="text-red-600">Eliminar cuenta</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}