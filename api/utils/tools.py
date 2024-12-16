import requests

def get_current_weather(latitude, longitude):
    # Format the URL with proper parameter substitution
    url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto"

    try:
        # Make the API call
        response = requests.get(url)

        # Raise an exception for bad status codes
        response.raise_for_status()

        # Return the JSON response
        return response.json()

    except requests.RequestException as e:
        # Handle any errors that occur during the request
        print(f"Error fetching weather data: {e}")
        return None

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
