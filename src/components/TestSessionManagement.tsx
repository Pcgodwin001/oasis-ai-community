import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Search,
  User,
  Clock,
  TestTube,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  FileText
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

interface TestSession {
  id: string
  playerId: string
  playerName: string
  sessionDate: string
  testId: string
  testName: string
  testCategory: string
  notes: string
  status: "planned" | "in_progress" | "completed" | "cancelled"
  results: TestResult[]
  createdBy: string
  createdAt: string
}

interface TestResult {
  id: string
  testTypeId: string
  testTypeName: string
  calculatedValue: number
  rawResults: { [key: string]: any }
  comments: string
  isValid: boolean
  judgement: string
  approvalStatus: "pending" | "approved" | "rejected"
  scoreLevel: string
  scoreCode: string
}

interface Player {
  id: string
  name: string
  position: string
  age: number
  team: string
}

interface TestType {
  id: string
  name: string
  categoryName: string
  unit: string
}

// Mock data
const mockPlayers: Player[] = [
  { id: "1", name: "Ahmet Yılmaz", position: "Kaleci", age: 24, team: "A Takımı" },
  { id: "2", name: "Mehmet Demir", position: "Defans", age: 22, team: "A Takımı" },
  { id: "3", name: "Ali Kaya", position: "Orta Saha", age: 26, team: "A Takımı" },
  { id: "4", name: "Fatih Öz", position: "Forvet", age: 23, team: "A Takımı" },
  { id: "5", name: "Burak Şen", position: "Kanat", age: 25, team: "B Takımı" }
]

const mockTestTypes: TestType[] = [
  { id: "1", name: "30 Metre Sprint", categoryName: "Fiziksel", unit: "saniye" },
  { id: "2", name: "Cooper Testi", categoryName: "Fiziksel", unit: "metre" },
  { id: "3", name: "Dikey Sıçrama", categoryName: "Fiziksel", unit: "cm" },
  { id: "4", name: "Futbol Dribling", categoryName: "Teknik", unit: "saniye" },
  { id: "5", name: "Konsantrasyon Testi", categoryName: "Psikolojik", unit: "puan" }
]

const mockTestSessions: TestSession[] = [
  {
    id: "1",
    playerId: "1",
    playerName: "Ahmet Yılmaz",
    sessionDate: "2024-01-25",
    testId: "1",
    testName: "30 Metre Sprint",
    testCategory: "Fiziksel",
    notes: "Sezon öncesi rutin test",
    status: "completed",
    results: [
      {
        id: "1",
        testTypeId: "1",
        testTypeName: "30 Metre Sprint",
        calculatedValue: 4.25,
        rawResults: { "1. Deneme": 4.32, "2. Deneme": 4.25, "En İyi": 4.25 },
        comments: "İyi performans",
        isValid: true,
        judgement: "Başarılı",
        approvalStatus: "approved",
        scoreLevel: "Orta",
        scoreCode: "B"
      }
    ],
    createdBy: "Dr. Mehmet Özkan",
    createdAt: "2024-01-20"
  },
  {
    id: "2",
    playerId: "2",
    playerName: "Mehmet Demir",
    sessionDate: "2024-01-26",
    testId: "2",
    testName: "Cooper Testi",
    testCategory: "Fiziksel",
    notes: "Dayanıklılık değerlendirmesi",
    status: "in_progress",
    results: [],
    createdBy: "Dr. Mehmet Özkan",
    createdAt: "2024-01-25"
  },
  {
    id: "3",
    playerId: "3",
    playerName: "Ali Kaya",
    sessionDate: "2024-01-27",
    testId: "3",
    testName: "Dikey Sıçrama",
    testCategory: "Fiziksel",
    notes: "Patlayıcı güç testi",
    status: "planned",
    results: [],
    createdBy: "Dr. Mehmet Özkan",
    createdAt: "2024-01-25"
  },
  {
    id: "4",
    playerId: "4",
    playerName: "Fatih Öz",
    sessionDate: "2024-01-24",
    testId: "4",
    testName: "Futbol Dribling",
    testCategory: "Teknik",
    notes: "Teknik beceri değerlendirmesi",
    status: "completed",
    results: [
      {
        id: "2",
        testTypeId: "4",
        testTypeName: "Futbol Dribling",
        calculatedValue: 12.8,
        rawResults: { "1. Deneme": 13.2, "2. Deneme": 12.8, "3. Deneme": 13.1 },
        comments: "Standart performans",
        isValid: true,
        judgement: "Orta",
        approvalStatus: "pending",
        scoreLevel: "Orta",
        scoreCode: "C"
      }
    ],
    createdBy: "Antrenör Selim Yıldız",
    createdAt: "2024-01-22"
  },
  {
    id: "5",
    playerId: "5",
    playerName: "Burak Şen",
    sessionDate: "2024-01-23",
    testId: "5",
    testName: "Konsantrasyon Testi",
    testCategory: "Psikolojik",
    notes: "Zihinsel hazırlık testi",
    status: "cancelled",
    results: [],
    createdBy: "Psikolog Dr. Ayşe Korkmaz",
    createdAt: "2024-01-22"
  }
]

