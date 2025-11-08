import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false
    @State private var showingSignup = false
    @State private var showingResetPassword = false

    var body: some View {
        ZStack {
            // Background
            Color(red: 0.95, green: 0.93, blue: 0.98)
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 32) {
                    Spacer().frame(height: 40)

                    // Logo
                    ZStack {
                        RoundedRectangle(cornerRadius: 28)
                            .fill(
                                LinearGradient(
                                    colors: [Color.purple, Color.blue],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: 100, height: 100)
                            .shadow(color: .purple.opacity(0.3), radius: 15, x: 0, y: 8)

                        Text("💙")
                            .font(.system(size: 50))
                    }

                    // Title
                    VStack(spacing: 8) {
                        Text("Oasis")
                            .font(.system(size: 38, weight: .bold))

                        Text("Your community support companion")
                            .font(.system(size: 16))
                            .foregroundColor(.secondary)
                    }

                    // Form
                    VStack(spacing: 16) {
                        // Email
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

                        // Password
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Password")
                                .font(.system(size: 15, weight: .semibold))

                            SecureField("Enter your password", text: $password)
                                .textContentType(.password)
                                .padding()
                                .background(Color.white)
                                .cornerRadius(12)
                        }

                        // Forgot Password
                        HStack {
                            Spacer()
                            Button("Forgot password?") {
                                showingResetPassword = true
                            }
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.blue)
                        }

                        // Sign In Button
                        Button {
                            Task {
                                isLoading = true
                                await authManager.signIn(email: email, password: password)
                                isLoading = false
                            }
                        } label: {
                            HStack {
                                if isLoading {
                                    ProgressView()
                                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                } else {
                                    Text("Sign In")
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
                        .disabled(isLoading || email.isEmpty || password.isEmpty)
                        .opacity((isLoading || email.isEmpty || password.isEmpty) ? 0.6 : 1)
                    }
                    .padding(.horizontal, 32)

                    // Sign Up
                    HStack(spacing: 4) {
                        Text("Don't have an account?")
                            .foregroundColor(.secondary)
                        Button("Sign Up") {
                            showingSignup = true
                        }
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.blue)
                    }

                    Spacer()
                }
            }
        }
        .sheet(isPresented: $showingSignup) {
            SignupView()
        }
        .sheet(isPresented: $showingResetPassword) {
            ResetPasswordView()
        }
    }
}
