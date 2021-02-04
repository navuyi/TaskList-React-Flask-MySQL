import datetime
import hashlib
import math

from flask import Flask
from flask_mysqldb import MySQL
from flask import jsonify
from flask import request
from flask import abort

from flask_cors import CORS, cross_origin
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required,
                                get_jwt_identity, get_raw_jwt)
from flask_jwt_extended import JWTManager


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['CORS_SUPPORTS_CREDENTIALS'] = 'True'

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'cisco'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_DB'] = 'task_list'
app.config['MSQL_CURSORCLASS'] = 'DictCursor'
app.config['JWT_SECRET_KEY'] = 'cisco'

mysql = MySQL(app)
jwt = JWTManager(app)
 
def hash_password(password):
    """Hash a password for storing."""
    return hashlib.sha256(password.encode()).hexdigest()




@app.route('/register', methods=['POST'])
@cross_origin()
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    # Hash password
    pwdhash = hash_password(password)

    cur = mysql.connection.cursor()
    statement = f''' INSERT INTO users (username, password) VALUES (%s, %s) '''
    insert_tuple = (username, pwdhash)
    cur.execute(statement, insert_tuple)
    mysql.connection.commit()

    return jsonify("Account created!"), 204


@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    username = request.json.get('username');
    password = request.json.get('password');

    print(username)
    print(password)
    # Fetch account data from database
    cur = mysql.connection.cursor()
    statement = f''' SELECT id, username, password FROM users WHERE username = %s '''
    insert_tuple = (username,)
    cur.execute(statement, insert_tuple)
    result = cur.fetchall()

    # Check if user exists
    if(len(result) == 0):
        return "User does not exist", 404

    db_id = result[0][0]
    db_username = result[0][1]
    db_password = result[0][2]

    # Check if password hashes are the same 
    if(hash_password(password)==db_password):
        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)
        return{
            'id': db_id,
            'username': db_username,
            'access_token': access_token,
            'refresh_token': refresh_token
        }, 200
    else:
        return "Access denied", 401

@app.route('/newTask', methods=['POST'])
@cross_origin()
@jwt_required
def newTask():
    user_id = request.json.get("id")
    task = request.json.get("task");

    cur = mysql.connection.cursor()
    statement = f''' INSERT INTO tasks (user_id, task, is_done) VALUES (%s, %s, %s) '''
    insert_tuple = (user_id, task, 0)
    cur.execute(statement, insert_tuple)
    mysql.connection.commit()

    return jsonify("New task created!"), 204

@app.route("/taskList", methods=['POST'])
@cross_origin()
@jwt_required
def taskList():
    user_id = request.json.get("id")
    cur = mysql.connection.cursor()
    statement = f''' SELECT id, task, is_done FROM tasks WHERE user_id = %s '''
    insert_tuple = (user_id,)
    cur.execute(statement, insert_tuple)
    result = cur.fetchall()
    
    return jsonify(result), 200


@app.route("/deleteTask", methods=['POST'])
@cross_origin()
@jwt_required
def deleteTask():
    task_id = request.json.get("task_id")
    cur = mysql.connection.cursor()
    statement = f''' DELETE FROM tasks WHERE id= %s '''
    insert_tuple = (task_id,)
    cur.execute(statement, insert_tuple)
    mysql.connection.commit()

    return jsonify("Task deleted"), 204

@app.route("/confirmTask", methods=['POST'])
@cross_origin()
@jwt_required
def confirmTask():
    task_id = request.json.get("task_id")
    cur = mysql.connection.cursor()
    statement = f''' UPDATE tasks SET is_done=1 WHERE id= %s'''
    insert_tuple = (task_id,)
    cur.execute(statement, insert_tuple)
    mysql.connection.commit()

    return jsonify("Task deleted"), 204


@app.route('/refresh_token', methods=['GET'])
@cross_origin()
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()
    response = {
        "access_token": create_access_token(identity=current_user)
    }
    return jsonify(response), 200