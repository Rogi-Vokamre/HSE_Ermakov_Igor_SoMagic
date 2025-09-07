from aiogram import F, Router, Dispatcher
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.context import FSMContext

# Роутер для обработчиков
router = Router()

# Клавиатура с кнопкой "Назад"
def create_profile_back_keyboard(language: str):
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

# Обработчик нажатия на кнопку "Личный кабинет"
@router.callback_query(F.data.startswith("profile_"))
async def show_profile(query: CallbackQuery):
    # Определение языка из callback_data
    language = query.data.split("_")[1]  # "rus" или "eng"

    # Получение username пользователя
    user_mention = f"@{query.from_user.username}" if query.from_user.username else query.from_user.full_name

    # Текст профиля в зависимости от языка
    if language == "rus":
        await query.message.answer(f"🧑‍💻 Имя пользователя: {user_mention}\n\n" 
                                   f"🔍 Количество доступных проверок: неограниченное количество проверок до 1 ноября 2025 г.\n\n"
                                   f"📋 Тарифный план: \"Разработчик\" до 1 ноября 2025",
                                   reply_markup=create_profile_back_keyboard("russian")
        )
    elif language == "eng":
        await query.message.answer(f"🧑‍💻 Username: {user_mention}\n\n" 
                                   f"🔍 Available checks: unlimited checks until November 1, 2025.\n\n"
                                   f"📋 Plan: \"Developer\" until November 1, 2025.",
                                   reply_markup=create_profile_back_keyboard("english")
        )

    # Скрытие клавиатуры после выбора
    await query.message.edit_reply_markup(reply_markup=None)

# Обработчик нажатия на кнопку "Назад"
@router.callback_query(F.data == "back_to_main_menu")
async def back_to_main_menu(query: CallbackQuery, state: FSMContext):
    
    data = await state.get_data()
    selected_language = data.get("selected_language", "russian")

    # Возврат в главное меню
    from handlers.main_menu import show_main_menu
    await show_main_menu(query.message, selected_language)
    await query.message.edit_reply_markup(reply_markup=None)

# Регистрация обработчиков
def register_profile_handlers(dp: Dispatcher):
    dp.include_router(router)
