import requests

ITUNES_URL = "https://itunes.apple.com/search"

def search_itunes(term, entity="song", limit=20):
    params = {
        "term": term,
        "entity": entity,
        "limit": limit
    }

    response = requests.get(ITUNES_URL, params=params, timeout=5)
    response.raise_for_status()
    return response.json()["results"]