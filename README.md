## GitHub Repository

Repository: https://github.com/p240001/research-opportunity-portal







# University Research Opportunity Portal

A beginner-friendly assignment project using Python, Flask, MySQL, HTML, CSS, and JavaScript.

## Features

- Create, list, view, update, and delete research opportunities.
- Change status between `Open` and `Closed`.
- Validate required fields and return appropriate HTTP status codes.
- Store records in MySQL rather than hard-coding them in the frontend.
- Test the API using the included Postman collection.

## Requirements

- Windows 10 or later
- Python 3.12 (or another compatible Python 3 version)
- MySQL Server
- MySQL Workbench (recommended)
- Postman

## Setup on Windows PowerShell

1. Open PowerShell in this project folder.
2. Create and activate a virtual environment:

   ```powershell
   py -m venv .venv
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\.venv\Scripts\Activate.ps1
   ```

   The execution-policy command applies only to the current PowerShell process. Alternatively, use `.\.venv\Scripts\python.exe` without activating.

3. Install packages:

   ```powershell
   python -m pip install -r requirements.txt
   ```

4. In MySQL Workbench, open `schema.sql` and execute it. This creates the `research_portal` database and `opportunities` table.

5. Set your local database environment variables in PowerShell. Replace the example password with your own MySQL password:

   ```powershell
   $env:DB_HOST="127.0.0.1"
   $env:DB_PORT="3306"
   $env:DB_USER="root"
   $env:DB_PASSWORD="YOUR_LOCAL_MYSQL_PASSWORD"
   $env:DB_NAME="research_portal"
   ```

   Do not commit real passwords to GitHub. `.env.example` is only a template; the app does not automatically load it.

6. Start Flask:

   ```powershell
   python app.py
   ```

7. Open `http://127.0.0.1:5000` in your browser.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/opportunities` | Create |
| GET | `/api/opportunities` | Retrieve all |
| GET | `/api/opportunities/<id>` | Retrieve one |
| PUT | `/api/opportunities/<id>` | Update one or more fields |
| DELETE | `/api/opportunities/<id>` | Delete |

## Example JSON for POST

```json
{
  "research_title": "AI for Healthcare",
  "research_description": "Explore machine learning methods for medical research.",
  "research_area": "Artificial Intelligence",
  "faculty_name": "Dr. Example",
  "department": "Computer Science",
  "required_skills": "Python, machine learning",
  "available_positions": 3,
  "application_deadline": "2026-11-30",
  "status": "Open"
}
```

Use realistic test data when demonstrating the project. The example is not inserted automatically.

## HTTP status codes

- `200 OK`: successful read, update, or delete.
- `201 Created`: successful creation.
- `400 Bad Request`: invalid or missing data.
- `404 Not Found`: opportunity or API endpoint does not exist.
- `500 Internal Server Error`: database/server failure.

## Postman testing

Import `postman/research-opportunity-portal.postman_collection.json` into Postman. Run the requests in order, create at least three records, and update the `opportunityId` collection variable to an ID returned by a create request. The final requests demonstrate a missing/deleted record (404) and invalid data (400).

## Notes

- The API uses parameterized SQL values to reduce SQL-injection risk.
- Configure your own database credentials through environment variables.
- Keep `.venv/`, passwords, and private credentials out of the repository.
- This is an educational local project, not a production-hardened deployment.
