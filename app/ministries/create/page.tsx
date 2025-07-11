"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { useMinistries } from "@/hooks/use-ministries"

export default function CreateMinistryPage() {
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
      return
    }

    try {
      await createMinistry({ name: name.trim() })
    } catch (error) {
      // Error handling is done in the hook
      console.error("Error in form submission:", error)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <Link
          href="/ministries"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Ministérios
        </Link>
        <h1 className="text-3xl font-bold">Criar Novo Ministério</h1>
        <p className="text-muted-foreground">Adicione um novo ministério à sua igreja</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Informações do Ministério
          </CardTitle>
          <CardDescription>Preencha as informações básicas do novo ministério</CardDescription>
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
                className={errors.name ? "border-red-500" : ""}
                maxLength={100}
                disabled={loading}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              <p className="text-xs text-muted-foreground">{name.length}/100 caracteres</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Criando..." : "Criar Ministério"}
              </Button>
              <Link href="/ministries">
                <Button type="button" variant="outline" disabled={loading} className="w-full bg-transparent">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
