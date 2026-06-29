---
title: AI Copilot Exercise
section: "1.9"
order: 9
slug: ai-copilot-exercise
status: draft
learningObjectives:
  - Develop the ability to critically evaluate AI-generated database solutions.
  - Understand the strengths and limitations of AI tools like ChatGPT and Copilot in database design.
  - Enhance skills in optimizing AI-generated SQL queries for performance.
keywords:
  - AI Copilot
  - SQL
  - database architecture
  - AI evaluation
  - analytics optimization
estimatedReadingTime: 25 minutes
researchStreams:
  - AI integration in databases
  - Database design and optimization
---

# AI Copilot Exercise

Artificial Intelligence tools such as ChatGPT and GitHub Copilot have revolutionized the way we interact with databases. These tools can assist in generating SQL queries, suggesting schema designs, and even proposing database architectures. However, it's crucial for analytics professionals to understand the trade-offs and limitations of these AI-generated solutions. This section provides a practical exercise to hone your skills in critically evaluating and improving AI-generated database solutions.

## Exercise 1: SQL Query Generation

Let's begin by using an AI copilot to generate a SQL query. Suppose we have a simple database with two tables: `customers` and `orders`. We want to find the total number of orders placed by each customer in the last month.

:::exercise
**Task:** Use an AI tool like ChatGPT or GitHub Copilot to generate an SQL query to retrieve the total number of orders placed by each customer in the last month.

**Prompt to AI Copilot:** 
"Generate an SQL query to find the total number of orders placed by each customer in the last month from tables `customers` and `orders`."

**AI-Generated SQL:**
```sql
SELECT c.customer_id, COUNT(o.order_id) AS total_orders
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
GROUP BY c.customer_id;
```
:::

### Critique and Improvement

While the AI-generated query is functional, it may not be optimized for performance or accuracy in a production environment. Let's evaluate and improve it.

- **Performance Considerations:** The AI-generated query uses `DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`, which is calculated for every row. Instead, we can calculate this date once and use a parameter or a variable if the database supports it.

- **Accuracy Concerns:** Ensure that the `order_date` field is indexed to improve query performance, especially for large datasets.

**Optimized SQL:**
```sql
SET @last_month := DATE_SUB(CURDATE(), INTERVAL 1 MONTH);

SELECT c.customer_id, COUNT(o.order_id) AS total_orders
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= @last_month
GROUP BY c.customer_id;
```

## Exercise 2: Database Schema Design

In this exercise, we will ask an AI copilot to suggest a database schema for a new e-commerce application.

:::exercise
**Task:** Use an AI tool to generate a basic schema design for an e-commerce platform.

**Prompt to AI Copilot:** 
"Create a database schema for an e-commerce platform with tables for `products`, `customers`, `orders`, and `order_items`."

**AI-Generated Schema:**
```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    stock INT
);

CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    address TEXT
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
```
:::

### Critique and Improvement

The AI-generated schema provides a reasonable starting point but can be enhanced for scalability and data integrity.

- **Normalization:** Ensure the schema adheres to normalization principles to reduce redundancy and improve data integrity. For example, consider splitting the `customers` table to handle multiple addresses.
  
- **Indexes:** Add indexes to frequently queried fields like `email` in `customers` and `product_id` in `order_items` to improve query performance.

- **Data Types:** Review data types to ensure they are appropriate for the expected data volumes. For instance, consider using `BIGINT` for primary keys if you anticipate a large dataset.

**Improved Schema:**
```sql
CREATE TABLE products (
    product_id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    stock INT,
    INDEX (name)
);

CREATE TABLE customers (
    customer_id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    INDEX (email)
);

CREATE TABLE orders (
    order_id BIGINT PRIMARY KEY,
    customer_id BIGINT,
    order_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
    order_item_id BIGINT PRIMARY KEY,
    order_id BIGINT,
    product_id BIGINT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
```

## Conclusion

While AI copilot tools can provide a solid foundation for SQL queries and database schema designs, it's essential for analytics professionals to critically evaluate and refine these outputs. Understanding the nuances of database performance, normalization, and indexing can significantly enhance the quality and efficiency of your database solutions. Remember, AI is a tool, not a replacement for expertise.