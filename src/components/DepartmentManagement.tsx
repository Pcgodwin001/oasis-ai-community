import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Search,
  Filter,
  BarChart3,
  Users,
  Building2
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

interface Department {
  id: string
  name: string
  description: string
  category: string
  sportId: string // Hangi branşa ait olduğu
  sportName: string // Branş adı (görüntüleme için)
  responsibilities: string[]
  requiredSkills: string[]
  clubCount: number
  memberCount: number
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

const mockDepartments: Department[] = [
  // Futbol Departmanları
  {
    id: "1",
    name: "Futbol Analiz Departmanı",
    description: "Futbol takımları için maç analizi, oyuncu performansı ve taktik değerlendirme",
    category: "performance",
    sportId: "1",
    sportName: "Futbol",
    responsibilities: ["Maç videoları analizi", "Oyuncu istatistikleri", "Rakip takım analizi", "Taktiksel raporlar", "Set piece analizi"],
    requiredSkills: ["Futbol taktik bilgisi", "Video analiz yazılımları", "İstatistik", "Rapor yazma"],
    clubCount: 15,
    memberCount: 45,
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    name: "Futbol Oyuncu İzleme Departmanı",
    description: "Futbol için oyuncu keşfi, scouting ve transfer analizleri",
    category: "scouting",
    sportId: "1",
    sportName: "Futbol",
    responsibilities: ["Oyuncu keşfi", "Scouting raporları", "Transfer değerlendirmeleri", "Genç yetenek takibi", "Rakip oyuncu analizi"],
    requiredSkills: ["Futbol oyuncu bilgisi", "Scouting network", "Değerlendirme", "Raporlama"],
    clubCount: 20,
    memberCount: 60,
    isActive: true,
    createdAt: "2024-01-15"
  },
  
  // Basketbol Departmanları
  {
    id: "3",
    name: "Basketbol Analiz Departmanı",
    description: "Basketbol takımları için oyun analizi, shot chart ve performans değerlendirme",
    category: "performance",
    sportId: "2",
    sportName: "Basketbol",
    responsibilities: ["Shot chart analizi", "Oyun sistemleri analizi", "Player tracking", "Rakip analizi", "Sayısal basketbol"],
    requiredSkills: ["Basketbol taktik bilgisi", "Analytics yazılımları", "İstatistiksel analiz", "Shot tracking"],
    clubCount: 12,
    memberCount: 36,
    isActive: true,
    createdAt: "2024-01-18"
  },
  {
    id: "4",
    name: "Basketbol Performans Departmanı",
    description: "Basketbolcular için özel kondisyon ve atletik performans geliştirme",
    category: "performance",
    sportId: "2",
    sportName: "Basketbol",
    responsibilities: ["Basketbola özel kondisyon", "Sıçrama antrenmanları", "Çeviklik programları", "Recovery protokolleri"],
    requiredSkills: ["Basketbol fizyolojisi", "Plyometrik antrenman", "Movement screening", "Performance testing"],
    clubCount: 10,
    memberCount: 30,
    isActive: true,
    createdAt: "2024-01-20"
  },

  // Yüzme Departmanları
  {
    id: "5",
    name: "Yüzme Teknik Departmanı",
    description: "Yüzme tekniği analizi ve stroke optimization",
    category: "technical",
    sportId: "3",
    sportName: "Yüzme",
    responsibilities: ["Stroke analizi", "Teknik düzeltme", "Video teknik analiz", "Yarış stratejileri"],
    requiredSkills: ["Yüzme teknik bilgisi", "Underwater kameralar", "Biomekhanik", "Teknik coaching"],
    clubCount: 8,
    memberCount: 24,
    isActive: true,
    createdAt: "2024-01-22"
  },
  {
    id: "6",
    name: "Yüzme Performans Departmanı",
    description: "Yüzücüler için özel kondisyon ve performans geliştirme",
    category: "performance",
    sportId: "3",
    sportName: "Yüzme",
    responsibilities: ["Dayanıklılık programları", "Güç antrenmanları", "Laktat testleri", "Yarış hazırlık"],
    requiredSkills: ["Yüzme fizyolojisi", "Periodization", "Laktat analizi", "Dryland training"],
    clubCount: 6,
    memberCount: 18,
    isActive: true,
    createdAt: "2024-01-25"
  },

  // Genel Departmanlar (Tüm sporlar için)
  {
    id: "7",
    name: "Genel Sağlık Departmanı",
    description: "Tüm spor dalları için genel sağlık hizmetleri",
    category: "medical",
    sportId: "all",
    sportName: "Tüm Sporlar",
    responsibilities: ["Genel sağlık kontrolleri", "İlk yardım", "Temel fizyoterapi", "Sağlık raporları"],
    requiredSkills: ["Tıp bilgisi", "İlk yardım", "Temel fizyoterapi", "Sağlık kayıtları"],
    clubCount: 30,
    memberCount: 90,
    isActive: true,
    createdAt: "2024-01-20"
  }
]

const categoryLabels = {
  "performance": "Performans",
  "scouting": "Oyuncu İzleme", 
  "medical": "Sağlık",
  "marketing": "Pazarlama",
  "technical": "Teknik",
  "administrative": "İdari",
  "education": "Eğitim",
  "finance": "Mali İşler"
}

export function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [sports] = useState<Sport[]>(mockSports)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterSport, setFilterSport] = useState<string>("all")
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({
    name: "",
    description: "",
    category: "",
    sportId: "",
    responsibilities: [],
    requiredSkills: [],
    isActive: true
  })
  const [newResponsibility, setNewResponsibility] = useState("")
  const [newSkill, setNewSkill] = useState("")

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.sportName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || dept.category === filterCategory
    const matchesSport = filterSport === "all" || dept.sportId === filterSport
    return matchesSearch && matchesCategory && matchesSport
  })

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setNewDepartment({
        ...newDepartment,
        responsibilities: [...(newDepartment.responsibilities || []), newResponsibility.trim()]
      })
      setNewResponsibility("")
    }
  }

  const removeResponsibility = (index: number) => {
    setNewDepartment({
      ...newDepartment,
      responsibilities: newDepartment.responsibilities?.filter((_, i) => i !== index) || []
    })
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setNewDepartment({
        ...newDepartment,
        requiredSkills: [...(newDepartment.requiredSkills || []), newSkill.trim()]
      })
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setNewDepartment({
      ...newDepartment,
      requiredSkills: newDepartment.requiredSkills?.filter((_, i) => i !== index) || []
    })
  }

  const handleAddDepartment = () => {
    if (newDepartment.name && newDepartment.description && newDepartment.category && newDepartment.sportId) {
      const selectedSport = sports.find(s => s.id === newDepartment.sportId) || { name: "Tüm Sporlar" }
      const department: Department = {
        id: Date.now().toString(),
        name: newDepartment.name!,
        description: newDepartment.description!,
        category: newDepartment.category!,
        sportId: newDepartment.sportId!,
        sportName: selectedSport.name,
        responsibilities: newDepartment.responsibilities || [],
        requiredSkills: newDepartment.requiredSkills || [],
        clubCount: 0,
        memberCount: 0,
        isActive: newDepartment.isActive!,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setDepartments([...departments, department])
      setNewDepartment({ 
        name: "", 
        description: "", 
        category: "", 
        sportId: "",
        responsibilities: [], 
        requiredSkills: [], 
        isActive: true 
      })
      setIsAddingNew(false)
    }
  }

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department)
  }

  const handleUpdateDepartment = () => {
    if (editingDepartment) {
      setDepartments(departments.map(d => d.id === editingDepartment.id ? editingDepartment : d))
      setEditingDepartment(null)
    }
  }

  const handleDeleteDepartment = (departmentId: string) => {
    setDepartments(departments.filter(d => d.id !== departmentId))
  }

  const toggleDepartmentStatus = (departmentId: string) => {
    setDepartments(departments.map(d => 
      d.id === departmentId ? { ...d, isActive: !d.isActive } : d
    ))
  }

  const totalClubs = departments.reduce((sum, dept) => sum + dept.clubCount, 0)
  const totalMembers = departments.reduce((sum, dept) => sum + dept.memberCount, 0)
  const activeCategories = [...new Set(departments.map(d => d.category))].length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Departman Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Kulüp departmanlarını yönetin ve düzenleyin</p>
        </div>
        <Button onClick={() => setIsAddingNew(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni Departman Ekle
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Departman</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
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
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Üye</p>
                <p className="text-2xl font-bold">{totalMembers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
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
              <BarChart3 className="w-8 h-8 text-orange-600" />
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
                  placeholder="Departman adı veya açıklama ile ara..."
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
                  <SelectItem value="all">🏆 Tüm Sporlar</SelectItem>
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

      {/* Add New Department Form */}
      {isAddingNew && (
        <Card>
          <CardHeader>
            <CardTitle>Yeni Departman Ekle</CardTitle>
            <CardDescription>Sisteme yeni bir departman ekleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Departman Adı</Label>
                <Input
                  value={newDepartment.name || ""}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                  placeholder="Ör: Futbol Analiz Departmanı"
                />
              </div>

              <div className="space-y-2">
                <Label>Branş</Label>
                <Select 
                  value={newDepartment.sportId || ""} 
                  onValueChange={(value) => setNewDepartment({...newDepartment, sportId: value})}
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
                    <SelectItem value="all">🏆 Tüm Sporlar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select 
                  value={newDepartment.category || ""} 
                  onValueChange={(value) => setNewDepartment({...newDepartment, category: value})}
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
                value={newDepartment.description || ""}
                onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                placeholder="Departman hakkında kısa açıklama..."
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
                {newDepartment.responsibilities?.map((resp, index) => (
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

            {/* Required Skills */}
            <div className="space-y-3">
              <Label>Gerekli Yetenekler</Label>
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
                {newDepartment.requiredSkills?.map((skill, index) => (
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

            <div className="flex items-center justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingNew(false)
                  setNewDepartment({ 
                    name: "", 
                    description: "", 
                    category: "", 
                    sportId: "",
                    responsibilities: [], 
                    requiredSkills: [], 
                    isActive: true 
                  })
                }}
              >
                <X className="w-4 h-4 mr-2" />
                İptal
              </Button>
              <Button onClick={handleAddDepartment}>
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Departments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDepartments.map(department => (
          <Card key={department.id} className={`${!department.isActive ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{department.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {categoryLabels[department.category as keyof typeof categoryLabels]}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      {sports.find(s => s.id === department.sportId)?.emoji || "🏆"}
                      {department.sportName}
                    </Badge>
                  </div>
                </div>
                <Badge variant={department.isActive ? "default" : "secondary"}>
                  {department.isActive ? "Aktif" : "Pasif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{department.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-600">{department.clubCount}</div>
                  <div className="text-xs text-blue-800">Kulüp</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-semibold text-green-600">{department.memberCount}</div>
                  <div className="text-xs text-green-800">Üye</div>
                </div>
              </div>

              {/* Responsibilities */}
              {department.responsibilities.length > 0 && (
                <div>
                  <Label className="text-xs">Sorumluluklar</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {department.responsibilities.slice(0, 3).map((resp, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {resp}
                      </Badge>
                    ))}
                    {department.responsibilities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{department.responsibilities.length - 3} daha
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Required Skills */}
              {department.requiredSkills.length > 0 && (
                <div>
                  <Label className="text-xs">Gerekli Yetenekler</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {department.requiredSkills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {department.requiredSkills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{department.requiredSkills.length - 3} daha
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  Eklendi: {new Date(department.createdAt).toLocaleDateString('tr-TR')}
                </span>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleDepartmentStatus(department.id)}
                  >
                    {department.isActive ? "Pasif Yap" : "Aktif Yap"}
                  </Button>
                  
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditDepartment(department)}
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
                        <AlertDialogTitle>Departmanı Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          <strong>{department.name}</strong> departmanını silmek istediğinizden emin misiniz? 
                          Bu departmanı kullanan {department.clubCount} kulüp etkilenecek.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteDepartment(department.id)}
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

      {filteredDepartments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Departman bulunamadı</h3>
            <p className="text-muted-foreground">Arama kriterlerinize uygun departman bulunmuyor.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}