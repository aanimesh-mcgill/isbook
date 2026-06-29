---
title: Hands-on Demo
section: "3.7"
order: 7
slug: hands-on-demo
status: draft
learningObjectives:
  - Explore different database systems through a practical lab exercise
  - Understand the suitable analytics use cases for each database type
  - Gain hands-on experience with SQL and NoSQL queries
keywords:
  - database systems
  - SQL
  - NoSQL
  - analytics
  - AI integration
estimatedReadingTime: 90
researchStreams:
  - database evolution
  - SQL vs NoSQL
  - AI and databases
---

# Section 3.7: Hands-on Demo

This hands-on demo provides a practical exploration of various database systems, allowing analytics professionals to grasp the nuances of each technology and how they can be applied to solve real-world analytics problems.

## Exercise Overview

In this lab, you will interact with three different database systems: a Relational Database Management System (RDBMS) using MySQL, a NoSQL database using MongoDB, and a graph database using Neo4j. The goal is to understand the strengths and trade-offs of each system in handling analytics tasks.

### Scenario

Imagine you're working for a cutting-edge streaming service like Netflix. Your task is to design a system that efficiently handles user data, viewing histories, and recommendation algorithms, integrating various types of databases.

## Lab Setup

Before you begin, ensure you have the following tools installed:

- **MySQL** for RDBMS tasks
- **MongoDB** for NoSQL tasks
- **Neo4j** for graph database tasks

You can use cloud services if local installation isn't feasible, such as AWS RDS for MySQL, MongoDB Atlas, and Neo4j Aura.

### Step 1: Relational Database with MySQL

:::exercise
**Objective**: Store and query user profiles and viewing history.

1. **Create a MySQL Database**  
   Launch your MySQL instance and create a database named `streaming_service`.

   ```sql
   CREATE DATABASE streaming_service;
   ```

2. **Create Tables**  
   Define tables for `users` and `viewing_history`.

   ```sql
   CREATE TABLE users (
       user_id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255),
       signup_date DATE
   );

   CREATE TABLE viewing_history (
       history_id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT,
       movie_title VARCHAR(255),
       view_date DATE,
       FOREIGN KEY (user_id) REFERENCES users(user_id)
   );
   ```

3. **Insert Data**  
   Populate your tables with sample data.

   ```sql
   INSERT INTO users (username, signup_date) VALUES ('john_doe', '2023-01-15');
   INSERT INTO viewing_history (user_id, movie_title, view_date) VALUES (1, 'Inception', '2023-02-20');
   ```

4. **Query Data**  
   Retrieve the viewing history for a specific user.

   ```sql
   SELECT movie_title, view_date FROM viewing_history WHERE user_id = 1;
   ```
:::

### Step 2: NoSQL Database with MongoDB

:::exercise
**Objective**: Store and retrieve complex data structures with flexibility.

1. **Create a MongoDB Collection**  
   Use MongoDB to store user preferences and their complex nested structures.

   ```javascript
   use streaming_service;

   db.users.insertOne({
       username: "jane_smith",
       preferences: {
           genres: ["Sci-Fi", "Drama"],
           notifications: true
       }
   });
   ```

2. **Query Data**  
   Fetch user preferences based on username.

   ```javascript
   db.users.find({ username: "jane_smith" });
   ```
:::

### Step 3: Graph Database with Neo4j

:::exercise
**Objective**: Model and query relationships between users and movies.

1. **Create a Graph Model**  
   Use Neo4j to model users and their viewed movies as nodes and relationships.

   ```cypher
   CREATE (u:User {name: 'alice'}),
          (m:Movie {title: 'Matrix'}),
          (u)-[:VIEWED]->(m);
   ```

2. **Query Relationships**  
   Find all movies viewed by a specific user.

   ```cypher
   MATCH (u:User {name: 'alice'})-[:VIEWED]->(m:Movie)
   RETURN m.title;
   ```
:::

## Conclusion

Each database technology offers unique strengths and trade-offs for analytics tasks. MySQL provides structured data handling and ACID compliance, MongoDB offers flexibility for complex and evolving data structures, while Neo4j excels at managing and querying intricate relationships. Understanding these differences helps you select the right tool for specific analytics problems. As AI continues to evolve, integrating these systems effectively will be crucial for deriving meaningful insights and competitive advantage.

:::callout
As you complete this lab, consider how Netflix might leverage these database systems to enhance its recommendation algorithms and user experience. The ability to choose the right database for the right task is a critical skill for any analytics professional in the AI era.
:::