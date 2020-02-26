'use strict';

const { prompt } = require('inquirer');
const cTable = require('console.table');
const prompts = require('./prompts');
const queries = require('./queries');
const app = require('../app');

function initApp() {
  prompts.initPrompts();

  prompt(prompts.prompts.main).then(answer => {
    switch (answer.action) {
      case 'View database':
        prompt(prompts.prompts.view).then(answer => {
          switch (answer.View) {
            case 'Employees':
              view('employees');
              break;
            case 'Departments':
              view('departments');
              break;
            case 'Roles':
              view('roles');
              break;
            case 'Employees by Department':
              view('employeesDepartment');
              break;
            case 'Employees by Manager':
              view('employeesManager');
              break;
            case 'Department Budget Utilized':
              view('budget');
              break;
            case 'Back':
              initApp();
              break;
            default:
              console.log('Exiting.');
              app.connection.end();
          }
        });
        break;
      case 'Add to database':
        prompt(prompts.prompts.add).then(answer => {
          switch (answer.Add) {
            case 'Employee':
              add('employee');
              break;
            case 'Department':
              add('department');
              break;
            case 'Role':
              add('role');
              break;
            case 'Back':
              initApp();
              break;
            default:
              console.log('Exiting.');
              app.connection.end();
          }
        });
        break;
      case 'Update database':
        prompt(prompts.prompts.update).then(answer => {
          switch (answer.Update) {
            case 'Employee Role':
              update('employeeRole');
              break;
            case 'Employee Manager':
              update('employeeManager');
              break;
            case 'Back':
              initApp();
              break;
            default:
              console.log('Exiting.');
              app.connection.end();
          }
        });
        break;
      case 'Delete from database':
        prompt(prompts.prompts.remove).then(answer => {
          switch (answer.Remove) {
            case 'Employee':
              remove('employee');
              break;
            case 'Department':
              remove('department');
              break;
            case 'Role':
              remove('role');
              break;
            case 'Back':
              initApp();
              break;
            default:
              console.log('Exiting.');
              app.connection.end();
          }
        });
        break;
      case 'Back':
        initApp();
        break;
      case 'Exit':
        console.log('Exiting application.');
        app.connection.end();
    }
  });
}

function view(choice) {
  switch (choice) {
    case 'departments':
      getQuery('view', queries.allDepartments);
      break;
    case 'roles':
      getQuery('view', queries.allRoles);
      break;
    case 'employees':
      getQuery('view', queries.allEmployees);
      break;
    case 'employeesDepartment':
      prompt(prompts.prompts.viewEmployeesDepartment).then(answer => {
        let departmentIdIndex = prompts.departmentChoices.indexOf(
          answer.employeesDepartment
        );
        let departmentId = prompts.departmentIds[departmentIdIndex];

        getQuery('view', queries.employeesDepartment, departmentId);
      });
      break;
    case 'employeesManager':
      prompt(prompts.prompts.viewEmployeesManager).then(answer => {
        let managerIdIndex = prompts.employeeChoices.indexOf(
          answer.employeesManager
        );
        let managerId = prompts.employeeIds[managerIdIndex];

        getQuery('view', queries.employeesManager, managerId);
      });
      break;
    case 'budget':
      prompt(prompts.prompts.viewBudget).then(answer => {
        getQuery('view', queries.budget, answer.departmentBudget);
      });
      break;
    default:
      throw new Error('Unexpected choice resulting in an error.');
  }
}

