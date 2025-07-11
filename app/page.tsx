"use client"

import type React from "react"

import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { LoadingState } from "@/components/common/loading-state"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, BookOpen, Newspaper, ChevronRight, Clock, MapPin, Users, Heart, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useDashboard } from "@/hooks/use-dashboard"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  const { stats, latestDevotionals, latestNews, upcomingEvents, loading } = useDashboard()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <LoadingState message="Carregando conteúdo..." />
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />

      <main>
        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center bg-no-repeat text-white py-20 px-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=600&fit=crop')`
          }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <img
                src="/images/dark-logo.png"
                alt="Logo Geração Eleita"
                className="h-16 object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bem-vindo à Geração Eleita
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Uma comunidade cristã comprometida com a Palavra de Deus e o amor ao próximo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-600 text-white hover:bg-orange-700">
                Visitantes
              </Button>
              <a href="/institutional"><Button size="lg" variant="outline" className="border-white text-orange-400 hover:bg-white hover:text-orange-600">
                Nossa História
              </Button></a>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-800 to-transparent"></div>
        </section>

        {/* Stats Section */}
        {/* <section className="py-12 px-4 -mt-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatsCard
                title="Membros"
                value={stats.totalMembers}
                description="Nossa família"
                icon={Users}
                color="bg-orange-500"
              />
              <StatsCard
                title="Famílias"
                value={stats.totalFamilies}
                description="Lares abençoados"
                icon={Home}
                color="bg-blue-500"
              />
              <StatsCard
                title="Eventos"
                value={stats.upcomingEvents}
                description="Este mês"
                icon={Calendar}
                color="bg-purple-500"
              />
              <StatsCard
                title="Conteúdo"
                value={stats.publishedNews}
                description="Publicações"
                icon={Newspaper}
                color="bg-green-500"
              />
            </div>
          </div>
        </section> */}

        {/* Content Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Vida em Comunidade
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Compartilhamos a Palavra, celebramos juntos e crescemos na fé
              </p>
            </div>

            <Tabs defaultValue="devotionals" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 max-w-md mx-auto">
                <TabsTrigger value="devotionals" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Devocionais</span>
                </TabsTrigger>
                <TabsTrigger value="news" className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4" />
                  <span className="hidden sm:inline">Notícias</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Eventos</span>
                </TabsTrigger>
              </TabsList>

              {/* Devotionals Tab */}
              <TabsContent value="devotionals">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {latestDevotionals.map((devotional) => (
                    <Card key={devotional.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <div className="relative h-48">
                        <img
                          src={devotional.image_url}
                          alt={devotional.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <p className="text-sm font-medium mb-1">"{devotional.verse_text}"</p>
                          <p className="text-xs opacity-90">{devotional.reference}</p>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{devotional.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {devotional.content.substring(0, 120)}...
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(devotional.publication_date).toLocaleDateString("pt-BR")}
                          </div>
                          <span className="font-medium">{devotional.author?.name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="text-center">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    Ver Todos os Devocionais
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* News Tab */}
              <TabsContent value="news">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {latestNews.map((news) => (
                    <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <div className="relative h-48">
                        <img
                          src={news.featured_image}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{news.title}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(news.publication_date).toLocaleDateString("pt-BR")}
                          </div>
                          <span className="font-medium">{news.author.name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="text-center">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    Ver Todas as Notícias
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <div className="relative h-48">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-orange-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                          {new Date(event.date).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="text-center">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    Ver Programação Completa
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Conecte-se Conosco
              </h2>
              <p className="text-xl text-gray-600">
                Encontre seu lugar em nossa comunidade
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <QuickAccessCard
                title="Pedidos de Oração"
                description="Compartilhe suas necessidades"
                icon={<Heart className="h-6 w-6" />}
                color="bg-purple-500"
              />
              <QuickAccessCard
                title="Ministérios"
                description="Descubra como servir"
                icon={<Users className="h-6 w-6" />}
                color="bg-blue-500"
              />
              <QuickAccessCard
                title="Nossa Família"
                description="Conheça os membros"
                icon={<Users className="h-6 w-6" />}
                color="bg-green-500"
              />
              <QuickAccessCard
                title="Sobre Nós"
                description="Nossa história e visão"
                icon={<BookOpen className="h-6 w-6" />}
                color="bg-orange-500"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const QuickAccessCard = ({ title, description, icon, color }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
      <CardContent className="p-6 text-center">
        <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

const StatsCard = ({ title, value, description, icon: Icon, color }: {
  title: string;
  value: number;
  description: string;
  icon: any;
  color: string;
}) => {
  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6 text-center">
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="font-medium text-gray-700 mb-1">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
};
