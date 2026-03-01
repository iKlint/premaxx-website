from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/quality')
def quality():
    return render_template('quality.html')

@app.route('/news')
def news():
    return render_template('news.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/submit-contact', methods=['POST'])
def submit_contact():
    data = request.json
    # Here you would handle email sending or DB storage
    return jsonify({'status': 'success', 'message': 'Message received!'})

if __name__ == '__main__':
    app.run(debug=True)
