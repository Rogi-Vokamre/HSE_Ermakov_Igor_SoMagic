from aiogram import F, Router, Dispatcher
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery

# Роутер для обработчиков
router = Router()

# Клавиатура с инлайн-кнопками для основного меню
def create_main_menu_keyboard_rus():
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Проверка 🔍", callback_data="check_rus")],
            [InlineKeyboardButton(text="Личный кабинет 🧑‍💻", callback_data="profile_rus")],
            [InlineKeyboardButton(text="Гайд 📋", callback_data="info_rus")],
        ]
    )
    return keyboard

def create_main_menu_keyboard_eng():
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Check 🔍", callback_data="check_eng")],
            [InlineKeyboardButton(text="Profile 🧑‍💻", callback_data="profile_eng")],
            [InlineKeyboardButton(text="Guide 📋", callback_data="info_eng")],
        ]
    )
    return keyboard

# Основное меню
async def show_main_menu(message: Message, language: str):
    if language == "russian":
        await message.answer(
            "Список доступных команд:",
            reply_markup=create_main_menu_keyboard_rus()
        )
    elif language == "english":
        await message.answer(
            "The list of available commands:",
            reply_markup=create_main_menu_keyboard_eng()
        )

# Регистрация обработчиков
def register_main_menu_handlers(dp: Dispatcher):
    dp.include_router(router)
