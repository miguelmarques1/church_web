"use client"

import { useState, useEffect } from "react"
import { memberRepository, type CreateMemberRequest } from "@/lib/repositories/member-repository"
import type { Member } from "@/types"
import { toast } from "@/hooks/use-toast"

export function useMember(id?: number) {
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMember = async (memberId: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await memberRepository.getById(memberId)
      setMember(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar membro"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createMember = async (memberData: CreateMemberRequest) => {
    try {
      setLoading(true)
      setError(null)

      const newMember = await memberRepository.create(memberData)
      setMember(newMember)

      toast({
        title: "Sucesso",
        description: "Membro criado com sucesso",
      })

      return newMember
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar membro"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateMember = async (memberId: number, memberData: Partial<CreateMemberRequest>) => {
    try {
      setLoading(true)
      setError(null)

      const updatedMember = await memberRepository.update(memberId, memberData)
      setMember(updatedMember)

      toast({
        title: "Sucesso",
        description: "Membro atualizado com sucesso",
      })

      return updatedMember
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar membro"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteMember = async (memberId: number) => {
    try {
      setLoading(true)
      setError(null)

      await memberRepository.delete(memberId)
      setMember(null)

      toast({
        title: "Sucesso",
        description: "Membro excluído com sucesso",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir membro"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getCurrentUser = async () => {
    try {
      setLoading(true)
      setError(null)
      const currentUser = await memberRepository.getCurrentUser()
      setMember(currentUser)
      return currentUser
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar usuário atual"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchMember(id)
    }
  }, [id])

  return {
    member,
    loading,
    error,
    fetchMember,
    createMember,
    updateMember,
    deleteMember,
    getCurrentUser,
  }
}
