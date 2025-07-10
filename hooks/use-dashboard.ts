"use client"

import { useState, useEffect } from "react"
import { memberRepository } from "@/lib/repositories/member-repository"
import { familyRepository } from "@/lib/repositories/family-repository"
import { eventRepository } from "@/lib/repositories/event-repository"
import { newsRepository } from "@/lib/repositories/news-repository"
import { devotionalRepository } from "@/lib/repositories/devotional-repository"
import { toast } from "@/hooks/use-toast"
import type { Event, News, Devotional } from "@/types"

interface DashboardStats {
  totalMembers: number
  totalFamilies: number
  upcomingEvents: number
  publishedNews: number
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalFamilies: 0,
    upcomingEvents: 0,
    publishedNews: 0,
  })
  const [latestDevotionals, setLatestDevotionals] = useState<Devotional[]>([])
  const [latestNews, setLatestNews] = useState<News[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch all data in parallel
        const [members, families, events, news, devotionals] = await Promise.all([
          memberRepository.getAll().catch(() => []),
          familyRepository.getAll().catch(() => []),
          eventRepository.getAll().catch(() => []),
          newsRepository.getAll().catch(() => []),
          devotionalRepository.getAll().catch(() => []),
        ])
        console.log("Fetched data:", {
          members,
          families,
          events,
          news,
          devotionals,
        });

        // Calculate stats
        const today = new Date()
        const upcoming = events.filter((event) => new Date(event.date) >= today)
        const published = news.filter((item) => item.published)

        setStats({
          totalMembers: members.length,
          totalFamilies: families.length,
          upcomingEvents: upcoming.length,
          publishedNews: published.length,
        })

        // Set latest content
        setLatestDevotionals(devotionals.slice(0, 3))
        setLatestNews(news.slice(0, 3))
        setUpcomingEvents(upcoming.slice(0, 3))
      } catch (err) {
        setError("Erro ao carregar dados do dashboard")
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do dashboard",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return {
    stats,
    latestDevotionals,
    latestNews,
    upcomingEvents,
    loading,
    error,
  }
}
