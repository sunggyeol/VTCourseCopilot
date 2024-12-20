def normalize_course_code(course_code: str) -> str:
    """Normalize course code to standard format (e.g., 'CS 3114')"""
    # Remove all spaces and convert to uppercase
    code = course_code.upper().replace(" ", "")
    
    # Find the position where numbers start
    for i, char in enumerate(code):
        if char.isdigit():
            # Insert space between department code and course number
            return f"{code[:i]} {code[i:]}"
    
    return code
