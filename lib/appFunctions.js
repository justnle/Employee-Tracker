'use strict';

const inquirer = require('inquirer');
const cTable = require('console.table');
const prompts = require('./prompts');
const queries = require('./queries');
const app = require('../app');

const roleChoices = [];
const employeeChoices = [];
const departmentChoices = [];
const employeeIds = [];

function prompt() {
  updateInfo(getDatabaseInfo);

  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        prompts.viewEmployees,
        prompts.viewDepartments,
        prompts.viewRoles,
        prompts.addEmployee,
        prompts.addDepartment,
        prompts.addRole,
        prompts.updateEmployeeRole,
        prompts.exit
      ]
    })
    .then(answer => {
      switch (answer.action) {
        case prompts.viewEmployees:
          viewEmployees();
          break;

        case prompts.viewDepartments:
          view('departments');
          break;

        case prompts.viewRoles:
          view('roles');
          break;

        case prompts.addEmployee:
          addEmployee();
          break;

        case prompts.addDepartment:
          addDepartment();
          break;

        case prompts.addRole:
          addRole();
          break;

        case prompts.updateEmployeeRole:
          updateEmployeeRole();
          break;

        case prompts.exit:
          app.connection.end();
          break;
        default:
          throw new Error('Unexpected prompt error.');
      }
    });
}

function viewEmployees() {
  app.connection.query(queries.allEmployees, (err, res) => {
    if (err) throw err;
    const employeeTable = cTable.getTable(res);
    console.log('\n' + employeeTable);
    prompt();
  });
}

function view(choice) {
  switch (choice) {
    case 'departments':
      app.connection.query(queries.allDepartments, (err, res) => {
        if (err) throw err;
        const departmentTable = cTable.getTable(res);
        console.log('\n' + departmentTable);
        prompt();
      });
      break;
    case 'roles':
      app.connection.query(queries.allRoles, (err, res) => {
        if (err) throw err;
        const roleTable = cTable.getTable(res);
        console.log('\n' + roleTable);
        prompt();
      });
      break;
    case 'employees':
      // place holder
      break;
    default:
      throw new Error('Unexpected choice, resulting in an error.');
  }
}

async function addEmployee() {
  employeeChoices.push('NULL');

  await inquirer
    .prompt([
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
    ])
    .then(answer => {
      let roleId = roleChoices.indexOf(answer.role) + 1;
      let managerIdIndex = employeeChoices.indexOf(answer.manager);
      let managerId = employeeIds[managerIdIndex];

      app.connection.query(
        queries.addEmployee,
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: roleId,
          manager_id: managerId
        },
        (err, res) => {
          if (err) throw err;
          console.log('-- New employee was added! --');
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
    ])
    .then(answer => {
      app.connection.query(
        queries.addDepartment,
        {
          name: answer.departmentName
        },
        (err, res) => {
          if (err) throw err;
          console.log('-- New department was added! --');
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
    ])
    .then(answer => {
      let departmentId = departmentChoices.indexOf(answer.roleDepartment) + 1;

      app.connection.query(
        queries.addRole,
        {
          title: answer.roleName,
          salary: answer.salary,
          department_id: departmentId
        },
        (err, res) => {
          if (err) throw err;
          console.log('-- New role was added! --');
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
      let employeeIdIndex = employeeChoices.indexOf(answer.updateEmployee);
      let employeeId = employeeIds[employeeIdIndex];
      let newRole = roleChoices.indexOf(answer.roleUpdate) + 1;

      app.connection.query(
        queries.updateEmployeeRole,
        [
          {
            role_id: newRole
          },
          {
            id: employeeId
          }
        ],
        (err, res) => {
          if (err) throw err;
          console.log('-- Successfully updated employee! --');
          prompt();
        }
      );
    });
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

module.exports = {
  prompt
};
