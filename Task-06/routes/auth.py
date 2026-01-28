from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    exists_sql = text("SELECT id FROM melofi_auth WHERE email = :email")
    row = db.session.execute(exists_sql, {"email": email}).first()
    if row:
        return jsonify({"error": "Email already registered"}), 400

    pw_hash = generate_password_hash(password)

    insert_sql = text("""
        INSERT INTO melofi_auth (email, password_hash)
        VALUES (:email, :password_hash)
    """)
    db.session.execute(insert_sql, {
        "email": email,
        "password_hash": pw_hash
    })
    db.session.commit()

    return jsonify({"message": "Registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    sql = text("""
        SELECT id, email, password_hash
        FROM melofi_auth
        WHERE email = :email
        LIMIT 1
    """)
    row = db.session.execute(sql, {"email": email}).mappings().first()
    if not row:
        return jsonify({"error": "Invalid email or password"}), 401

    if not check_password_hash(row["password_hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": row["id"],
            "email": row["email"]
        }
    }), 200
