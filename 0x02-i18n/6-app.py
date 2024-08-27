#!/usr/bin/env python3
"""
Flask app
"""
from flask import Flask, render_template, request, g
from flask_babel import Babel


app = Flask(__name__)


class Config:
    """
    Config class
    """
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app.config.from_object(Config)


babel = Babel(app)


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


@babel.localeselector
def get_locale():
    """
    Determine the best match with our supported languages
    """
    locale = request.args.get('locale')
    if locale and locale in app.config['LANGUAGES']:
        return locale

    user_id = request.args.get('login_as')
    user = get_user(int(user_id))
    if user and user.get('locale') in app.config['LANGUAGES']:
        return user['locale']

    # Fallback to the previous default behavior
    return request.accept_languages.best_match(app.config['LANGUAGES']) or app.config['BABEL_DEFAULT_LOCALE']


def get_user(id):
    """
    Get user by his id if user found
    """
    if id in users:
        return users[id]
    return None


@app.before_request
def before_request():
    """
    Check user is logged in before request
    """
    user_id = request.args.get('login_as')
    if user_id and user_id.isdigit():
        g.user = get_user(int(user_id))
    else:
        g.user = None


@app.route('/', strict_slashes=False)
def home():
    """
    Return the home page content through the template
    """
    return render_template('5-index.html')


if __name__ == '__main__':
    app.run(debug=True)
