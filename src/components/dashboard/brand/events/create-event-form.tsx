// components/dashboard/brand/events/create-event-form.tsx
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { EventStatus } from "@/lib/constants";
import BrandNavigation from "@/components/dashboard/brand/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Lista de categorías disponibles
const availableCategories = [
  { id: "moda", label: "Moda" },
  { id: "belleza", label: "Belleza" },
  { id: "fitness", label: "Fitness y Salud" },
  { id: "gastronomia", label: "Gastronomía" },
  { id: "viajes", label: "Viajes" },
  { id: "tecnologia", label: "Tecnología" },
  { id: "gaming", label: "Gaming" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "educacion", label: "Educación" },
  { id: "entretenimiento", label: "Entretenimiento" },
];

const eventFormSchema = z.object({
  title: z.string().min(5, {
    message: "El título debe tener al menos 5 caracteres.",
  }),
  description: z.string().min(20, {
    message: "La descripción debe tener al menos 20 caracteres.",
  }),
  requirements: z.string().optional(),
  compensation: z.string().min(1, {
    message: "La compensación es requerida.",
  }),
  deadline: z.date().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  location: z.string().optional(),
  status: z.enum([
    EventStatus.DRAFT,
    EventStatus.PUBLISHED,
    EventStatus.CLOSED,
    EventStatus.CANCELLED,
  ]),
  maxInfluencers: z.coerce.number().int().positive().optional(),
  minFollowers: z.coerce.number().int().positive().optional(),
  categories: z.array(z.string()).min(1, {
    message: "Selecciona al menos una categoría.",
  }),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface CreateEventFormProps {
  event?: EventFormValues & { id?: string };
  isEditing?: boolean;
}

export default function CreateEventForm({ event, isEditing = false }: CreateEventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: event || {
      title: "",
      description: "",
      requirements: "",
      compensation: "",
      location: "",
      status: EventStatus.DRAFT,
      categories: [],
    },
  });

  async function onSubmit(values: EventFormValues) {
    setIsSubmitting(true);
    try {
      const endpoint = isEditing 
        ? `/api/events/${event?.id}` 
        : "/api/events";
      
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Algo salió mal");
      }

      toast.success(isEditing ? "Evento actualizado con éxito" : "Evento creado con éxito");
      router.push("/dashboard/brand/events");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Error al procesar el evento");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BrandNavigation />
      <div className="flex-1 p-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          {isEditing ? "Editar Evento" : "Crear Nuevo Evento"}
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Información del Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título*</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del evento" {...field} />
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
                      <FormLabel>Descripción*</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe detalladamente el evento y lo que buscas..."
                          className="h-32 resize-none"
                          {...field}
                        />
                      </FormControl>
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
                            placeholder="Requisitos para los influencers..."
                            className="h-24 resize-none"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
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
                          <Textarea
                            placeholder="Detalle de la compensación ofrecida..."
                            className="h-24 resize-none"
                            {...field}
                          />
                        </FormControl>
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
                        <FormLabel>Fecha límite para aplicar</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
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
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
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
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de finalización</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
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
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const startDate = form.getValues("startDate");
                                return date < new Date() || (startDate ? date < startDate : false);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
                          <Input placeholder="Ubicación del evento" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxInfluencers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número máximo de influencers</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" placeholder="Sin límite" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>
                          Deja en blanco para no establecer un límite
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
                        <FormLabel>Mínimo de seguidores requeridos</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" placeholder="Sin requisito" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>
                          Mínimo de seguidores en cualquier red social
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="categories"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Categorías*</FormLabel>
                        <FormDescription>
                          Selecciona las categorías relacionadas con tu evento
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {availableCategories.map((category) => (
                          <FormField
                            key={category.id}
                            control={form.control}
                            name="categories"
                            render={({ field }) => {
                              return (
                                <FormItem key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(category.id)}
                                      onCheckedChange={(checked) => {
                                        const currentValues = field.value || [];
                                        return checked
                                          ? field.onChange([...currentValues, category.id])
                                          : field.onChange(
                                              currentValues.filter((value) => value !== category.id)
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {category.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-4">
                          <Button
                            type="button"
                            variant={field.value === EventStatus.DRAFT ? "default" : "outline"}
                            onClick={() => form.setValue("status", EventStatus.DRAFT)}
                          >
                            Borrador
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === EventStatus.PUBLISHED ? "default" : "outline"}
                            onClick={() => form.setValue("status", EventStatus.PUBLISHED)}
                          >
                            Publicar
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Los eventos en borrador no serán visibles para los influencers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Guardando..."
                      : isEditing
                        ? "Actualizar evento"
                        : "Crear evento"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}