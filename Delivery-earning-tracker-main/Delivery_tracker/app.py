from flask import Flask, render_template, request, redirect
import sqlite3

app = Flask(__name__)

# Create database table
def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS earnings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        orders INTEGER,
        earnings REAL,
        fuel REAL,
        profit REAL
    )
    ''')

    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM earnings ORDER BY id DESC")
    data = cursor.fetchall()

    total_earnings = sum(row[3] for row in data)
    total_fuel = sum(row[4] for row in data)
    total_profit = sum(row[5] for row in data)

    conn.close()

    return render_template(
        'index.html',
        data=data,
        total_earnings=total_earnings,
        total_fuel=total_fuel,
        total_profit=total_profit
    )

@app.route('/add', methods=['POST'])
def add():
    date = request.form['date']
    orders = int(request.form['orders'])
    earnings = float(request.form['earnings'])
    fuel = float(request.form['fuel'])

    profit = earnings - fuel

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO earnings (date, orders, earnings, fuel, profit)
    VALUES (?, ?, ?, ?, ?)
    """, (date, orders, earnings, fuel, profit))

    conn.commit()
    conn.close()

    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
