"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { authService } from "@/lib/auth/auth-service"
import type { LoginRequest } from "@/types/auth"
import Image from "next/image"
import { DialogTitle } from "@radix-ui/react-dialog"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess?: () => void
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [formData, setFormData] = useState<LoginRequest>({
    phone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3")
    }
    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData((prev) => ({ ...prev, phone: formatted }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, password: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Limpar formatação do telefone antes de enviar
      const cleanPhone = formData.phone.replace(/\D/g, "")
      await authService.login({ phone: cleanPhone, password: formData.password })

      onLoginSuccess?.()
      onClose()
      // Reset form
      setFormData({ phone: "", password: "" })
      setRememberMe(false)
    } catch (err: any) {
      setError("Telefone ou senha incorretos")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.phone.length >= 14 && formData.password.length >= 1

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogTitle></DialogTitle>
        <div className="p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image src="/images/logo.png" alt="Geração Eleita" width={200} height={60} className="h-12 w-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo!</h2>
            <p className="text-gray-600">Entre na sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                Telefone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="h-12 text-base"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="h-12 text-base pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Lembrar-me
                </Label>
              </div>
              <button type="button" className="text-sm text-red-600 hover:text-red-700 font-medium">
                Esqueci a senha
              </button>
            </div>

            {/* Error Message */}
            {error && <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg">{error}</div>}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-medium text-base"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              Ao continuar, você concorda com nossos{" "}
              <button className="text-red-600 hover:text-red-700">Termos de Uso</button> e{" "}
              <button className="text-red-600 hover:text-red-700">Política de Privacidade</button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
