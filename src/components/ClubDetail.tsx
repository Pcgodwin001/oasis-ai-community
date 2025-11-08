import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
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
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Trash2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  Trophy,
  Building2,
  User,
  Shield,
  AlertCircle,
  CheckCircle,
  Plus,
  Minus
} from "lucide-react"
import { Club } from "./ClubManagement"

interface ClubDetailProps {
  club: Club
  onBack: () => void
  onUpdate: (club: Club) => void
  onDelete: (clubId: string) => void
}

const statusLabels = {
  active: "Aktif",
  pending: "Beklemede",
  suspended: "Askıya Alınmış"
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  suspended: "bg-red-100 text-red-800"
}

const roleLabels = {
  "baskan": "Başkan",
  "genel-koordinator": "Genel Koordinatör",
  "spor-direktoru": "Spor Direktörü",
  "yonetim-kurulu": "Yönetim Kurulu Üyesi",
  "genel-sekreter": "Genel Sekreter",
  "mali-isler": "Mali İşler Sorumlusu"
}

const sportLabels: { [key: string]: string } = {
  "futbol": "Futbol ⚽",
  "basketbol": "Basketbol 🏀",
  "voleybol": "Voleybol 🏐",
  "yuzme": "Yüzme 🏊",
  "tenis": "Tenis 🎾",
  "atletizm": "Atletizm 🏃",
  "badminton": "Badminton 🏸",
  "yelken": "Yelken ⛵",
  "jimnastik": "Jimnastik 🤸",
  "fitness": "Fitness 💪",
  "pilates": "Pilates 🧘",
  "karate": "Karate 🥋",
  "judo": "Judo 🥋",
  "boks": "Boks 🥊",
  "guler": "Güreş 🤼",
  "halk-oyunlari": "Halk Oyunları 💃",
  "satranc": "Satranç ♟️",
  "masa-tenisi": "Masa Tenisi 🏓",
  "hentbol": "Hentbol 🤾",
  "golf": "Golf ⛳",
  "okculuk": "Okçuluk 🏹"
}

// Tüm mevcut spor branşları
const allSports = Object.keys(sportLabels)

