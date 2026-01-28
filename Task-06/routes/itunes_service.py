import requests

def search_itunes(term):
    url = "https://itunes.apple.com/search"
    params = {
        "term": term,
        "media": "music",
        "limit": 20
    }
    r = requests.get(url, params=params)
    data = r.json()
    return data["results"]  
