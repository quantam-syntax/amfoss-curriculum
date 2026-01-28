from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text

playlists_bp = Blueprint("playlists", __name__)

@playlists_bp.route("/playlists", methods=["POST"])
def create_playlist():
    data = request.get_json() or {}
    user_id = data.get("user_id")
    name = (data.get("name") or "").strip()
    description = (data.get("description") or "").strip()

    if not user_id or not name:
        return jsonify({"error": "user_id and name are required"}), 400

    sql = text("""
        INSERT INTO playlists (user_id, name, description)
        VALUES (:user_id, :name, :description)
    """)
    result = db.session.execute(sql, {
        "user_id": user_id,
        "name": name,
        "description": description or None,
    })
    db.session.commit()

    playlist_id = result.lastrowid

    return jsonify({
        "id": playlist_id,
        "user_id": user_id,
        "name": name,
        "description": description
    }), 201

@playlists_bp.route("/playlists", methods=["GET"])
def list_playlists():
    user_id = request.args.get("user_id", type=int)
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    sql = text("""
        SELECT id, name, description, created_at
        FROM playlists
        WHERE user_id = :user_id
        ORDER BY created_at DESC
    """)
    rows = db.session.execute(sql, {"user_id": user_id}).mappings().all()
    return jsonify([dict(r) for r in rows])

@playlists_bp.route("/playlists/<int:playlist_id>", methods=["GET"])
def get_playlist(playlist_id):
    user_id = request.args.get("user_id", type=int)
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    # verify playlist belongs to user
    pl_sql = text("""
        SELECT id, user_id, name, description, created_at
        FROM playlists
        WHERE id = :playlist_id AND user_id = :user_id
        LIMIT 1
    """)
    playlist = db.session.execute(pl_sql, {
        "playlist_id": playlist_id,
        "user_id": user_id
    }).mappings().first()

    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404

    tracks_sql = text("""
        SELECT track_id, track_name, artist_name, artwork_url, preview_url, added_at
        FROM playlist_tracks
        WHERE playlist_id = :playlist_id
        ORDER BY added_at DESC
    """)
    tracks = db.session.execute(tracks_sql, {
        "playlist_id": playlist_id
    }).mappings().all()

    return jsonify({
        "playlist": dict(playlist),
        "tracks": [dict(t) for t in tracks],
    })

@playlists_bp.route("/playlists/<int:playlist_id>/tracks", methods=["POST"])
def add_track_to_playlist(playlist_id):
    data = request.get_json() or {}
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    check_sql = text("""
        SELECT id FROM playlists
        WHERE id = :playlist_id AND user_id = :user_id
        LIMIT 1
    """)
    row = db.session.execute(check_sql, {
        "playlist_id": playlist_id,
        "user_id": user_id
    }).first()

    if not row:
        return jsonify({"error": "Playlist not found"}), 404

    sql = text("""
        INSERT INTO playlist_tracks
            (playlist_id, track_id, track_name, artist_name, artwork_url, preview_url)
        VALUES
            (:playlist_id, :track_id, :track_name, :artist_name, :artwork_url, :preview_url)
        ON DUPLICATE KEY UPDATE id = id
    """)

    db.session.execute(sql, {
        "playlist_id": playlist_id,
        "track_id": data.get("track_id"),
        "track_name": data.get("track_name"),
        "artist_name": data.get("artist_name"),
        "artwork_url": data.get("artwork_url"),
        "preview_url": data.get("preview_url"),
    })
    db.session.commit()
    return jsonify({"status": "ok"}), 201
