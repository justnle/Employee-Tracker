'use strict';

const app = require('../app');
const queries = require('./queries');

const roleChoices = [];
const employeeChoices = [];
const departmentChoices = [];
const employeeIds = [];

function initPrompts() {
  updateInfo(getDatabaseInfo);
}

function getDatabaseInfo(table, column) {
  let choiceArr;

  switch (table) {
    case 'department':
      choiceArr = departmentChoices;
      break;
    case 'role':
      choiceArr = roleChoices;
      break;
    case 'employee':
      choiceArr = employeeChoices;
      break;
    default:
      throw new Error('Unknown table, unexpected case.');
  }

  if (table === 'employee' && column === 'full_name') {
    employeeChoices.length = 0;

    app.connection.query(queries.employeesFullName, (err, res) => {
      if (err) throw err;
      for (const employees of res) {
        choiceArr.push(employees.full_name);
      }
    });
  } else {
    app.connection.query(`SELECT ${column} FROM ${table}`, (err, res) => {
      if (err) throw err;

      switch (column) {
        case 'name':
          departmentChoices.length = 0;

          for (const department of res) {
            choiceArr.push(department.name);
          }
          break;
        case 'title':
          roleChoices.length = 0;

          for (const role of res) {
            choiceArr.push(role.title);
          }
          break;
        case 'id':
          employeeIds.length = 0;

          for (const ids of res) {
            employeeIds.push(ids.id);
          }
          employeeIds.sort((a, b) => a - b);
          break;
        default:
          throw new Error('Unknown column, unexpected case.');
      }
    });
  }
}

function updateInfo(callback) {
  callback('role', 'title');
  callback('department', 'name');
  callback('employee', 'full_name');
  callback('employee', 'id');
}

const prompts = {
  main: {
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View database',
      'Add to database',
      'Update database',
      'Delete from database',
      'Exit'
    ]
  },
  view: {
    name: 'View',
    type: 'list',
    choices: [
      'Employees',
      'Departments',
      'Roles',
      'Employees by Department',
      'Employees by Manager',
      'Managers',
      'Department Budget Utilized',
      'Back',
      'Exit'
    ]
  },
  add: {
    name: 'Add',
    type: 'list',
    choices: ['Employee', 'Department', 'Role', 'Back', 'Exit']
  },
  update: {
    name: 'Update',
    type: 'list',
    choices: ['Employee Role', 'Employee Manager', 'Back', 'Exit']
  },
  delete: {
    name: 'Remove',
    type: 'list',
    choices: ['Employee', 'Department', 'Role', 'Back', 'Exit']
  },
  addEmployee: [
    {
      name: 'firstName',
      type: 'input',
      message: "What is the employee's first name?",
      validate: name => {
        const check = name.match(/^[A-Z][a-z]*$/);
        if (check) {
          return true;
        } else {
          return 'Please enter a valid first name';
        }
      }
    },
    {
      name: 'lastName',
      type: 'input',
      message: "What is the employee's last name?",
      validate: name => {
        const check = name.match(/^[A-Z][a-z]*$/);
        if (check) {
          return true;
        } else {
          return 'Please enter a valid last name';
        }
      }
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
  ],
  addDepartment: [
    {
      name: 'departmentName',
      type: 'input',
      message: 'What is the name of the department?',
      validate: department => {
        const check = department.match(
          /^[a-zA-Z]+(([ -][a-zA-Z ])?[a-zA-Z]*)*$/
        );
        if (check) {
          return true;
        } else {
          return 'Please enter a valid name for the department';
        }
      }
    }
  ],
  addRole: [
    {
      name: 'roleName',
      type: 'input',
      message: 'What is the name of the role?',
      validate: role => {
        const check = role.match(/^[a-zA-Z]+(([ -][a-zA-Z ])?[a-zA-Z]*)*$/);
        if (check) {
          return true;
        } else {
          return 'Please enter a valid name for the role.';
        }
      }
    },
    {
      name: 'salary',
      type: 'input',
      message: 'What is the salary for this role?',
      validate: salary => {
        const check = salary.match(/^[1-9][0-9]*([.][0-9]{2}|)$/);
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
  ],
  updateEmployeeRole: [
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
  ]
};

module.exports = {
  prompts: prompts,
  initPrompts
};
