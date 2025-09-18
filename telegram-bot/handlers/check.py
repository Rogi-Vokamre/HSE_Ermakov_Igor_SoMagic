from aiogram import F, Router, Bot, Dispatcher
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.exceptions import TelegramBadRequest
from aiogram.types import FSInputFile
import os
from .shard_request import get_address_risk

router = Router()

class CheckState(StatesGroup):
    waiting_for_currency = State()
    waiting_for_wallet_address = State()

def create_check_back_keyboard(language: str):
    text = "Назад" if language == "russian" else "Back"
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text=text, callback_data="back_to_main_menu")]
    ])

def create_currency_keyboard(language: str):
    buttons = [
        [InlineKeyboardButton(text="BTC (Bitcoin)", callback_data="currency_btc-btc")],
        [InlineKeyboardButton(text="ETH (Ether)", callback_data="currency_eth-eth")],
        [InlineKeyboardButton(text="TRX (Tron)", callback_data="currency_trx-trx")],
    ]
    back_text = "Назад" if language == "russian" else "Back"
    buttons.append([InlineKeyboardButton(text=back_text, callback_data="back_to_main_menu")])
    return InlineKeyboardMarkup(inline_keyboard=buttons)

TEXT_ASK_CURRENCY = {
    "russian": "🌐 Выберите сеть для проверки адреса:",
    "english": "🌐 Select the network to check the address:"
}

TEXT_ASK_ADDRESS = {
    "russian": (
        "📬 Введите адрес кошелька:\n"
        "Пример: TCFD8N3vM5b4Gr5f1kkajQsodRVNyyAq1d"
    ),
    "english": (
        "📬 Enter the wallet address:\n"
        "Example: TCFD8N3vM5b4Gr5f1kkajQsodRVNyyAq1d"
    )
}

TEXT_PROCESSING = {
    "russian": "⏳ Проверяю данные...",
    "english": "⏳ Checking data..."
}

TEXT_ERROR_API = {
    "russian": "❌ Ошибка при запросе к API. Проверьте адрес или попробуйте позже.",
    "english": "❌ API request failed. Please check the address or try again later."
}

ADDRESS_EXAMPLES = {
    "btc-btc": "bc1qqlqhu85am9ldqsavlw79kd2faq0xw2kr7h5g2g",
    "eth-eth": "0x21a31ee1afc51d94c2efccaa2092ad1028285549",
    "trx-trx": "TCFD8N3vM5b4Gr5f1kkajQsodRVNyyAq1d",
}

@router.callback_query(F.data.startswith("check_"))
async def process_check(query: CallbackQuery, state: FSMContext):
    lang_code = query.data.split("_")[1]
    language = "russian" if lang_code == "rus" else "english"
    await state.update_data(selected_language=language)

    text = TEXT_ASK_CURRENCY[language]
    keyboard = create_currency_keyboard(language)

    sent = await query.message.answer(text, reply_markup=keyboard)
    await query.message.edit_reply_markup(reply_markup=None)
    await state.update_data(last_message_id=sent.message_id)
    await state.set_state(CheckState.waiting_for_currency)

@router.callback_query(F.data.startswith("currency_"))
async def process_currency_selection(query: CallbackQuery, state: FSMContext):
    currency_tag = query.data.split("_", 1)[1]
    data = await state.get_data()
    language = data.get("selected_language", "russian")

    await state.update_data(currency_tag=currency_tag)

    example_address = ADDRESS_EXAMPLES.get(currency_tag, "N/A")

    text = (
        f"📬 Введите адрес кошелька:\n"
        f"Пример: {example_address}"
    ) if language == "russian" else (
        f"📬 Enter the wallet address:\n"
        f"Example: {example_address}"
    )

    keyboard = create_check_back_keyboard(language)

    sent = await query.message.answer(text, reply_markup=keyboard)
    await query.message.edit_reply_markup(reply_markup=None)
    await state.update_data(last_message_id=sent.message_id)
    await state.set_state(CheckState.waiting_for_wallet_address)

@router.message(CheckState.waiting_for_wallet_address)
async def process_wallet_address(message: Message, state: FSMContext, bot: Bot):
    data = await state.get_data()
    language = data.get("selected_language", "russian")
    currency_tag = data.get("currency_tag")
    last_msg_id = data.get("last_message_id")

    if last_msg_id:
        try:
            await bot.edit_message_reply_markup(chat_id=message.chat.id, message_id=last_msg_id, reply_markup=None)
        except TelegramBadRequest:
            pass

    address = message.text.strip()
    await message.answer(TEXT_PROCESSING[language])

    try:
        api_data = get_address_risk(address, currency_tag)
        risk_score = api_data.get("risk_score", 0)
    except Exception as e:
        print(f"[API ERROR] {e}")
        await message.answer(TEXT_ERROR_API[language], reply_markup=create_check_back_keyboard(language))
        return

    if risk_score >= 80:
        img = "Tophigh"
    elif 60 <= risk_score <= 79:
        img = "High"
    elif 30 <= risk_score <= 59:
        img = "Moderate"
    else:
        img = "Safe"

    suffix = "_rus.png" if language == "russian" else "_eng.png"
    image_file = img + suffix
    image_path = os.path.join(os.path.dirname(__file__), "assets", image_file)

    if not os.path.exists(image_path):
        await message.answer("❌ Файл изображения не найден.")
        return

    photo = FSInputFile(image_path)

    network_map = {
        "btc-btc": "BTC (Bitcoin)",
        "eth-eth": "ETH (Ether)",
        "trx-trx": "TRX (Tron)"
    }
    network_name = network_map.get(currency_tag, currency_tag)

    caption = (
        f"✅ Результат проверки\n\n"
        f"Адрес: <code>{address}</code>\n"
        f"Сеть: {network_name}\n"
        f"Риск: <b>{risk_score}/100</b>"
    ) if language == "russian" else (
        f"✅ Check result\n\n"
        f"Address: <code>{address}</code>\n"
        f"Network: {network_name}\n"
        f"Risk: <b>{risk_score}/100</b>"
    )

    await message.answer_photo(
        photo=photo,
        caption=caption,
        parse_mode="HTML",
        reply_markup=create_check_back_keyboard(language)
    )

@router.callback_query(F.data == "back_to_main_menu")
async def back_to_main_menu(query: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    language = data.get("selected_language", "russian")
    from handlers.main_menu import show_main_menu
    await show_main_menu(query.message, language)
    await query.message.edit_reply_markup(reply_markup=None)
    await state.clear()

def register_check_handlers(dp: Dispatcher):
    dp.include_router(router)
