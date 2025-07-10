import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Heart, Target, Users, Calendar, MapPin, Phone, Mail } from "lucide-react"

export default function InstitutionalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Institucional" />

      <main className="p-4 pb-20">
        {/* Hero Section with Church Image */}
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-6">
          <img 
            src="https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Igreja Geração Eleita" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
              <Building className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Igreja Geração Eleita</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-md">
              Transformando vidas através do amor de Cristo
            </p>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-800">Missão</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-gray-600 leading-relaxed">
                Proclamar o evangelho de Jesus Cristo, discipular vidas e servir à comunidade com amor e excelência.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-800">Visão</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-gray-600 leading-relaxed">
                Ser uma igreja relevante que impacta positivamente nossa cidade e forma discípulos de Cristo.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-800">Valores</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-gray-600 leading-relaxed">
                Amor, Integridade, Excelência, Comunhão, Serviço e Crescimento espiritual contínuo.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* History Section with Church Interior Image */}
        <Card className="mb-8 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                src="https://www.tabernaculodamensagem.org.br/gallery/Historico_Botucatu/content/images/large/Historico_Botucatu_199.jpg" 
                alt="Interior da Igreja" 
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Nossa História</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  A Igreja Geração Eleita foi fundada em 2010 com o propósito de alcançar vidas para Cristo e formar uma
                  comunidade de fé sólida e acolhedora.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Ao longo dos anos, temos crescido não apenas em número, mas em maturidade espiritual, desenvolvendo
                  ministérios que atendem todas as faixas etárias e necessidades da nossa comunidade.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Hoje somos uma igreja que celebra a diversidade, promove a unidade e busca constantemente maneiras de
                  servir nossa cidade com o amor de Cristo.
                </p>
              </CardContent>
            </div>
          </div>
        </Card>

        {/* Leadership and Contact in Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Leadership */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                Liderança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Pastor Principal</h3>
                  <p className="text-gray-600">Rev. João Silva</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Pastora Auxiliar</h3>
                  <p className="text-gray-600">Pra. Maria Silva</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                <Phone className="h-5 w-5 text-orange-600" />
                Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Endereço</p>
                  <p className="text-gray-600">Rua da Igreja, 123 - Centro<br />São Paulo/SP</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-semibold text-gray-900">Telefone</p>
                  <p className="text-gray-600">(11) 3333-4444</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600">contato@geracaoeleita.com.br</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Times */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Horários de Culto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Domingo</h3>
                <p className="text-gray-600">9h00 e 19h00</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border border-amber-100">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Quarta-feira</h3>
                <p className="text-gray-600">19h30</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Sexta-feira</h3>
                <p className="text-gray-600">20h00 (Jovens)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}