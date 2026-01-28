from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text

recent_bp = Blueprint("recent", __name__)

@recent_bp.route("/recently-played", methods=["POST"])
def add_recent():
    data = request.get_json() or {}
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    sql = text("""
        INSERT INTO recent (user_id, track_id, track_name, artist_name, artwork_url, preview_url)
        VALUES (:user_id, :track_id, :track_name, :artist_name, :artwork_url, :preview_url)
        ON DUPLICATE KEY UPDATE played_at = NOW()
    """)

    db.session.execute(sql, {
        "user_id": user_id,
        "track_id": data.get("track_id"),
        "track_name": data.get("track_name"),
        "artist_name": data.get("artist_name"),
        "artwork_url": data.get("artwork_url"),
        "preview_url": data.get("preview_url"),
    })
    db.session.commit()
    return jsonify({"status": "ok"}), 201

@recent_bp.route("/recently-played", methods=["GET"])
def get_recent():
    user_id = request.args.get("user_id", type=int)
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    limit = request.args.get("limit", 7, type=int)
    if limit < 1:
        limit = 1
    if limit > 7:
        limit = 7

    sql = text("""
        SELECT track_id, track_name, artist_name, artwork_url, preview_url
        FROM recent
        WHERE user_id = :user_id
        ORDER BY played_at DESC
        LIMIT :limit
    """)
    rows = db.session.execute(sql, {
        "user_id": user_id,
        "limit": limit
    }).mappings().all()

    return jsonify([dict(r) for r in rows])
