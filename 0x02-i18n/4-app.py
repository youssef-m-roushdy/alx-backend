#!/usr/bin/env python3
"""
Flask app
"""
from flask import Flask, render_template, request
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


@babel.localeselector
def get_locale():
    """
    Determine the best match with our supported languages
    """
    locale = request.args.get('locale')
    
    if locale and locale in app.config['LANGUAGES']:
        return locale

    # Fallback to the previous default behavior
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/', strict_slashes=False)
def home():
    """
    Return the home page content through the template
    """
    return render_template('3-index.html')


if __name__ == '__main__':
    app.run(debug=True)
