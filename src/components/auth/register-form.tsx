// components/auth/register-form.tsx
"use client";

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

// Schema de validación base
const baseSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum([UserRole.BRAND, UserRole.INFLUENCER]),
});

// Schema específico para influencer
const influencerSchema = baseSchema.extend({
  instagramUsername: z.string().min(1, "El usuario de Instagram es requerido"),
  instagramFollowers: z.string().optional(),
  tiktokUsername: z.string().optional(),
  tiktokFollowers: z.string().optional(),
  whatsapp: z.string().min(10, "Número de WhatsApp inválido").optional(),
  niche: z.string().min(1, "Selecciona al menos un nicho").optional(),
  bio: z.string().min(10, "La biografía debe tener al menos 10 caracteres").max(500, "Máximo 500 caracteres").optional(),
});

// Schema específico para marca
const brandSchema = baseSchema.extend({
  companyName: z.string().min(2, "El nombre de la empresa es requerido"),
  industry: z.string().min(1, "La industria es requerida").optional(),
  website: z.string().url("URL inválida").optional(),
  contactPhone: z.string().min(10, "Número de contacto inválido").optional(),
});

// Tipos derivados de los schemas
type BaseFormData = z.infer<typeof baseSchema>;
type InfluencerFormData = z.infer<typeof influencerSchema>;
type BrandFormData = z.infer<typeof brandSchema>;

// Opciones para nichos/categorías
const nicheOptions = [
  "Moda",
  "Belleza",
  "Estilo de vida",
  "Fitness",
  "Comida",
  "Viajes",
  "Gaming",
  "Tecnología",
  "Entretenimiento",
  "Educación",
  "Negocios",
  "Otro"
];

