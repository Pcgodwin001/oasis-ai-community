import { useState } from "react"
import { ClubList } from "./ClubList"
import { ClubDetail } from "./ClubDetail"
import { Button } from "./ui/button"
import { ArrowLeft, Plus } from "lucide-react"

export interface Club {
  id: string
  logo?: string
  clubName: string
  clubAddress: string
  clubPhone: string
  clubEmail: string
  contactName: string
  contactPhone: string
  contactEmail: string
  adminRole: string
  adminEmail: string
  selectedSports: string[]
  createdAt: string
  status: "active" | "pending" | "suspended"
  memberCount: number
  city: string
  district: string
}

// Mock data for demonstration
const mockClubs: Club[] = [
  {
    id: "CLB-001",
    clubName: "Beşiktaş Jimnastik Kulübü",
    clubAddress: "Dolmabahçe Cad. No:1 Beşiktaş/İstanbul",
    clubPhone: "0212 227 1905",
    clubEmail: "info@bjk.com.tr",
    contactName: "Ahmet Nur Çebi",
    contactPhone: "0532 123 4567",
    contactEmail: "cebi@bjk.com.tr",
    adminRole: "baskan",
    adminEmail: "admin@bjk.com.tr",
    selectedSports: ["futbol", "basketbol", "voleybol", "yuzme"],
    createdAt: "2024-01-15",
    status: "active",
    memberCount: 45000,
    city: "İstanbul",
    district: "Beşiktaş"
  },
  {
    id: "CLB-002",
    clubName: "Galatasaray Spor Kulübü",
    clubAddress: "Galatasaray Adası Seyrantepe/İstanbul",
    clubPhone: "0212 305 1905",
    clubEmail: "info@galatasaray.org",
    contactName: "Dursun Özbek",
    contactPhone: "0532 234 5678",
    contactEmail: "ozbek@galatasaray.org",
    adminRole: "baskan",
    adminEmail: "admin@galatasaray.org",
    selectedSports: ["futbol", "basketbol", "yuzme", "atletizm"],
    createdAt: "2024-01-20",
    status: "active",
    memberCount: 52000,
    city: "İstanbul",
    district: "Sarıyer"
  },
  {
    id: "CLB-003",
    clubName: "Fenerbahçe Spor Kulübü",
    clubAddress: "Şükrü Saracoğlu Stadyumu Kadıköy/İstanbul",
    clubPhone: "0216 542 1907",
    clubEmail: "info@fenerbahce.org",
    contactName: "Ali Koç",
    contactPhone: "0532 345 6789",
    contactEmail: "koc@fenerbahce.org",
    adminRole: "baskan",
    adminEmail: "admin@fenerbahce.org",
    selectedSports: ["futbol", "basketbol", "voleybol", "tenis"],
    createdAt: "2024-02-01",
    status: "active",
    memberCount: 48000,
    city: "İstanbul",
    district: "Kadıköy"
  },
  {
    id: "CLB-004",
    clubName: "Ankara Gençlik Spor Kulübü",
    clubAddress: "Atatürk Bulvarı No:45 Çankaya/Ankara",
    clubPhone: "0312 468 1234",
    clubEmail: "info@ankaragenclk.com",
    contactName: "Mehmet Yılmaz",
    contactPhone: "0532 456 7890",
    contactEmail: "yilmaz@ankaragenclk.com",
    adminRole: "genel-koordinator",
    adminEmail: "admin@ankaragenclk.com",
    selectedSports: ["atletizm", "yuzme", "tenis", "badminton"],
    createdAt: "2024-02-10",
    status: "active",
    memberCount: 1200,
    city: "Ankara",
    district: "Çankaya"
  },
  {
    id: "CLB-005",
    clubName: "İzmir Karşıyaka Spor Kulübü",
    clubAddress: "Karşıyaka İskelesi Mevkii İzmir",
    clubPhone: "0232 369 1234",
    clubEmail: "info@karsiyaka.org.tr",
    contactName: "Levent Şahin",
    contactPhone: "0532 567 8901",
    contactEmail: "sahin@karsiyaka.org.tr",
    adminRole: "baskan",
    adminEmail: "admin@karsiyaka.org.tr",
    selectedSports: ["futbol", "basketbol", "yelken", "yuzme"],
    createdAt: "2024-02-15",
    status: "pending",
    memberCount: 850,
    city: "İzmir",
    district: "Karşıyaka"
  },
  {
    id: "CLB-006",
    clubName: "Bursa Nilüfer Spor Kulübü",
    clubAddress: "Nilüfer Merkez Bursa",
    clubPhone: "0224 441 1234",
    clubEmail: "info@nilufer.com",
    contactName: "Ayşe Demir",
    contactPhone: "0532 678 9012",
    contactEmail: "demir@nilufer.com",
    adminRole: "genel-sekreter",
    adminEmail: "admin@nilufer.com",
    selectedSports: ["voleybol", "jimnastik", "fitness", "pilates"],
    createdAt: "2024-03-01",
    status: "active",
    memberCount: 650,
    city: "Bursa",
    district: "Nilüfer"
  }
]

export function ClubManagement({ onNewRegistration }: { onNewRegistration: () => void }) {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [clubs, setClubs] = useState<Club[]>(mockClubs)

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club)
  }

  const handleBackToList = () => {
    setSelectedClub(null)
  }

  const handleClubUpdate = (updatedClub: Club) => {
    setClubs(prev => prev.map(club => 
      club.id === updatedClub.id ? updatedClub : club
    ))
    setSelectedClub(updatedClub)
  }

  const handleClubDelete = (clubId: string) => {
    setClubs(prev => prev.filter(club => club.id !== clubId))
    setSelectedClub(null)
  }

  if (selectedClub) {
    return (
      <ClubDetail
        club={selectedClub}
        onBack={handleBackToList}
        onUpdate={handleClubUpdate}
        onDelete={handleClubDelete}
      />
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Kulüp Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Kayıtlı kulüpleri yönetin ve güncelleyin</p>
        </div>
        <Button onClick={onNewRegistration} className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni Kulüp Kaydet
        </Button>
      </div>

      {/* Club List */}
      <ClubList clubs={clubs} onClubSelect={handleClubSelect} />
    </div>
  )
}