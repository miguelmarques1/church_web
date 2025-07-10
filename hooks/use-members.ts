"use client"

import { useState, useEffect } from "react"
import { memberRepository } from "@/lib/repositories/member-repository"
import type { Member } from "@/types"
import { toast } from "@/hooks/use-toast"

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMembers = async (search?: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await memberRepository.getAll(search)
      setMembers(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar membros"
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

  const deleteMember = async (id: number) => {
    try {
      await memberRepository.delete(id)
      setMembers((prev) => prev.filter((member) => member.id !== id))
      toast({
        title: "Sucesso",
        description: "Membro excluído com sucesso",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir membro"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const getMembersByRole = (roleCredentials: string) => {
    return members.filter((member) => member.role.credentials === roleCredentials)
  }

  const getMembersByFamily = (familyId: number) => {
    return members.filter((member) => member.family?.id === familyId)
  }

  const getMembersByMinistry = (ministryId: number) => {
    return members.filter((member) => member.ministries?.some((ministry) => ministry.id === ministryId))
  }

  const searchMembers = (query: string) => {
    if (!query.trim()) return members

    const lowercaseQuery = query.toLowerCase()
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(lowercaseQuery) ||
        member.email?.toLowerCase().includes(lowercaseQuery) ||
        member.phone.includes(query) ||
        member.role.name.toLowerCase().includes(lowercaseQuery),
    )
  }

  const getStats = () => {
    const total = members.length
    const pastors = getMembersByRole("pastor").length
    const leaders = getMembersByRole("leader").length
    const regularMembers = getMembersByRole("member").length
    const withFamilies = members.filter((member) => member.family).length
    const withMinistries = members.filter((member) => member.ministries && member.ministries.length > 0).length

    return {
      total,
      pastors,
      leaders,
      regularMembers,
      withFamilies,
      withMinistries,
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  return {
    members,
    loading,
    error,
    fetchMembers,
    deleteMember,
    getMembersByRole,
    getMembersByFamily,
    getMembersByMinistry,
    searchMembers,
    getStats,
  }
}
