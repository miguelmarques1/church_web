"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Loader2 } from "lucide-react"
import { useMinistries } from "@/hooks/use-ministries"
import { BottomNav } from "@/components/layout/bottom-nav"
import { toast } from "sonner"

export default function CreateMinistryPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<{ name?: string }>({})
  const { createMinistry, loading } = useMinistries()

  const validateForm = () => {
    const newErrors: { name?: string } = {}

    if (!name.trim()) {
      newErrors.name = "O nome do ministério é obrigatório"
    } else if (name.trim().length < 3) {
      newErrors.name = "O nome deve ter pelo menos 3 caracteres"
    } else if (name.trim().length > 100) {
      newErrors.name = "O nome não pode exceder 100 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário.")
      return
    }

    try {
      await createMinistry({ name: name.trim() })
      // The useMinistries hook already handles toast and navigation on success
    } catch (error) {
      // Error handling is done in the hook, but we can log here if needed
      console.error("Error in form submission:", error)
    }
  }

  const goBack = () => {
    router.push("/ministries")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1">
        {/* Header similar to devotionals/create */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={goBack} disabled={loading}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Novo Ministério</h1>
        </div>

        <main className="p-4 pb-20 md:pb-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-6">
            {/* Main Form Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Informações do Ministério
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Nome do Ministério <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Ex: Ministério de Louvor, Ministério Infantil..."
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          if (errors.name) {
                            setErrors({ ...errors, name: undefined })
                          }
                        }}
                        className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
                        maxLength={100}
                        disabled={loading}
                      />
                      {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                      <p className="text-xs text-muted-foreground text-right">{name.length}/100 caracteres</p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Criando...
                          </>
                        ) : (
                          "Criar Ministério"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goBack}
                        disabled={loading}
                        className="flex-1 bg-transparent"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