const statusLabels = {
  "planned": "Planlandı",
  "in_progress": "Devam Ediyor",
  "completed": "Tamamlandı",
  "cancelled": "İptal Edildi"
}

const statusColors = {
  "planned": "bg-blue-100 text-blue-800",
  "in_progress": "bg-yellow-100 text-yellow-800",
  "completed": "bg-green-100 text-green-800",
  "cancelled": "bg-red-100 text-red-800"
}

const approvalStatusLabels = {
  "pending": "Beklemede",
  "approved": "Onaylandı",
  "rejected": "Reddedildi"
}

export function TestSessionManagement() {
  const [sessions, setSessions] = useState<TestSession[]>(mockTestSessions)
  const [players] = useState<Player[]>(mockPlayers)
  const [testTypes] = useState<TestType[]>(mockTestTypes)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [isAddingSession, setIsAddingSession] = useState(false)
  const [selectedSession, setSelectedSession] = useState<TestSession | null>(null)
  const [newSession, setNewSession] = useState<Partial<TestSession>>({
    playerId: "",
    sessionDate: "",
    testId: "",
    notes: "",
    status: "planned"
  })

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.testCategory.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || session.status === filterStatus
    const matchesCategory = filterCategory === "all" || session.testCategory === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleAddSession = () => {
    if (newSession.playerId && newSession.sessionDate && newSession.testId) {
      const selectedPlayer = players.find(p => p.id === newSession.playerId)
      const selectedTest = testTypes.find(t => t.id === newSession.testId)
      
      const session: TestSession = {
        id: Date.now().toString(),
        playerId: newSession.playerId!,
        playerName: selectedPlayer?.name || "Bilinmeyen",
        sessionDate: newSession.sessionDate!,
        testId: newSession.testId!,
        testName: selectedTest?.name || "Bilinmeyen",
        testCategory: selectedTest?.categoryName || "Bilinmeyen",
        notes: newSession.notes || "",
        status: newSession.status as any || "planned",
        results: [],
        createdBy: "Sistem Yöneticisi",
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setSessions([...sessions, session])
      setNewSession({
        playerId: "",
        sessionDate: "",
        testId: "",
        notes: "",
        status: "planned"
      })
      setIsAddingSession(false)
    }
  }

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId))
  }

  const updateSessionStatus = (sessionId: string, newStatus: string) => {
    setSessions(sessions.map(s => 
      s.id === sessionId ? { ...s, status: newStatus as any } : s
    ))
  }

  const totalSessions = sessions.length
  const completedSessions = sessions.filter(s => s.status === "completed").length
  const pendingSessions = sessions.filter(s => s.status === "planned" || s.status === "in_progress").length
  const cancelledSessions = sessions.filter(s => s.status === "cancelled").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Test Oturumları</h1>
          <p className="text-muted-foreground mt-1">Sporcu test oturumlarını yönetin ve sonuçları takip edin</p>
        </div>
        <Button onClick={() => setIsAddingSession(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni Test Oturumu
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Oturum</p>
                <p className="text-2xl font-bold">{totalSessions}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tamamlanan</p>
                <p className="text-2xl font-bold">{completedSessions}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bekleyen</p>
                <p className="text-2xl font-bold">{pendingSessions}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">İptal Edilen</p>
                <p className="text-2xl font-bold">{cancelledSessions}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
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
                  placeholder="Oyuncu adı, test adı ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Label>Durum Filtresi</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
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
                  <SelectItem value="Fiziksel">Fiziksel</SelectItem>
                  <SelectItem value="Teknik">Teknik</SelectItem>
                  <SelectItem value="Psikolojik">Psikolojik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Session Form */}
      {isAddingSession && (
        <Card>
          <CardHeader>
            <CardTitle>Yeni Test Oturumu</CardTitle>
            <CardDescription>Yeni bir test oturumu planlayın</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Oyuncu</Label>
                <Select 
                  value={newSession.playerId || ""} 
                  onValueChange={(value) => setNewSession({...newSession, playerId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Oyuncu seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {players.map(player => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name} - {player.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Test Türü</Label>
                <Select 
                  value={newSession.testId || ""} 
                  onValueChange={(value) => setNewSession({...newSession, testId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Test türü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {testTypes.map(testType => (
                      <SelectItem key={testType.id} value={testType.id}>
                        {testType.name} - {testType.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Oturum Tarihi</Label>
                <Input
                  type="date"
                  value={newSession.sessionDate || ""}
                  onChange={(e) => setNewSession({...newSession, sessionDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Durum</Label>
                <Select 
                  value={newSession.status || "planned"} 
                  onValueChange={(value) => setNewSession({...newSession, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Notlar</Label>
              <Textarea
                value={newSession.notes || ""}
                onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                placeholder="Test oturumu hakkında notlar..."
              />
            </div>
            
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingSession(false)}>
                <X className="w-4 h-4 mr-2" />
                İptal
              </Button>
              <Button onClick={handleAddSession}>
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSessions.map(session => (
          <Card key={session.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {session.playerName}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{session.testCategory}</Badge>
                    <Badge variant="secondary">{session.testName}</Badge>
                    <Badge className={statusColors[session.status]}>
                      {statusLabels[session.status]}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.sessionDate).toLocaleDateString('tr-TR')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.createdBy}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.notes && (
                <p className="text-sm text-muted-foreground">{session.notes}</p>
              )}
              
              {/* Test Results */}
              {session.results.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Test Sonuçları</Label>
                  {session.results.map(result => (
                    <div key={result.id} className="p-3 bg-gray-50 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{result.testTypeName}</Badge>
                          <Badge variant={result.isValid ? "default" : "destructive"}>
                            {result.isValid ? "Geçerli" : "Geçersiz"}
                          </Badge>
                          <Badge className={
                            result.approvalStatus === "approved" ? "bg-green-100 text-green-800" :
                            result.approvalStatus === "rejected" ? "bg-red-100 text-red-800" : 
                            "bg-yellow-100 text-yellow-800"
                          }>
                            {approvalStatusLabels[result.approvalStatus]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">{result.calculatedValue}</span>
                          <span className="text-sm text-muted-foreground">
                            {testTypes.find(t => t.id === result.testTypeId)?.unit}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Değerlendirme: {result.judgement}</p>
                        <p>Seviye: {result.scoreLevel} ({result.scoreCode})</p>
                        {result.comments && <p>Yorumlar: {result.comments}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  Oluşturulma: {new Date(session.createdAt).toLocaleDateString('tr-TR')}
                </span>
                
                <div className="flex items-center gap-2">
                  {session.status === "planned" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSessionStatus(session.id, "in_progress")}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Başlat
                    </Button>
                  )}
                  
                  {session.status === "in_progress" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSessionStatus(session.id, "completed")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Tamamla
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSession(session)}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Detay
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
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
                        <AlertDialogTitle>Test Oturumunu Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu test oturumunu silmek istediğinizden emin misiniz?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteSession(session.id)}
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

      {filteredSessions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Test oturumu bulunamadı</h3>
            <p className="text-muted-foreground">Arama kriterlerinize uygun test oturumu bulunmuyor.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}