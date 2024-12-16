import json
import sqlite3
import os
from .universitydatacommons import get_udc
from .ratemyprocessor import get_professor_info
from ..utils.tools import normalize_course_code

def get_db_path():
    """Get the absolute path to the database file"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up two levels from services: services -> api -> project root
    project_root = os.path.dirname(os.path.dirname(current_dir))
    return os.path.join(project_root, 'data', 'grade_distribution.db')

def get_course_info(course: str) -> str:
    """
    Get combined course and professor information from SQLite database
    
    Args:
        course (str): Course in format "CS 3114" or "MATH 2114"
        
    Returns:
        str: JSON string containing combined course and professor information
    """
    try:
        normalized_course = normalize_course_code(course)
        # Parse subject and course number
        subject, course_no = normalized_course.split()
        course_no = int(course_no)
        
        # Use the correct database path
        db_path = get_db_path()
        print(f"Querying for {subject} {course_no}")  # Debug log
        
        # Connect to SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Query course information
        query = """
        SELECT * FROM grades 
        WHERE Subject = ? AND "Course No." = ?
        ORDER BY "Academic Year" DESC, Term DESC
        """
        cursor.execute(query, (subject, course_no))
        
        # Convert query results to list of dictionaries
        columns = [description[0] for description in cursor.description]
        course_data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        print(f"Found {len(course_data)} course entries")  # Debug log
        
        if not course_data:
            print("No course data found")
            return json.dumps({"error": "No course data found", "course_info": [], "professor_info": []})
            
        # Get unique professor names
        professor_names = list(set(entry.get('Instructor', '') for entry in course_data))
        print(f"Found professors: {professor_names}")  # Debug log
        
        # Get professor info for each unique professor from RateMyProfessor
        professors_data = []
        for professor_name in professor_names:
            if professor_name and professor_name.strip():  # Only process non-empty names
                try:
                    prof_data = get_professor_info(professor_name)
                    if prof_data:  # Only add if we got valid professor data
                        # Parse the string as JSON if it's a string
                        if isinstance(prof_data, str):
                            try:
                                prof_data = json.loads(prof_data)
                            except json.JSONDecodeError:
                                continue
                        professors_data.append(prof_data)
                        print(f"Added professor data for {professor_name}")  # Debug log
                except Exception as e:
                    print(f"Error getting professor info for {professor_name}: {e}")
                    continue
        
        # Combine the data
        combined_data = {
            "course_info": course_data,
            "professor_info": professors_data
        }
        
        conn.close()
        result = json.dumps(combined_data, indent=2)
        print(f"Returning data with {len(course_data)} courses and {len(professors_data)} professors")  # Debug log
        return result
        
    except Exception as e:
        print(f"Error in get_course_info: {e}")
        import traceback
        traceback.print_exc()  # Print full stack trace
        return json.dumps({"error": str(e), "course_info": [], "professor_info": []})

if __name__ == "__main__":
    course = "CS 2506"
    result_db = get_course_info(course)
    with open("course_info_db_"+course+".json", "w") as f:
        f.write(result_db)
