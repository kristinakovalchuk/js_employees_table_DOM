'use strict';

// виділення рядків

const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const activeRow = tbody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
});

// сортування таблиці

const thead = document.querySelector('thead');
let sortedColumn = null;
let sortDirection = 'asc';

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const columnIndex = th.cellIndex;

  if (sortedColumn === columnIndex) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortedColumn = columnIndex;
    sortDirection = 'asc';
  }

  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((rowA, rowB) => {
    const valueA = rowA.cells[columnIndex].textContent.trim();
    const valueB = rowB.cells[columnIndex].textContent.trim();

    let result;

    if (columnIndex === 3 || columnIndex === 4) {
      const numberA = Number(valueA.replace(/[$,\s]/g, ''));
      const numberB = Number(valueB.replace(/[$,\s]/g, ''));

      result = numberA - numberB;
    } else {
      result = valueA.localeCompare(valueB);
    }

    return sortDirection === 'asc' ? result : -result;
  });

  rows.forEach((row) => {
    tbody.append(row);
  });
});

// створення та додавання форми

const form = document.createElement('form');

form.classList.add('new-employee-form');

const fields = [
  ['name', 'Name', 'text'],
  ['position', 'Position', 'text'],
  ['age', 'Age', 'number'],
  ['salary', 'Salary', 'number'],
];

fields.forEach(([title, label2, type]) => {
  const labelform = document.createElement('label');
  const input = document.createElement('input');

  input.type = type;
  input.name = title;
  input.required = true;

  labelform.textContent = `${label2}:`;

  input.setAttribute('data-qa', title);

  labelform.append(input);

  if (title === 'age') {
    const officeLabel = document.createElement('label');
    const select = document.createElement('select');

    officeLabel.textContent = 'Office:';

    select.name = 'office';
    select.setAttribute('data-qa', 'office');
    select.required = true;

    const cities = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    cities.forEach((city) => {
      const option = document.createElement('option');

      option.value = city;
      option.textContent = city;
      select.append(option);
    });

    officeLabel.append(select);
    form.append(officeLabel);
  }

  form.append(labelform);
});

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

form.append(submitButton);

document.body.append(form);

// сповіщення

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add(type);
  notification.textContent = message;

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// додавання нового співробітника та валідація

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name1 = form.elements.name.value.trim();
  const position = form.elements.position.value.trim();
  const office = form.elements.office.value;
  const age = Number(form.elements.age.value);
  const salary = Number(form.elements.salary.value);

  if (name1.length < 4) {
    showNotification('Name must contain at least 4 characters', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  const row = document.createElement('tr');

  const nameCell = document.createElement('td');
  const positionCell = document.createElement('td');
  const officeCell = document.createElement('td');
  const ageCell = document.createElement('td');
  const salaryCell = document.createElement('td');

  nameCell.textContent = name1;
  positionCell.textContent = position;
  officeCell.textContent = office;
  ageCell.textContent = age;
  salaryCell.textContent = `$${salary.toLocaleString('en-US')}`;

  row.append(nameCell, positionCell, officeCell, ageCell, salaryCell);

  tbody.append(row);

  showNotification('Employee successfully added', 'success');

  form.reset();
});
