---
title: Hands-on Demo
section: "2.7"
order: 7
slug: hands-on-demo
status: draft
learningObjectives:
  - Understand the practical application of different database types
  - Execute SQL and NoSQL queries for analytics use cases
  - Evaluate database effectiveness for AI data integration
keywords:
  - database types
  - SQL
  - NoSQL
  - data analytics
  - AI integration
estimatedReadingTime: 45 minutes
researchStreams:
  - database management
  - analytics pipelines
  - AI training data
---

# Hands-on Demo

In this practical exercise, we'll explore how different database systems handle various data types and how they fit into analytics workflows. This demo will give you hands-on experience with MySQL for structured data, MongoDB for semi-structured data, and Neo4j for unstructured data relationships. By the end of this session, you'll understand which database is best suited for specific analytics and AI use cases.

## Tools Required

- MySQL: For managing structured data.
- MongoDB: For handling semi-structured data.
- Neo4j: For exploring unstructured data relationships.
- Sample datasets (provided in the lab).

## Scenario Overview

Imagine you are an analytics professional at a company like Netflix, tasked with analyzing customer behavior. You need to understand subscription transactions (structured), user interaction logs (semi-structured), and social media relationships (unstructured). Let's dive into how each database type can help.

## Step 1: Working with Structured Data in MySQL

First, let's explore structured transaction data using MySQL.

### Setup MySQL

Ensure your MySQL server is running and accessible. Download the `transactions.sql` dataset from the lab resources.

### Import Data

```sql
mysql -u root -p
CREATE DATABASE netflix_data;
USE netflix_data;
SOURCE /path/to/transactions.sql;
```

### Query Transactions

Let's analyze subscription patterns.

```sql
SELECT plan_type, COUNT(*) as subscribers
FROM subscriptions
GROUP BY plan_type
ORDER BY subscribers DESC;
```

:::exercise
- **Objective:** Identify the most popular subscription plan.
- **Task:** Modify the query to include average revenue per plan.
:::

## Step 2: Exploring Semi-Structured Data with MongoDB

Next, we'll analyze user interaction logs with MongoDB.

### Setup MongoDB

Start your MongoDB server and import the `user_logs.json` dataset.

### Import Data

```shell
mongoimport --db netflix_logs --collection user_interactions --file /path/to/user_logs.json --jsonArray
```

### Analyze Interaction Logs

```javascript
db.user_interactions.aggregate([
  { $match: { action: "play" } },
  { $group: { _id: "$device", totalPlays: { $sum: 1 } } },
  { $sort: { totalPlays: -1 } }
]);
```

:::exercise
- **Objective:** Determine the most commonly used devices for streaming.
- **Task:** Extend the aggregation to filter logs by a specific date range.
:::

## Step 3: Visualizing Unstructured Data Relationships with Neo4j

Finally, let's map social media relationships using Neo4j.

### Setup Neo4j

Ensure you have Neo4j running and import the `social_media.graphml` dataset.

### Import Data

```shell
CALL apoc.import.graphml('/path/to/social_media.graphml', {batchSize: 10000, useTypes: true});
```

### Analyze Social Network

```cypher
MATCH (u1:User)-[:FOLLOWS]->(u2:User)
RETURN u1.name AS Follower, u2.name AS Followed
LIMIT 10;
```

:::exercise
- **Objective:** Identify key influencers in the network.
- **Task:** Use graph algorithms to find users with the highest centrality.
:::

## Conclusion

By completing this hands-on demo, you've gained practical experience with MySQL, MongoDB, and Neo4j, understanding their strengths for different data types in analytics. You can now better evaluate which database technology is best suited for your specific analytics and AI data needs.

::checklist
- Have you executed queries across all three databases?
- Did you understand the trade-offs of each database type?
- Are you able to determine the optimal database for a given problem?
::