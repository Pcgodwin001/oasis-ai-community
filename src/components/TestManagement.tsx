import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { 
  TestTube, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Search,
  Target,
  Activity,
  Settings,
  BarChart3,
  Users,
  Clock,
  Zap,
  Trophy,
  Brain,
  Heart,
  Dumbbell
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

interface TestCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  testCount: number
  isActive: boolean
  createdAt: string
}

interface TestType {
  id: string
  name: string
  categoryId: string
  categoryName: string
  description: string
  unit: string
  isCalculated: boolean
  fieldCount: number
  sessionCount: number
  isActive: boolean
  createdAt: string
}

interface TestField {
  id: string
  testTypeId: string
  testTypeName: string
  fieldName: string
  inputType: string
  unit: string
  isRequired: boolean
  order: number
  isActive: boolean
  createdAt: string
}

const mockCategories: TestCategory[] = [
  {
    id: "1",
    name: "Fiziksel Testler",
    description: "Atletik performans ve fiziksel kapasite testleri",
    icon: "💪",
    color: "bg-blue-500",
    testCount: 12,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "2", 
    name: "Teknik Testler",
    description: "Branş özel teknik beceri testleri",
    icon: "⚽",
    color: "bg-green-500",
    testCount: 8,
    isActive: true,
    createdAt: "2024-01-12"
  },
  {
    id: "3",
    name: "Psikolojik Testler",
    description: "Zihinsel hazırlık ve psikolojik dayanıklılık testleri",
    icon: "🧠",
    color: "bg-purple-500",
    testCount: 6,
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: "4",
    name: "Kardiyovasküler Testler",
    description: "Kalp ve damar sistemi sağlığı testleri",
    icon: "❤️",
    color: "bg-red-500",
    testCount: 5,
    isActive: true,
    createdAt: "2024-01-18"
  },
  {
    id: "5",
    name: "Koordinasyon Testleri",
    description: "Denge, çeviklik ve koordinasyon testleri",
    icon: "🎯",
    color: "bg-orange-500",
    testCount: 7,
    isActive: true,
    createdAt: "2024-01-20"
  }
]

const mockTestTypes: TestType[] = [
  // Fiziksel Testler
  {
    id: "1",
    name: "30 Metre Sprint",
    categoryId: "1",
    categoryName: "Fiziksel Testler",
    description: "Kısa mesafe hız testi",
    unit: "saniye",
    isCalculated: false,
    fieldCount: 3,
    sessionCount: 45,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "2",
    name: "Cooper Testi",
    categoryId: "1", 
    categoryName: "Fiziksel Testler",
    description: "12 dakikalık koşu dayanıklılık testi",
    unit: "metre",
    isCalculated: true,
    fieldCount: 2,
    sessionCount: 32,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    name: "Dikey Sıçrama",
    categoryId: "1",
    categoryName: "Fiziksel Testler", 
    description: "Bacak kuvveti ve patlayıcı güç testi",
    unit: "cm",
    isCalculated: false,
    fieldCount: 2,
    sessionCount: 38,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "4",
    name: "Bench Press 1RM",
    categoryId: "1",
    categoryName: "Fiziksel Testler",
    description: "Maksimum kuvvet testi",
    unit: "kg",
    isCalculated: true,
    fieldCount: 4,
    sessionCount: 28,
    isActive: true,
    createdAt: "2024-01-11"
  },

  // Teknik Testler
  {
    id: "5",
    name: "Futbol Dribling",
    categoryId: "2",
    categoryName: "Teknik Testler",
    description: "Koni slalom dribling testi",
    unit: "saniye",
    isCalculated: false,
    fieldCount: 3,
    sessionCount: 22,
    isActive: true,
    createdAt: "2024-01-12"
  },
  {
    id: "6",
    name: "Basketbol Şut Testi",
    categoryId: "2",
    categoryName: "Teknik Testler",
    description: "Farklı pozisyonlardan şut isabeti",
    unit: "puan",
    isCalculated: true,
    fieldCount: 5,
    sessionCount: 18,
    isActive: true,
    createdAt: "2024-01-12"
  },

  // Psikolojik Testler
  {
    id: "7",
    name: "Konsantrasyon Testi",
    categoryId: "3",
    categoryName: "Psikolojik Testler",
    description: "Dikkat ve konsantrasyon seviyesi ölçümü",
    unit: "puan",
    isCalculated: true,
    fieldCount: 8,
    sessionCount: 15,
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: "8",
    name: "Stres Yönetimi",
    categoryId: "3",
    categoryName: "Psikolojik Testler",
    description: "Stres altında performans testi",
    unit: "puan",
    isCalculated: true,
    fieldCount: 6,
    sessionCount: 12,
    isActive: true,
    createdAt: "2024-01-15"
  },

  // Kardiyovasküler Testler
  {
    id: "9",
    name: "Dinlenik Nabız",
    categoryId: "4",
    categoryName: "Kardiyovasküler Testler",
    description: "Dinlenim kalp atış hızı ölçümü",
    unit: "atım/dk",
    isCalculated: false,
    fieldCount: 1,
    sessionCount: 42,
    isActive: true,
    createdAt: "2024-01-18"
  },
  {
    id: "10",
    name: "VO2 Max",
    categoryId: "4",
    categoryName: "Kardiyovasküler Testler",
    description: "Maksimum oksijen tüketimi testi",
    unit: "ml/kg/dk",
    isCalculated: true,
    fieldCount: 4,
    sessionCount: 25,
    isActive: true,
    createdAt: "2024-01-18"
  }
]

