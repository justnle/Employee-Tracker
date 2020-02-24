'use strict';

const allEmployees = `
SELECT employee.id AS 'Employee ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', concat(E.first_name, ' ', E.last_name) AS 'Manager Name'
FROM employee 
  INNER JOIN role 
      ON (employee.role_id = role.id)
  INNER JOIN department
      ON (role.department_id = department.id)
  LEFT JOIN employee E
      ON (employee.manager_id = E.id)
ORDER BY employee.id;
`;

const allDepartments = `SELECT name AS Departments FROM department`;

const allRoles = `SELECT title AS Roles FROM role`;

const addEmployee = `INSERT INTO employee SET ?`;

const addDepartment = `INSERT INTO department SET ?`;

const addRole = `INSERT INTO role SET ?`;

const updateEmployeeRole = `UPDATE employee SET ? WHERE ?`;

const employeesFullName = `SELECT concat(first_name, ' ', last_name) AS full_name FROM employee`;

module.exports = {
  allEmployees,
  allDepartments,
  allRoles,
  addEmployee,
  addDepartment,
  addRole,
  updateEmployeeRole,
  employeesFullName
};
