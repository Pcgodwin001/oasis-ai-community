import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Search,
  Target,
  MapPin,
  TrendingUp,
  Activity
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"

interface PlayerPosition {
  id: string
  name: string
  shortName: string
  description: string
  sportId: string
  sportName: string
  responsibilities: string[]
  skills: string[]
  formations: string[]
  playerCount: number
  isActive: boolean
  createdAt: string
}

interface Sport {
  id: string
  name: string
  emoji: string
}

// Mock sports data
const mockSports: Sport[] = [
  { id: "1", name: "Futbol", emoji: "⚽" },
  { id: "2", name: "Basketbol", emoji: "🏀" },
  { id: "3", name: "Yüzme", emoji: "🏊" },
  { id: "4", name: "Karate", emoji: "🥋" },
  { id: "5", name: "Tenis", emoji: "🎾" },
  { id: "6", name: "Voleybol", emoji: "🏐" },
  { id: "7", name: "Atletizm", emoji: "🏃" }
]

const mockPositions: PlayerPosition[] = [
  // Futbol Pozisyonları
  {
    id: "1",
    name: "Kaleci",
    shortName: "GK",
    description: "Kaleyi korumakla görevli oyuncu. Ceza sahası içinde el kullanabilir.",
    sportId: "1",
    sportName: "Futbol",
    responsibilities: ["Kale koruma", "Hava topları", "Penaltı kurtarma", "Oyun kurma"],
    skills: ["Refleks", "El becerisi", "Pozisyon alma", "Ayak teknigi"],
    formations: ["4-4-2", "4-3-3", "3-5-2", "4-2-3-1"],
    playerCount: 45,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "2", 
    name: "Merkez Bek",
    shortName: "CB",
    description: "Savunmanın merkezinde oynayan, rakip hücumcuları markajla görevli oyuncu.",
    sportId: "1",
    sportName: "Futbol",
    responsibilities: ["Markaj", "Hava topu mücadelesi", "Temizleme", "Oyun kurma"],
    skills: ["Kafa vuruşu", "Markaj", "Güç", "Okuma becerisi"],
    formations: ["4-4-2", "4-3-3", "3-5-2", "5-3-2"],
    playerCount: 128,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    name: "Kanat Bek", 
    shortName: "FB",
    description: "Savunmanın yan bölgelerinde oynayan, hem savunma hem hücumda görev alan oyuncu.",
    sportId: "1",
    sportName: "Futbol",
    responsibilities: ["Kanat savunması", "Hücuma katılım", "Orta açma", "Geri koşu"],
    skills: ["Hız", "Dayanıklılık", "Orta", "Savunma"],
    formations: ["4-4-2", "4-3-3", "4-2-3-1", "3-5-2"],
    playerCount: 156,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "4",
    name: "Defansif Orta Saha",
    shortName: "CDM", 
    description: "Savunma ile orta saha arasında oynayan, top kaptırma ve dağıtma görevli oyuncu.",
    sportId: "1",
    sportName: "Futbol",
    responsibilities: ["Top kazanma", "Pas dağıtımı", "Savunma desteği", "Oyun temposu"],
    skills: ["Pas", "Top kaptırma", "Pozisyon alma", "Oyun okuma"],
    formations: ["4-2-3-1", "4-3-3", "3-5-2", "4-1-4-1"],
    playerCount: 89,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "5",
    name: "Merkez Orta Saha",
    shortName: "CM",
    description: "Oyunun merkezinde, hem savunma hem de hücumda görev alan çok yönlü oyuncu.",
    sportId: "1", 
    sportName: "Futbol",
    responsibilities: ["Pas dağıtımı", "Box-to-box", "Gol katkısı", "Savunma yardımı"],
    skills: ["Pas", "Şut", "Mücadele", "Vizyon"],
    formations: ["4-4-2", "4-3-3", "3-5-2", "4-2-3-1"],
    playerCount: 134,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "6",
    name: "Ofansif Orta Saha",
    shortName: "CAM",
    description: "Hücum arkasında oynayan, pas ve gol ile takımına katkı sağlayan oyuncu.",
    sportId: "1",
    sportName: "Futbol", 
    responsibilities: ["Asist", "Gol", "Oyun kurma", "Yaratıcılık"],
    skills: ["Yaratıcılık", "Şut", "Pas", "Dribling"],
    formations: ["4-2-3-1", "4-1-4-1", "3-4-1-2"],
    playerCount: 67,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "7",
    name: "Kanat Oyuncusu",
    shortName: "W",
    description: "Yan koridorlarda oynayan, hız ve teknikle rakibi geçmeye odaklanan oyuncu.", 
    sportId: "1",
    sportName: "Futbol",
    responsibilities: ["Dribling", "Orta", "Gol", "Kanat oyunu"],
    skills: ["Hız", "Dribling", "Orta", "Bitiricilik"],
    formations: ["4-3-3", "3-5-2", "4-2-3-1", "3-4-3"],
    playerCount: 98,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "8",
    name: "Santrafor",
    shortName: "ST",
    description: "En öndeki oyuncu, gol atmakla birinci derecede sorumlu oyuncu.",
    sportId: "1",
    sportName: "Futbol",
    responsibilities: ["Gol", "Asist", "Pres", "Hava topu"],
    skills: ["Bitiricilik", "Kafa vuruşu", "Pozisyon alma", "Güç"],
    formations: ["4-4-2", "4-3-3", "3-5-2", "4-2-3-1"],
    playerCount: 76,
    isActive: true,
    createdAt: "2024-01-10"
  },

  // Basketbol Pozisyonları
  {
    id: "9",
    name: "Point Guard",
    shortName: "PG",
    description: "Takımın oyun kurucusu, sayı kurucu guard pozisyonu.",
    sportId: "2",
    sportName: "Basketbol",
    responsibilities: ["Oyun kurma", "Asist", "Top sürme", "Tempo kontrolü"],
    skills: ["Pas", "Top sürme", "Liderlik", "Oyun zekası"],
    formations: ["1-2-2", "1-3-1", "2-3", "1-4"],
    playerCount: 42,
    isActive: true,
    createdAt: "2024-01-12"
  },
  {
    id: "10", 
    name: "Shooting Guard",
    shortName: "SG",
    description: "Şut odaklı guard, skorer guard pozisyonu.",
    sportId: "2",
    sportName: "Basketbol",
    responsibilities: ["Sayı üretme", "Dış şut", "Dribling", "Defans"],
    skills: ["Şut", "Atletizm", "Top sürme", "Defans"],
    formations: ["1-2-2", "2-3", "1-3-1", "1-4"],
    playerCount: 38,
    isActive: true,
    createdAt: "2024-01-12"
  },
  {
    id: "11",
    name: "Small Forward", 
    shortName: "SF",
    description: "Çok yönlü oyuncu, küçük forvet pozisyonu.",
    sportId: "2",
    sportName: "Basketbol",
    responsibilities: ["Skor", "Ribaund", "Defans", "Çok yönlülük"],
    skills: ["Çok yönlülük", "Atletizm", "Şut", "Ribaund"],
    formations: ["1-2-2", "2-3", "1-3-1", "2-1-2"],
    playerCount: 45,
    isActive: true,
    createdAt: "2024-01-12"
  },
  {
    id: "12",
    name: "Power Forward",
    shortName: "PF", 
    description: "Güçlü forvet, büyük forvet pozisyonu.",
    sportId: "2",
    sportName: "Basketbol",
    responsibilities: ["Ribaund", "İç oyun", "Defans", "Orta mesafe şut"],
    skills: ["Güç", "Ribaund", "İç oyun", "Defans"],
    formations: ["1-2-2", "2-3", "1-3-1", "2-1-2"],
    playerCount: 41,
    isActive: true,
    createdAt: "2024-01-12"
  },
  {
    id: "13",
    name: "Center",
    shortName: "C",
    description: "Pivot, en uzun ve güçlü oyuncu pozisyonu.",
    sportId: "2", 
    sportName: "Basketbol",
    responsibilities: ["Ribaund", "İç skor", "Blok", "Posta oyunu"],
    skills: ["Boy", "Güç", "Ribaund", "Blok"],
    formations: ["1-2-2", "2-3", "1-3-1", "2-1-2"],
    playerCount: 28,
    isActive: true,
    createdAt: "2024-01-12"
  },

  // Voleybol Pozisyonları
  {
    id: "14",
    name: "Libero",
    shortName: "L",
    description: "Savunma uzmanı, arka sıra oyuncusu.",
    sportId: "6",
    sportName: "Voleybol",
    responsibilities: ["Karşılama", "Savunma", "Manchet", "Dig"],
    skills: ["Karşılama", "Savunma", "Refleks", "Okuma"],
    formations: ["6-2", "5-1", "4-2"],
    playerCount: 35,
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: "15",
    name: "Pasör",
    shortName: "S",
    description: "Oyun kurucu, setter pozisyonu.",
    sportId: "6",
    sportName: "Voleybol", 
    responsibilities: ["Set", "Oyun kurma", "Tempo", "Strateji"],
    skills: ["El teknigi", "Oyun zekası", "Liderlik", "Temp"],
    formations: ["6-2", "5-1", "4-2"],
    playerCount: 24,
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: "16",
    name: "Smaçör",
    shortName: "OH",
    description: "Hücum oyuncusu, outside hitter pozisyonu.",
    sportId: "6",
    sportName: "Voleybol",
    responsibilities: ["Smaç", "Karşılama", "Servis", "Blok"],
    skills: ["Sıçrama", "Güç", "Smaç", "Karşılama"],
    formations: ["6-2", "5-1", "4-2", "6-0"],
    playerCount: 48,
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: "17",
    name: "Ortadan Smaçör", 
    shortName: "MB",
    description: "Orta blokçu, middle blocker pozisyonu.",
    sportId: "6",
    sportName: "Voleybol",
    responsibilities: ["Blok", "Hızlı smaç", "Orta hücum", "Savunma"],
    skills: ["Blok", "Hız", "Sıçrama", "Timing"],
    formations: ["6-2", "5-1", "4-2"],
    playerCount: 32,
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: "18",
    name: "Çapraz",
    shortName: "OPP",
    description: "Karşı çapraz, opposite hitter pozisyonu.",
    sportId: "6",
    sportName: "Voleybol",
    responsibilities: ["Smaç", "Blok", "Servis", "Skor"],
    skills: ["Güç", "Smaç", "Blok", "Servis"],
    formations: ["6-2", "5-1", "4-2"],
    playerCount: 29,
    isActive: true,
    createdAt: "2024-01-15"
  }
]

