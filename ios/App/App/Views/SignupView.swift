import SwiftUI

struct SignupView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var authManager: AuthManager
    @State private var fullName = ""
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false
    @State private var showSuccess = false

    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.95, green: 0.93, blue: 0.98)
                    .ignoresSafeArea()

                if showSuccess {
                    VStack(spacing: 24) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 80))
                            .foregroundColor(.green)

                        Text("Account Created!")
                            .font(.system(size: 28, weight: .bold))

                        Text("Welcome to Oasis")
                            .font(.system(size: 17))
                            .foregroundColor(.secondary)

                        Button {
                            dismiss()
                        } label: {
                            Text("Continue")
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
                            Spacer().frame(height: 20)

                            Text("Create Account")
                                .font(.system(size: 32, weight: .bold))

                            Text("Join Oasis to access your benefits")
                                .font(.system(size: 16))
                                .foregroundColor(.secondary)

                            VStack(spacing: 16) {
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Full Name")
                                        .font(.system(size: 15, weight: .semibold))

                                    TextField("Enter your full name", text: $fullName)
                                        .textContentType(.name)
                                        .padding()
                                        .background(Color.white)
                                        .cornerRadius(12)
                                }

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

                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Password")
                                        .font(.system(size: 15, weight: .semibold))

                                    SecureField("Create a password", text: $password)
                                        .textContentType(.newPassword)
                                        .padding()
                                        .background(Color.white)
                                        .cornerRadius(12)
                                }

                                Button {
                                    Task {
                                        isLoading = true
                                        await authManager.signUp(email: email, password: password, fullName: fullName)
                                        isLoading = false
                                        showSuccess = true
                                    }
                                } label: {
                                    HStack {
                                        if isLoading {
                                            ProgressView()
                                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                        } else {
                                            Text("Create Account")
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
                                .disabled(isLoading || fullName.isEmpty || email.isEmpty || password.isEmpty)
                                .opacity((isLoading || fullName.isEmpty || email.isEmpty || password.isEmpty) ? 0.6 : 1)
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
