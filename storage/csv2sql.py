import sqlite3
import pandas as pd
import os

# Get the current directory (shsould be the 'data' directory)
current_dir = os.path.dirname(os.path.abspath(__file__))

# Load the CSV file from the data directory
file_path = os.path.join(current_dir, 'grade_distribution_new.csv')
data = pd.read_csv(file_path)

# Create database in the data directory
db_path = os.path.join(current_dir, 'grade_distribution.db')

# Create a connection to SQLite database using the correct path
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Define the table name
table_name = 'grades'

# Create table with appropriate schema
create_table_query = f'''
CREATE TABLE IF NOT EXISTS {table_name} (
    academic_year TEXT,
    term TEXT,
    subject TEXT,
    course_no INTEGER,
    course_title TEXT,
    instructor TEXT,
    gpa REAL,
    a_percent REAL,
    a_minus_percent REAL,
    b_plus_percent REAL,
    b_percent REAL,
    b_minus_percent REAL,
    c_plus_percent REAL,
    c_percent REAL,
    c_minus_percent REAL,
    d_plus_percent REAL,
    d_percent REAL,
    d_minus_percent REAL,
    f_percent REAL,
    withdraws INTEGER,
    graded_enrollment INTEGER,
    crn INTEGER,
    credits INTEGER
);
'''

cursor.execute(create_table_query)

# Insert data into the SQLite table
data.to_sql(table_name, conn, if_exists='replace', index=False)

# Commit and close the connection
conn.commit()
conn.close()

print(f"Data successfully converted to SQLite database: {db_path}")