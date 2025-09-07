from aiogram import F, Router, Dispatcher
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.context import FSMContext

# Роутер для обработчиков
router = Router()

# Тексты справочника на русском и анлийском языках
INFO_TEXT_RUS = (
    "📚 Cервис доступен в двух версиях с разным функционалом:\n" 
    "🟡 MINI - бот для быстрой проверки криптовалют.\n"
    "🟡 PRO - мини-приложение для детальной проверки криптовалют и работы с отчетами.\n\n"
    "1️⃣ Версия MINI\n"
    "➖ В разделе \"Проверки\" укажи криптовалютный адрес и получи информацию о риск-скоринге адреса.\n"
    "➖ В разделе \"Профиль\" указан твой тарифный план и количество доступных проверок.\n\n"
    "2️⃣ Версия PRO\n"
    "➖ Для перехода в мини-приложение нажми кнопку \"Open\".\n"
    "➖ В разделе \"Проверки\" укажи криптовалютный адрес и получи детальный отчет о риск-скоринге адреса.\n"
    "➖ В разделе \"Гайд\" ознакомься с подробной инструкцией о приложении."
)

INFO_TEXT_ENG = (
    "📚 The service is available in two modes with different traits:\n" 
    "🟡 MINI - bot for quickly checking crypto.\n"
    "🟡 PRO - mini-app for checking crypto in details and managing reports.\n\n"
    "1️⃣ MINI Mode\n"
    "➖ In \"Check\" section insert a crypto address and get a crypto's risk notification.\n"
    "➖ In \"Profile\" find your plan and number of available checks.\n\n"
    "2️⃣ PRO Mode\n"
    "➖ Click \"Open\" button to use mini-app.\n"
    "➖ In \"Check\" section insert a crypto address and get a crypto's risk profile report in details.\n"
    "➖ In \"Guide\" section deep dive into detailed info about mini-app."
)

# Клавиатура с кнопкой "Назад"
def create_info_back_keyboard(language: str):
    if language == "russian":
        return InlineKeyboardMarkup(
            inline_keyboard=[
                [InlineKeyboardButton(text="Назад", callback_data="back_to_main_menu")]
            ]
        )
    elif language == "english":
        return InlineKeyboardMarkup(
            inline_keyboard=[
                [InlineKeyboardButton(text="Back", callback_data="back_to_main_menu")]
            ]
        )

# Обработчик нажатия на кнопку "Справочник"
@router.callback_query(F.data.startswith("info_"))
async def show_info(query: CallbackQuery, state: FSMContext):
    # Получение выбранного языка из состояния FSM
    data = await state.get_data()
    selected_language = data.get("selected_language", "russian")

    # Текст справочника в зависимости от языка
    if selected_language == "russian":
        await query.message.answer(
            INFO_TEXT_RUS,
            reply_markup=create_info_back_keyboard("russian")
        )
    elif selected_language == "english":
        await query.message.answer(
            INFO_TEXT_ENG,
            reply_markup=create_info_back_keyboard("english")
        )

    # Скрытие клавиатуры после выбора
    await query.message.edit_reply_markup(reply_markup=None)

# Обработчик нажатия на кнопку "Назад"
@router.callback_query(F.data =="back_to_main_menu")
async def back_to_main_menu(query: CallbackQuery, state: FSMContext):
    
    data = await state.get_data()
    selected_language = data.get("selected_language", "russian")

    # Возврат в главное меню
    from handlers.main_menu import show_main_menu
    await show_main_menu(query.message, selected_language)
    await query.message.edit_reply_markup(reply_markup=None)

# Регистрация обработчиков
def register_info_handlers(dp: Dispatcher):
    dp.include_router(router)
