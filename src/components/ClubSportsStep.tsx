import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription } from "./ui/alert"
import { CheckCircle, Plus, Trophy, Users } from "lucide-react"

interface ClubSportsStepProps {
  data: any
  updateData: (data: any) => void
  onPrev: () => void
}

const sportsCategories = [
  {
    category: "Takım Sporları",
    sports: [
      { id: "futbol", name: "Futbol", icon: "⚽" },
      { id: "basketbol", name: "Basketbol", icon: "🏀" },
      { id: "voleybol", name: "Voleybol", icon: "🏐" },
      { id: "hentbol", name: "Hentbol", icon: "🤾" },
      { id: "ragbi", name: "Ragbi", icon: "🏈" },
      { id: "beyzbol", name: "Beyzbol", icon: "⚾" }
    ]
  },
  {
    category: "Bireysel Sporlar",
    sports: [
      { id: "yuzme", name: "Yüzme", icon: "🏊" },
      { id: "atletizm", name: "Atletizm", icon: "🏃" },
      { id: "tenis", name: "Tenis", icon: "🎾" },
      { id: "badminton", name: "Badminton", icon: "🏸" },
      { id: "masa-tenisi", name: "Masa Tenisi", icon: "🏓" },
      { id: "golf", name: "Golf", icon: "⛳" }
    ]
  },
  {
    category: "Dövüş Sporları",
    sports: [
      { id: "karate", name: "Karate", icon: "🥋" },
      { id: "judo", name: "Judo", icon: "🤼" },
      { id: "boks", name: "Boks", icon: "🥊" },
      { id: "tekvando", name: "Tekvando", icon: "🥋" },
      { id: "gures", name: "Güreş", icon: "🤼" },
      { id: "aikido", name: "Aikido", icon: "🥋" }
    ]
  },
  {
    category: "Su Sporları",
    sports: [
      { id: "yelken", name: "Yelken", icon: "⛵" },
      { id: "kano", name: "Kano", icon: "🛶" },
      { id: "su-topu", name: "Su Topu", icon: "🤽" },
      { id: "dalıs", name: "Dalış", icon: "🤿" },
      { id: "surf", name: "Surf", icon: "🏄" }
    ]
  },
  {
    category: "Fitness ve Jimnastik",
    sports: [
      { id: "jimnastik", name: "Jimnastik", icon: "🤸" },
      { id: "fitness", name: "Fitness", icon: "💪" },
      { id: "pilates", name: "Pilates", icon: "🧘" },
      { id: "yoga", name: "Yoga", icon: "🧘" },
      { id: "aerobik", name: "Aerobik", icon: "🤸" }
    ]
  }
]

export function ClubSportsStep({ data, updateData, onPrev }: ClubSportsStepProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  const toggleSport = (sportId: string) => {
    const selectedSports = data.selectedSports || []
    const newSelectedSports = selectedSports.includes(sportId)
      ? selectedSports.filter((id: string) => id !== sportId)
      : [...selectedSports, sportId]
    
    updateData({ selectedSports: newSelectedSports })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.selectedSports.length === 0) {
      return
    }
    
    // Burada kayıt işlemi simüle edilir
    setShowSuccess(true)
    
    // Gerçek uygulamada burada API çağrısı yapılır
    console.log("Kulüp kayıt bilgileri:", data)
  }

  if (showSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Kayıt Başarıyla Tamamlandı!</h3>
          <p className="text-gray-600">
            <strong>{data.clubName}</strong> kulübünüz sisteme başarıyla kaydedildi.
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Kayıt Özeti:</h4>
          <div className="space-y-2 text-sm text-green-800">
            <p><strong>Kulüp:</strong> {data.clubName}</p>
            <p><strong>Yetkili:</strong> {data.contactName}</p>
            <p><strong>Admin:</strong> {data.adminEmail}</p>
            <p><strong>Branş Sayısı:</strong> {data.selectedSports.length}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Hesap aktivasyon e-postası <strong>{data.adminEmail}</strong> adresine gönderilecektir.
          </p>
          <Button className="w-full">
            Sisteme Giriş Yap
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5" />
          <h3 className="font-medium">Kulübünüzün Faaliyet Gösterdiği Spor Branşlarını Seçin</h3>
        </div>
        
        {data.selectedSports?.length > 0 && (
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              <strong>{data.selectedSports.length}</strong> branş seçildi. En az 1 branş seçmelisiniz.
            </AlertDescription>
          </Alert>
        )}

        {sportsCategories.map((category) => (
          <Card key={category.category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {category.sports.map((sport) => {
                  const isSelected = data.selectedSports?.includes(sport.id)
                  return (
                    <button
                      key={sport.id}
                      type="button"
                      onClick={() => toggleSport(sport.id)}
                      className={`p-3 rounded-lg border-2 transition-all hover:border-blue-300 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-2xl">{sport.icon}</span>
                        <span className="text-sm font-medium">{sport.name}</span>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {data.selectedSports?.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-900">Seçilen Branşlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.selectedSports.map((sportId: string) => {
                  const sport = sportsCategories
                    .flatMap(cat => cat.sports)
                    .find(s => s.id === sportId)
                  return sport ? (
                    <Badge key={sportId} variant="secondary" className="bg-blue-100 text-blue-800">
                      {sport.icon} {sport.name}
                    </Badge>
                  ) : null
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {data.selectedSports?.length === 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            Devam etmek için en az bir spor branşı seçmelisiniz.
          </AlertDescription>
        </Alert>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Önceki Adım
        </Button>
        <Button 
          type="submit" 
          className="px-8"
          disabled={!data.selectedSports?.length}
        >
          <Plus className="w-4 h-4 mr-2" />
          Kulübü Kaydet
        </Button>
      </div>
    </form>
  )
}