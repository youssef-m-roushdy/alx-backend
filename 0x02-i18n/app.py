#!/usr/bin/env python3
"""
Flask app
"""
from flask import Flask, render_template, request, g
from flask_babel import Babel
import pytz
from pytz.exceptions import UnknownTimeZoneError
from datetime import datetime


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
    Determine the best match with our supported languages in the order of:
    1. Locale from URL parameters
    2. Locale from user settings
    3. Locale from request header
    4. Default locale
    """
    locale = request.args.get('locale')
    if locale and locale in app.config['LANGUAGES']:
        return locale

    user_id = request.args.get('login_as')
    if user_id and user_id.isdigit():
        user = get_user(int(user_id))
        if user and user.get('locale') in app.config['LANGUAGES']:
            return user['locale']

    # Fallback to the previous default behavior
    locale = request.accept_languages.best_match(app.config['LANGUAGES'])
    if locale:
        return locale

    # Default locale
    return app.config['BABEL_DEFAULT_LOCALE']


@babel.timezoneselector
def get_timezone():
    """
    Determine the best match with our supported time zones in the order of:
    1. Timezone from URL parameters
    2. Timezone from user settings
    3. Default timezone
    """
    timezone = request.args.get('timezone')
    if timezone:
        try:
            pytz.timezone(timezone)
            return timezone
        except UnknownTimeZoneError:
            pass

    user_id = request.args.get('login_as')
    if user_id and user_id.isdigit():
        user = get_user(int(user_id))
        if user and user.get('timezone'):
            try:
                pytz.timezone(user['timezone'])
                return user['timezone']
            except UnknownTimeZoneError:
                pass

    # Default timezone
    return app.config['BABEL_DEFAULT_TIMEZONE']


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
    Check if the user is logged in before each request and set the user's timezone.
    """
    user_id = request.args.get('login_as')
    if user_id and user_id.isdigit():
        user = get_user(int(user_id))
        g.user = user
        if user and user.get('timezone'):
            try:
                user_timezone = pytz.timezone(user['timezone'])
                g.time = datetime.now(user_timezone)
            except UnknownTimeZoneError:
                g.time = None
        else:
            g.time = None
    else:
        g.user = None
        g.time = None

    print(g.time)

@app.route('/', strict_slashes=False)
def home():
    """
    Return the home page content through the template
    """
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
