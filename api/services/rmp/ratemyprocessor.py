import ratemyprofessor
import json

def get_professor_info(professor_name: str) -> str:
    """
    Get professor information from RateMyProfessor
    
    Args:
        professor_name (str): Name of professor
        
    Returns:
        str: JSON string containing professor information
    """
    try:
        # Get professor info from RMP
        professor = ratemyprofessor.get_professor_by_school_and_name(
            ratemyprofessor.get_school_by_name("Virginia Tech"), professor_name)
        
        if professor is not None and professor.school.name == "Virginia Tech":
            # Create dictionary with professor info
            prof_data = {
                "name": professor.name,
                "department": professor.department,
                "school": professor.school.name,
                "rating": professor.rating,
                "difficulty": professor.difficulty,
                "num_ratings": professor.num_ratings,
                "would_take_again": round(professor.would_take_again, 1) if professor.would_take_again is not None else None
            }
            return json.dumps(prof_data, indent=2)
        else:
            return json.dumps({})
            
    except Exception as e:
        print(f"Error getting professor info: {e}")
        return json.dumps({})

if __name__ == "__main__":
    # Test the function
    professor_name = "Hamouda"
    prof_info = get_professor_info(professor_name)
    print(prof_info)
