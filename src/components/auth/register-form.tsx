// components/auth/register-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@/lib/constants";

// Schema de validación
const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum([UserRole.BRAND, UserRole.INFLUENCER]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.INFLUENCER,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al registrarse");
      }

      // Redirigir según el rol
      if (data.role === UserRole.BRAND) {
        router.push("/onboarding/brand");
      } else {
        router.push("/onboarding/influencer");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nombre
          </label>
          <input
            {...register("name")}
            id="name"
            type="text"
            className="w-full p-2 border rounded"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            className="w-full p-2 border rounded"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Contraseña
          </label>
          <input
            {...register("password")}
            id="password"
            type="password"
            className="w-full p-2 border rounded"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Registrarme como</label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center p-3 border rounded cursor-pointer">
              <input
                {...register("role")}
                type="radio"
                value={UserRole.BRAND}
                className="mr-2"
                disabled={isLoading}
              />
              <span>Marca</span>
            </label>
            <label className="flex items-center p-3 border rounded cursor-pointer">
              <input
                {...register("role")}
                type="radio"
                value={UserRole.INFLUENCER}
                className="mr-2"
                disabled={isLoading}
              />
              <span>Influencer</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          {isLoading ? "Procesando..." : "Registrarme"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}