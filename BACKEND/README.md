For FYI:
oru kilo : 1000 grams
Kaal Kilo (1/4): 250 grams
Arai Kilo (1/2): 500 grams
Mukkala Kilo (3/4): 750 grams 

Logger :
______________________________________
| Level    | Color (default Uvicorn) |
| -------- | ----------------------- |
| DEBUG    | Blue                    |
| INFO     | Green                   |
| WARNING  | Yellow                  |
| ERROR    | Red                     |
| CRITICAL | Bright Red              |


To run the system locally:

DataBase : run the database
Backend: cd BACKEND && .\venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
Frontend: cd FRONTEND && npm run dev (running on port 3000)