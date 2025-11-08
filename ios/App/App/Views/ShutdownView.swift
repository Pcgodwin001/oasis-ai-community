import SwiftUI

struct ShutdownView: View {
    @State private var notificationsEnabled = true

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Risk Meter
                VStack(spacing: 20) {
                    Text("⚠️")
                        .font(.system(size: 60))

                    Text("Government Shutdown Risk")
                        .font(.system(size: 22, weight: .bold))
                        .multilineTextAlignment(.center)

                    ZStack {
                        Circle()
                            .stroke(Color.gray.opacity(0.2), lineWidth: 18)
                            .frame(width: 160, height: 160)

                        Circle()
                            .trim(from: 0, to: 0.25)
                            .stroke(
                                LinearGradient(
                                    colors: [.green, .yellow],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                ),
                                style: StrokeStyle(lineWidth: 18, lineCap: .round)
                            )
                            .frame(width: 160, height: 160)
                            .rotationEffect(.degrees(-90))

                        VStack(spacing: 4) {
                            Text("25%")
                                .font(.system(size: 44, weight: .bold))
                            Text("LOW RISK")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(.secondary)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 4)
                                .background(Color(UIColor.systemGray6))
                                .cornerRadius(8)
                        }
                    }

                    Text("Last updated: January 15, 2025")
                        .font(.system(size: 13))
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity)
                .padding(30)
                .background(Color(UIColor.secondarySystemGroupedBackground))
                .cornerRadius(20)

                // What This Means
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("💡")
                        Text("What This Means")
                            .font(.system(size: 17, weight: .semibold))
                    }

                    Text("Risk is low right now. Congress has time to pass funding. Your benefits are safe for now, but it's good to have a backup plan.")
                        .font(.system(size: 15))
                        .foregroundColor(.secondary)
                }
                .padding(20)
                .background(Color(UIColor.secondarySystemGroupedBackground))
                .cornerRadius(16)

                // Preparation Checklist
                VStack(alignment: .leading, spacing: 16) {
                    HStack {
                        Text("✓")
                        Text("Preparation Checklist")
                            .font(.system(size: 19, weight: .bold))
                        Spacer()
                        Text("2/5")
                            .font(.system(size: 13, weight: .semibold))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(Color.purple.opacity(0.1))
                            .cornerRadius(10)
                    }

                    ChecklistItem(text: "Know your nearest food pantries", isCompleted: true)
                    ChecklistItem(text: "Have emergency contacts saved", isCompleted: true)
                    ChecklistItem(text: "Stock non-perishable food", isCompleted: false)
                    ChecklistItem(text: "Plan alternative food sources", isCompleted: false)
                    ChecklistItem(text: "Monitor shutdown news daily", isCompleted: false)
                }
                .padding(20)
                .background(Color(UIColor.secondarySystemGroupedBackground))
                .cornerRadius(16)

                // Notifications
                VStack(spacing: 16) {
                    HStack {
                        Image(systemName: "bell.fill")
                            .foregroundColor(.purple)
                        Text("Stay Informed")
                            .font(.system(size: 19, weight: .bold))
                        Spacer()
                    }

                    Text("Oasis monitors Congress 24/7 and will alert you if shutdown risk increases.")
                        .font(.system(size: 15))
                        .foregroundColor(.secondary)

                    Toggle(isOn: $notificationsEnabled) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Alerts Enabled")
                                .font(.system(size: 15, weight: .semibold))
                            Text("Get notified of risk changes")
                                .font(.system(size: 13))
                                .foregroundColor(.secondary)
                        }
                    }
                    .tint(.purple)
                }
                .padding(20)
                .background(Color(UIColor.secondarySystemGroupedBackground))
                .cornerRadius(16)
            }
            .padding(20)
        }
        .background(Color(UIColor.systemGroupedBackground))
        .navigationTitle("Shutdown Alerts")
        .navigationBarTitleDisplayMode(.large)
    }
}

struct ChecklistItem: View {
    let text: String
    let isCompleted: Bool

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: isCompleted ? "checkmark.circle.fill" : "circle")
                .foregroundColor(isCompleted ? .green : .gray)
                .font(.title3)

            Text(text)
                .font(.system(size: 15))
                .foregroundColor(isCompleted ? .secondary : .primary)
                .strikethrough(isCompleted)

            Spacer()
        }
    }
}
