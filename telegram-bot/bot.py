from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
from dotenv import load_dotenv
import os

# Загрузка переменных окружения из файла .env
load_dotenv()

# Инициализация бота и диспетчера
bot = Bot(token=os.getenv("BOT_TOKEN"))
dp = Dispatcher()
dp = Dispatcher(storage=MemoryStorage())

# Импорт обработчиков
from handlers.start import register_start_handlers
from handlers.main_menu import register_main_menu_handlers
from handlers.info import register_info_handlers
from handlers.check import register_check_handlers
from handlers.profile import register_profile_handlers

# Регистрация обработчиков
register_start_handlers(dp)
register_main_menu_handlers(dp)
register_info_handlers(dp)
register_check_handlers(dp)
register_profile_handlers(dp)

# Запуск бота
async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    dp.run_polling(bot)
