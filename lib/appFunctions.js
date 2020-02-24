'use strict';

const inquirer = require('inquirer');
const cTable = require('console.table');
const prompts = require('./prompts');
const queries = require('./queries');
// import connection from '../index.js';

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
          connection.end();
          break;
        default:
          throw new Error('Unexpected prompt error.');
      }
    });
}

function viewEmployees() {
  connection.query(queries.allEmployees, (err, res) => {
    if (err) throw err;
    const employeeTable = cTable.getTable(res);
    console.log('\n' + employeeTable);
    prompt();
  });
}

function view(choice) {
  switch (choice) {
    case 'departments':
      connection.query(queries.allDepartments, (err, res) => {
        if (err) throw err;
        const departmentTable = cTable.getTable(res);
        console.log('\n' + departmentTable);
        prompt();
      });
      break;
    case 'roles':
      connection.query(queries.allRoles, (err, res) => {
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

function addEmployee() {
  employeeChoices.push('NULL');

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
      let roleId = roleChoices.indexOf(answer.role) + 1;
      let managerIdIndex = employeeChoices.indexOf(answer.manager);
      let managerId = employeeIds[managerIdIndex];

      connection.query(
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
        message: 'What is the name of the department?'
      }
    ])
    .then(answer => {
      connection.query(
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
      let departmentId = departmentChoices.indexOf(answer.roleDepartment) + 1;

      connection.query(
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

      connection.query(
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

    connection.query(queries.employeesFullName, (err, res) => {
      if (err) throw err;
      for (const employees of res) {
        choiceArr.push(employees.full_name);
      }
    });
  } else {
    connection.query(`SELECT ${column} FROM ${table}`, (err, res) => {
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
