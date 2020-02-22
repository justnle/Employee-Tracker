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

// ALL HAVE TO DYNAMICALLY UPDATE or PULL FROM THE DB
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
  'Christian Eckenrode',
  'None'
];

const departmentChoices = ['Sales', 'Engineering', 'Finance', 'Legal'];

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

/*
TODO first_name, last_name FROM employees WHERE manager_id = id -- MANAGER
*/
function viewEmployees() {
  const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id
    FROM employee 
        INNER JOIN role 
            ON (employee.role_id = role.id)
        INNER JOIN department
            ON (role.department_id = department.id)
    ORDER BY employee.id
    `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    const employeeTable = cTable.getTable(res);
    console.log('\n' + employeeTable);
    prompt();
  });
}

// TODO: DRY OUT, view() are all similar, just SELECT from different tables
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

// DRY OUT
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
      switch (answer.role) {
        case 'Sales Lead':
          answer.role = 1;
          break;
        case 'Salesperson':
          answer.role = 2;
          break;
        case 'Lead Engineer':
          answer.role = 3;
          break;
        case 'Software Engineer':
          answer.role = 4;
          break;
        case 'Accountant':
          answer.role = 5;
          break;
        case 'Legal Team Lead':
          answer.role = 6;
          break;
        case 'Lawyer':
          answer.role = 7;
          break;
      }

      switch (answer.manager) {
        case 'John Doe':
          answer.manager = 1;
          break;
        case 'Mike Chan':
          answer.manager = 2;
          break;
        case 'Ashley Rodriguez':
          answer.manager = 3;
          break;
        case 'Kevin Tupik':
          answer.manager = 4;
          break;
        case 'Malia Brown':
          answer.manager = 5;
          break;
        case 'Sarah Lourd':
          answer.manager = 6;
          break;
        case 'Tom Allen':
          answer.manager = 7;
          break;
        case 'Christian Eckenrode':
          answer.manager = 8;
          break;
        default:
          answer.manager = null;
      }

      const query = connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.role,
          manager_id: answer.manager
        },
        (err, res) => {
          if (err) throw err;
          // console.log(res);
          prompt();
        }
      );
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: 'departmentName',
        type: 'input',
        message: 'What is the name of the department?'
      }
    ])
    .then(answer => {
      const query = connection.query(
        'INSERT INTO department SET ?',
        {
          name: answer.departmentName
        },
        (err, res) => {
          if (err) throw err;
          prompt();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: 'roleName',
        type: 'input',
        message: 'What is the name of the role?'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary for this role?',
        validate: answer => {
          const check = answer.match(/^[1-9][0-9]*([.][0-9]{2}|)$/);
          if (check) {
            return true;
          } else {
            return 'Please enter a valid salary.';
          }
        }
      },
      {
        name: 'roleDepartment',
        type: 'list',
        message: 'What department is this role in?',
        choices: departmentChoices
      }
    ])
    .then(answer => {
      switch (answer.roleDepartment) {
        case 'Sales':
          answer.roleDepartment = 1;
          break;
        case 'Engineering':
          answer.roleDepartment = 2;
          break;
        case 'Finance':
          answer.roleDepartment = 3;
          break;
        case 'Legal':
          answer.roleDepartment = 4;
          break;
        default:
          answer.roleDepartment = null;
      }

      const query = connection.query(
        'INSERT INTO role SET ?',
        {
          title: answer.roleName,
          salary: answer.salary,
          department_id: answer.roleDepartment
        },
        (err, res) => {
          if (err) throw err;
          prompt();
        }
      );
    });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        name: 'updateEmployee',
        type: 'list',
        message: "Which employee's role would you like to update?",
        choices: employeeChoices
      },
      {
        name: 'roleUpdate',
        type: 'rawlist',
        message: "What is the employee's new role?",
        choices: roleChoices
      }
    ])
    .then(answer => {
      switch (answer.roleUpdate) {
        case 'Sales Lead':
          answer.roleUpdate = 1;
          break;
        case 'Salesperson':
          answer.roleUpdate = 2;
          break;
        case 'Lead Engineer':
          answer.roleUpdate = 3;
          break;
        case 'Software Engineer':
          answer.roleUpdate = 4;
          break;
        case 'Accountant':
          answer.roleUpdate = 5;
          break;
        case 'Legal Team Lead':
          answer.roleUpdate = 6;
          break;
        case 'Lawyer':
          answer.roleUpdate = 7;
          break;
      }

      const query = connection.query(
        'UPDATE employee SET ? WHERE ?',
        [
          {
            role_id: answer.roleUpdate
          },
          {
            id: answer.updateEmployee
          }
        ],
        (err, res) => {
          if (err) throw err;
          prompt();
        }
      );
    });
}

// TODO: validate all answers, extract prompts to different file
