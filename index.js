const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

async function connectToWhatsApp() {
    // Session state সংরক্ষণ করার জন্য 'auth_info_baileys' ফোল্ডার তৈরি হবে
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false // আমরা qrcode-terminal দিয়ে কাস্টমভাবে ছোট QR দেখাব
    });

    // কানেকশন আপডেট হ্যান্ডেল করা
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        // টার্মিনালে QR code দেখানো
        if (qr) {
            console.log('\n--- অনুগ্রহ করে নিচের QR Code-টি আপনার WhatsApp দিয়ে স্ক্যান করুন ---\n');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('কানেকশন বিচ্ছিন্ন হয়েছে। আবার চেষ্টা করা হচ্ছে:', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('✅ WhatsApp বট সফলভাবে কানেক্ট হয়েছে!');
        }
    });

    // ক্রেডেনশিয়াল আপডেট হলে সেভ করা
    sock.ev.on('creds.update', saveCreds);

    // ইনকামিং মেসেজ রিসিভ এবং রেসপন্স করা
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        console.log(`[মেসেজ এসেছে] ${from}: ${text}`);

        // উদাহরণ: 'ping' পাঠালে বট 'pong' উত্তর দেবে
        if (text.toLowerCase() === 'ping') {
            await sock.sendMessage(from, { text: 'pong 🏓' });
        }
    });
}

connectToWhatsApp();
