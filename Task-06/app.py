from flask import Flask
from flask_cors import CORS
from extensions import db
from routes.search import search_bp
from routes.recent import recent_bp
from routes.liked import liked_bp 
from routes.auth import auth_bp


app = Flask(__name__)
app.config.from_object("config.Config")

CORS(app)

db.init_app(app)

app.register_blueprint(search_bp, url_prefix="/api")
app.register_blueprint(recent_bp, url_prefix="/api")
app.register_blueprint(liked_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api/auth")

if __name__ == "__main__":
    app.run(debug=True)