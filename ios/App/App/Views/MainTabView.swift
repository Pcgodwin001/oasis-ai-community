import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            NavigationStack {
                HomeView()
            }
            .tabItem {
                Label("Home", systemImage: "house.fill")
            }
            .tag(0)

            NavigationStack {
                MapView()
            }
            .tabItem {
                Label("Find Food", systemImage: "map.fill")
            }
            .tag(1)

            NavigationStack {
                ChatView()
            }
            .tabItem {
                Label("ZENO", systemImage: "message.fill")
            }
            .tag(2)

            NavigationStack {
                BalanceView()
            }
            .tabItem {
                Label("Balance", systemImage: "creditcard.fill")
            }
            .tag(3)

            NavigationStack {
                ShutdownView()
            }
            .tabItem {
                Label("Alerts", systemImage: "exclamationmark.triangle.fill")
            }
            .tag(4)
        }
        .accentColor(.purple)
    }
}
