# On importe les modules necessaires au server et à la base de donnée
from flask import Flask, request, redirect, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user

# On initialise le serveur
app = Flask(__name__)

# On initialise la base de données
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
app.config["SECRET_KEY"] = "abc"
db = SQLAlchemy()

# On initialise le gestionnaire de connexion, qu'on associe au serveur Flask
login_manager = LoginManager()
login_manager.init_app(app)

# On créé un objet User et on créé un tableau contenant les utilisateurs
class Users(UserMixin, db.Model):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(250), unique=1, nullable=False)
	password = db.Column(db.String(250), nullable=False)

# On créé un objet quiz contenant les quizs créés par les utilisateur et on créé un tableau les contenant
class Quizs(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(250), unique=False, nullable=False)
	user_id = db.Column(db.Integer, nullable=False)
	username = db.Column(db.String(250), nullable=False)
	theme = db.Column(db.Integer, nullable=False)
	questions_number = db.Column(db.Integer, nullable=False)
	questions = db.Column(db.String(2250), nullable=False)
	responses = db.Column(db.String(6000), nullable=False)

# On associe la base de données au serveur Flask
db.init_app(app)

# On continue l'initialisation de la base de donnée 
with app.app_context():
	db.create_all()
	#admin_user = Users(username="admin", password="admin")
	#db.session.add(admin_user)
	#db.session.commit()

# On charge les données de l'utilisateur à chaque requête
@login_manager.user_loader
def loader_user(user_id):
	return Users.query.get(user_id)

# On crée la route d'inscription au site
@app.route("/register", methods=["POST"])
def register():
	user = Users(username=request.json["username"], password=request.json["password"])
	db.session.add(user)
	db.session.commit()
	return "success"

# On crée une route pour pouvoir afficher les informations de l'utilisateur
@login_required
@app.route("/user")
def getuseremail():
	return str(loader_user(current_user.id).username)

# On crée la route de connexion au site
@app.route("/login", methods=["POST"])
def login():
	user = Users.query.filter_by(username=request.json["username"]).first()
	if user.password == request.json["password"]:
		login_user(user)
		return "success"
	else:
		return "error"

# On crée la route de déconnexion au site
@app.route("/logout")
def logout():
	logout_user()
	return "success"

# On crée la route pour créer un quiz
@login_required
@app.route("/create", methods=["POST"])
def create():
	currentUser = loader_user(current_user.id)
	if 1 <=request.json["theme"] <= 5:
		quiz = Quizs(name=request.json["name"], user_id=currentUser.id, username=currentUser.username, theme=request.json["theme"], questions_number=int(request.json["questionsNumber"]), questions=request.json["questions"], responses=request.json["responses"])
		db.session.add(quiz)
		db.session.commit()
		return "success"
	else:
		return "error"

# On crée une route pour pouvoir afficher les quizs
@app.route("/quizs")
def getquizs():
	table_data = []
	all_records = Quizs.query.all()[::-1]
	for record in all_records:
		table_data.append({
        	'id': record.id,
			'name': record.name,
			'user_id': record.user_id,
			'username': record.username,
			'theme': record.theme,
			'questions_number': record.questions_number

        })
	return jsonify(table_data)

# On crée une route pour obtenir les données d'un quiz en particulier
@app.route("/quiz",methods=['GET'])
def getquiz():
	quiz_id = request.args.get('id', None)
	if quiz_id is None:
		abort(404)
	else:
		record = Quizs.query.filter_by(id=quiz_id)[0]
		table_data = {
			'id': record.id,
			'name': record.name,
			'user_id': record.user_id,
			'username': record.username,
			'theme': record.theme,
			'questions_number': record.questions_number,
			'questions': record.questions,
			'responses': record.responses

		}
		return jsonify(table_data)


# On crée la route de redirection à la page d'accueil du site
@app.route("/")
def home():
	return redirect("/home/index.html")

# On charge l'icone du site
@app.route("/favicon.ico")
def favicon():
    return send_from_directory("static/ing", "favicon.ico")

# On charge les fichiers HTML, CSS et JS sur les pages
@app.route("/home/<path:path>")
def webApp(path):
    return send_from_directory("static", path)

# On démarre le site
app.run("0.0.0.0", debug=True)

# On crée une route pour afficher la progression des utilisateurs
@login_required
@app.route("/progress", methods=['GET'])
def progress():
	currentUser = loader_user(current_user.id)
	return ""