const mockTestFields: TestField[] = [
  // 30 Metre Sprint alanları
  {
    id: "1",
    testTypeId: "1",
    testTypeName: "30 Metre Sprint",
    fieldName: "1. Deneme",
    inputType: "number",
    unit: "saniye",
    isRequired: true,
    order: 1,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "2",
    testTypeId: "1",
    testTypeName: "30 Metre Sprint",
    fieldName: "2. Deneme",
    inputType: "number",
    unit: "saniye",
    isRequired: true,
    order: 2,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    testTypeId: "1",
    testTypeName: "30 Metre Sprint",
    fieldName: "En İyi Derece",
    inputType: "number",
    unit: "saniye",
    isRequired: false,
    order: 3,
    isActive: true,
    createdAt: "2024-01-10"
  },

  // Cooper Testi alanları
  {
    id: "4",
    testTypeId: "2",
    testTypeName: "Cooper Testi",
    fieldName: "Koşulan Mesafe",
    inputType: "number",
    unit: "metre",
    isRequired: true,
    order: 1,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "5",
    testTypeId: "2",
    testTypeName: "Cooper Testi",
    fieldName: "Süre",
    inputType: "time",
    unit: "dakika",
    isRequired: true,
    order: 2,
    isActive: true,
    createdAt: "2024-01-10"
  },

  // Dikey Sıçrama alanları
  {
    id: "6",
    testTypeId: "3",
    testTypeName: "Dikey Sıçrama",
    fieldName: "Reach Yüksekliği",
    inputType: "number",
    unit: "cm",
    isRequired: true,
    order: 1,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "7",
    testTypeId: "3",
    testTypeName: "Dikey Sıçrama",
    fieldName: "Sıçrama Yüksekliği",
    inputType: "number",
    unit: "cm",
    isRequired: true,
    order: 2,
    isActive: true,
    createdAt: "2024-01-10"
  }
]

const inputTypeLabels = {
  "number": "Sayı",
  "text": "Metin",
  "time": "Zaman",
  "date": "Tarih",
  "boolean": "Evet/Hayır",
  "select": "Seçim Listesi"
}