// Opciones para industrias
const industryOptions = [
  "Moda y Ropa",
  "Belleza y Cosmética",
  "Alimentos y Bebidas",
  "Tecnología",
  "Salud y Bienestar",
  "Hogar y Decoración",
  "Viajes y Turismo",
  "Educación",
  "Finanzas",
  "Entretenimiento",
  "Otro"
];

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole.BRAND | UserRole.INFLUENCER>(
    roleParam === 'brand' ? UserRole.BRAND : UserRole.INFLUENCER
  );

  // Formulario para los datos básicos (paso 1)
  const baseForm = useForm<BaseFormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: selectedRole,
    },
  });

  // Formulario para datos de influencer (paso 2 para influencers)
  const influencerForm = useForm<InfluencerFormData>({
    resolver: zodResolver(influencerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.INFLUENCER,
      instagramUsername: "",
      instagramFollowers: "",
      tiktokUsername: "",
      tiktokFollowers: "",
      whatsapp: "",
      niche: "",
      bio: "",
    },
  });

  // Formulario para datos de marca (paso 2 para marcas)
  const brandForm = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.BRAND,
      companyName: "",
      industry: "",
      website: "",
      contactPhone: "",
    },
  });

  // Manejar cambio de rol
  const handleRoleChange = (role: UserRole.BRAND | UserRole.INFLUENCER) => {
    setSelectedRole(role);
    baseForm.setValue("role", role);
  };

  // Avanzar al siguiente paso
  const goToNextStep: SubmitHandler<BaseFormData> = async (data) => {
    // Copiar datos del primer paso al formulario correspondiente
    if (data.role === UserRole.INFLUENCER) {
      influencerForm.setValue("name", data.name);
      influencerForm.setValue("email", data.email);
      influencerForm.setValue("password", data.password);
      influencerForm.setValue("role", UserRole.INFLUENCER);
    } else {
      brandForm.setValue("name", data.name);
      brandForm.setValue("email", data.email);
      brandForm.setValue("password", data.password);
      brandForm.setValue("role", UserRole.BRAND);
      brandForm.setValue("companyName", data.name); // Usar nombre como nombre de empresa por defecto
    }
    
    setCurrentStep(2);
  };

  // Volver al paso anterior
  const goToPreviousStep = () => {
    setCurrentStep(1);
  };

  // Enviar formulario final
  const submitInfluencerForm: SubmitHandler<InfluencerFormData> = async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/register/influencer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrarse");
      }

      // Redirigir al onboarding
      router.push("/onboarding/influencer");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Enviar formulario de marca
  const submitBrandForm: SubmitHandler<BrandFormData> = async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/register/brand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrarse");
      }

      // Redirigir al onboarding
      router.push("/onboarding/brand");
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

      {/* Paso 1: Información básica */}
      {currentStep === 1 && (
        <form onSubmit={baseForm.handleSubmit(goToNextStep)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre completo
            </label>
            <input
              {...baseForm.register("name")}
              id="name"
              type="text"
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
            {baseForm.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">{baseForm.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              {...baseForm.register("email")}
              id="email"
              type="email"
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
            {baseForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{baseForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              {...baseForm.register("password")}
              id="password"
              type="password"
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
            {baseForm.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {baseForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Registrarme como</label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${
                  selectedRole === UserRole.INFLUENCER ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleRoleChange(UserRole.INFLUENCER)}
              >
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <span className="font-medium">Influencer</span>
                <p className="text-xs text-gray-500 text-center mt-1">Para creadores de contenido</p>
              </div>
              <div 
                className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${
                  selectedRole === UserRole.BRAND ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleRoleChange(UserRole.BRAND)}
              >
                <Building2 className="h-8 w-8 text-blue-600 mb-2" />
                <span className="font-medium">Marca</span>
                <p className="text-xs text-gray-500 text-center mt-1">Para empresas y productos</p>
              </div>
            </div>
            <input 
              type="hidden" 
              {...baseForm.register("role")}
              value={selectedRole}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-medium"
            disabled={isLoading}
          >
            Continuar
          </button>
          
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Iniciar sesión
            </Link>
          </div>
        </form>
      )}

      {/* Paso 2: Información específica de Influencer */}
      {currentStep === 2 && selectedRole === UserRole.INFLUENCER && (
        <form onSubmit={influencerForm.handleSubmit(submitInfluencerForm)} className="space-y-4">
          <div className="text-sm text-gray-500 mb-4">
            <p>Cuéntanos más sobre tu perfil para conectarte con las marcas adecuadas.</p>
          </div>
          
          {/* Instagram */}
          <div>
            <label htmlFor="instagramUsername" className="block text-sm font-medium mb-1 flex items-center">
              <InstagramIcon className="w-4 h-4 mr-1 text-pink-600" />
              Usuario de Instagram*
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">@</span>
              <input
                {...influencerForm.register("instagramUsername")}
                id="instagramUsername"
                type="text"
                className="w-full pl-8 p-2 border rounded"
                placeholder="usuario"
                disabled={isLoading}
              />
            </div>
            {influencerForm.formState.errors.instagramUsername && (
              <p className="text-red-500 text-sm mt-1">
                {influencerForm.formState.errors.instagramUsername.message}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="instagramFollowers" className="block text-sm font-medium mb-1">
              Seguidores en Instagram
            </label>
            <input
              {...influencerForm.register("instagramFollowers")}
              id="instagramFollowers"
              type="number"
              className="w-full p-2 border rounded"
              placeholder="Ej: 5000"
              disabled={isLoading}
            />
          </div>
          
          {/* TikTok */}
          <div>
            <label htmlFor="tiktokUsername" className="block text-sm font-medium mb-1 flex items-center">
              <TiktokIcon className="w-4 h-4 mr-1 text-black" />
              Usuario de TikTok
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">@</span>
              <input
                {...influencerForm.register("tiktokUsername")}
                id="tiktokUsername"
                type="text"
                className="w-full pl-8 p-2 border rounded"
                placeholder="usuario (opcional)"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="tiktokFollowers" className="block text-sm font-medium mb-1">
              Seguidores en TikTok
            </label>
            <input
              {...influencerForm.register("tiktokFollowers")}
              id="tiktokFollowers"
              type="number"
              className="w-full p-2 border rounded"
              placeholder="Ej: 10000 (opcional)"
              disabled={isLoading}
            />
          </div>
          
          {/* WhatsApp */}
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium mb-1 flex items-center">
              <Phone className="w-4 h-4 mr-1 text-green-600" />
              WhatsApp para contacto*
            </label>
            <input
              {...influencerForm.register("whatsapp")}
              id="whatsapp"
              type="tel"
              className="w-full p-2 border rounded"
              placeholder="+573141234567"
              disabled={isLoading}
            />
            {influencerForm.formState.errors.whatsapp && (
              <p className="text-red-500 text-sm mt-1">
                {influencerForm.formState.errors.whatsapp.message}
              </p>
            )}
          </div>
          
          {/* Nicho/Categoría */}
          <div>
            <label htmlFor="niche" className="block text-sm font-medium mb-1">
              Nicho/Categoría principal*
            </label>
            <select
              {...influencerForm.register("niche")}
              id="niche"
              className="w-full p-2 border rounded"
              disabled={isLoading}
            >
              <option value="">Selecciona una categoría</option>
              {nicheOptions.map((niche) => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>
            {influencerForm.formState.errors.niche && (
              <p className="text-red-500 text-sm mt-1">
                {influencerForm.formState.errors.niche.message}
              </p>
            )}
          </div>
          
          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-1">
              Breve biografía*
            </label>
            <textarea
              {...influencerForm.register("bio")}
              id="bio"
              rows={3}
              className="w-full p-2 border rounded"
              placeholder="Cuéntanos brevemente sobre tu contenido y audiencia..."
              disabled={isLoading}
            />
            {influencerForm.formState.errors.bio && (
              <p className="text-red-500 text-sm mt-1">
                {influencerForm.formState.errors.bio.message}
              </p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="w-1/3 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition"
              disabled={isLoading}
            >
              Atrás
            </button>
            <button
              type="submit"
              className="w-2/3 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "Completar registro"}
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mt-4">
            <p>Al registrarte, aceptas nuestros <Link href="/terms" className="text-blue-600 hover:underline">Términos de servicio</Link> y <Link href="/privacy" className="text-blue-600 hover:underline">Política de privacidad</Link>.</p>
            <p className="mt-2">Tu perfil será revisado por nuestro equipo antes de ser aprobado.</p>
          </div>
        </form>
      )}
      
      {/* Paso 2: Información específica de Marca */}
      {currentStep === 2 && selectedRole === UserRole.BRAND && (
        <form onSubmit={brandForm.handleSubmit(submitBrandForm)} className="space-y-4">
          <div className="text-sm text-gray-500 mb-4">
            <p>Cuéntanos más sobre tu empresa para conectarte con los influencers adecuados.</p>
          </div>
          
          {/* Nombre de la empresa */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium mb-1">
              Nombre de la empresa*
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
          
          {/* Industria */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium mb-1">
              Industria*
            </label>
            <select
              {...brandForm.register("industry")}
              id="industry"
              className="w-full p-2 border rounded"
              disabled={isLoading}
            >
              <option value="">Selecciona una industria</option>
              {industryOptions.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            {brandForm.formState.errors.industry && (
              <p className="text-red-500 text-sm mt-1">
                {brandForm.formState.errors.industry.message}
              </p>
            )}
          </div>
          
          {/* Sitio web */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-1">
              Sitio web
            </label>
            <input
              {...brandForm.register("website")}
              id="website"
              type="url"
              className="w-full p-2 border rounded"
              placeholder="https://..."
              disabled={isLoading}
            />
            {brandForm.formState.errors.website && (
              <p className="text-red-500 text-sm mt-1">
                {brandForm.formState.errors.website.message}
              </p>
            )}
          </div>
          
          {/* Teléfono de contacto */}
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium mb-1">
              Teléfono de contacto*
            </label>
            <input
              {...brandForm.register("contactPhone")}
              id="contactPhone"
              type="tel"
              className="w-full p-2 border rounded"
              placeholder="+573141234567"
              disabled={isLoading}
            />
            {brandForm.formState.errors.contactPhone && (
              <p className="text-red-500 text-sm mt-1">
                {brandForm.formState.errors.contactPhone.message}
              </p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="w-1/3 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition"
              disabled={isLoading}
            >
              Atrás
            </button>
            <button
              type="submit"
              className="w-2/3 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "Completar registro"}
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mt-4">
            <p>Al registrarte, aceptas nuestros <Link href="/terms" className="text-blue-600 hover:underline">Términos de servicio</Link> y <Link href="/privacy" className="text-blue-600 hover:underline">Política de privacidad</Link>.</p>
          </div>
        </form>
      )}
    </div>
  );
}