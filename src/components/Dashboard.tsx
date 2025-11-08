import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Building2, Users, Trophy, TrendingUp, Plus, Eye, TestTube, Calendar } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

const statsData = [
  { title: "Toplam Kulüp", value: "156", change: "+12", icon: Building2, color: "text-blue-600", bgColor: "bg-blue-50" },
  { title: "Aktif Üye", value: "24,847", change: "+1,205", icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
  { title: "Test Oturumları", value: "1,248", change: "+89", icon: Calendar, color: "text-purple-600", bgColor: "bg-purple-50" },
  { title: "Aktif Testler", value: "47", change: "+5", icon: TestTube, color: "text-orange-600", bgColor: "bg-orange-50" },
]

const monthlyData = [
  { month: "Oca", clubs: 120, members: 18500 },
  { month: "Şub", clubs: 125, members: 19200 },
  { month: "Mar", clubs: 132, members: 20100 },
  { month: "Nis", clubs: 138, members: 21300 },
  { month: "May", clubs: 145, members: 22800 },
  { month: "Haz", clubs: 152, members: 24200 },
  { month: "Tem", clubs: 156, members: 24847 },
]

const sportsData = [
  { name: "Futbol", value: 45, color: "#8884d8" },
  { name: "Basketbol", value: 30, color: "#82ca9d" },
  { name: "Voleybol", value: 25, color: "#ffc658" },
  { name: "Yüzme", value: 20, color: "#ff7300" },
  { name: "Tenis", value: 15, color: "#00ff88" },
  { name: "Diğer", value: 21, color: "#ff8888" },
]

const recentActivities = [
  { type: "Test Tamamlandı", description: "Ahmet Yılmaz - 30 Metre Sprint testi tamamlandı", time: "1 saat önce", color: "bg-green-100 text-green-800" },
  { type: "Yeni Kulüp", description: "Ankara Gençlik SK kaydı tamamlandı", time: "2 saat önce", color: "bg-green-100 text-green-800" },
  { type: "Test Planlandı", description: "5 sporcu için Cooper testi planlandı", time: "3 saat önce", color: "bg-blue-100 text-blue-800" },
  { type: "Güncelleme", description: "İstanbul Spor Kulübü bilgileri güncellendi", time: "4 saat önce", color: "bg-blue-100 text-blue-800" },
  { type: "Test Onayı", description: "12 test sonucu onay bekliyor", time: "6 saat önce", color: "bg-yellow-100 text-yellow-800" },
  { type: "Branş Eklendi", description: "Karate branşı sisteme eklendi", time: "1 gün önce", color: "bg-purple-100 text-purple-800" },
]

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Hoş geldiniz!</h1>
          <p className="text-muted-foreground">Sistem genel durumu ve son aktiviteler</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Rapor Görüntüle
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kulüp
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span>{stat.change} bu ay</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Aylık Büyüme</CardTitle>
            <CardDescription>Kulüp ve üye sayısı gelişimi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="clubs" stroke="#8884d8" strokeWidth={2} name="Kulüp Sayısı" />
                <Line type="monotone" dataKey="members" stroke="#82ca9d" strokeWidth={2} name="Üye Sayısı" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sports Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Branş Dağılımı</CardTitle>
            <CardDescription>Kulüplerin spor branşlarına göre dağılımı</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sportsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sportsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {sportsData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
          <CardDescription>Sistemdeki son işlemler ve güncellemeler</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <Badge variant="secondary" className={activity.color}>
                  {activity.type}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}