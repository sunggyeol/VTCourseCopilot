import json
from udc.universitydatacommons import get_udc
from rmp.ratemyprocessor import get_professor_info

def get_course_info(course: str) -> str:
    """
    Get combined course and professor information
    
    Args:
        course (str): Course in format "CS 3114" or "MATH 2114"
        
    Returns:
        str: JSON string containing combined course and professor information
    """
    try:
        # Get course info first
        course_data = json.loads(get_udc(course))
        
        # Check if we have any course data
        if not course_data or len(course_data) == 0:
            return json.dumps({"course_info": [], "professor_info": []})
        
        # Get unique professor names from all course entries
        professor_names = list(set(entry.get('Instructor', '') for entry in course_data))
        
        # Get professor info for each unique professor
        professors_data = []
        for professor_name in professor_names:
            if professor_name:  # Only process if professor name is not empty
                prof_data = json.loads(get_professor_info(professor_name))
                if prof_data:  # Only add if we got valid professor data
                    professors_data.append(prof_data)
        
        # Combine the data
        combined_data = {
            "course_info": course_data,
            "professor_info": professors_data
        }
        
        return json.dumps(combined_data, indent=2)
        
    except Exception as e:
        print(f"Error getting combined info: {e}")
        return json.dumps({"course_info": [], "professor_info": []})

if __name__ == "__main__":
    # Test the function
    course = "CS 3114"
    result = get_course_info(course)
    print(result)
