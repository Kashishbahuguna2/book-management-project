# Book Management Application

## What This Project Does

This project is a full-stack book management application:

- `Server/` contains a Flask REST API for creating, reading, updating, and deleting books.
- `Server/books.db` is a SQLite database created automatically when the Flask application starts.
- `Client/` contains the React user interface for viewing and managing books.
- `Server/tests/` and `Client/tests/` contain API, backend, and browser end-to-end tests.

The backend runs at `http://127.0.0.1:5001` and the React development server runs at `http://localhost:5173`.

## Prerequisites

Install the following before starting:

- Python 3.8 or newer
- Node.js 16 or newer and npm
- Git, if cloning the repository

No PostgreSQL installation is required for the current Flask application. The application uses SQLite through Python's built-in `sqlite3` module.

## Initial Setup

### 1. Create a Python virtual environment

From the repository root:

```bash
cd Server
python3 -m venv .venv
source .venv/bin/activate
```

The `.venv` keeps project packages separate from the operating system Python. This prevents the `externally-managed-environment` error that can occur when installing packages into a system-managed Python installation.

On Windows PowerShell, activate it with:

```powershell
.venv\Scripts\Activate.ps1
```

### 2. Install Python dependencies

Run this from `Server/` while `.venv` is active:

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

The requirements include Flask, CORS support, API documentation support, the pytest test runner, JSON test reporting, and the pandas/Jinja2 packages used to build the unified report.

### 3. Install frontend and Newman dependencies

Install the React and Playwright packages:

```bash
cd ../Client
npm ci
npx playwright install chromium
```

Install the Newman API testing packages:

```bash
cd ../Server/tests/postman_newman
npm ci
```

Use `npm install` instead of `npm ci` if the corresponding lock file is not present.

## Run the Application

### Start the Flask API

From `Server/`, with `.venv` active:

```bash
python app.py
```

The API starts on `http://127.0.0.1:5001`. The database file `Server/books.db` and its `book` table are initialized automatically.

Useful endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Return all books |
| `POST` | `/create` | Create a book |
| `PUT` | `/update/<id>` | Update a book |
| `DELETE` | `/delete/<id>` | Delete a book |
| `GET` | `/health` | Check API and database health |

### Start the React client

In a second terminal:

```bash
cd Client
npm run dev
```

Open `http://localhost:5173` in a browser. The client uses the Flask API at port `5001`.

## Test Suites

The repository has three complementary test layers. They intentionally test different boundaries of the application.

### 1. Pytest: backend and API behavior

Pytest runs the Flask application through its test client, without requiring the Flask HTTP server to be running. The tests cover:

- Health and list-book behavior
- Valid and invalid book creation
- Missing fields, invalid costs, invalid dates, and non-JSON requests
- Book updates and missing-book responses
- Book deletion and missing-book responses
- Simulated database failures
- Global `404` and `405` error handling

Run from the repository root:

```bash
cd Server
source .venv/bin/activate
bash run-pytest.sh
```

Or run pytest directly:

```bash
python -m pytest tests/pytest/ -v \
  --json-report \
  --json-report-file=tests/pytest/pytest-report.json \
  --tb=short
```

The JSON result is written to `Server/tests/pytest/pytest-report.json`. Test markers are defined in `Server/pytest.ini`, including `create_api`, `update_api`, `delete_api`, `db_failure`, and `global_error`.

### 2. Postman-Newman: live REST API contract testing

Newman runs the exported Postman collection against the running Flask server. It validates the API over real HTTP, including request payloads, response status codes, response data, CRUD flows, and negative cases. The collection uses the environment value `base_url=http://127.0.0.1:5001`.

Start the Flask API first, then run these commands in another terminal:

```bash
cd Server/tests/postman_newman
npm test
```

For the enhanced dashboard:

```bash
npm run test:enhanced
```

Newman produces:

- `newman-result.json` for automated report processing
- `newman-standard-report.html` for the standard run
- `newman-enhanced-report.html` for the enhanced run with charts and analytics

The collection and environment are stored in `Server/tests/postman_newman/`.

### 3. Playwright: browser end-to-end testing

Playwright tests the application as a user would use it in Chromium. It verifies page navigation, book-list rendering, create-book forms, update flows, and complete UI CRUD journeys. The Playwright configuration starts the Vite development server automatically when one is not already running.

From `Client/`:

```bash
npm test
```

Useful variants:

```bash
npm run test:headed
npm run test:debug
npm run test:ui
npm run test:report
```

Playwright tests require the Flask API to be running because the browser makes real requests to the backend. The HTML report is written to `Client/playwright-report/`.

## Generate the Unified Report

Run the backend and Newman tests first so their result files exist. Then, from `Server/` with `.venv` active:

```bash
python tests/unified_report/test-report-generator.py
```

Or use the helper script:

```bash
bash generate-unified-report.sh
```

The generator combines the pytest JSON output, Newman JSON output, and the formal test plan in `Server/tests/Flask_CRUD_TestPlan_44TCs.csv`. It reports pass/fail results, failed test details, Newman-to-test-case mapping, and automation coverage.

The generated report is saved to `Server/tests/unified_report/comprehensive-test-report.html`.

## Recommended Complete Workflow

Use three terminals after the initial setup:

```bash
# Terminal 1: Flask API
cd Server
source .venv/bin/activate
python app.py
```

```bash
# Terminal 2: React client
cd Client
npm run dev
```

```bash
# Terminal 3: backend and API tests
cd Server
source .venv/bin/activate
bash run-pytest.sh
cd tests/postman_newman
npm test
```

Run the browser tests from a fourth terminal, or after the API tests finish:

```bash
cd Client
npm test
```

After the backend and Newman runs:

```bash
cd Server
source .venv/bin/activate
bash generate-unified-report.sh
```

## Troubleshooting

### `externally-managed-environment`

Do not install with the system `pip`. Create and activate `Server/.venv`, then use:

```bash
python -m pip install -r Server/requirements.txt
```

### API connection failures

Confirm the Flask process is running and check:

```bash
curl http://127.0.0.1:5001/health
```

### Playwright browser is missing

From `Client/`, install the Chromium browser:

```bash
npx playwright install chromium
```

### Stale local data

The SQLite database is `Server/books.db`. Stop the application before removing it if a clean local database is required:

```bash
rm Server/books.db
```

The next application start recreates the database and table.