export function TestManagement() {
  const [categories, setCategories] = useState<TestCategory[]>(mockCategories)
  const [testTypes, setTestTypes] = useState<TestType[]>(mockTestTypes)
  const [testFields, setTestFields] = useState<TestField[]>(mockTestFields)
  const [activeTab, setActiveTab] = useState("categories")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTestType, setSelectedTestType] = useState<string>("all")

  // Category Management
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState<Partial<TestCategory>>({
    name: "",
    description: "",
    icon: "🏃",
    color: "bg-blue-500",
    isActive: true
  })

  // Test Type Management
  const [isAddingTestType, setIsAddingTestType] = useState(false)
  const [newTestType, setNewTestType] = useState<Partial<TestType>>({
    name: "",
    categoryId: "",
    description: "",
    unit: "",
    isCalculated: false,
    isActive: true
  })

  // Test Field Management
  const [isAddingTestField, setIsAddingTestField] = useState(false)
  const [newTestField, setNewTestField] = useState<Partial<TestField>>({
    testTypeId: "",
    fieldName: "",
    inputType: "number",
    unit: "",
    isRequired: true,
    order: 1,
    isActive: true
  })

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTestTypes = testTypes.filter(testType => {
    const matchesSearch = testType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testType.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || testType.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredTestFields = testFields.filter(field => {
    const matchesSearch = field.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.testTypeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTestType = selectedTestType === "all" || field.testTypeId === selectedTestType
    return matchesSearch && matchesTestType
  })

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.description) {
      const category: TestCategory = {
        id: Date.now().toString(),
        name: newCategory.name!,
        description: newCategory.description!,
        icon: newCategory.icon!,
        color: newCategory.color!,
        testCount: 0,
        isActive: newCategory.isActive!,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setCategories([...categories, category])
      setNewCategory({
        name: "",
        description: "",
        icon: "🏃",
        color: "bg-blue-500",
        isActive: true
      })
      setIsAddingCategory(false)
    }
  }

  const handleAddTestType = () => {
    if (newTestType.name && newTestType.categoryId && newTestType.description) {
      const selectedCategory = categories.find(c => c.id === newTestType.categoryId)
      const testType: TestType = {
        id: Date.now().toString(),
        name: newTestType.name!,
        categoryId: newTestType.categoryId!,
        categoryName: selectedCategory?.name || "Bilinmeyen",
        description: newTestType.description!,
        unit: newTestType.unit!,
        isCalculated: newTestType.isCalculated!,
        fieldCount: 0,
        sessionCount: 0,
        isActive: newTestType.isActive!,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setTestTypes([...testTypes, testType])
      setNewTestType({
        name: "",
        categoryId: "",
        description: "",
        unit: "",
        isCalculated: false,
        isActive: true
      })
      setIsAddingTestType(false)
    }
  }

  const handleAddTestField = () => {
    if (newTestField.testTypeId && newTestField.fieldName) {
      const selectedTestType = testTypes.find(t => t.id === newTestField.testTypeId)
      const field: TestField = {
        id: Date.now().toString(),
        testTypeId: newTestField.testTypeId!,
        testTypeName: selectedTestType?.name || "Bilinmeyen",
        fieldName: newTestField.fieldName!,
        inputType: newTestField.inputType!,
        unit: newTestField.unit!,
        isRequired: newTestField.isRequired!,
        order: newTestField.order!,
        isActive: newTestField.isActive!,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setTestFields([...testFields, field])
      setNewTestField({
        testTypeId: "",
        fieldName: "",
        inputType: "number",
        unit: "",
        isRequired: true,
        order: 1,
        isActive: true
      })
      setIsAddingTestField(false)
    }
  }

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter(c => c.id !== categoryId))
  }

  const deleteTestType = (testTypeId: string) => {
    setTestTypes(testTypes.filter(t => t.id !== testTypeId))
  }

  const deleteTestField = (fieldId: string) => {
    setTestFields(testFields.filter(f => f.id !== fieldId))
  }

  const totalTests = testTypes.length
  const totalCategories = categories.length
  const totalFields = testFields.length
  const totalSessions = testTypes.reduce((sum, test) => sum + test.sessionCount, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Test Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Sporcu testleri ve değerlendirme sistemini yönetin</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Kategori</p>
                <p className="text-2xl font-bold">{totalCategories}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Test</p>
                <p className="text-2xl font-bold">{totalTests}</p>
              </div>
              <TestTube className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Alan</p>
                <p className="text-2xl font-bold">{totalFields}</p>
              </div>
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Oturum</p>
                <p className="text-2xl font-bold">{totalSessions}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Test Kategorileri</TabsTrigger>
          <TabsTrigger value="types">Test Türleri</TabsTrigger>
          <TabsTrigger value="fields">Test Alanları</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Kategori ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
            <Button onClick={() => setIsAddingCategory(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Yeni Kategori
            </Button>
          </div>

          {/* Add Category Form */}
          {isAddingCategory && (
            <Card>
              <CardHeader>
                <CardTitle>Yeni Test Kategorisi</CardTitle>
                <CardDescription>Sisteme yeni bir test kategorisi ekleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Kategori Adı</Label>
                    <Input
                      value={newCategory.name || ""}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      placeholder="Ör: Fiziksel Testler"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>İkon</Label>
                    <Input
                      value={newCategory.icon || ""}
                      onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                      placeholder="Ör: 💪"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Açıklama</Label>
                  <Textarea
                    value={newCategory.description || ""}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    placeholder="Kategori açıklaması..."
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                    <X className="w-4 h-4 mr-2" />
                    İptal
                  </Button>
                  <Button onClick={handleAddCategory}>
                    <Save className="w-4 h-4 mr-2" />
                    Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(category => (
              <Card key={category.id} className={`${!category.isActive ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-white text-xl`}>
                        {category.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <Badge variant="secondary">{category.testCount} Test</Badge>
                      </div>
                    </div>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(category.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
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
                            <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu kategoriyi silmek istediğinizden emin misiniz?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteCategory(category.id)}>
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
        </TabsContent>

        {/* Test Types Tab */}
        <TabsContent value="types" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Test türü ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsAddingTestType(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Yeni Test Türü
            </Button>
          </div>

          {/* Add Test Type Form */}
          {isAddingTestType && (
            <Card>
              <CardHeader>
                <CardTitle>Yeni Test Türü</CardTitle>
                <CardDescription>Sisteme yeni bir test türü ekleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Test Adı</Label>
                    <Input
                      value={newTestType.name || ""}
                      onChange={(e) => setNewTestType({...newTestType, name: e.target.value})}
                      placeholder="Ör: 30 Metre Sprint"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Select 
                      value={newTestType.categoryId || ""} 
                      onValueChange={(value) => setNewTestType({...newTestType, categoryId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Birim</Label>
                    <Input
                      value={newTestType.unit || ""}
                      onChange={(e) => setNewTestType({...newTestType, unit: e.target.value})}
                      placeholder="Ör: saniye, metre, kg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Açıklama</Label>
                  <Textarea
                    value={newTestType.description || ""}
                    onChange={(e) => setNewTestType({...newTestType, description: e.target.value})}
                    placeholder="Test açıklaması..."
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingTestType(false)}>
                    <X className="w-4 h-4 mr-2" />
                    İptal
                  </Button>
                  <Button onClick={handleAddTestType}>
                    <Save className="w-4 h-4 mr-2" />
                    Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Test Types List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTestTypes.map(testType => (
              <Card key={testType.id} className={`${!testType.isActive ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{testType.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{testType.categoryName}</Badge>
                        <Badge variant="secondary">{testType.unit}</Badge>
                        {testType.isCalculated && <Badge variant="default">Hesaplanan</Badge>}
                      </div>
                    </div>
                    <Badge variant={testType.isActive ? "default" : "secondary"}>
                      {testType.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{testType.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-semibold text-blue-600">{testType.fieldCount}</div>
                      <div className="text-xs text-blue-800">Alan</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-semibold text-green-600">{testType.sessionCount}</div>
                      <div className="text-xs text-green-800">Oturum</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      {new Date(testType.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
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
                            <AlertDialogTitle>Test Türünü Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu test türünü silmek istediğinizden emin misiniz?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTestType(testType.id)}>
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
        </TabsContent>

        {/* Test Fields Tab */}
        <TabsContent value="fields" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Test alanı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={selectedTestType} onValueChange={setSelectedTestType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Test Türleri</SelectItem>
                  {testTypes.map(testType => (
                    <SelectItem key={testType.id} value={testType.id}>
                      {testType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsAddingTestField(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Yeni Test Alanı
            </Button>
          </div>

          {/* Add Test Field Form */}
          {isAddingTestField && (
            <Card>
              <CardHeader>
                <CardTitle>Yeni Test Alanı</CardTitle>
                <CardDescription>Sisteme yeni bir test alanı ekleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Test Türü</Label>
                    <Select 
                      value={newTestField.testTypeId || ""} 
                      onValueChange={(value) => setNewTestField({...newTestField, testTypeId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Test türü seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {testTypes.map(testType => (
                          <SelectItem key={testType.id} value={testType.id}>
                            {testType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Alan Adı</Label>
                    <Input
                      value={newTestField.fieldName || ""}
                      onChange={(e) => setNewTestField({...newTestField, fieldName: e.target.value})}
                      placeholder="Ör: 1. Deneme"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Giriş Türü</Label>
                    <Select 
                      value={newTestField.inputType || ""} 
                      onValueChange={(value) => setNewTestField({...newTestField, inputType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(inputTypeLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Birim</Label>
                    <Input
                      value={newTestField.unit || ""}
                      onChange={(e) => setNewTestField({...newTestField, unit: e.target.value})}
                      placeholder="Ör: saniye, cm, kg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sıra</Label>
                    <Input
                      type="number"
                      value={newTestField.order || 1}
                      onChange={(e) => setNewTestField({...newTestField, order: parseInt(e.target.value)})}
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingTestField(false)}>
                    <X className="w-4 h-4 mr-2" />
                    İptal
                  </Button>
                  <Button onClick={handleAddTestField}>
                    <Save className="w-4 h-4 mr-2" />
                    Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Test Fields List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTestFields.map(field => (
              <Card key={field.id} className={`${!field.isActive ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{field.fieldName}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{field.testTypeName}</Badge>
                        <Badge variant="secondary">{inputTypeLabels[field.inputType as keyof typeof inputTypeLabels]}</Badge>
                        {field.isRequired && <Badge variant="default">Zorunlu</Badge>}
                      </div>
                    </div>
                    <Badge variant={field.isActive ? "default" : "secondary"}>
                      {field.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Birim: {field.unit}</span>
                    <span className="text-sm text-muted-foreground">Sıra: {field.order}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      {new Date(field.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
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
                            <AlertDialogTitle>Test Alanını Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu test alanını silmek istediğinizden emin misiniz?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTestField(field.id)}>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}