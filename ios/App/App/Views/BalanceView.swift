import SwiftUI

struct BalanceView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Balance Card
                VStack(spacing: 16) {
                    Text("Current Balance")
                        .font(.system(size: 15))
                        .foregroundColor(.secondary)

                    Text("$245.00")
                        .font(.system(size: 52, weight: .bold))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [.purple, .blue],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )

                    Text("15 days until next refill")
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity)
                .padding(30)
                .background(
                    LinearGradient(
                        colors: [Color.purple.opacity(0.1), Color.blue.opacity(0.1)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .cornerRadius(20)

                // Recent Transactions
                VStack(alignment: .leading, spacing: 16) {
                    Text("Recent Transactions")
                        .font(.system(size: 20, weight: .bold))

                    TransactionRow(store: "Kroger", amount: -45.32, date: "Today")
                    TransactionRow(store: "Walmart", amount: -67.89, date: "Yesterday")
                    TransactionRow(store: "Save-A-Lot", amount: -23.45, date: "2 days ago")
                }

                // Budget Insights
                VStack(alignment: .leading, spacing: 16) {
                    Text("Budget Insights")
                        .font(.system(size: 20, weight: .bold))

                    InsightCard(icon: "chart.pie.fill", title: "Daily Average", value: "$16.33", color: .blue)
                    InsightCard(icon: "cart.fill", title: "Most Shopped", value: "Kroger", color: .purple)
                    InsightCard(icon: "clock.fill", title: "Days Remaining", value: "15 days", color: .cyan)
                }
            }
            .padding(20)
        }
        .background(Color(UIColor.systemGroupedBackground))
        .navigationTitle("EBT Balance")
        .navigationBarTitleDisplayMode(.large)
    }
}

struct TransactionRow: View {
    let store: String
    let amount: Double
    let date: String

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(store)
                    .font(.system(size: 16, weight: .semibold))
                Text(date)
                    .font(.system(size: 14))
                    .foregroundColor(.secondary)
            }
            Spacer()
            Text(String(format: "$%.2f", abs(amount)))
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.red)
        }
        .padding(16)
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(12)
    }
}

struct InsightCard: View {
    let icon: String
    let title: String
    let value: String
    let color: Color

    var body: some View {
        HStack {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)
                .frame(width: 44, height: 44)
                .background(color.opacity(0.1))
                .cornerRadius(10)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 13))
                    .foregroundColor(.secondary)
                Text(value)
                    .font(.system(size: 17, weight: .semibold))
            }
            Spacer()
        }
        .padding(16)
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(12)
    }
}
