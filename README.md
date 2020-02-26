# Employee-Tracker
A Node.js application that accesses a SQL database composed of employee information from a company. Using the command line, the user can view, add, and update employee information, or view/add new employees/roles to the company.

## Usage
To install and use locally, 
1. ```git clone``` this repository to a local directory
2. Run the ```schema.sql``` file in MySQLWorkbench, or from the terminal to initialize and begin using the database
3. Optionally, run the ```seed.sql``` file to seed the database with some information
4. Install the dependencies via the terminal by running:
```bash
npm i
```
5. Then run the application with:

```bash
npm start
```

The user will use arrow keys to navigate the menu, and the application will receive the user's input to the prompts to manage the employee database.

### Screenshots
![start](https://github.com/twopcz/Employee-Tracker/blob/dev/assets/images/start.png?raw=true)
![employees-view](https://github.com/twopcz/Employee-Tracker/blob/dev/assets/images/employees.png?raw=true)

### Demo
![demo-gif](https://github.com/twopcz/Employee-Tracker/blob/dev/assets/images/employee-tracker.gif?raw=true)
![Video](https://github.com/twopcz/Employee-Tracker/blob/dev/assets/images/employee-tracker.mp4)

# Technologies

This application was built with:

* JavaScript
* [MySQL](https://dev.mysql.com/doc/)
* [Node](https://nodejs.org/en/)

The dependencies required:

```
  "dependencies": {
    "console.table": "^0.10.0",
    "inquirer": "^7.0.4",
    "mysql": "^2.18.1"
  }
  ```

Documentation on dependencies:

* [console.table](https://www.npmjs.com/package/console.table)
* [Inquirer](https://www.npmjs.com/package/inquirer)
* [mysql](https://www.npmjs.com/package/mysql)

# Enhancements
Better regex expressions to validate some of the answers would be nice, making the code A LOT cleaner would be ideal. Add some ASCII art since everybody else has it!

# License
This project is licensed under the MIT License - see the LICENSE.md file for details
