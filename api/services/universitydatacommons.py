import json
import sqlite3
import os
from typing import List, Dict, Any

def init_storage_directories():
    """Initialize storage directory structure"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    
    # Create storage directories
    storage_paths = {
        'storage': os.path.join(project_root, 'storage'),
        'db': os.path.join(project_root, 'storage', 'db'),
        'raw': os.path.join(project_root, 'storage', 'raw'),
        'cache': os.path.join(project_root, 'storage', 'cache'),
        'exports': os.path.join(project_root, 'storage', 'exports')
    }
    
    for path in storage_paths.values():
        if not os.path.exists(path):
            os.makedirs(path)
            print(f"Created directory: {path}")
    
    return storage_paths

def get_db_path():
    """Get the absolute path to the database file"""
    try:
        storage_paths = init_storage_directories()
        db_path = os.path.join(storage_paths['db'], 'grade_distribution_subject.db')
        
        if not os.path.exists(db_path):
            print(f"Warning: Database file not found at {db_path}")
        return db_path
    except Exception as e:
        print(f"Error setting up database path: {e}")
        raise

def get_course_data(subject: str, course_no: int) -> List[Dict[str, Any]]:
    """
    Get course data from SQLite database
    
    Args:
        subject (str): Course subject (e.g., 'CS')
        course_no (int): Course number (e.g., 3114)
        
    Returns:
        List[Dict[str, Any]]: List of course entries
    """
    try:
        db_path = get_db_path()
        if not os.path.exists(db_path):
            print(f"Error: Database file not found at {db_path}")
            return []
            
        print(f"Connecting to database at: {db_path}")
        conn = sqlite3.connect(db_path)
        print("Successfully connected to the database")
        
        cursor = conn.cursor()
        table_name = f"subj_{subject.upper()}"
        
        # Try the new table format first
        try:
            query = f"""
            SELECT * FROM {table_name}
            WHERE subject = ? AND course_no = ?
            ORDER BY academic_year DESC, term DESC
            """
            cursor.execute(query, (subject, course_no))
            
        except sqlite3.OperationalError:
            # If new format fails, try the old format
            print("Falling back to old table format...")
            query = """
            SELECT * FROM grades 
            WHERE Subject = ? AND "Course No." = ?
            ORDER BY "Academic Year" DESC, Term DESC
            """
            cursor.execute(query, (subject, course_no))
        
        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()
        
        # Convert column names to match the old format if needed
        column_mapping = {
            'academic_year': 'Academic Year',
            'term': 'Term',
            'subject': 'Subject',
            'course_no': 'Course No.',
            'course_title': 'Course Title',
            'instructor': 'Instructor',
            'gpa': 'GPA',
            'a_percent': 'A (%)',
            'a_minus_percent': 'A- (%)',
            'b_plus_percent': 'B+ (%)',
            'b_percent': 'B (%)',
            'b_minus_percent': 'B- (%)',
            'c_plus_percent': 'C+ (%)',
            'c_percent': 'C (%)',
            'c_minus_percent': 'C- (%)',
            'd_plus_percent': 'D+ (%)',
            'd_percent': 'D (%)',
            'd_minus_percent': 'D- (%)',
            'f_percent': 'F (%)',
            'withdraws': 'Withdraws',
            'graded_enrollment': 'Graded Enrollment',
            'crn': 'CRN',
            'credits': 'Credits'
        }
        
        # Map the column names back to the original format
        mapped_columns = [column_mapping.get(col, col) for col in columns]
        course_data = [dict(zip(mapped_columns, row)) for row in rows]
        
        print("Closing database connection")
        conn.close()
        return course_data
        
    except Exception as e:
        print(f"Error in get_course_data: {e}")
        return []

def get_unique_professors(course_data: List[Dict[str, Any]]) -> List[str]:
    """Extract unique professor names from course data"""
    return list(set(entry.get('Instructor', '') 
                   for entry in course_data 
                   if entry.get('Instructor', '').strip()))
