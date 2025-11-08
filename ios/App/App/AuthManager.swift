import Foundation
import Combine

class AuthManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var errorMessage: String?

    struct User {
        let id: String
        let email: String
        let fullName: String
    }

    func signIn(email: String, password: String) async {
        // Simulate authentication - in production, integrate with Supabase
        do {
            try await Task.sleep(nanoseconds: 1_000_000_000)
            await MainActor.run {
                self.currentUser = User(
                    id: UUID().uuidString,
                    email: email,
                    fullName: "Demo User"
                )
                self.isAuthenticated = true
            }
        } catch {
            await MainActor.run {
                self.errorMessage = error.localizedDescription
            }
        }
    }

    func signUp(email: String, password: String, fullName: String) async {
        // Simulate sign up - in production, integrate with Supabase
        do {
            try await Task.sleep(nanoseconds: 1_000_000_000)
            await MainActor.run {
                self.currentUser = User(
                    id: UUID().uuidString,
                    email: email,
                    fullName: fullName
                )
                self.isAuthenticated = true
            }
        } catch {
            await MainActor.run {
                self.errorMessage = error.localizedDescription
            }
        }
    }

    func signOut() {
        currentUser = nil
        isAuthenticated = false
    }

    func resetPassword(email: String) async {
        // Simulate password reset
        do {
            try await Task.sleep(nanoseconds: 1_000_000_000)
            // Success
        } catch {
            await MainActor.run {
                self.errorMessage = error.localizedDescription
            }
        }
    }
}
