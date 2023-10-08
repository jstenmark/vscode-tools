#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

// Function to fetch the value from a specified key
const getValueFromKey = (data, key) => {
  const values = [];

  const search = (obj) => {
    if (typeof obj === 'object') {
      for (const prop in obj) {
        if (prop === key) {
          values.push(obj[prop]);
        } else {
          search(obj[prop]);
        }
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item) => search(item));
    }
  };

  search(data);
  return values;
};

// Get command-line arguments
const args = process.argv.slice(2);

// Check if the arguments are provided correctly
if (args.length !== 3 || args[1] !== '--key') {
  console.log('Usage: node script.mjs [filepath] --key [examplekey]');
  process.exit(1);
}

const filePath = args[0];
const specifiedKey = args[2];

fs.readFile(filePath, 'utf8')
  .then((data) => {
    try {
      const jsonData = JSON.parse(data);

      // Function to fetch the values for the specified key
      const values = getValueFromKey(jsonData, specifiedKey);

      if (values.length === 0) {
        console.log(`Key "${specifiedKey}" not found.`);
      } else {
        values.forEach((value) => {
          const extensionPath = path.basename(value);
          console.log(extensionPath.split('-').slice(0, -1).join('-')); // Remove the version from extension name
        });
      }
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
    }
  })
  .catch((err) => {
    console.error('Error reading JSON file:', err);
    process.exit(1);
  });
