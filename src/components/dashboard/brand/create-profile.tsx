// app/dashboard/brand/create-profile.tsx
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";

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

export default function CreateBrandProfile() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BrandProfileFormValues>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: {
      companyName: "",
      website: "",
      industry: "",
      location: "",
      contactPhone: "",
      description: "",
    },
  });

  async function onSubmit(values: BrandProfileFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/brand/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Algo salió mal");
      }

      toast.success("Perfil creado con éxito");
      router.push("/dashboard/brand");
      router.refresh();
    } catch (error) {
      console.error("Error al crear el perfil:", error);
      toast.error(error instanceof Error ? error.message : "Error al crear el perfil");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Completa tu perfil de marca</CardTitle>
          <CardDescription className="text-center">
            Añade información sobre tu empresa para conectar con influencers
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
                        className="h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar perfil"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}