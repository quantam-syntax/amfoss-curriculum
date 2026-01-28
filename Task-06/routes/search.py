from flask import Blueprint, request, jsonify
from services.itunes_service import search_itunes

search_bp = Blueprint("search", __name__)

@search_bp.route("/search", methods=["GET"])
def search():
    term = request.args.get("q")
    if not term:
        return jsonify({"error": "Missing search query"}), 400

    results = search_itunes(term)
    return jsonify(results)