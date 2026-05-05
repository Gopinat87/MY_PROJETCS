from flask import Flask, render_template, request, redirect, session
import pymysql

app = Flask(__name__)
app.secret_key = "secret123"

db = pymysql.connect(
    host="localhost",
    user="root",
    password="1234",
    database="bank_db"
)

# Home
@app.route('/')
def home():
    return redirect('/login')

# Register
@app.route('/register', methods=['GET','POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        cursor = db.cursor()
        cursor.execute("INSERT INTO users(username,password) VALUES(%s,%s)", (username,password))
        db.commit()

        return redirect('/login')
    return render_template('register.html')

# Login
@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        cursor = db.cursor()
        cursor.execute("SELECT * FROM users WHERE username=%s AND password=%s", (username,password))
        user = cursor.fetchone()

        if user:
            session['user'] = username
            return redirect('/dashboard')

    return render_template('login.html')

# Dashboard
@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect('/login')

    cursor = db.cursor()
    cursor.execute("SELECT balance FROM users WHERE username=%s", (session['user'],))
    balance = cursor.fetchone()[0]

    return render_template('dashboard.html', balance=balance)

# Transfer
@app.route('/transfer', methods=['GET','POST'])
def transfer():
    if request.method == 'POST':
        receiver = request.form['receiver']
        amount = int(request.form['amount'])

        cursor = db.cursor()

        # Deduct sender
        cursor.execute("UPDATE users SET balance = balance - %s WHERE username=%s", (amount, session['user']))

        # Add receiver
        cursor.execute("UPDATE users SET balance = balance + %s WHERE username=%s", (amount, receiver))

        # Save transaction
        cursor.execute("INSERT INTO transactions(sender,receiver,amount) VALUES(%s,%s,%s)",
                       (session['user'], receiver, amount))

        db.commit()

        return redirect('/dashboard')

    return render_template('transfer.html')

# History
@app.route('/history')
def history():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM transactions WHERE sender=%s", (session['user'],))
    data = cursor.fetchall()

    return render_template('history.html', data=data)

# Logout
@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/login')

if __name__ == '__main__':
    app.run(debug=True)