Video Drive Link: https://drive.google.com/file/d/1PranUu_HH63QJI94P8wQhPoWghnVYDKR/view?usp=drive_link
<body>
<h2> Academic Tracker Web application </h2>
<h3> Team: GSquare </h3>
<ul> Team Deatils
    <li> Name: Sachin A<br>
        Branch: CSE <br>
        Semester: 3
    </li>
    <li> Name: Sarvesh Joglekar<br>
        Branch: CSE <br>
        Semester: 3
    </li>
</ul>

<ul>Technology used 
    <li>Backend: Express framework,
        Nodejs runtime environment</li>
    <li>
        Database: Mongodb (mongoose)
    </li>    
    <li>
        EJS engines to add frontend
    </li>
    <li>
        Authentication and Authorization:
        Passport-local strategy
    </li>
</ul>

<ul>Models created:
    <li>Student Model: for user authentication and authorization</li>
    <li>Course Model: for listing all the courses from 1st to 4th sem, routes accessing this model are admin routes</li>
    <li>TestScore Model: User can add courses and input there result for that specidied course. One to one mapping between course model</li>
    <li>Attendance Model: Student can track there attendance according courses they have registered</li>
    <li>Expense Model: Tracks expenses of student, to add edit delete expenses</li>
    <li>Target Model (or deadline remainder): Reminds student of upcoming deadlines </li>
</ul>


<strong>  Student router</strong>

1. GET /login: Renders the login page for the student.

2. POST /login: Handles the login form submission using Passport's local authentication strategy. If authentication fails, redirects back to the login page. If successful, redirects to the student dashboard.

3. GET /signup: Renders the signup page for the student.

4. POST /signup: Handles the signup form submission. Creates a new student user with the provided username and password. Upon successful registration, automatically logs in the user and redirects to the post-signup page. If there's an error during registration, redirects back to the signup page.

5. GET /logout: Logs out the currently authenticated user and redirects to the login page.

6. GET /postsignup: Renders a page for post-signup actions. Requires user authentication.

7. POST /postsignup: Handles post-signup form submission. Updates the user's semester and branch information. Redirects to the home page after successful submission.

8. GET /: Renders the home page.


<strong>Course Router</strong>

1. GET /: Retrieves all courses from the database and renders the index page, passing the course data to be displayed.

2. GET /new: Renders the page for creating a new course.

3. POST /new: Handles the form submission for creating a new course. Extracts data from the request body and creates a new Course instance with the provided information. Saves the new course to the database and redirects to the course index page.

4. DELETE /:id: Deletes a course by its ID. Retrieves the course ID from the request parameters, finds the course in the database, deletes it, and sends a success message if deletion is successful.

5. GET /:id/edit: Renders the page for editing a course. Retrieves the course by its ID from the request parameters and renders the edit page, passing the course data to be pre-filled in the form.

6. POST /:id/update: Handles the form submission for updating a course. Extracts the updated data from the request body and updates the course in the database using its ID. Redirects to the course index page after updating.

<strong>Target Router or deadline</strong>

1. GET /: Retrieves all targets belonging to the logged-in user from the database, sorts them by due date, and filters out the targets with due dates in the future. Renders the index page, passing the filtered targets data to be displayed.

2. GET /new: Renders the page for creating a new target.

3. POST /new: Handles the form submission for creating a new target. Extracts data from the request body and creates a new Target instance with the provided information. Saves the new target to the database and redirects to the targets index page.

4. POST /:id/done: Handles the form submission for marking a target as done or pending. Retrieves the target by its ID from the request parameters, toggles its status between 'done' and 'pending', saves the updated target, and redirects to the targets index page.

5. POST /:id/delete: Handles the form submission for deleting a target. Retrieves the target by its ID from the request parameters, deletes it from the database, and redirects to the targets index page.

6. GET /:id/edit: Renders the page for editing a target. Retrieves the target by its ID from the request parameters and renders the edit page, passing the target data to be pre-filled in the form.

7. POST /:id/edit: Handles the form submission for updating a target. Retrieves the target ID and updated data from the request parameters and updates the target in the database. Redirects to the targets index page after updating.

<strong>TestScore Router</strong>

1. GET /: Renders the index page for the test module.

2. GET /score: Retrieves test scores based on the semester specified in the query parameter. Retrieves courses for the specified semester and test scores for the logged-in user in that semester. Renders the course page with the retrieved data.

3. GET /scores/add: Renders the page for adding test scores. Retrieves courses for the next semester (semester + 1) to enable adding scores for the upcoming semester.

4. POST /scores/add: Handles the form submission for adding test scores. Creates a new test score instance with the provided data and saves it to the database. Redirects to the page displaying test scores for the corresponding course.

5. GET /scores/:courseId: Retrieves test scores for a specific course. Renders the scores page with the retrieved test scores.

6. GET /scores/:id/edit: Renders the page for editing a test score. Retrieves the test score by its ID and renders the edit page with the retrieved data.

7. POST /scores/:id/edit: Handles the form submission for editing a test score. Updates the test score with the provided data and saves it to the database. Redirects to the page displaying test scores for the corresponding course.

<strong>Expense Router</strong>

1. GET /new: Renders the form for creating a new expense.

2. GET /:id/edit: Renders the form for editing an existing expense. It first checks if the provided expense ID is valid, then looks up the expense associated with the logged-in user and renders the edit form with the expense data.

3. POST /: Creates a new expense. It expects an array of items, monthlyBudget, and yearlyBudget in the request body. It validates the incoming data and creates a new expense instance with the provided data. Then, it saves the new expense to the database.

Attendance Router

1. GET /: Retrieves attendance details for the logged-in user. It finds attendance records associated with the user and renders a page to display them.

2. GET /new: Renders a form for creating a new attendance record. It retrieves courses for the current semester and renders a form with the course options.

3. POST /new: Creates a new attendance record. It receives data from the form submission, validates it, creates a new attendance record, and saves it to the database.

4. GET /:courseId: Retrieves attendance records for a specific course. It finds attendance records associated with the user and the specified course and renders a page to display them.

5. GET /edit/:id: Renders a form for editing an existing attendance record. It finds the attendance record by ID and renders a form with the existing data.

6. PUT /:id: Updates an existing attendance record. It finds the attendance record by ID, updates the specified fields, recalculates attendance data, and saves the updated record to the database.

7. DELETE /delete/:id: Deletes an existing attendance record. It finds the attendance record by ID and deletes it from the database.

8. GET /weekly/:attendanceId: Retrieves weekly attendance data for a specific attendance record. It calculates the number of weeks, retrieves the attendance record by ID, and renders a page to display weekly attendance.

9. POST /:attendanceId/mark: Updates the attendance status for a specific week and day. It finds the attendance record by ID, updates the status, and saves the updated record to the database.

</body>
