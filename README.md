# Shift-Report

![license-badge](https://img.shields.io/badge/MIT_License-01a6ff)

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
- [Features](#features)

## Description

The goal was to create a shift report website. It is where the production leads can summarize how their shift went. After logging in, they select their shift, the machine, if its running or not, the parts made, and any comments they want to share. When they submit the form, it becomes available for supervisors to verify & approve. If anyone needs to view the production history, there's a section on the site for them to do so. They have the ability to filter by dates, machines, and how to view the data (daily, weekly, or montly). The filtered table will be shown on the screen and there will be a link for users to download the table into a pdf. 

When supervisors login, there will be two additional pages on the navigation bar for them to create an account and verify & approve shift reports (OTS). OTS is the enterprise resource planning software that streamlines our business process where it tracks production, inventory levels, and raw materials. With this site, after supervisors approve reports on the OTS page, it will be in the correct format to send over to the OTS software (will be done in future development).

The inspiration came from Arjun’s work. Currently, the production leads have to manually write the email about how their shift went. This makes it difficult for supervisors or others to view production history as they need to grab the values from all the emails sent. In addition, supervisors need to manually enter production information on OTS. Therefore, website will be used to streamline and automate the process of filling out and storing the shift production data as well as inputting info onto OTS.

Below are screenshots of our project.

![login dashboard](./images/Screenshot%202025-01-27%20210728.png)

![employee createReport ](./images/Screenshot%202025-01-27%20210844.png)

![supervisor dashboard](./images/Screenshot%202025-01-27%20210936.png) 

![supervisor CreateAccount](./images/Screenshot%202025-01-27%20211511.png)

![Supervisor OTS view](./images/Screenshot%202025-01-29%20181534.png)


#### Here's the link to our project presentation: [Presentation](https://docs.google.com/presentation/d/19x_CMu5_MZl-CIDv8hBnNWQl2FIYHho4tTuLKpXLuX0/edit?usp=sharing)

## Installation

No installation required. Users need a computer and a connection to the internet.

To run the code locally, you will have a .env file inside the server folder (if running in develop mode) and a .env file in the root directory (if running in production mode). The variables needed shown below. You can copy the code below to your .env file and enter the values after the equal sign for the corresponding variables. The MONGODB_URI is your local MongoDB url. JWT_SECRET_KEY can be assigned any string. DOCUMENT_TEMPLATE_ID and PDF_API_KEY are the credentials from pdf Monkey which is the API we used to generate a pdf in the history section. SENDGRID_API_KEY is the sendGrid API that we used to send an email that summarizes the recent report created.

```
MONGODB_URI=
JWT_SECRET_KEY=
DOCUMENT_TEMPLATE_ID=
PDF_API_KEY=
SENDGRID_API_KEY=
```

To run the code locally, in the root directory exceute npm run render-build in your git bash which will install the necessary packages, build the client & server code, and seed the user mock data. Then, exceute npm run develop if you to deploy the site in develop mode where the front and back end are listening on different ports. If you want to run in production mode, open the .npmrc file and change production from false to true and then exceute npm run start in your git bash from the root directory. Keep in mind to made production set to false afterwards as to avoid build issues the next time you run npm run render-build.

Develop mode
```
npm run render-build
npm run develop
```
Production mode
```
npm run render-build
**Change production to true in .npmrc file**
npm run start
**Make sure to revert production to false in .npmrc file after you are done**
```

## Usage

#### The video below shows the web application's appearance and functionality:


https://github.com/user-attachments/assets/e27b95db-1cc5-4175-9e6e-b9d2591b380d




#### Have a look for yourself! [Shift Report Site](https://shift-report-v2.onrender.com/)



## Credits

Arjun Patel - [Arjun's GitHub](https://github.com/apatel62) <br>
Destinee Miles - [Destinee's GitHub](https://github.com/Destineeco) <br>
Keaton Greer - [Keatons' GitHub](https://github.com/keatongreer)

## License

#### MIT License

Copyright (c) 2024 apatel62

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE


### User story:

```
GIVEN a shift report
WHEN I load the website
THEN I am presented with a landing page that asks users to login if they want to create a shift report
WHEN I login
THEN I am presented with a form that asks for the shift
WHEN I select either 1 or 2 for the shift
THEN I am presented with which machine it is for
WHEN I select the machine
THEN I am presented with if this machine is up or down
WHEN I select either up or down
THEN I am presented with how many parts did this machine produce
WHEN I enter the number of parts the machine made
THEN I am presented with the comments and the submit button
WHEN I press submit
THEN I am prompted if I want to add another machine to this shift report
WHEN I click yes
THEN the form page re-initializes to be filled out again for another machine
WHEN I select no
THEN a confirm pop-up appears if I am ready for the report to be submitted
WHEN I click yes
THEN the report is saved to the database and awaits supervisor's approval
WHEN I view the history page
THEN I am presented with another form that asks the dates I want to see production data from
WHEN I select the dates
THEN I am asked which machines I want to see the data from
WHEN I select the machines
THEN I am asked to select the time interval of how I want the data presented (daily, weekly, or monthly)
WHEN I select either daily, weekly, or monthly
THEN I see the view tables button
WHEN I press the button
THEN I see the requested filtered table and a link to download this table into a pdf
WHEN supervisors login
THEN two additional pages will be shown on the navigation bar (OTS & Create an Account)
WHEN the supervisor click on Create an Account
THEN the Create an Account page will load with a form for supervisors to create an account on behalf of someone
WHEN the supervisor clicks on Create an Account button
THEN the user will be created and a confirmation message will appear
WHEN supervisors click on OTS
THEN the OTS page will load with tiles shown where each tile represents a shift report that is waiting for their approval
WHEN the supervisors click on view button on a tile
THEN the OTS View page will load where all info of that shift report will be displayed & a field to enter the lot number for each machine
WHEN the supervisors click on Approve button
THEN the data will be stored in the database, the report will be emailed to all supervisors, and this tile will not be seen on OTS page
```
