import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Search, Filter, MapPin, Users, Phone, Mail, Calendar, Eye } from "lucide-react"
import { Club } from "./ClubManagement"

interface ClubListProps {
  clubs: Club[]
  onClubSelect: (club: Club) => void
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

const sportLabels: { [key: string]: string } = {
  "futbol": "Futbol",
  "basketbol": "Basketbol",
  "voleybol": "Voleybol",
  "yuzme": "Yüzme",
  "tenis": "Tenis",
  "atletizm": "Atletizm",
  "badminton": "Badminton",
  "yelken": "Yelken",
  "jimnastik": "Jimnastik",
  "fitness": "Fitness",
  "pilates": "Pilates"
}

export function ClubList({ clubs, onClubSelect }: ClubListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedSport, setSelectedSport] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // Get unique cities from clubs
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(clubs.map(club => club.city))]
    return uniqueCities.sort()
  }, [clubs])

  // Get unique sports from clubs
  const sports = useMemo(() => {
    const allSports = clubs.flatMap(club => club.selectedSports)
    const uniqueSports = [...new Set(allSports)]
    return uniqueSports.sort()
  }, [clubs])

  // Filter and sort clubs
  const filteredAndSortedClubs = useMemo(() => {
    let filtered = clubs.filter(club => {
      const matchesSearch = club.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           club.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           club.city.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCity = selectedCity === "all" || club.city === selectedCity
      const matchesStatus = selectedStatus === "all" || club.status === selectedStatus
      const matchesSport = selectedSport === "all" || club.selectedSports.includes(selectedSport)

      return matchesSearch && matchesCity && matchesStatus && matchesSport
    })

    // Sort clubs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.clubName.localeCompare(b.clubName, 'tr')
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "members":
          return b.memberCount - a.memberCount
        case "city":
          return a.city.localeCompare(b.city, 'tr')
        default:
          return 0
      }
    })

    return filtered
  }, [clubs, searchTerm, selectedCity, selectedStatus, selectedSport, sortBy])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCity("all")
    setSelectedStatus("all")
    setSelectedSport("all")
    setSortBy("name")
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Arama ve Filtreleme
          </CardTitle>
          <CardDescription>
            Kulüpleri arayın ve filtreleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Kulüp adı, yetkili kişi veya şehir ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* City Filter */}
            <div>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Şehir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Şehirler</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="pending">Beklemede</SelectItem>
                  <SelectItem value="suspended">Askıya Alınmış</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sport Filter */}
            <div>
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger>
                  <SelectValue placeholder="Branş" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Branşlar</SelectItem>
                  {sports.map(sport => (
                    <SelectItem key={sport} value={sport}>
                      {sportLabels[sport] || sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">İsme Göre</SelectItem>
                  <SelectItem value="date">Kayıt Tarihine Göre</SelectItem>
                  <SelectItem value="members">Üye Sayısına Göre</SelectItem>
                  <SelectItem value="city">Şehre Göre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{filteredAndSortedClubs.length} kulüp bulundu</span>
              {(searchTerm || selectedCity !== "all" || selectedStatus !== "all" || selectedSport !== "all") && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Filtreleri Temizle
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Club Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedClubs.map(club => (
          <Card key={club.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={club.logo} alt={club.clubName} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {club.clubName.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg leading-tight">{club.clubName}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {club.city}, {club.district}
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={statusColors[club.status]}
                >
                  {statusLabels[club.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{club.contactName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{club.clubPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{club.clubEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Kayıt: {new Date(club.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>

              {/* Sports */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Branşlar:</p>
                <div className="flex flex-wrap gap-1">
                  {club.selectedSports.slice(0, 3).map(sport => (
                    <Badge key={sport} variant="outline" className="text-xs">
                      {sportLabels[sport] || sport}
                    </Badge>
                  ))}
                  {club.selectedSports.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{club.selectedSports.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm">
                  <span className="font-medium">{club.memberCount.toLocaleString('tr-TR')}</span>
                  <span className="text-gray-600 ml-1">üye</span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onClubSelect(club)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                >
                  <Eye className="w-4 h-4" />
                  Detay
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedClubs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Kulüp bulunamadı</h3>
          <p className="text-gray-600 mb-4">
            Arama kriterlerinizle eşleşen kulüp bulunmadı.
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Filtreleri Temizle
          </Button>
        </div>
      )}
    </div>
  )
}