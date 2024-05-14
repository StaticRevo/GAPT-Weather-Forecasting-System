# GAPT-Weather-Forecasting-System
GAPT - Weather Forecasting System by Isaac, Kayla, Greg and Nathan

A fully funcional Weather Forecasting System created and tested using XAMPP.

## Setup Instructions

**XAMPP**
1. Install XAMPP
2. Download the latest version of XAMPP from the official website: XAMPP Downloads.
3. Follow the installation instructions provided for your operating system (Windows, macOS, or Linux).
4. Start the Apache and MySQL services from the XAMPP Control Panel.

**Composer**
1. Download and install Composer, a dependency manager for PHP, from the official website: Composer Downloads.
2. Follow the installation instructions provided for your operating system.
3. Once installed, verify that Composer is accessible from the command line by running: composer --version
4. Navigate to the root directory of the project using the command line.
5. Run Composer to install project dependencies defined in the composer.json file. composer install

**Configure Database**
1. Open the XAMPP Control Panel and start the MySQL service if it's not already running.
2. Access phpMyAdmin by visiting http://localhost/phpmyadmin in your web browser.
3. Create a new database for your project called WeatherDatabase
4. Update the database with the sql: [WeatherDatbase](https://github.com/StaticRevo/GAPT-Weather-Forecasting-System/blob/main/LoginWeather/sql/WeatherDatabase.sql)
5. Add user account with the following properties: **Username**: 'weatherhost' , **Hostname**: localhost, **Password**: 'weather and ensure that all privelages are ticked

**Ensure Permissions**
1. To use the profile picture feature go on command line and type:
2. chmod 777 /Applications/XAMPP/xamppfiles/htdocs/(ProjectName)/uploads

**Start the Web Server**
1. Place the project files in the appropriate directory within the XAMPP installation (usually htdocs).
2. Access the project in your web browser by visiting http://localhost/project_directory where project_directory is the name of the directory containing your project files.
