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
import { BrandProfile } from "@/types/brand";
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

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex-1 p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Perfil de Marca
      </h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Información de Perfil</TabsTrigger>
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
  );
}