export function ClubDetail({ club, onBack, onUpdate, onDelete }: ClubDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedClub, setEditedClub] = useState<Club>(club)
  const [isSaving, setIsSaving] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
    setEditedClub(club)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedClub(club)
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onUpdate(editedClub)
    setIsEditing(false)
    setIsSaving(false)
  }

  const handleDelete = () => {
    onDelete(club.id)
  }

  const updateEditedClub = (updates: Partial<Club>) => {
    setEditedClub(prev => ({ ...prev, ...updates }))
  }

  const addSport = (sport: string) => {
    if (!editedClub.selectedSports.includes(sport)) {
      updateEditedClub({ 
        selectedSports: [...editedClub.selectedSports, sport] 
      })
    }
  }

  const removeSport = (sport: string) => {
    updateEditedClub({ 
      selectedSports: editedClub.selectedSports.filter(s => s !== sport) 
    })
  }

  const availableSports = allSports.filter(sport => 
    !editedClub.selectedSports.includes(sport)
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kulüp Listesi
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={club.logo} alt={club.clubName} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {club.clubName.split(' ').map(word => word[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold text-foreground">{club.clubName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={statusColors[club.status]}>
                  {statusLabels[club.status]}
                </Badge>
                <span className="text-sm text-muted-foreground">ID: {club.id}</span>
              </div>
            </div>
          </div>
        </div>
            
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleEdit} className="gap-2">
                    <Edit className="w-4 h-4" />
                    Düzenle
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="w-4 h-4" />
                        Sil
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Kulübü Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          <strong>{club.clubName}</strong> kulübünü silmek istediğinizden emin misiniz? 
                          Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    İptal
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </>
              )}
            </div>
      </div>

      {/* Content */}
      <div>
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info" className="gap-2">
              <Building2 className="w-4 h-4" />
              Genel Bilgiler
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <User className="w-4 h-4" />
              İletişim
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2">
              <Shield className="w-4 h-4" />
              Yönetici
            </TabsTrigger>
            <TabsTrigger value="sports" className="gap-2">
              <Trophy className="w-4 h-4" />
              Branşlar
            </TabsTrigger>
          </TabsList>

          {/* General Info Tab */}
          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kulüp Bilgileri</CardTitle>
                <CardDescription>Kulübün genel bilgileri ve istatistikleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Kulüp Adı</Label>
                    {isEditing ? (
                      <Input
                        value={editedClub.clubName}
                        onChange={(e) => updateEditedClub({ clubName: e.target.value })}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 rounded border">{club.clubName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Durum</Label>
                    {isEditing ? (
                      <Select 
                        value={editedClub.status} 
                        onValueChange={(value: any) => updateEditedClub({ status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="pending">Beklemede</SelectItem>
                          <SelectItem value="suspended">Askıya Alınmış</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2">
                        <Badge className={statusColors[club.status]}>
                          {statusLabels[club.status]}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Adres</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedClub.clubAddress}
                      onChange={(e) => updateEditedClub({ clubAddress: e.target.value })}
                      rows={3}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">{club.clubAddress}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Şehir</Label>
                    {isEditing ? (
                      <Input
                        value={editedClub.city}
                        onChange={(e) => updateEditedClub({ city: e.target.value })}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 rounded border">{club.city}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>İlçe</Label>
                    {isEditing ? (
                      <Input
                        value={editedClub.district}
                        onChange={(e) => updateEditedClub({ district: e.target.value })}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 rounded border">{club.district}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Üye Sayısı</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedClub.memberCount}
                        onChange={(e) => updateEditedClub({ memberCount: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 rounded border">{club.memberCount.toLocaleString('tr-TR')}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Kayıt Tarihi</p>
                    <p className="text-blue-700">{new Date(club.createdAt).toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kulüp İletişim</CardTitle>
                  <CardDescription>Kulübün resmi iletişim bilgileri</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Telefon</Label>
                    {isEditing ? (
                      <Input
                        value={editedClub.clubPhone}
                        onChange={(e) => updateEditedClub({ clubPhone: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {club.clubPhone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>E-posta</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editedClub.clubEmail}
                        onChange={(e) => updateEditedClub({ clubEmail: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {club.clubEmail}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Yetkili Kişi</CardTitle>
                  <CardDescription>Kulüp yetkili kişisinin bilgileri</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Ad Soyad</Label>
                    {isEditing ? (
                      <Input
                        value={editedClub.contactName}
                        onChange={(e) => updateEditedClub({ contactName: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                        <User className="w-4 h-4 text-gray-500" />
                        {club.contactName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Telefon</Label>
                    {isEditing ? (
                      <Input
                        value={editedClub.contactPhone}
                        onChange={(e) => updateEditedClub({ contactPhone: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {club.contactPhone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>E-posta</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editedClub.contactEmail}
                        onChange={(e) => updateEditedClub({ contactEmail: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {club.contactEmail}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Admin Tab */}
          <TabsContent value="admin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Yönetici Hesabı</CardTitle>
                <CardDescription>Kulüp yönetici hesabı bilgileri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rol</Label>
                    {isEditing ? (
                      <Select 
                        value={editedClub.adminRole} 
                        onValueChange={(value) => updateEditedClub({ adminRole: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baskan">Başkan</SelectItem>
                          <SelectItem value="genel-koordinator">Genel Koordinatör</SelectItem>
                          <SelectItem value="spor-direktoru">Spor Direktörü</SelectItem>
                          <SelectItem value="yonetim-kurulu">Yönetim Kurulu Üyesi</SelectItem>
                          <SelectItem value="genel-sekreter">Genel Sekreter</SelectItem>
                          <SelectItem value="mali-isler">Mali İşler Sorumlusu</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                        <Shield className="w-4 h-4 text-gray-500" />
                        {roleLabels[club.adminRole as keyof typeof roleLabels] || club.adminRole}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>E-posta</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editedClub.adminEmail}
                        onChange={(e) => updateEditedClub({ adminEmail: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {club.adminEmail}
                      </div>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Güvenlik nedeniyle şifre bilgileri görüntülenemez. Şifre değişikliği için ayrı bir işlem gereklidir.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sports Tab */}
          <TabsContent value="sports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Sports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Mevcut Branşlar</span>
                    <Badge variant="secondary">
                      {isEditing ? editedClub.selectedSports.length : club.selectedSports.length} Branş
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Kulübün faaliyet gösterdiği spor branşları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(isEditing ? editedClub.selectedSports : club.selectedSports).map(sport => (
                      <div 
                        key={sport}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-900">
                            {sportLabels[sport] || sport}
                          </span>
                        </div>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSport(sport)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {(isEditing ? editedClub.selectedSports : club.selectedSports).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Henüz branş eklenmemiş</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Available Sports (Only in Edit Mode) */}
              {isEditing && availableSports.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Eklenebilir Branşlar</CardTitle>
                    <CardDescription>
                      Kulübe ekleyebileceğiniz spor branşları
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {availableSports.map(sport => (
                        <div 
                          key={sport}
                          className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                            <span className="font-medium text-gray-700">
                              {sportLabels[sport] || sport}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addSport(sport)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions (Only in Edit Mode) */}
              {isEditing && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Hızlı İşlemler</CardTitle>
                    <CardDescription>
                      Yaygın kullanılan branş kombinasyonları
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const ballSports = ["futbol", "basketbol", "voleybol", "hentbol"]
                          const newSports = [...editedClub.selectedSports]
                          ballSports.forEach(sport => {
                            if (!newSports.includes(sport)) {
                              newSports.push(sport)
                            }
                          })
                          updateEditedClub({ selectedSports: newSports })
                        }}
                        className="gap-2"
                      >
                        <Trophy className="w-4 h-4" />
                        Top Sporları Ekle
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const waterSports = ["yuzme", "yelken"]
                          const newSports = [...editedClub.selectedSports]
                          waterSports.forEach(sport => {
                            if (!newSports.includes(sport)) {
                              newSports.push(sport)
                            }
                          })
                          updateEditedClub({ selectedSports: newSports })
                        }}
                        className="gap-2"
                      >
                        <Trophy className="w-4 h-4" />
                        Su Sporları Ekle
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const martialArts = ["karate", "judo", "boks", "guler"]
                          const newSports = [...editedClub.selectedSports]
                          martialArts.forEach(sport => {
                            if (!newSports.includes(sport)) {
                              newSports.push(sport)
                            }
                          })
                          updateEditedClub({ selectedSports: newSports })
                        }}
                        className="gap-2"
                      >
                        <Trophy className="w-4 h-4" />
                        Dövüş Sporları Ekle
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateEditedClub({ selectedSports: [] })
                        }}
                        className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      >
                        <X className="w-4 h-4" />
                        Tümünü Temizle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sports Statistics (Only in View Mode) */}
              {!isEditing && club.selectedSports.length > 0 && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Branş İstatistikleri</CardTitle>
                    <CardDescription>
                      Branşlara göre kategori dağılımı
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {club.selectedSports.filter(sport => 
                            ["futbol", "basketbol", "voleybol", "hentbol"].includes(sport)
                          ).length}
                        </div>
                        <div className="text-sm text-blue-800">Top Sporları</div>
                      </div>
                      
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {club.selectedSports.filter(sport => 
                            ["yuzme", "yelken"].includes(sport)
                          ).length}
                        </div>
                        <div className="text-sm text-green-800">Su Sporları</div>
                      </div>
                      
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {club.selectedSports.filter(sport => 
                            ["karate", "judo", "boks", "guler"].includes(sport)
                          ).length}
                        </div>
                        <div className="text-sm text-purple-800">Dövüş Sporları</div>
                      </div>
                      
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {club.selectedSports.filter(sport => 
                            !["futbol", "basketbol", "voleybol", "hentbol", "yuzme", "yelken", "karate", "judo", "boks", "guler"].includes(sport)
                          ).length}
                        </div>
                        <div className="text-sm text-orange-800">Diğer</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}