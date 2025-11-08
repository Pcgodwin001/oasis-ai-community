import SwiftUI

struct HomeView: View {
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Welcome Card
                VStack(alignment: .leading, spacing: 12) {
                    Text("Welcome back,")
                        .font(.system(size: 18))
                        .foregroundColor(.secondary)
                    Text(authManager.currentUser?.fullName ?? "User")
                        .font(.system(size: 32, weight: .bold))
                    Text("Jackson, Tennessee")
                        .font(.system(size: 15))
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(24)
                .background(
                    LinearGradient(
                        colors: [Color.purple.opacity(0.1), Color.blue.opacity(0.1)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .cornerRadius(16)

                // Quick Stats
                HStack(spacing: 12) {
                    StatCard(
                        icon: "💳",
                        title: "EBT Balance",
                        value: "$245",
                        subtitle: "15 days left",
                        gradient: [.purple, .blue]
                    )

                    StatCard(
                        icon: "📍",
                        title: "Nearest Food Bank",
                        value: "2.3 mi",
                        subtitle: "Open now",
                        gradient: [.green, .cyan]
                    )
                }

                // Shutdown Risk
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("⚠️")
                            .font(.system(size: 32))
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Shutdown Risk")
                                .font(.system(size: 18, weight: .bold))
                            Text("Low - 25%")
                                .font(.system(size: 15))
                                .foregroundColor(.green)
                        }
                        Spacer()
                        Image(systemName: "chevron.right")
                            .foregroundColor(.secondary)
                    }
                }
                .padding(20)
                .background(Color(UIColor.secondarySystemGroupedBackground))
                .cornerRadius(16)

                // Quick Actions
                VStack(spacing: 12) {
                    ActionCard(icon: "🗺️", title: "Find Food", description: "Locate nearby pantries")
                    ActionCard(icon: "💬", title: "Chat with ZENO", description: "Get instant help")
                    ActionCard(icon: "📊", title: "Track Balance", description: "Monitor your benefits")
                }
            }
            .padding(20)
        }
        .background(Color(UIColor.systemGroupedBackground))
        .navigationTitle("Home")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Menu {
                    Button(action: {
                        authManager.signOut()
                    }) {
                        Label("Sign Out", systemImage: "arrow.right.square")
                    }
                } label: {
                    Image(systemName: "person.circle.fill")
                        .font(.title3)
                        .foregroundColor(.purple)
                }
            }
        }
    }
}

struct StatCard: View {
    let icon: String
    let title: String
    let value: String
    let subtitle: String
    let gradient: [Color]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(icon)
                .font(.system(size: 28))
            Text(title)
                .font(.system(size: 13))
                .foregroundColor(.secondary)
            Text(value)
                .font(.system(size: 28, weight: .bold))
                .foregroundStyle(
                    LinearGradient(
                        colors: gradient,
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
            Text(subtitle)
                .font(.system(size: 12))
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(16)
    }
}

struct ActionCard: View {
    let icon: String
    let title: String
    let description: String

    var body: some View {
        HStack(spacing: 12) {
            Text(icon)
                .font(.system(size: 32))
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 16, weight: .semibold))
                Text(description)
                    .font(.system(size: 14))
                    .foregroundColor(.secondary)
            }
            Spacer()
            Image(systemName: "chevron.right")
                .foregroundColor(.secondary)
        }
        .padding(16)
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(12)
    }
}
