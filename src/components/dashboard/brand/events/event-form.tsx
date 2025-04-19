// components/dashboard/brand/profile/brand-profile-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, ImagePlus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { AVAILABLE_CATEGORIES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/brand";

// Esquema de validación para el formulario de evento
const eventSchema = z.object({
  title: z.string().min(5, {
    message: "El título debe tener al menos 5 caracteres."
  }),
  description: z.string().min(20, {
    message: "La descripción debe tener al menos 20 caracteres."
  }),
  requirements: z.string().optional(),
  compensation: z.string().min(3, {
    message: "La compensación debe tener al menos 3 caracteres."
  }),
  deadline: z.date().optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  location: z.string().optional(),
  maxInfluencers: z.coerce.number().optional().nullable(),
  minFollowers: z.coerce.number().optional().nullable(),
  // Las categorías y las imágenes se manejan por separado
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  isEditing?: boolean;
}

export default function EventForm({ event, isEditing = false }: EventFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(event?.categories || []);
  const [images, setImages] = useState<string[]>(event?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");

  // Obtener el ID del influencer si se está creando un evento desde la página de influencer
  const influencerId = searchParams?.get("influencer");

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      requirements: event?.requirements || "",
      compensation: event?.compensation || "",
      deadline: event?.deadline ? new Date(event.deadline) : undefined,
      startDate: event?.startDate ? new Date(event.startDate) : undefined,
      endDate: event?.endDate ? new Date(event.endDate) : undefined,
      location: event?.location || "",
      maxInfluencers: event?.maxInfluencers || undefined,
      minFollowers: event?.minFollowers || undefined,
    },
  });

  const onSubmit = async (values: EventFormValues) => {
    if (selectedCategories.length === 0) {
      toast.error("Debes seleccionar al menos una categoría");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const eventData = {
        ...values,
        categories: selectedCategories,
        images: images,
      };

      const url = isEditing ? `/api/events/${event?.id}` : "/api/events";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Algo salió mal");
      }

      const data = await response.json();
      
      toast.success(
        isEditing ? "Evento actualizado correctamente" : "Evento creado correctamente"
      );
      
      router.push(`/dashboard/brand/events/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : isEditing
          ? "Error al actualizar el evento"
          : "Error al crear el evento"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = () => {
    if (currentCategory && !selectedCategories.includes(currentCategory)) {
      setSelectedCategories([...selectedCategories, currentCategory]);
      setCurrentCategory("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category));
  };

  const handleAddImage = () => {
    // Esta es una función simulada, debes implementar tu lógica de carga de imágenes
    // Podrías usar uploadthing o alguna otra solución para subir imágenes
    const newImageUrl = `/images/placeholder-${Math.floor(Math.random() * 1000)}.jpg`;
    setImages([...images, newImageUrl]);
  };

  const handleRemoveImage = (imageUrl: string) => {
    setImages(images.filter((img) => img !== imageUrl));
  };

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Evento" : "Crear Nuevo Evento"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Actualiza la información de tu evento"
            : "Completa los detalles para tu nuevo evento"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del evento*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Campaña de Instagram para producto X" {...field} />
                  </FormControl>
                  <FormDescription>
                    Un título claro y conciso para tu evento.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe en detalle de qué trata el evento..."
                      className="h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Explica el objetivo del evento y lo que esperas de los influencers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requisitos</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Requisitos específicos para los influencers..."
                        className="h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Requisitos específicos que deben cumplir los influencers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="compensation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compensación*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Producto gratis + $50 USD" {...field} />
                    </FormControl>
                    <FormDescription>
                      ¿Qué recibirán los influencers a cambio?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha límite</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Fecha límite para aplicar al evento.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Cuándo comenzará el evento.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de fin</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Cuándo finalizará el evento.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Ciudad, País o Virtual" {...field} />
                    </FormControl>
                    <FormDescription>
                      Dónde se realizará el evento, o "Virtual" si es online.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxInfluencers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Máximo de influencers</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="Ej: 10" 
                        // Corregimos el error de tipo aquí, convirtiendo null/undefined a string vacía
                        value={field.value?.toString() || ''} 
                        onChange={(e) => {
                          const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Número máximo de influencers para este evento.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minFollowers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mínimo de seguidores</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="Ej: 5000" 
                        // Corregimos el error de tipo aquí, convirtiendo null/undefined a string vacía
                        value={field.value?.toString() || ''} 
                        onChange={(e) => {
                          const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Cantidad mínima de seguidores requerida.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormItem>
              <FormLabel>Categorías*</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {AVAILABLE_CATEGORIES.find(c => c.id === category)?.label || category}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category)}
                      className="ml-1 rounded-full h-4 w-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {selectedCategories.length === 0 && (
                  <span className="text-sm text-gray-500">
                    Selecciona al menos una categoría
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Select
                  value={currentCategory}
                  onValueChange={setCurrentCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_CATEGORIES.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                        disabled={selectedCategories.includes(category.id)}
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCategory}
                  disabled={!currentCategory}
                >
                  Añadir
                </Button>
              </div>
              <FormDescription>
                Selecciona las categorías relevantes para tu evento.
              </FormDescription>
            </FormItem>

            <FormItem>
              <FormLabel>Imágenes</FormLabel>
              <div className="grid grid-cols-3 gap-4 mb-3">
                {images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-video bg-gray-100 rounded-md overflow-hidden"
                  >
                    <img
                      src={imageUrl}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(imageUrl)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="aspect-video flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-gray-400 transition-colors"
                  >
                    <ImagePlus className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-500">Añadir imagen</span>
                  </button>
                )}
              </div>
              <FormDescription>
                Añade hasta 5 imágenes para tu evento (opcional).
              </FormDescription>
            </FormItem>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditing
                    ? "Actualizando..."
                    : "Creando..."
                  : isEditing
                  ? "Actualizar evento"
                  : "Crear evento"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}