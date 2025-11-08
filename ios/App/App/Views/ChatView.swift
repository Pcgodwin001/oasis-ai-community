import SwiftUI

struct ChatView: View {
    @State private var message = ""
    @State private var messages: [ChatMessage] = [
        ChatMessage(text: "Hi! I'm ZENO, your AI assistant. How can I help you today?", isUser: false)
    ]

    var body: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(spacing: 12) {
                    ForEach(messages) { msg in
                        ChatBubble(message: msg)
                    }
                }
                .padding()
            }

            HStack {
                TextField("Type a message...", text: $message)
                    .padding(12)
                    .background(Color(UIColor.systemGray6))
                    .cornerRadius(20)

                Button {
                    sendMessage()
                } label: {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.system(size: 32))
                        .foregroundColor(.purple)
                }
                .disabled(message.isEmpty)
            }
            .padding()
            .background(Color(UIColor.systemBackground))
        }
        .navigationTitle("ZENO AI")
        .navigationBarTitleDisplayMode(.large)
    }

    func sendMessage() {
        guard !message.isEmpty else { return }
        messages.append(ChatMessage(text: message, isUser: true))
        let userMessage = message
        message = ""

        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            messages.append(ChatMessage(
                text: "I understand you need help with \(userMessage). Let me assist you with that.",
                isUser: false
            ))
        }
    }
}

struct ChatMessage: Identifiable {
    let id = UUID()
    let text: String
    let isUser: Bool
}

struct ChatBubble: View {
    let message: ChatMessage

    var body: some View {
        HStack {
            if message.isUser { Spacer() }

            Text(message.text)
                .padding(14)
                .background(message.isUser ? Color.purple : Color(UIColor.systemGray5))
                .foregroundColor(message.isUser ? .white : .primary)
                .cornerRadius(16)
                .frame(maxWidth: 280, alignment: message.isUser ? .trailing : .leading)

            if !message.isUser { Spacer() }
        }
    }
}
