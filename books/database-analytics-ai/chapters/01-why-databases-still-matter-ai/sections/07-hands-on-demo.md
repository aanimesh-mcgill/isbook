---
title: Hands-on Demo
section: "1.7"
order: 7
slug: hands-on-demo
status: draft
learningObjectives:
  - Understand the role of different databases in solving analytics problems
  - Gain hands-on experience with SQL and NoSQL databases
  - Evaluate trade-offs in database selection for specific use cases
keywords:
  - databases
  - analytics
  - SQL
  - NoSQL
  - CAP theorem
  - AI integration
estimatedReadingTime: 45 minutes
researchStreams:
  - database ecosystems
  - AI and data integration
---

## Hands-on Demo

In this section, we'll guide you through a practical lab exercise to explore the differences in database technologies and evaluate them for specific analytics scenarios. We'll be using MySQL and MongoDB to demonstrate how structured and unstructured data can be managed and queried. This exercise will provide you with first-hand experience in understanding why certain databases are better suited for particular types of analytics problems.

### Tools Required

- **MySQL**: A popular relational database management system that is widely used for structured data.
- **MongoDB**: A leading NoSQL database that excels with unstructured data.
- **SQL Client**: Such as MySQL Workbench or DBeaver.
- **MongoDB Compass**: A graphical user interface for MongoDB.

### Exercise Steps

::::exercise
**Objective**: Compare the effectiveness of MySQL and MongoDB for different data types and workloads.

**Step 1: Set Up Databases**
1. **Install MySQL and MongoDB** if you haven't already. Follow the official documentation for installation:
   - [MySQL Installation Guide](https://dev.mysql.com/doc/refman/8.0/en/installing.html)
   - [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Create a MySQL Database**:
   - Launch your SQL client and connect to your MySQL server.
   - Create a database and a table for structured data:
     ```sql
     CREATE DATABASE analytics_demo;
     USE analytics_demo;
     CREATE TABLE customers (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100),
       email VARCHAR(100),
       signup_date DATE
     );
     ```

3. **Create a MongoDB Database**:
   - Open MongoDB Compass and connect to your MongoDB server.
   - Create a new database named `analytics_demo` and a collection named `reviews`.

**Step 2: Insert Data**
1. **Insert Structured Data into MySQL**:
   ```sql
   INSERT INTO customers (name, email, signup_date) VALUES
   ('Alice Johnson', 'alice@example.com', '2023-01-15'),
   ('Bob Smith', 'bob@example.com', '2023-02-10'),
   ('Charlie Brown', 'charlie@example.com', '2023-03-05');
   ```

2. **Insert Unstructured Data into MongoDB**:
   - In the `reviews` collection, insert documents using the following JSON format:
     ```json
     { "user": "Alice Johnson", "feedback": "Great service!", "rating": 5, "date": "2023-01-16" }
     { "user": "Bob Smith", "feedback": "Average experience.", "rating": 3, "date": "2023-02-11" }
     { "user": "Charlie Brown", "feedback": "Will not return.", "rating": 1, "date": "2023-03-06" }
     ```

**Step 3: Query Data**
1. **Query Structured Data with SQL**:
   - Find all customers who signed up in 2023:
     ```sql
     SELECT * FROM customers WHERE signup_date >= '2023-01-01';
     ```

2. **Query Unstructured Data with MongoDB**:
   - Find all reviews with a rating greater than 3:
     ```json
     db.reviews.find({ "rating": { "$gt": 3 } })
     ```

**Step 4: Analyze Trade-offs**
- **Consistency vs. Availability**:
  - MySQL offers strong consistency for transactions, making it ideal for applications requiring data accuracy.
  - MongoDB provides high availability and can scale horizontally, suitable for handling large volumes of unstructured data.

- **Use Case Evaluation**:
  - For structured data and complex queries, MySQL is typically preferred.
  - For flexible schemas and rapid, scalable data handling, MongoDB is advantageous.

::::

### Conclusion

Through this exercise, you have practically engaged with MySQL and MongoDB, understanding the strengths and trade-offs of each system. Remember, the choice of database should align with your specific analytics problem, considering factors like data structure, scale, and consistency requirements. As you continue to explore the modern data ecosystem, keep in mind that the right technology choice can significantly impact your analytics outcomes.

:::callout
**Real-World Application**: Companies like Netflix use a combination of databases, such as MySQL for billing and MongoDB for content metadata, to optimize for performance and reliability.
:::