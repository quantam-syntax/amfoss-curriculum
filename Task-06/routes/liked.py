from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text

liked_bp = Blueprint("liked", __name__)

@liked_bp.route("/liked", methods=["POST"])
def add_liked():
    data = request.get_json() or {}
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    sql = text("""
        INSERT INTO liked_songs (user_id, track_id, track_name, artist_name, artwork_url, preview_url)
        VALUES (:user_id, :track_id, :track_name, :artist_name, :artwork_url, :preview_url)
        ON DUPLICATE KEY UPDATE id = id
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

@liked_bp.route("/liked", methods=["GET"])
def get_liked():
    user_id = request.args.get("user_id", type=int)
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    sql = text("""
        SELECT track_id, track_name, artist_name, artwork_url, preview_url
        FROM liked_songs
        WHERE user_id = :user_id
        ORDER BY id DESC
    """)
    rows = db.session.execute(sql, {"user_id": user_id}).mappings().all()
    return jsonify([dict(r) for r in rows])
