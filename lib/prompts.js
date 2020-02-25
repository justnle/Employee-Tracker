'use strict';

const appFunctions = require('./appFunctions');

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
      choices: appFunctions.roleChoices
    },
    {
      name: 'manager',
      type: 'rawlist',
      message: "Who is the employee's manager?",
      choices: appFunctions.employeeChoices
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
      choices: appFunctions.departmentChoices
    }
  ],
  updateEmployeeRole: [
    {
      name: 'updateEmployee',
      type: 'list',
      message: "Which employee's role would you like to update?",
      choices: appFunctions.employeeChoices
    },
    {
      name: 'roleUpdate',
      type: 'rawlist',
      message: "What is the employee's new role?",
      choices: appFunctions.roleChoices
    }
  ],

};

module.exports = {
  prompts: prompts
};
