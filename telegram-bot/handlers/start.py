from aiogram import F, Router, Dispatcher
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

# Роутер для обработчиков
router = Router()

# Состояния для FSM (Finite State Machine)
class LanguageSelection(StatesGroup):
    waiting_for_language = State()
    selected_language = State()  

# Клавиатура с инлайн-кнопками для выбора языка
def create_language_keyboard():
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="Русский 🇷🇺", callback_data="lang_russian"),
                InlineKeyboardButton(text="English 🇬🇧", callback_data="lang_english")
            ]
        ]
    )
    return keyboard

# Обработчик команды /start
@router.message(Command("start"))
async def start_command(message: Message, state: FSMContext):
    sent_message = await message.answer(
        "🇷🇺|| Для начала работы с сервисом выберите один из языков:\n\n"
        "🇬🇧|| To use the tool, please, choose one of the languages:",
        reply_markup=create_language_keyboard()
    )
    await state.update_data(start_message_id=sent_message.message_id)
    await state.set_state(LanguageSelection.waiting_for_language)

# Обработчик выбора языка через инлайн-кнопки
@router.callback_query(LanguageSelection.waiting_for_language, F.data.startswith("lang_"))
async def process_language_selection(query: CallbackQuery, state: FSMContext):
    # Определение выбранного языка
    selected_language = query.data.split("_")[1]

    # Получение username пользователя
    user_mention = f"@{query.from_user.username}" if query.from_user.username else query.from_user.full_name

    # Ответ в зависимости от выбранного языка
    if selected_language == "russian":
        await query.message.answer(
            f"Добро пожаловать в сервис, {user_mention} 🎉\nТеперь можно приступить к работе!"
        )
        await query.message.answer(
            "Перед началом работы мы рекомендуем ознакомиться с возможностями сервиса в \"Гайде\"."
        )

    elif selected_language == "english":
        await query.message.answer(
            f"Welcome, {user_mention} 🎉\nLet's get started!"
        )
        await query.message.answer(
            "At first we recommend you to deep dive into service's traits in the \"Guide\"."
        )

    # Скрытие клавиатуры после выбора
    await query.message.edit_reply_markup(reply_markup=None)

    # Удаление исходного сообщения с выбором языка
    data = await state.get_data()
    start_message_id = data.get("start_message_id")
    if start_message_id:
        await query.bot.delete_message(chat_id=query.message.chat.id, message_id=start_message_id)

    # Сохранение выбранного языка в состояние FSM
    await state.update_data(selected_language=selected_language)
    await state.set_state(LanguageSelection.selected_language)

    # Переход к основному меню
    from handlers.main_menu import show_main_menu
    await show_main_menu(query.message, selected_language)

# Регистрация обработчиков
def register_start_handlers(dp: Dispatcher):
    dp.include_router(router)
