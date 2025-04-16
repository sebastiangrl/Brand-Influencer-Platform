// components/auth/debug-register-form.tsx
"use client";

// Este es un componente temporal para depurar el formulario de registro
// Una vez que identifiquemos el problema, volveremos a la versión normal

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@/lib/constants";
import { Users, Building2, Phone } from "lucide-react";
import InstagramIcon from "@/components/icons/instagram-icon";
import TiktokIcon from "@/components/icons/tiktok-icon";

// Schema de validación para marca simplificado para pruebas
const brandFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.literal(UserRole.BRAND),
  companyName: z.string().min(2, "El nombre de la empresa es requerido"),
});

// Schema de validación para influencer simplificado para pruebas
const influencerFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.literal(UserRole.INFLUENCER),
  instagramUsername: z.string().min(1, "El usuario de Instagram es requerido"),
  bio: z.string().min(10, "La biografía debe tener al menos 10 caracteres"),
});

type BrandFormData = z.infer<typeof brandFormSchema>;
type InfluencerFormData = z.infer<typeof influencerFormSchema>;

export function DebugRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole.BRAND | UserRole.INFLUENCER>(
    roleParam === 'brand' ? UserRole.BRAND : UserRole.INFLUENCER
  );

  // Formulario para datos de marca
  const brandForm = useForm<BrandFormData>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.BRAND,
      companyName: "",
    },
  });

  // Formulario para datos de influencer
  const influencerForm = useForm<InfluencerFormData>({
    resolver: zodResolver(influencerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.INFLUENCER,
      instagramUsername: "",
      bio: "",
    },
  });

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  // Manejar cambio de rol
  const handleRoleChange = (role: UserRole.BRAND | UserRole.INFLUENCER) => {
    setSelectedRole(role);
  };

  // Enviar formulario de marca
  const submitBrandForm: SubmitHandler<BrandFormData> = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      addLog(`Enviando datos de marca: ${JSON.stringify(data, null, 2)}`);

      const response = await fetch("/api/register/brand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      addLog(`Respuesta del servidor: ${JSON.stringify(responseData, null, 2)}`);

      if (!response.ok) {
        throw new Error(responseData.message || "Error al registrarse");
      }

      // Redirigir al onboarding
      addLog("Registro exitoso, redireccionando a onboarding");
      router.push("/onboarding/brand");
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Enviar formulario de influencer
  const submitInfluencerForm: SubmitHandler<InfluencerFormData> = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      addLog(`Enviando datos de influencer: ${JSON.stringify(data, null, 2)}`);

      const response = await fetch("/api/register/influencer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      addLog(`Respuesta del servidor: ${JSON.stringify(responseData, null, 2)}`);

      if (!response.ok) {
        throw new Error(responseData.message || "Error al registrarse");
      }

      // Redirigir al onboarding
      addLog("Registro exitoso, redireccionando a onboarding");
      router.push("/onboarding/influencer");
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Formulario de Depuración</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <div className="text-sm font-medium mb-2">Selecciona un rol para pruebas:</div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handleRoleChange(UserRole.INFLUENCER)}
            className={`px-4 py-2 rounded-md ${
              selectedRole === UserRole.INFLUENCER ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Influencer
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange(UserRole.BRAND)}
            className={`px-4 py-2 rounded-md ${
              selectedRole === UserRole.BRAND ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Marca
          </button>
        </div>
      </div>

      {selectedRole === UserRole.BRAND ? (
        <form onSubmit={brandForm.handleSubmit(submitBrandForm)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre completo
            </label>
            <input
              {...brandForm.register("name")}
              id="name"
              type="text"
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
            {brandForm.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">{brandForm.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              {...brandForm.register("email")}
              id="email"
              type="email"
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
            {brandForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{brandForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              {...brandForm.register("password")}
              id="password"
              type="password"
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
            {brandForm.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {brandForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium mb-1">
              Nombre de la empresa
            </label>
            <input
              {...brandForm.register("companyName")}
              id="companyName"
              type="text"
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
            {brandForm.formState.errors.companyName && (
              <p className="text-red-500 text-sm mt-1">
                {brandForm.formState.errors.companyName.message}
              </p>
            )}
          </div>

          <input type="hidden" {...brandForm.register("role")} value={UserRole.BRAND} />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : "Registrar Marca (Depuración)"}
          </button>
        </form>
      ) : (
        <form onSubmit={influencerForm.handleSubmit(submitInfluencerForm)} className="space-y-4">
          <div>
            <label htmlFor="inf_name" className="block text-sm font-medium mb-1">
              Nombre completo
            </label>
            <input
              {...influencerForm.register("name")}
              id="inf_name"
              type="text"
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
            {influencerForm.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">{influencerForm.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="inf_email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              {...influencerForm.register("email")}
              id="inf_email"
              type="email"
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
            {influencerForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{influencerForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="inf_password" className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              {...influencerForm.register("password")}
              id="inf_password"
              type="password"
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
            {influencerForm.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {influencerForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="instagramUsername" className="block text-sm font-medium mb-1">
              Usuario de Instagram
            </label>
            <input
              {...influencerForm.register("instagramUsername")}
              id="instagramUsername"
              type="text"
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
            {influencerForm.formState.errors.instagramUsername && (
              <p className="text-red-500 text-sm mt-1">
                {influencerForm.formState.errors.instagramUsername.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-1">
              Biografía
            </label>
            <textarea
              {...influencerForm.register("bio")}
              id="bio"
              rows={3}
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
            {influencerForm.formState.errors.bio && (
              <p className="text-red-500 text-sm mt-1">
                {influencerForm.formState.errors.bio.message}
              </p>
            )}
          </div>

          <input type="hidden" {...influencerForm.register("role")} value={UserRole.INFLUENCER} />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : "Registrar Influencer (Depuración)"}
          </button>
        </form>
      )}

      {/* Sección de logs */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Logs de depuración:</h3>
        <div className="bg-gray-100 p-4 rounded-md max-h-60 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">No hay logs disponibles.</p>
          ) : (
            <ul className="space-y-1 text-xs font-mono">
              {logs.map((log, index) => (
                <li key={index} className="break-all">{log}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}