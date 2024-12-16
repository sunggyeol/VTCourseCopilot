import pandas as pd
import os
import json

def get_udc(course: str) -> str:
    """
    Get course information from grade distribution CSV file.
    
    Args:
        course (str): Course in format "CS 3114" or "MATH 2114"
    
    Returns:
        str: JSON string containing course information
    """
    # Split the course string into subject and number
    try:
        subject, course_no = course.split()
        course_no = str(course_no)  # Convert to string to ensure consistent type
    except ValueError:
        return json.dumps([])

    # Get the absolute path to the CSV file 
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, '../../data/grade_distribution.csv')

    # Read the CSV file
    try:
        df = pd.read_csv(csv_path)
        
        # Convert Course No. to string and strip any whitespace
        df['Course No.'] = df['Course No.'].astype(str).str.strip()
        
        # Filter the dataframe based on subject and course number
        filtered_df = df[
            (df['Subject'].str.strip() == subject) & 
            (df['Course No.'].str.strip() == course_no)
        ]
        
        # Convert filtered dataframe to list of dictionaries
        result = filtered_df.to_dict('records')
        
        # Convert to JSON string
        return json.dumps(result, indent=2)
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return json.dumps([])

if __name__ == "__main__":
    # Test the function
    course = "CS 3114"
    course_info = get_udc(course)
    print(course_info)