function add(choice) {
  switch (choice) {
    case 'employee':
      prompts.employeeChoices.push('NULL');

      prompt(prompts.prompts.addEmployee).then(answer => {
        let roleId = prompts.roleChoices.indexOf(answer.role) + 1;
        let managerIdIndex = prompts.employeeChoices.indexOf(answer.manager);
        let managerId = prompts.employeeIds[managerIdIndex];

        getQuery('add', queries.addEmployee, {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: roleId,
          manager_id: managerId
        });

        console.log(
          `--- Added ${answer.firstName} ${answer.lastName} to the employee database! ---`
        );
      });
      break;
    case 'department':
      prompt(prompts.prompts.addDepartment).then(answer => {
        getQuery('add', queries.addDepartment, { name: answer.departmentName });
        console.log(`--- Added ${answer.departmentName} as a department! ---`);
      });
      break;
    case 'role':
      prompt(prompts.prompts.addRole).then(answer => {
        let departmentIdIndex = prompts.departmentChoices.indexOf(
          answer.roleDepartment
        );
        let departmentId = prompts.departmentIds[departmentIdIndex];

        getQuery('add', queries.addRole, {
          title: answer.roleName,
          salary: answer.salary,
          department_id: departmentId
        });

        console.log(`--- Added ${answer.roleName} as a role! ---`);
      });
      break;
  }
}

function remove(choice) {
  switch (choice) {
    case 'employee':
      prompt(prompts.prompts.removeEmployee).then(answer => {
        let employeeIdIndex = prompts.employeeChoices.indexOf(
          answer.removeEmployee
        );
        let employeeId = prompts.employeeIds[employeeIdIndex];

        getQuery('remove', queries.removeEmployee, { id: employeeId });
        console.log(
          `--- Removed ${answer.removeEmployee} from the database ---`
        );
      });
      break;
    case 'department':
      prompt(prompts.prompts.removeDepartment).then(answer => {
        getQuery('remove', queries.removeDepartment, {
          name: answer.removeDepartment
        });
        console.log(
          `--- Removed ${answer.removeDepartment} as a department from the database ---`
        );
      });
      break;
    case 'role':
      prompt(prompts.prompts.removeRole).then(answer => {
        getQuery('remove', queries.removeRole, {
          title: answer.removeRole
        });
        console.log(
          `--- Removed ${answer.removeRole} as a role from the database ---`
        );
      });
      break;
    default:
      throw new Error('Unexpected choice resulting in an error.');
  }
}

function update(choice) {
  switch (choice) {
    case 'employeeRole':
      prompt(prompts.prompts.updateEmployeeRole).then(answer => {
        let employeeIdIndex = prompts.employeeChoices.indexOf(
          answer.updateEmployee
        );
        let employeeId = prompts.employeeIds[employeeIdIndex];
        let newRoleIndex = prompts.roleChoices.indexOf(answer.roleUpdate);
        let newRole = prompts.roleIds[newRoleIndex];

        getQuery('update', queries.updateEmployee, [
          { role_id: newRole },
          { id: employeeId }
        ]);
        console.log(
          `--- Updated ${answer.updateEmployee}'s role to ${answer.roleUpdate} ---`
        );
      });
      break;
    case 'employeeManager':
      prompt(prompts.prompts.updateEmployeeManager).then(answer => {
        let employeeIdIndex = prompts.employeeChoices.indexOf(
          answer.updateEmployee
        );
        let employeeId = prompts.employeeIds[employeeIdIndex];
        let newManagerIndex = prompts.employeeChoices.indexOf(
          answer.managerUpdate
        );
        let newManager = prompts.employeeIds[newManagerIndex];

        getQuery('update', queries.updateEmployee, [
          { manager_id: newManager },
          { id: employeeId }
        ]);
        console.log(
          `--- Updated ${answer.updateEmployee}'s Manager to ${answer.managerUpdate} ---`
        );
      });
      break;
  }
}

function getQuery(choice, type, setting) {
  app.connection.query(type, setting, (err, res) => {
    if (err) throw err;

    switch (choice) {
      case 'view':
        if (res.length === 0) {
          console.log(`\nNo data! \nMay not be a manager.`);
        }
        const table = cTable.getTable(res);
        console.log('\n' + table);
        initApp();
        break;
      case 'add':
        initApp();
        break;
      case 'remove':
        initApp();
        break;
      case 'update':
        initApp();
        break;
      default:
        throw new Error('Unexpected choice resulting in an error.');
    }
  });
}

module.exports = {
  initApp
};
