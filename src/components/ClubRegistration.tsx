import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { ClubInfoStep } from "./ClubInfoStep"
import { AdminAccountStep } from "./AdminAccountStep"
import { ClubSportsStep } from "./ClubSportsStep"
import { CheckCircle } from "lucide-react"

export function ClubRegistration() {
  const [currentStep, setCurrentStep] = useState(1)
  const [clubData, setClubData] = useState({
    // Kulüp bilgileri
    logo: null as File | null,
    clubName: "",
    clubAddress: "",
    clubPhone: "",
    clubEmail: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    // Admin hesap bilgileri
    adminRole: "",
    adminEmail: "",
    adminPassword: "",
    adminPasswordConfirm: "",
    // Branş bilgileri
    selectedSports: [] as string[]
  })

  const steps = [
    { id: 1, name: "Kulüp Bilgileri", description: "Kulüp ve yetkili kişi bilgileri" },
    { id: 2, name: "Admin Hesabı", description: "Yönetici hesabı oluşturma" },
    { id: 3, name: "Branşlar", description: "Kulüp spor branşları" }
  ]

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateClubData = (data: Partial<typeof clubData>) => {
    setClubData(prev => ({ ...prev, ...data }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kulüp Kayıt Sistemi</h1>
          <p className="text-gray-600">Spor kulübünüzü sisteme kaydetmek için aşağıdaki adımları tamamlayın</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep > step.id
                        ? "bg-green-500 border-green-500 text-white"
                        : currentStep === step.id
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-white border-gray-300 text-gray-500"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`font-medium ${
                      currentStep >= step.id ? "text-gray-900" : "text-gray-500"
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-full h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Badge */}
        <div className="flex justify-center mb-6">
          <Badge variant="secondary" className="px-4 py-2">
            Adım {currentStep} / {steps.length}: {steps[currentStep - 1].name}
          </Badge>
        </div>

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <ClubInfoStep
                data={clubData}
                updateData={updateClubData}
                onNext={nextStep}
              />
            )}
            {currentStep === 2 && (
              <AdminAccountStep
                data={clubData}
                updateData={updateClubData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 3 && (
              <ClubSportsStep
                data={clubData}
                updateData={updateClubData}
                onPrev={prevStep}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}