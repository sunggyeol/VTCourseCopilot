# VT Course Copilot

An intelligent assistant for Virginia Tech students to find the best professors and make informed decisions about their courses.

Hosted at [http://vtcopilot.com](http://vtcopilot.com).

This project is built on top of [ai-sdk-preview-python-streaming](https://github.com/vercel-labs/ai-sdk-preview-python-streaming).

**Disclaimer: This project is not officially affiliated with or endorsed by Virginia Tech.**

## Features

- Professor recommendations based on comprehensive data analysis
- Integration with University Data Commons for grade distribution
- Rate My Professors data integration

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- AWS EC2 (deployment)
- FastAPI
- SQLite

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/VTCourseCopilot.git
```

2. Sign up for accounts with the AI providers you want to use (e.g., OpenAI, Anthropic).

3. Obtain API keys for each provider.

4. Set the required environment variables as shown in the .env.example file, but in a new file called .env.

5. Install the required Node dependencies:
```bash
pnpm install
```

6. Create a virtual environment:
```bash
virtualenv venv
```

7. Activate the virtual environment:
```bash
source venv/bin/activate
```

8. Install the required Python dependencies:
```bash
pip install -r requirements.txt
```

9. Run the development server:
```bash
pnpm dev
```

10. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

Feel free to submit issues and enhancement requests. We are also looking for a frontend developer to join our team.

## Contact

Created by [Sung Oh](https://www.sunggyeol.com) - feel free to contact me!

## License

This project is licensed under the MIT License.

## Future Plans

- Incorporate all Virginia Tech domain-specific datasets
- Expand to become VT Copilot, not just VT Course Copilot
