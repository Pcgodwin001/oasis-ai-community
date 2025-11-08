import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription } from "./ui/alert"
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"

interface AdminAccountStepProps {
  data: any
  updateData: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

export function AdminAccountStep({ data, updateData, onNext, onPrev }: AdminAccountStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Şifre en az 8 karakter olmalıdır"
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Şifre en az bir küçük harf içermelidir"
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Şifre en az bir büyük harf içermelidir"
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Şifre en az bir rakam içermelidir"
    }
    return ""
  }

  const handlePasswordChange = (password: string) => {
    updateData({ adminPassword: password })
    setPasswordError(validatePassword(password))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!data.adminRole || !data.adminEmail || !data.adminPassword || !data.adminPasswordConfirm) {
      return
    }

    if (data.adminPassword !== data.adminPasswordConfirm) {
      setPasswordError("Şifreler eşleşmiyor")
      return
    }

    if (validatePassword(data.adminPassword)) {
      return
    }

    onNext()
  }

  const passwordStrength = () => {
    const password = data.adminPassword
    if (!password) return 0
    
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/(?=.*[a-z])/.test(password)) strength += 25
    if (/(?=.*[A-Z])/.test(password)) strength += 25
    if (/(?=.*\d)/.test(password)) strength += 25
    
    return strength
  }

  const getPasswordStrengthColor = () => {
    const strength = passwordStrength()
    if (strength < 50) return "bg-red-500"
    if (strength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Yönetici Hesabı Oluşturma
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminRole">Kulüp Rolü *</Label>
            <Select value={data.adminRole} onValueChange={(value) => updateData({ adminRole: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Kulüpteki rolünüzü seçin" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmail">Admin E-posta Adresi *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="adminEmail"
                type="email"
                value={data.adminEmail}
                onChange={(e) => updateData({ adminEmail: e.target.value })}
                placeholder="admin@kulubadiniz.com"
                className="pl-10"
                required
              />
            </div>
            <p className="text-sm text-gray-500">Bu e-posta adresi sisteme giriş için kullanılacaktır</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminPassword">Şifre *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="adminPassword"
                type={showPassword ? "text" : "password"}
                value={data.adminPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Güçlü bir şifre oluşturun"
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {data.adminPassword && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength()}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">{passwordStrength()}%</span>
                </div>
                
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 text-sm ${data.adminPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle className="w-3 h-3" />
                    En az 8 karakter
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${/(?=.*[a-z])/.test(data.adminPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle className="w-3 h-3" />
                    Küçük harf
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${/(?=.*[A-Z])/.test(data.adminPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle className="w-3 h-3" />
                    Büyük harf
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${/(?=.*\d)/.test(data.adminPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle className="w-3 h-3" />
                    Rakam
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminPasswordConfirm">Şifre Tekrar *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="adminPasswordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                value={data.adminPasswordConfirm}
                onChange={(e) => updateData({ adminPasswordConfirm: e.target.value })}
                placeholder="Şifrenizi tekrar girin"
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {data.adminPasswordConfirm && data.adminPassword !== data.adminPasswordConfirm && (
              <p className="text-sm text-red-600">Şifreler eşleşmiyor</p>
            )}
          </div>

          {passwordError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Önceki Adım
        </Button>
        <Button type="submit" className="px-8">
          Sonraki Adım
        </Button>
      </div>
    </form>
  )
}