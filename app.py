import os

import pandas as pd
import numpy as np
import json
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/energy_db.sqlite" 
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

print(Base.classes.keys())

# Save references to each table
country = Base.classes.TEP_countries
region = Base.classes.TEP_regions


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/countries")
def country_names():
    """Return a list of country names."""
    # Use Pandas to perform the sql query
    stmt = db.session.query(country).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (country names)
    return jsonify(list(df.columns)[1:])


@app.route("/regions")
def region_names():
    """Return a list of region names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(region).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (region names)
    return jsonify(list(df.columns)[1:])



@app.route("/countries/<year>")
def countries(year):
    stmt = db.session.query(country).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    df1 = df.loc[lambda df: df['Year'] == year]
    year_data = df1.drop(['Year'], axis=1)
    # Format the data to send as json
    country_data = {
        "yearKey" : year_data.values.tolist()
    }
    return jsonify(country_data)

@app.route("/regions/<year>")
def regions(year):
    stmt = db.session.query(region).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    df1 = df.loc[lambda df: df['Year'] == year]
    year_data = df1.drop(['Year'], axis=1)
    # Format the data to send as json
    region_data = {
        "yearKey" : year_data.values.tolist()
    }
    return jsonify(region_data)


@app.route("/geojson")
def geojson():
    parent_path = '\\'.join(os.path.realpath(__file__).split('\\')[:-1])
    file_path = os.path.join(parent_path, 'resources\\mymap.geo.json')
    with open(file_path, 'r') as file_data:
        json_data = json.load(file_data)

    return jsonify(json_data)

@app.route("/years")

def years():

    year_list = range(1990,2017)

    years = ["{0}".format(year) for year in year_list]

    return jsonify(years)

if __name__ == "__main__":
    app.run()
