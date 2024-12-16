import json
import sqlite3
import os
from typing import List, Dict, Any

def get_db_path():
    """Get the absolute path to the database file"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    return os.path.join(project_root, 'data', 'grade_distribution.db')

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
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        query = """
        SELECT * FROM grades 
        WHERE Subject = ? AND "Course No." = ?
        ORDER BY "Academic Year" DESC, Term DESC
        """
        cursor.execute(query, (subject, course_no))
        
        columns = [description[0] for description in cursor.description]
        course_data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
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
