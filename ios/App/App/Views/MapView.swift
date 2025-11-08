import SwiftUI
import MapKit

struct MapView: View {
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 35.6145, longitude: -88.8139),
        span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1)
    )

    var body: some View {
        ZStack(alignment: .bottom) {
            Map(coordinateRegion: $region, showsUserLocation: true)
                .ignoresSafeArea()

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    FoodPantryCard(
                        name: "Community Food Bank",
                        distance: "2.3 mi",
                        status: "Open Now",
                        address: "123 Main St"
                    )
                    FoodPantryCard(
                        name: "Hope Pantry",
                        distance: "3.7 mi",
                        status: "Closes 5 PM",
                        address: "456 Oak Ave"
                    )
                    FoodPantryCard(
                        name: "Grace Food Center",
                        distance: "5.1 mi",
                        status: "Open Now",
                        address: "789 Pine Rd"
                    )
                }
                .padding()
            }
            .background(Color(UIColor.systemBackground))
            .cornerRadius(20, corners: [.topLeft, .topRight])
            .shadow(color: .black.opacity(0.1), radius: 10, x: 0, y: -5)
        }
        .navigationTitle("Find Food")
        .navigationBarTitleDisplayMode(.large)
    }
}

struct FoodPantryCard: View {
    let name: String
    let distance: String
    let status: String
    let address: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("🏪")
                    .font(.system(size: 32))
                Spacer()
                Text(distance)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.purple)
            }

            Text(name)
                .font(.system(size: 17, weight: .bold))

            Text(address)
                .font(.system(size: 14))
                .foregroundColor(.secondary)

            HStack {
                Circle()
                    .fill(Color.green)
                    .frame(width: 8, height: 8)
                Text(status)
                    .font(.system(size: 13))
                    .foregroundColor(.green)
            }

            Button {
                // Get directions
            } label: {
                Text("Get Directions")
                    .font(.system(size: 15, weight: .semibold))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(Color.purple)
                    .foregroundColor(.white)
                    .cornerRadius(10)
            }
        }
        .frame(width: 260)
        .padding(16)
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(16)
    }
}

extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(
            roundedRect: rect,
            byRoundingCorners: corners,
            cornerRadii: CGSize(width: radius, height: radius)
        )
        return Path(path.cgPath)
    }
}
