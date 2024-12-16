import json
from typing import Dict, Any
from .ratemyprocessor import get_professor_info
from .universitydatacommons import get_course_data, get_unique_professors
from ..utils.tools import normalize_course_code

def get_course_info(course: str) -> str:
    """
    Get combined course and professor information
    
    Args:
        course (str): Course in format "CS 3114" or "MATH 2114"
        
    Returns:
        str: JSON string containing combined course and professor information
    """
    try:
        # Parse and normalize course code
        normalized_course = normalize_course_code(course)
        subject, course_no = normalized_course.split()
        course_no = int(course_no)
        
        # Get course data
        course_data = get_course_data(subject, course_no)
        if not course_data:
            return json.dumps({"error": "No course data found", "course_info": [], "professor_info": []})
        
        # Get professor information
        professors_data = []
        for professor_name in get_unique_professors(course_data):
            try:
                prof_data = get_professor_info(professor_name)
                if isinstance(prof_data, str):
                    prof_data = json.loads(prof_data)
                if prof_data:
                    professors_data.append(prof_data)
            except Exception as e:
                print(f"Error getting professor info for {professor_name}: {e}")
                continue
        
        # Combine and return data
        return json.dumps({
            "course_info": course_data,
            "professor_info": professors_data
        }, indent=2)
        
    except Exception as e:
        print(f"Error in get_course_info: {e}")
        import traceback
        traceback.print_exc()
        return json.dumps({"error": str(e), "course_info": [], "professor_info": []})

if __name__ == "__main__":
    course = "CS 2506"
    result_db = get_course_info(course)
    with open("course_info_db_"+course+".json", "w") as f:
        f.write(result_db)
