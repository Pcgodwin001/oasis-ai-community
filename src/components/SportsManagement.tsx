import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { 
  Trophy, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Search,
  Filter,
  BarChart3,
  Briefcase,
  Users
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Alert, AlertDescription } from "./ui/alert"
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

interface Sport {
  id: string
  name: string
  emoji: string
  category: string
  description: string
  clubCount: number
  memberCount: number
  isActive: boolean
  createdAt: string
  assignedDepartments: string[] // Department IDs
}

interface Department {
  id: string
  name: string
  category: string
  sportId: string // Hangi branşa ait olduğu (veya "all" tüm branşlar için)
}

// Mock departments data - Now sport-specific
const mockDepartments: Department[] = [
  // Futbol Departmanları
  { id: "1", name: "Futbol Analiz Departmanı", category: "performance", sportId: "1" },
  { id: "2", name: "Futbol Oyuncu İzleme Departmanı", category: "scouting", sportId: "1" },
  { id: "13", name: "Futbol Sağlık Departmanı", category: "medical", sportId: "1" },
  { id: "14", name: "Futbol Performans Departmanı", category: "performance", sportId: "1" },
  
  // Basketbol Departmanları  
  { id: "3", name: "Basketbol Analiz Departmanı", category: "performance", sportId: "2" },
  { id: "4", name: "Basketbol Performans Departmanı", category: "performance", sportId: "2" },
  { id: "15", name: "Basketbol Sağlık Departmanı", category: "medical", sportId: "2" },
  
  // Yüzme Departmanları
  { id: "5", name: "Yüzme Teknik Departmanı", category: "technical", sportId: "3" },
  { id: "6", name: "Yüzme Performans Departmanı", category: "performance", sportId: "3" },
  { id: "16", name: "Yüzme Sağlık Departmanı", category: "medical", sportId: "3" },
  
  // Karate Departmanları
  { id: "17", name: "Karate Teknik Departmanı", category: "technical", sportId: "4" },
  { id: "18", name: "Karate Sağlık Departmanı", category: "medical", sportId: "4" },
  
  // Tenis Departmanları
  { id: "19", name: "Tenis Analiz Departmanı", category: "performance", sportId: "5" },
  { id: "20", name: "Tenis Sağlık Departmanı", category: "medical", sportId: "5" },
  
  // Genel Departmanlar (Tüm sporlar için)
  { id: "7", name: "Genel Mali İşler Departmanı", category: "finance", sportId: "all" },
  { id: "8", name: "Genel Eğitim Departmanı", category: "education", sportId: "all" },
  { id: "12", name: "Genel Pazarlama Departmanı", category: "marketing", sportId: "all" }
]

const mockSports: Sport[] = [
  {
    id: "1",
    name: "Futbol",
    emoji: "⚽",
    category: "top-sporlari",
    description: "Dünya genelinde en popüler spor dalı",
    clubCount: 45,
    memberCount: 12500,
    isActive: true,
    createdAt: "2024-01-15",
    assignedDepartments: ["1", "2", "13"] // Futbol Analiz, Futbol Oyuncu İzleme, Futbol Sağlık
  },
  {
    id: "2", 
    name: "Basketbol",
    emoji: "🏀",
    category: "top-sporlari",
    description: "Hızlı tempolu ve stratejik takım sporu",
    clubCount: 30,
    memberCount: 8200,
    isActive: true,
    createdAt: "2024-01-15",
    assignedDepartments: ["3", "4", "15"] // Basketbol Analiz, Basketbol Performans, Basketbol Sağlık
  },
  {
    id: "3",
    name: "Yüzme", 
    emoji: "🏊",
    category: "su-sporlari",
    description: "Bireysel ve takım kategorilerinde su sporu",
    clubCount: 20,
    memberCount: 4500,
    isActive: true,
    createdAt: "2024-01-15",
    assignedDepartments: ["5", "6", "16"] // Yüzme Teknik, Yüzme Performans, Yüzme Sağlık
  },
  {
    id: "4",
    name: "Karate",
    emoji: "🥋", 
    category: "dovus-sporlari",
    description: "Geleneksel Japon dövüş sanatı",
    clubCount: 15,
    memberCount: 2800,
    isActive: true,
    createdAt: "2024-02-01",
    assignedDepartments: ["17", "18"] // Karate Teknik, Karate Sağlık
  },
  {
    id: "5",
    name: "Tenis",
    emoji: "🎾",
    category: "raket-sporlari", 
    description: "Bireysel ve çiftli kategorilerde raket sporu",
    clubCount: 25,
    memberCount: 3200,
    isActive: true,
    createdAt: "2024-01-20",
    assignedDepartments: ["19", "20"] // Tenis Analiz, Tenis Sağlık
  }
]

const categoryLabels = {
  "top-sporlari": "Top Sporları",
  "su-sporlari": "Su Sporları", 
  "dovus-sporlari": "Dövüş Sporları",
  "raket-sporlari": "Raket Sporları",
  "atletizm": "Atletizm",
  "gymn-dans": "Jimnastik & Dans",
  "diger": "Diğer"
}

