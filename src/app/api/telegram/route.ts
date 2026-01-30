import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { name, email, subject, message } = await request.json()

        const botToken = process.env.TELEGRAM_BOT_TOKEN
        const chatId = process.env.TELEGRAM_CHAT_ID

        if (!botToken || !chatId) {
            return NextResponse.json(
                { error: 'Telegram configuration missing' },
                { status: 500 }
            )
        }

        // Format the message for Telegram
        const telegramMessage = `
📬 *رسالة جديدة من الموقع*

👤 *الاسم:* ${name}
📧 *البريد:* ${email}
📝 *الموضوع:* ${subject || 'بدون موضوع'}

💬 *الرسالة:*
${message}

---
🕐 ${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}
        `.trim()

        // Send message to Telegram
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: telegramMessage,
                    parse_mode: 'Markdown',
                }),
            }
        )

        if (!telegramResponse.ok) {
            const error = await telegramResponse.json()
            console.error('Telegram API error:', error)
            return NextResponse.json(
                { error: 'Failed to send Telegram notification' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error sending Telegram notification:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
