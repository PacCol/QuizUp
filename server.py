from flask import Flask, render_template, request, url_for, redirect, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
app.config["SECRET_KEY"] = "abc"
db = SQLAlchemy()

login_manager = LoginManager()
login_manager.init_app(app)


class Users(UserMixin, db.Model):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(250), unique=True, nullable=False)
	password = db.Column(db.String(250), nullable=False)


db.init_app(app)


with app.app_context():
	db.create_all()


@login_manager.user_loader
def loader_user(user_id):
	return Users.query.get(user_id)


@app.route('/register', methods=["POST"])
def register():
	user = Users(username=request.form.get("username"),
					password=request.form.get("password"))
	db.session.add(user)
	db.session.commit()
	return redirect(url_for("login"))


@app.route("/login", methods=["POST"])
def login():
	user = Users.query.filter_by(
	    username=request.form.get("username")).first()
	if user.password == request.form.get("password"):
		login_user(user)
		return redirect(url_for("home"))


@app.route("/logout")
def logout():
	logout_user()
	return redirect(url_for("home"))


@app.route("/")
def home():
	return redirect("/home/index.html")

@app.route("/favicon.ico")
def favicon():
    return send_from_directory("static", "favicon.ico")


@app.route("/home/<path:path>")
def webApp(path):
    return send_from_directory("static", path)

if __name__ == "__main__":
	app.run()
