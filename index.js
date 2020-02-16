'use strict';

const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const promptMessages = {
  viewEmployees: 'View All Employees',
  addEmployee: 'Add Employee',
  viewDepartments: 'View All Departments',
  addDepartment: 'Add Department',
  viewRoles: 'View All Roles',
  addRole: 'Add Role',
  updateEmployeeRole: 'Update Employee Role',
  exit: 'Exit'
};

const promptMessagesBonus = {
  viewEmployeesByDepartment: 'View All Employees By Department',
  updateEmployeeManager: 'Update Employee Manager',
  viewEmployeesByManager: 'View All Employees By Manager',
  removeEmployee: 'Remove Employee',
  removeDepartment: 'Remove Department',
  removeRole: 'Remove Role',
  viewDepartmentBudget: 'View Department Budget Utilized',
  viewManagers: 'View All Managers'
};

const roleChoices = [
  'Sales Lead',
  'Salesperson',
  'Lead Engineer',
  'Software Engineer',
  'Accountant',
  'Legal Team Lead',
  'Lawyer'
];

const employeeChoices = [
    'John Doe',
    'Mike Chan',
    'Ashley Rodriguez',
    'Kevin Tupik',
    'Malia Brown',
    'Sarah Lourd',
    'Tom Allen',
    'Christian Eckenrode'
];

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'testing123',
  database: 'employees_db'
});

connection.connect(err => {
  if (err) throw err;
  prompt();
});

function prompt() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        promptMessages.viewEmployees,
        promptMessages.viewDepartments,
        promptMessages.viewRoles,
        promptMessages.addEmployee,
        promptMessages.addDepartment,
        promptMessages.addRole,
        promptMessages.updateEmployeeRole,
        promptMessages.exit
      ]
    })
    .then(answer => {
    //   console.log('answer', answer);
      switch (answer.action) {
        case promptMessages.viewEmployees:
          viewEmployees();
          break;

        case promptMessages.viewDepartments:
          viewDepartments();
          break;

        case promptMessages.viewRoles:
          viewRoles();
          break;

        case promptMessages.addEmployee:
          addEmployee();
          break;

        case promptMessages.addDepartment:
          addDepartment();
          break;

        case promptMessages.addRole:
          addRole();
          break;

        case promptMessages.updateEmployeeRole:
          updateEmployeeRole();
          break;

        case promptMessages.exit:
          connection.end();
          break;
      }
    });
}

// WIP
function viewEmployees() {
    const query = 'SELECT id, first_name, last_name FROM employees';
    connection.query(query, (err, res) => {
        if (err) throw err;
        const employeeTable = cTable.getTable(res);
        console.log('\n' + employeeTable);
        prompt();
    });
    
    /*
     TODO JOIN: title FROM role WHERE employee.role_id = role.id -- ROLE TITLE
     TODO JOIN: name FROM department WHERE role.department_id = department.id  -- DEPARTMENT
     TODO JOIN: salary FROM role WHERE role.id = employees.role_id -- SALARY
     TODO JOIN: first_name, last_name FROM employees WHERE manager_id = id -- MANAGER
    */
}

function viewDepartments() {
    const query = 'SELECT name FROM department';
    connection.query(query, (err, res) => {
        if (err) throw err;
        const departmentTable = cTable.getTable(res);
        console.log('\n' + departmentTable);
        prompt();
    });
}

function viewRoles() {
    const query = 'SELECT title FROM role';
    connection.query(query, (err, res) => {
        if (err) throw err;
        const roleTable = cTable.getTable(res);
        console.log('\n' + roleTable);
        prompt();
    });
}

// WIP
function addEmployee() {
  inquirer
    .prompt([
      {
        name: 'firstName',
        type: 'input',
        message: "What is the employee's first name?"
      },
      {
        name: 'lastName',
        type: 'input',
        message: "What is the employee's last name?"
      },
      {
        name: 'role',
        type: 'rawlist',
        message: "What is the employee's role?",
        choices: roleChoices
      },
      {
        name: 'manager',
        type: 'rawlist',
        message: "Who is the employee's manager?",
        choices: employeeChoices
      }
    ])
    .then(answer => {
    //   console.log('answer', answer);
    });
}

// function addDepartment() {

// }

// function addRole() {

// }

// function updateEmployeeRole() {

// }