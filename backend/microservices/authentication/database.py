from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base

 

import urllib

params = urllib.parse.quote_plus("driver={ODBC Driver 17 for SQL Server}; server=192.168.138.122,1433; database=users;Trusted_Connection=yes;UID=sa ;PWD=")
engine = create_engine("mssql+pyodbc:///?odbc_connect=%s" % params)

 
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