export function PlayerPositionManagement() {
  const [positions, setPositions] = useState<PlayerPosition[]>(mockPositions)
  const [sports] = useState<Sport[]>(mockSports)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingPosition, setEditingPosition] = useState<PlayerPosition | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSport, setFilterSport] = useState<string>("all")
  const [newPosition, setNewPosition] = useState<Partial<PlayerPosition>>({
    name: "",
    shortName: "",
    description: "",
    sportId: "",
    responsibilities: [],
    skills: [],
    formations: [],
    isActive: true
  })
  const [newResponsibility, setNewResponsibility] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [newFormation, setNewFormation] = useState("")

  const filteredPositions = positions.filter(position => {
    const matchesSearch = position.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.sportName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = filterSport === "all" || position.sportId === filterSport
    return matchesSearch && matchesSport
  })

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setNewPosition({
        ...newPosition,
        responsibilities: [...(newPosition.responsibilities || []), newResponsibility.trim()]
      })
      setNewResponsibility("")
    }
  }

  const removeResponsibility = (index: number) => {
    setNewPosition({
      ...newPosition,
      responsibilities: newPosition.responsibilities?.filter((_, i) => i !== index) || []
    })
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setNewPosition({
        ...newPosition,
        skills: [...(newPosition.skills || []), newSkill.trim()]
      })
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setNewPosition({
      ...newPosition,
      skills: newPosition.skills?.filter((_, i) => i !== index) || []
    })
  }

  const addFormation = () => {
    if (newFormation.trim()) {
      setNewPosition({
        ...newPosition,
        formations: [...(newPosition.formations || []), newFormation.trim()]
      })
      setNewFormation("")
    }
  }

  const removeFormation = (index: number) => {
    setNewPosition({
      ...newPosition,
      formations: newPosition.formations?.filter((_, i) => i !== index) || []
    })
  }

  const handleAddPosition = () => {
    if (newPosition.name && newPosition.shortName && newPosition.description && newPosition.sportId) {
      const selectedSport = sports.find(s => s.id === newPosition.sportId) || { name: "Bilinmeyen Branş" }
      const position: PlayerPosition = {
        id: Date.now().toString(),
        name: newPosition.name!,
        shortName: newPosition.shortName!,
        description: newPosition.description!,
        sportId: newPosition.sportId!,
        sportName: selectedSport.name,
        responsibilities: newPosition.responsibilities || [],
        skills: newPosition.skills || [],
        formations: newPosition.formations || [],
        playerCount: 0,
        isActive: newPosition.isActive!,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setPositions([...positions, position])
      setNewPosition({ 
        name: "", 
        shortName: "",
        description: "", 
        sportId: "",
        responsibilities: [],
        skills: [],
        formations: [],
        isActive: true 
      })
      setIsAddingNew(false)
    }
  }

  const handleDeletePosition = (positionId: string) => {
    setPositions(positions.filter(p => p.id !== positionId))
  }

  const togglePositionStatus = (positionId: string) => {
    setPositions(positions.map(p => 
      p.id === positionId ? { ...p, isActive: !p.isActive } : p
    ))
  }

  const totalPositions = positions.length
  const activePositions = positions.filter(p => p.isActive).length
  const totalPlayers = positions.reduce((sum, position) => sum + position.playerCount, 0)
  const sportsWithPositions = [...new Set(positions.map(p => p.sportId))].length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Oyuncu Pozisyon Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Branşa özel oyuncu pozisyonlarını yönetin</p>
        </div>
        <Button onClick={() => setIsAddingNew(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni Pozisyon Ekle
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Pozisyon</p>
                <p className="text-2xl font-bold">{totalPositions}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktif Pozisyonlar</p>
                <p className="text-2xl font-bold">{activePositions}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Oyuncu</p>
                <p className="text-2xl font-bold">{totalPlayers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Branş Sayısı</p>
                <p className="text-2xl font-bold">{sportsWithPositions}</p>
              </div>
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Arama</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Pozisyon adı veya branş ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Label>Branş Filtresi</Label>
              <Select value={filterSport} onValueChange={setFilterSport}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Branşlar</SelectItem>
                  {sports.map(sport => (
                    <SelectItem key={sport.id} value={sport.id}>
                      {sport.emoji} {sport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Position Form */}
      {isAddingNew && (
        <Card>
          <CardHeader>
            <CardTitle>Yeni Pozisyon Ekle</CardTitle>
            <CardDescription>Sisteme yeni bir oyuncu pozisyonu ekleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Pozisyon Adı</Label>
                <Input
                  value={newPosition.name || ""}
                  onChange={(e) => setNewPosition({...newPosition, name: e.target.value})}
                  placeholder="Ör: Kaleci"
                />
              </div>

              <div className="space-y-2">
                <Label>Kısa Adı</Label>
                <Input
                  value={newPosition.shortName || ""}
                  onChange={(e) => setNewPosition({...newPosition, shortName: e.target.value})}
                  placeholder="Ör: GK"
                />
              </div>

              <div className="space-y-2">
                <Label>Branş</Label>
                <Select 
                  value={newPosition.sportId || ""} 
                  onValueChange={(value) => setNewPosition({...newPosition, sportId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Branş seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map(sport => (
                      <SelectItem key={sport.id} value={sport.id}>
                        {sport.emoji} {sport.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Açıklama</Label>
              <Textarea
                value={newPosition.description || ""}
                onChange={(e) => setNewPosition({...newPosition, description: e.target.value})}
                placeholder="Pozisyon hakkında kısa açıklama..."
                rows={2}
              />
            </div>

            {/* Responsibilities */}
            <div className="space-y-3">
              <Label>Sorumluluklar</Label>
              <div className="flex gap-2">
                <Input
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  placeholder="Yeni sorumluluk ekle..."
                  onKeyPress={(e) => e.key === 'Enter' && addResponsibility()}
                />
                <Button onClick={addResponsibility} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newPosition.responsibilities?.map((resp, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {resp}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeResponsibility(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <Label>Gereken Yetenekler</Label>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Yeni yetenek ekle..."
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newPosition.skills?.map((skill, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    {skill}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeSkill(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Formations */}
            <div className="space-y-3">
              <Label>Uyumlu Dizilişler</Label>
              <div className="flex gap-2">
                <Input
                  value={newFormation}
                  onChange={(e) => setNewFormation(e.target.value)}
                  placeholder="Diziliş ekle (ör: 4-4-2)..."
                  onKeyPress={(e) => e.key === 'Enter' && addFormation()}
                />
                <Button onClick={addFormation} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newPosition.formations?.map((formation, index) => (
                  <Badge key={index} variant="default" className="gap-1">
                    {formation}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeFormation(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingNew(false)
                  setNewPosition({ 
                    name: "", 
                    shortName: "",
                    description: "", 
                    sportId: "",
                    responsibilities: [],
                    skills: [],
                    formations: [],
                    isActive: true 
                  })
                }}
              >
                <X className="w-4 h-4 mr-2" />
                İptal
              </Button>
              <Button onClick={handleAddPosition}>
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Positions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPositions.map(position => (
          <Card key={position.id} className={`${!position.isActive ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {position.shortName}
                    </Badge>
                    {position.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      {sports.find(s => s.id === position.sportId)?.emoji}
                      {position.sportName}
                    </Badge>
                    <Badge variant={position.isActive ? "default" : "secondary"}>
                      {position.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{position.description}</p>
              
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="font-semibold text-blue-600">{position.playerCount}</div>
                <div className="text-xs text-blue-800">Bu Pozisyonda Oyuncu</div>
              </div>

              {/* Responsibilities */}
              {position.responsibilities.length > 0 && (
                <div>
                  <Label className="text-xs">Sorumluluklar</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {position.responsibilities.slice(0, 3).map((resp, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {resp}
                      </Badge>
                    ))}
                    {position.responsibilities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{position.responsibilities.length - 3} daha
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Skills */}
              {position.skills.length > 0 && (
                <div>
                  <Label className="text-xs">Yetenekler</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {position.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {position.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{position.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Formations */}
              {position.formations.length > 0 && (
                <div>
                  <Label className="text-xs">Dizilişler</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {position.formations.slice(0, 3).map((formation, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {formation}
                      </Badge>
                    ))}
                    {position.formations.length > 3 && (
                      <Badge variant="default" className="text-xs">
                        +{position.formations.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  Eklendi: {new Date(position.createdAt).toLocaleDateString('tr-TR')}
                </span>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePositionStatus(position.id)}
                  >
                    {position.isActive ? "Pasif Yap" : "Aktif Yap"}
                  </Button>
                  
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingPosition(position)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Pozisyonu Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          <strong>{position.name}</strong> pozisyonunu silmek istediğinizden emin misiniz? 
                          Bu pozisyonda {position.playerCount} oyuncu bulunmaktadır.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeletePosition(position.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPositions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Pozisyon bulunamadı</h3>
            <p className="text-muted-foreground">Arama kriterlerinize uygun pozisyon bulunmuyor.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}