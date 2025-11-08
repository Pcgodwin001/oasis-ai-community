import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Upload, Building2, User, Phone, Mail } from "lucide-react"

interface ClubInfoStepProps {
  data: any
  updateData: (data: any) => void
  onNext: () => void
}

export function ClubInfoStep({ data, updateData, onNext }: ClubInfoStepProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateData({ logo: file })
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form validation burada yapılabilir
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo Upload */}
      <div className="space-y-2">
        <Label>Kulüp Logosu</Label>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo önizleme" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
            />
            <Label htmlFor="logo-upload" className="cursor-pointer">
              <Button type="button" variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Logo Yükle
              </Button>
            </Label>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG veya GIF formatında yükleyebilirsiniz</p>
          </div>
        </div>
      </div>

      {/* Kulüp Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Kulüp Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clubName">Kulüp Adı *</Label>
            <Input
              id="clubName"
              value={data.clubName}
              onChange={(e) => updateData({ clubName: e.target.value })}
              placeholder="Örn: Beşiktaş Jimnastik Kulübü"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clubAddress">Kulüp Adresi *</Label>
            <Textarea
              id="clubAddress"
              value={data.clubAddress}
              onChange={(e) => updateData({ clubAddress: e.target.value })}
              placeholder="Kulübün tam adresi"
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clubPhone">Kulüp Telefon *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="clubPhone"
                  type="tel"
                  value={data.clubPhone}
                  onChange={(e) => updateData({ clubPhone: e.target.value })}
                  placeholder="0212 555 0123"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clubEmail">Kulüp E-posta *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="clubEmail"
                  type="email"
                  value={data.clubEmail}
                  onChange={(e) => updateData({ clubEmail: e.target.value })}
                  placeholder="info@kulubadiniz.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yetkili Kişi Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Yetkili Kişi Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">Yetkili Kişi Ad Soyad *</Label>
            <Input
              id="contactName"
              value={data.contactName}
              onChange={(e) => updateData({ contactName: e.target.value })}
              placeholder="Örn: Ahmet Yılmaz"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Yetkili Kişi Telefon *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="contactPhone"
                  type="tel"
                  value={data.contactPhone}
                  onChange={(e) => updateData({ contactPhone: e.target.value })}
                  placeholder="0532 555 0123"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Yetkili Kişi E-posta *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="contactEmail"
                  type="email"
                  value={data.contactEmail}
                  onChange={(e) => updateData({ contactEmail: e.target.value })}
                  placeholder="ahmet@kulubadiniz.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" className="px-8">
          Sonraki Adım
        </Button>
      </div>
    </form>
  )
}