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

The goal was to create a shift report website. It is where the production leads can summarize how their shift went. After logging in, they select their shift, the machine, if its running or not, the parts made, and any comments they want to share. When they submit the form, it emails to the company a summary of that shift. If anyone needs to view the production history, there's a section on the site for them to do so. They have the ability to filter by dates, machines, and how to view the data (daily, weekly, or montly). The filtered table will be shown on the screen and there will be a link for users to download the table into a pdf.

The inspiration came from Arjun’s work. Currently, the production leads have to manually write the email about how their shift went. This makes it difficult for supervisors or others to view production history as they need to grab the values from all the emails sent.
Therefore, website will be used to streamline and automate the process of filling out and storing the shift production data.

Below are screenshots of our project.

![Website Homepage Screenshot](/images/home-login.png)

![Website Create Report Screenshot](/images/create-report.png)

![Website View History Screenshot](/images/history.png)

#### Here's the link to our project presentation: [Presentation](https://docs.google.com/presentation/d/1GSXnY6Al5yUVaayPNQpdUfn_UYgviRMi5mYfYsU3rEM/edit?usp=sharing)

## Installation

No installation required. Users need a computer and a connection to the internet.

To run the code locally, you will have a .env file inside the server folder. The variables needed are: DB_NAME, DB_PASSWORD, DB_USER, DOCUMENT_TEMPLATE_ID, JWT_SECRET_KEY, PDF_API_KEY, and SENDGRID_API_KEY. The DB variables are your local Postgres credentials. JWT_SECRET_KEY can be assigned any string. DOCUMENT_TEMPLATE_ID and PDF_API_KEY are the credentials from pdf Monkey which is the API we used to generate a pdf in the history section. SENDGRID_API_KEY is the sendGrid API that we used to send an email that summarizes the recent report created.

## Usage

#### The video below shows the web application's appearance and functionality:

https://github.com/user-attachments/assets/95d7ce00-17f9-4f8d-bab1-cfe8a224a348

#### Have a look for yourself! [Shift Report Site](https://dak-shift-report.onrender.com/)


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

## Features

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
THEN a confirm pop-up appears if I am ready for the report to be emailed
WHEN I click yes
THEN the email is sent to everyone
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
```
