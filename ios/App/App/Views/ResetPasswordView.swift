import SwiftUI

struct ResetPasswordView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var authManager: AuthManager
    @State private var email = ""
    @State private var isLoading = false
    @State private var showSuccess = false

    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.95, green: 0.93, blue: 0.98)
                    .ignoresSafeArea()

                if showSuccess {
                    VStack(spacing: 24) {
                        Image(systemName: "envelope.circle.fill")
                            .font(.system(size: 80))
                            .foregroundColor(.blue)

                        Text("Check Your Email")
                            .font(.system(size: 28, weight: .bold))

                        Text("We've sent password reset instructions to \(email)")
                            .font(.system(size: 17))
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)

                        Button {
                            dismiss()
                        } label: {
                            Text("Back to Login")
                                .font(.system(size: 17, weight: .bold))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 16)
                                .background(
                                    LinearGradient(
                                        colors: [Color.purple, Color.blue],
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                                .foregroundColor(.white)
                                .cornerRadius(12)
                        }
                        .padding(.horizontal, 32)
                    }
                } else {
                    ScrollView {
                        VStack(spacing: 24) {
                            Spacer().frame(height: 40)

                            Text("Reset Password")
                                .font(.system(size: 32, weight: .bold))

                            Text("Enter your email to receive reset instructions")
                                .font(.system(size: 16))
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)

                            VStack(spacing: 16) {
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Email")
                                        .font(.system(size: 15, weight: .semibold))

                                    TextField("Enter your email", text: $email)
                                        .textContentType(.emailAddress)
                                        .keyboardType(.emailAddress)
                                        .autocapitalization(.none)
                                        .padding()
                                        .background(Color.white)
                                        .cornerRadius(12)
                                }

                                Button {
                                    Task {
                                        isLoading = true
                                        await authManager.resetPassword(email: email)
                                        isLoading = false
                                        showSuccess = true
                                    }
                                } label: {
                                    HStack {
                                        if isLoading {
                                            ProgressView()
                                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                        } else {
                                            Text("Send Reset Link")
                                                .font(.system(size: 17, weight: .bold))
                                        }
                                    }
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 16)
                                    .background(
                                        LinearGradient(
                                            colors: [Color.purple, Color.blue],
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                                    .foregroundColor(.white)
                                    .cornerRadius(12)
                                }
                                .disabled(isLoading || email.isEmpty)
                                .opacity((isLoading || email.isEmpty) ? 0.6 : 1)
                            }
                            .padding(.horizontal, 32)

                            Spacer()
                        }
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark")
                            .foregroundColor(.primary)
                    }
                }
            }
        }
    }
}
