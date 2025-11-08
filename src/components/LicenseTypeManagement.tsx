import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Search,
  Users,
  Building2,
  Calendar,
  Shield
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

interface LicenseType {
  id: string
  name: string
  description: string
  category: string
  sportId: string
  sportName: string
  validityPeriod: number // ay cinsinden
  requirements: string[]
  fees: {
    registrationFee: number
    renewalFee: number
    currency: string
  }
  ageGroups: string[]
  isActive: boolean
  playerCount: number
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

const mockLicenseTypes: LicenseType[] = [
  // Futbol Lisans Tipleri
  {
    id: "1",
    name: "Futbol Amatör Lisansı",
    description: "Amatör seviyede futbol oynayan oyuncular için temel lisans",
    category: "amateur",
    sportId: "1",
    sportName: "Futbol",
    validityPeriod: 12,
    requirements: ["Sağlık raporu", "Kimlik fotokopisi", "Kulüp tescil belgesi", "Amatör beyannamesi"],
    fees: {
      registrationFee: 150,
      renewalFee: 100,
      currency: "TL"
    },
    ageGroups: ["U16", "U18", "U21", "Seniors"],
    isActive: true,
    playerCount: 1250,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Futbol Profesyonel Lisansı",
    description: "Profesyonel liglerde oynayan futbolcular için lisans",
    category: "professional",
    sportId: "1",
    sportName: "Futbol",
    validityPeriod: 12,
    requirements: ["Detaylı sağlık raporu", "Kimlik fotokopisi", "Profesyonel sözleşme", "TFF onay belgesi"],
    fees: {
      registrationFee: 500,
      renewalFee: 300,
      currency: "TL"
    },
    ageGroups: ["U21", "Seniors"],
    isActive: true,
    playerCount: 450,
    createdAt: "2024-01-15"
  },
  {
    id: "3",
    name: "Futbol Genç Lisansı",
    description: "16 yaş altı genç oyuncular için özel lisans",
    category: "youth",
    sportId: "1",
    sportName: "Futbol",
    validityPeriod: 12,
    requirements: ["Sağlık raporu", "Veli izin belgesi", "Kimlik fotokopisi", "Okul belgesi"],
    fees: {
      registrationFee: 75,
      renewalFee: 50,
      currency: "TL"
    },
    ageGroups: ["U8", "U10", "U12", "U14", "U16"],
    isActive: true,
    playerCount: 800,
    createdAt: "2024-01-15"
  },

  // Basketbol Lisans Tipleri
  {
    id: "4",
    name: "Basketbol Amatör Lisansı",
    description: "Amatör basketbol liglerinde oynayan oyuncular için",
    category: "amateur",
    sportId: "2",
    sportName: "Basketbol",
    validityPeriod: 12,
    requirements: ["Sağlık raporu", "Kimlik fotokopisi", "Boy-kilo ölçümü", "TBF tescil belgesi"],
    fees: {
      registrationFee: 200,
      renewalFee: 120,
      currency: "TL"
    },
    ageGroups: ["U16", "U18", "U20", "Seniors"],
    isActive: true,
    playerCount: 680,
    createdAt: "2024-01-18"
  },
  {
    id: "5",
    name: "Basketbol Profesyonel Lisansı",
    description: "BSL ve alt liglerde oynayan profesyonel basketbolcular için",
    category: "professional",
    sportId: "2",
    sportName: "Basketbol",
    validityPeriod: 12,
    requirements: ["Detaylı sağlık raporu", "Kimlik fotokopisi", "Profesyonel sözleşme", "TBF onayı"],
    fees: {
      registrationFee: 750,
      renewalFee: 400,
      currency: "TL"
    },
    ageGroups: ["U18", "U20", "Seniors"],
    isActive: true,
    playerCount: 320,
    createdAt: "2024-01-18"
  },

  // Yüzme Lisans Tipleri
  {
    id: "6",
    name: "Yüzme Yarışma Lisansı",
    description: "Resmi yüzme yarışmalarına katılan sporcular için",
    category: "competitive",
    sportId: "3",
    sportName: "Yüzme",
    validityPeriod: 12,
    requirements: ["Sağlık raporu", "Yüzme seviye testi", "Kimlik fotokopisi", "TYF tescil"],
    fees: {
      registrationFee: 300,
      renewalFee: 180,
      currency: "TL"
    },
    ageGroups: ["U12", "U14", "U16", "U18", "Seniors", "Masters"],
    isActive: true,
    playerCount: 420,
    createdAt: "2024-01-20"
  },
  {
    id: "7",
    name: "Yüzme Rekreasyon Lisansı",
    description: "Rekreasyonel amaçlı yüzme yapan sporcular için",
    category: "recreational",
    sportId: "3",
    sportName: "Yüzme",
    validityPeriod: 6,
    requirements: ["Temel sağlık raporu", "Kimlik fotokopisi", "Yüzme becerisini gösteren belge"],
    fees: {
      registrationFee: 100,
      renewalFee: 60,
      currency: "TL"
    },
    ageGroups: ["Tüm yaşlar"],
    isActive: true,
    playerCount: 150,
    createdAt: "2024-01-20"
  },

  // Karate Lisans Tipleri
  {
    id: "8",
    name: "Karate Dan/Kyu Lisansı",
    description: "Karate dan ve kyu dereceli sporcular için",
    category: "graded",
    sportId: "4",
    sportName: "Karate",
    validityPeriod: 24,
    requirements: ["Sağlık raporu", "Dan/Kyu sertifikası", "Kimlik fotokopisi", "Dojo tescil belgesi"],
    fees: {
      registrationFee: 250,
      renewalFee: 150,
      currency: "TL"
    },
    ageGroups: ["U12", "U14", "U16", "U18", "Seniors"],
    isActive: true,
    playerCount: 380,
    createdAt: "2024-01-25"
  }
]

const categoryLabels = {
  "amateur": "Amatör",
  "professional": "Profesyonel", 
  "youth": "Genç",
  "competitive": "Yarışmacı",
  "recreational": "Rekreasyonel",
  "graded": "Dereceli"
}

export function LicenseTypeManagement() {
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>(mockLicenseTypes)
  const [sports] = useState<Sport[]>(mockSports)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingLicense, setEditingLicense] = useState<LicenseType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterSport, setFilterSport] = useState<string>("all")
  const [newLicense, setNewLicense] = useState<Partial<LicenseType>>({
    name: "",
    description: "",
    category: "",
    sportId: "",
    validityPeriod: 12,
    requirements: [],
    fees: {
      registrationFee: 0,
      renewalFee: 0,
      currency: "TL"
    },
    ageGroups: [],
    isActive: true
  })
  const [newRequirement, setNewRequirement] = useState("")
  const [newAgeGroup, setNewAgeGroup] = useState("")

  const filteredLicenseTypes = licenseTypes.filter(license => {
    const matchesSearch = license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.sportName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || license.category === filterCategory
    const matchesSport = filterSport === "all" || license.sportId === filterSport
    return matchesSearch && matchesCategory && matchesSport
  })

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setNewLicense({
        ...newLicense,
        requirements: [...(newLicense.requirements || []), newRequirement.trim()]
      })
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setNewLicense({
      ...newLicense,
      requirements: newLicense.requirements?.filter((_, i) => i !== index) || []
    })
  }

  const addAgeGroup = () => {
    if (newAgeGroup.trim()) {
      setNewLicense({
        ...newLicense,
        ageGroups: [...(newLicense.ageGroups || []), newAgeGroup.trim()]
      })
      setNewAgeGroup("")
    }
  }

  const removeAgeGroup = (index: number) => {
    setNewLicense({
      ...newLicense,
      ageGroups: newLicense.ageGroups?.filter((_, i) => i !== index) || []
    })
  }

  const handleAddLicense = () => {
    if (newLicense.name && newLicense.description && newLicense.category && newLicense.sportId) {
      const selectedSport = sports.find(s => s.id === newLicense.sportId) || { name: "Bilinmeyen Branş" }
      const license: LicenseType = {
        id: Date.now().toString(),
        name: newLicense.name!,
        description: newLicense.description!,
        category: newLicense.category!,
        sportId: newLicense.sportId!,
        sportName: selectedSport.name,
        validityPeriod: newLicense.validityPeriod!,
        requirements: newLicense.requirements || [],
        fees: newLicense.fees!,
        ageGroups: newLicense.ageGroups || [],
        isActive: newLicense.isActive!,
        playerCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setLicenseTypes([...licenseTypes, license])
      setNewLicense({ 
        name: "", 
        description: "", 
        category: "", 
        sportId: "",
        validityPeriod: 12,
        requirements: [],
        fees: {
          registrationFee: 0,
          renewalFee: 0,
          currency: "TL"
        },
        ageGroups: [],
        isActive: true 
      })
      setIsAddingNew(false)
    }
  }

  const handleDeleteLicense = (licenseId: string) => {
    setLicenseTypes(licenseTypes.filter(l => l.id !== licenseId))
  }

  const toggleLicenseStatus = (licenseId: string) => {
    setLicenseTypes(licenseTypes.map(l => 
      l.id === licenseId ? { ...l, isActive: !l.isActive } : l
    ))
  }

  const totalPlayers = licenseTypes.reduce((sum, license) => sum + license.playerCount, 0)
  const activeLicenses = licenseTypes.filter(l => l.isActive).length
  const totalRevenue = licenseTypes.reduce((sum, license) => 
    sum + (license.fees.registrationFee * license.playerCount), 0
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Lisans Tipi Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Branşa özel lisans tiplerini yönetin</p>
        </div>
        <Button onClick={() => setIsAddingNew(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni Lisans Tipi Ekle
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Lisans Tipi</p>
                <p className="text-2xl font-bold">{licenseTypes.length}</p>
              </div>
              <Award className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktif Lisanslar</p>
                <p className="text-2xl font-bold">{activeLicenses}</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
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
                <p className="text-sm font-medium text-muted-foreground">Toplam Gelir</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} ₺</p>
              </div>
              <Building2 className="w-8 h-8 text-orange-600" />
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
                  placeholder="Lisans tipi adı veya branş ile ara..."
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
            
            <div className="w-full md:w-48">
              <Label>Kategori Filtresi</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New License Form */}
      {isAddingNew && (
        <Card>
          <CardHeader>
            <CardTitle>Yeni Lisans Tipi Ekle</CardTitle>
            <CardDescription>Sisteme yeni bir lisans tipi ekleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Lisans Adı</Label>
                <Input
                  value={newLicense.name || ""}
                  onChange={(e) => setNewLicense({...newLicense, name: e.target.value})}
                  placeholder="Ör: Futbol Amatör Lisansı"
                />
              </div>

              <div className="space-y-2">
                <Label>Branş</Label>
                <Select 
                  value={newLicense.sportId || ""} 
                  onValueChange={(value) => setNewLicense({...newLicense, sportId: value})}
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

              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select 
                  value={newLicense.category || ""} 
                  onValueChange={(value) => setNewLicense({...newLicense, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Geçerlilik Süresi (Ay)</Label>
                <Input
                  type="number"
                  value={newLicense.validityPeriod || 12}
                  onChange={(e) => setNewLicense({...newLicense, validityPeriod: parseInt(e.target.value)})}
                  placeholder="12"
                />
              </div>

              <div className="space-y-2">
                <Label>Kayıt Ücreti (₺)</Label>
                <Input
                  type="number"
                  value={newLicense.fees?.registrationFee || 0}
                  onChange={(e) => setNewLicense({
                    ...newLicense, 
                    fees: {
                      ...newLicense.fees!,
                      registrationFee: parseInt(e.target.value)
                    }
                  })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Yenileme Ücreti (₺)</Label>
                <Input
                  type="number"
                  value={newLicense.fees?.renewalFee || 0}
                  onChange={(e) => setNewLicense({
                    ...newLicense,
                    fees: {
                      ...newLicense.fees!,
                      renewalFee: parseInt(e.target.value)
                    }
                  })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Açıklama</Label>
              <Textarea
                value={newLicense.description || ""}
                onChange={(e) => setNewLicense({...newLicense, description: e.target.value})}
                placeholder="Lisans hakkında kısa açıklama..."
                rows={2}
              />
            </div>

            {/* Requirements */}
            <div className="space-y-3">
              <Label>Gereksinimler</Label>
              <div className="flex gap-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Yeni gereksinim ekle..."
                  onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                />
                <Button onClick={addRequirement} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newLicense.requirements?.map((req, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {req}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeRequirement(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Age Groups */}
            <div className="space-y-3">
              <Label>Yaş Grupları</Label>
              <div className="flex gap-2">
                <Input
                  value={newAgeGroup}
                  onChange={(e) => setNewAgeGroup(e.target.value)}
                  placeholder="Yaş grubu ekle (ör: U16)..."
                  onKeyPress={(e) => e.key === 'Enter' && addAgeGroup()}
                />
                <Button onClick={addAgeGroup} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newLicense.ageGroups?.map((age, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    {age}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeAgeGroup(index)}
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
                  setNewLicense({ 
                    name: "", 
                    description: "", 
                    category: "", 
                    sportId: "",
                    validityPeriod: 12,
                    requirements: [],
                    fees: {
                      registrationFee: 0,
                      renewalFee: 0,
                      currency: "TL"
                    },
                    ageGroups: [],
                    isActive: true 
                  })
                }}
              >
                <X className="w-4 h-4 mr-2" />
                İptal
              </Button>
              <Button onClick={handleAddLicense}>
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* License Types List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLicenseTypes.map(license => (
          <Card key={license.id} className={`${!license.isActive ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{license.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {categoryLabels[license.category as keyof typeof categoryLabels]}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      {sports.find(s => s.id === license.sportId)?.emoji}
                      {license.sportName}
                    </Badge>
                  </div>
                </div>
                <Badge variant={license.isActive ? "default" : "secondary"}>
                  {license.isActive ? "Aktif" : "Pasif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{license.description}</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-600">{license.playerCount}</div>
                  <div className="text-xs text-blue-800">Oyuncu</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-semibold text-green-600">{license.validityPeriod}</div>
                  <div className="text-xs text-green-800">Ay Geçerli</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded">
                  <div className="font-semibold text-orange-600">{license.fees.registrationFee} ₺</div>
                  <div className="text-xs text-orange-800">Kayıt Ücreti</div>
                </div>
              </div>

              {/* Requirements */}
              {license.requirements.length > 0 && (
                <div>
                  <Label className="text-xs">Gereksinimler</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {license.requirements.slice(0, 2).map((req, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                    {license.requirements.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{license.requirements.length - 2} daha
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Age Groups */}
              {license.ageGroups.length > 0 && (
                <div>
                  <Label className="text-xs">Yaş Grupları</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {license.ageGroups.slice(0, 4).map((age, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {age}
                      </Badge>
                    ))}
                    {license.ageGroups.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{license.ageGroups.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  Eklendi: {new Date(license.createdAt).toLocaleDateString('tr-TR')}
                </span>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLicenseStatus(license.id)}
                  >
                    {license.isActive ? "Pasif Yap" : "Aktif Yap"}
                  </Button>
                  
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingLicense(license)}
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
                        <AlertDialogTitle>Lisans Tipini Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          <strong>{license.name}</strong> lisans tipini silmek istediğinizden emin misiniz? 
                          Bu lisansa sahip {license.playerCount} oyuncu etkilenecek.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteLicense(license.id)}
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

      {filteredLicenseTypes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Lisans tipi bulunamadı</h3>
            <p className="text-muted-foreground">Arama kriterlerinize uygun lisans tipi bulunmuyor.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}