const departmentCategoryLabels = {
  "performance": "Performans",
  "scouting": "Oyuncu İzleme",
  "medical": "Sağlık",
  "marketing": "Pazarlama",
  "technical": "Teknik",
  "administrative": "İdari",
  "education": "Eğitim",
  "finance": "Mali İşler"
}

export function SportsManagement() {
  const [sports, setSports] = useState<Sport[]>(mockSports)
  const [departments] = useState<Department[]>(mockDepartments)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingSport, setEditingSport] = useState<Sport | null>(null)
  const [managingDepartments, setManagingDepartments] = useState<Sport | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [newSport, setNewSport] = useState<Partial<Sport>>({
    name: "",
    emoji: "",
    category: "",
    description: "",
    isActive: true,
    assignedDepartments: []
  })

  const filteredSports = sports.filter(sport => {
    const matchesSearch = sport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sport.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || sport.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAddSport = () => {
    if (newSport.name && newSport.emoji && newSport.category) {
      const sport: Sport = {
        id: Date.now().toString(),
        name: newSport.name!,
        emoji: newSport.emoji!,
        category: newSport.category!,
        description: newSport.description || "",
        clubCount: 0,
        memberCount: 0,
        isActive: newSport.isActive!,
        createdAt: new Date().toISOString().split('T')[0],
        assignedDepartments: newSport.assignedDepartments || []
      }
      setSports([...sports, sport])
      setNewSport({ name: "", emoji: "", category: "", description: "", isActive: true, assignedDepartments: [] })
      setIsAddingNew(false)
    }
  }

  const handleEditSport = (sport: Sport) => {
    setEditingSport(sport)
  }

  const handleUpdateSport = () => {
    if (editingSport) {
      setSports(sports.map(s => s.id === editingSport.id ? editingSport : s))
      setEditingSport(null)
    }
  }

  const handleDeleteSport = (sportId: string) => {
    setSports(sports.filter(s => s.id !== sportId))
  }

  const toggleSportStatus = (sportId: string) => {
    setSports(sports.map(s => 
      s.id === sportId ? { ...s, isActive: !s.isActive } : s
    ))
  }

  const assignDepartmentToSport = (sportId: string, departmentId: string) => {
    setSports(sports.map(s => 
      s.id === sportId 
        ? { ...s, assignedDepartments: [...s.assignedDepartments, departmentId] }
        : s
    ))
  }

  const removeDepartmentFromSport = (sportId: string, departmentId: string) => {
    setSports(sports.map(s => 
      s.id === sportId 
        ? { ...s, assignedDepartments: s.assignedDepartments.filter(d => d !== departmentId) }
        : s
    ))
  }

  const getDepartmentName = (departmentId: string) => {
    const dept = departments.find(d => d.id === departmentId)
    return dept ? dept.name : "Bilinmeyen Departman"
  }

  const totalClubs = sports.reduce((sum, sport) => sum + sport.clubCount, 0)
  const totalMembers = sports.reduce((sum, sport) => sum + sport.memberCount, 0)
  const activeCategories = [...new Set(sports.map(s => s.category))].length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Branş Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Spor branşlarını yönetin ve düzenleyin</p>
        </div>
        <Button onClick={() => setIsAddingNew(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni Branş Ekle
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Branş</p>
                <p className="text-2xl font-bold">{sports.length}</p>
              </div>
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kulüp Sayısı</p>
                <p className="text-2xl font-bold">{totalClubs}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Üye</p>
                <p className="text-2xl font-bold">{totalMembers.toLocaleString('tr-TR')}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kategori</p>
                <p className="text-2xl font-bold">{activeCategories}</p>
              </div>
              <Trophy className="w-8 h-8 text-orange-600" />
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
                  placeholder="Branş adı veya açıklama ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
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

      {/* Add New Sport Form */}
      {isAddingNew && (
        <Card>
          <CardHeader>
            <CardTitle>Yeni Branş Ekle</CardTitle>
            <CardDescription>Sisteme yeni bir spor branşı ekleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Branş Adı</Label>
                <Input
                  value={newSport.name || ""}
                  onChange={(e) => setNewSport({...newSport, name: e.target.value})}
                  placeholder="Ör: Futbol"
                />
              </div>

              <div className="space-y-2">
                <Label>Emoji</Label>
                <Input
                  value={newSport.emoji || ""}
                  onChange={(e) => setNewSport({...newSport, emoji: e.target.value})}
                  placeholder="Ör: ⚽"
                />
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select 
                  value={newSport.category || ""} 
                  onValueChange={(value) => setNewSport({...newSport, category: value})}
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

            <div className="space-y-2">
              <Label>Açıklama</Label>
              <Textarea
                value={newSport.description || ""}
                onChange={(e) => setNewSport({...newSport, description: e.target.value})}
                placeholder="Branş hakkında kısa açıklama..."
                rows={2}
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingNew(false)
                  setNewSport({ name: "", emoji: "", category: "", description: "", isActive: true })
                }}
              >
                <X className="w-4 h-4 mr-2" />
                İptal
              </Button>
              <Button onClick={handleAddSport}>
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSports.map(sport => (
          <Card key={sport.id} className={`${!sport.isActive ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sport.emoji}</span>
                  <div>
                    <CardTitle className="text-lg">{sport.name}</CardTitle>
                    <Badge variant="outline">
                      {categoryLabels[sport.category as keyof typeof categoryLabels]}
                    </Badge>
                  </div>
                </div>
                <Badge variant={sport.isActive ? "default" : "secondary"}>
                  {sport.isActive ? "Aktif" : "Pasif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{sport.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-600">{sport.clubCount}</div>
                  <div className="text-xs text-blue-800">Kulüp</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-semibold text-green-600">{sport.memberCount.toLocaleString('tr-TR')}</div>
                  <div className="text-xs text-green-800">Üye</div>
                </div>
              </div>

              {/* Assigned Departments */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Atanmış Departmanlar</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setManagingDepartments(sport)}
                    className="text-xs h-6"
                  >
                    <Briefcase className="w-3 h-3 mr-1" />
                    Yönet
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {sport.assignedDepartments.length > 0 ? (
                    sport.assignedDepartments.slice(0, 2).map(deptId => (
                      <Badge key={deptId} variant="secondary" className="text-xs">
                        {getDepartmentName(deptId)}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Departman atanmamış</span>
                  )}
                  {sport.assignedDepartments.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{sport.assignedDepartments.length - 2} daha
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  Eklendi: {new Date(sport.createdAt).toLocaleDateString('tr-TR')}
                </span>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSportStatus(sport.id)}
                  >
                    {sport.isActive ? "Pasif Yap" : "Aktif Yap"}
                  </Button>
                  
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditSport(sport)}
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
                        <AlertDialogTitle>Branşı Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          <strong>{sport.name}</strong> branşını silmek istediğinizden emin misiniz? 
                          Bu branşı kullanan {sport.clubCount} kulüp etkilenecek.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteSport(sport.id)}
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

      {filteredSports.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Branş bulunamadı</h3>
            <p className="text-muted-foreground">Arama kriterlerinize uygun branş bulunmuyor.</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Sport Dialog */}
      {editingSport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Branş Düzenle</CardTitle>
              <CardDescription>{editingSport.name} branşını düzenleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Branş Adı</Label>
                <Input
                  value={editingSport.name}
                  onChange={(e) => setEditingSport({...editingSport, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Emoji</Label>
                <Input
                  value={editingSport.emoji}
                  onChange={(e) => setEditingSport({...editingSport, emoji: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select 
                  value={editingSport.category} 
                  onValueChange={(value) => setEditingSport({...editingSport, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Açıklama</Label>
                <Textarea
                  value={editingSport.description}
                  onChange={(e) => setEditingSport({...editingSport, description: e.target.value})}
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingSport(null)}
                >
                  İptal
                </Button>
                <Button onClick={handleUpdateSport}>
                  <Save className="w-4 h-4 mr-2" />
                  Güncelle
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Department Management Dialog */}
      {managingDepartments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {managingDepartments.name} - Departman Yönetimi
              </CardTitle>
              <CardDescription>
                Bu branşa departman atayın veya mevcut atamaları yönetin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Currently Assigned Departments */}
              <div>
                <Label className="text-base font-medium">Atanmış Departmanlar ({managingDepartments.assignedDepartments.length})</Label>
                <div className="mt-2 space-y-2">
                  {managingDepartments.assignedDepartments.length > 0 ? (
                    managingDepartments.assignedDepartments.map(deptId => {
                      const dept = departments.find(d => d.id === deptId)
                      return dept ? (
                        <div key={deptId} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Briefcase className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-900">{dept.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {departmentCategoryLabels[dept.category as keyof typeof departmentCategoryLabels] || dept.category}
                            </Badge>
                            {dept.sportId === "all" && (
                              <Badge variant="secondary" className="text-xs">
                                Genel
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDepartmentFromSport(managingDepartments.id, deptId)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : null
                    })
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Henüz departman atanmamış</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Available Departments */}
              <div>
                <Label className="text-base font-medium">Atanabilir Departmanlar</Label>
                <div className="mt-2 space-y-2">
                  {departments
                    .filter(dept => 
                      !managingDepartments.assignedDepartments.includes(dept.id) &&
                      (dept.sportId === managingDepartments.id || dept.sportId === "all")
                    )
                    .map(dept => (
                      <div key={dept.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                          <span className="font-medium text-gray-700">{dept.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {departmentCategoryLabels[dept.category as keyof typeof departmentCategoryLabels] || dept.category}
                          </Badge>
                          {dept.sportId === "all" && (
                            <Badge variant="secondary" className="text-xs">
                              Genel
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => assignDepartmentToSport(managingDepartments.id, dept.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  }
                  
                  {departments.filter(dept => 
                    !managingDepartments.assignedDepartments.includes(dept.id) &&
                    (dept.sportId === managingDepartments.id || dept.sportId === "all")
                  ).length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Bu branş için uygun departman bulunmuyor</p>
                      <p className="text-xs mt-1">Departman Yönetimi sayfasından yeni departman ekleyebilirsiniz</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setManagingDepartments(null)}
                >
                  Kapat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}