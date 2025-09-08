import requests
import os
from dotenv import load_dotenv

load_dotenv()
SHARD_API_TOKEN = os.getenv("SHARD_API_TOKEN")
SHARD_API_URL = "https://shard.ru/external/api"

def get_address_risk(address: str, currency_tag: str) -> dict:
    url = f"{SHARD_API_URL}/address/{address}/risks/{currency_tag}"
    params = {"token": SHARD_API_TOKEN}

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise Exception(f"Shard API error: {str(e)}")
