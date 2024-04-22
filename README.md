# PitchPro

## Installations
Installations steps are only necessary if the application is being run locally.
### Backend
All Python requirements can be installed using requirements.txt in the backend directory
```
pip install -r requirements.txt
```
### Frontend
All React requirements can be installed using package.json in the frontend directory. **The following command should be run from the frontend directory.**
```
npm install
```
## Running the application

### Docker
From the base directory run the following. Docker performs all module/library installs during the build.
```
docker-compose up --build
```
### Local
Running the application locally requires two terminals
#### Frontend
The following command need to be run from the frontend directory.
```
npm start
```
#### Backend
Prior to running the application locally, be sure to have a PostgreSQL instance up and running and the appropriate credentials entered into the /backend/backend/settings.py file
All the following commands need to be run from the backend directory
Database migrations need to be run first
```
python manage.py migrate
python manage.py makemigrations
```
Run the Django server
```
python manage.py runserver
```
