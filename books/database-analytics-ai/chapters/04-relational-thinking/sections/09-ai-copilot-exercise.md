---
title: AI Copilot Exercise
section: "4.9"
order: 9
slug: ai-copilot-exercise
status: draft
learningObjectives:
  - Understand how AI tools can assist in generating database schema and SQL queries.
  - Develop skills to critically evaluate AI-generated database solutions.
  - Enhance relational thinking by identifying improvements in AI outputs.
keywords:
  - AI Copilot
  - SQL generation
  - Schema critique
  - Relational databases
  - Analytics
estimatedReadingTime: 25 minutes
researchStreams:
  - AI in database management
  - Relational database design
---

## Section 4.9: AI Copilot Exercise

In this section, we explore the utilization of AI tools like ChatGPT, Cursor, and Copilot to assist in generating SQL queries and database schemas. While AI can be an effective partner in designing databases, it is crucial to develop the skills to evaluate and refine its outputs to ensure they meet the specific needs of your analytics projects.

### AI Copilot in Action

Imagine you are tasked with designing a database schema for a fintech company like Stripe, focusing on customer analytics, order processing, and fraud detection. You decide to use an AI tool to generate an initial schema.

:::exercise
**Prompt Input to AI:**
"Generate a database schema for managing customers, orders, and fraud detection."

**AI Output:**

```sql
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100),
    DateOfBirth DATE
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATE,
    Amount DECIMAL(10, 2),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

CREATE TABLE FraudDetection (
    FraudID INT PRIMARY KEY,
    OrderID INT,
    FraudStatus VARCHAR(50),
    DetectionDate DATE,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);
```
:::

### Critique and Improvement

The AI-generated schema provides a solid starting point but requires critical evaluation and improvement:

- **Normalization**: The schema is in 1NF but can be further normalized. Consider splitting the `Customers` table if additional address or contact information is needed.

- **Data Types and Constraints**: Ensure that data types align with real-world data. For example, emails should have a UNIQUE constraint, and `FraudStatus` should be an ENUM or a separate reference table for predefined statuses.

- **Business Rules**: The schema lacks the business rules necessary for fraud detection. Consider additional tables or fields for transaction velocity checks and customer risk scores.

- **Indexes**: Add indexes to fields often used in WHERE clauses, such as `OrderDate` and `FraudStatus`.

Let's refine the AI-generated schema with these improvements:

```sql
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    DateOfBirth DATE
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATE,
    Amount DECIMAL(10, 2),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    INDEX (OrderDate)
);

CREATE TABLE FraudStatus (
    StatusID INT PRIMARY KEY,
    StatusName VARCHAR(50)
);

CREATE TABLE FraudDetection (
    FraudID INT PRIMARY KEY,
    OrderID INT,
    FraudStatusID INT,
    DetectionDate DATE,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (FraudStatusID) REFERENCES FraudStatus(StatusID),
    INDEX (DetectionDate)
);
```

### Another AI Copilot Exercise

Consider a scenario at Netflix where you need to query user activity for personalized recommendations.

:::exercise
**Prompt Input to AI:**
"Write an SQL query to retrieve the most active users based on watch history."

**AI Output:**

```sql
SELECT UserID, COUNT(*) AS WatchCount
FROM WatchHistory
GROUP BY UserID
ORDER BY WatchCount DESC
LIMIT 10;
```
:::

### Evaluating the Query

- **Performance**: While the query efficiently retrieves the top 10 users, consider adding indexes on `UserID` for performance optimization.

- **Accuracy**: Ensure `WatchHistory` reflects all necessary data points, such as different user activities. If different activities should be weighted differently, adjust the query accordingly.

- **Scalability**: For large-scale datasets, consider partitioning strategies or distributed query engines.

By critically evaluating AI-generated outputs, analytics professionals can leverage AI as an effective tool while ensuring that the final database design and queries align with business needs and technical requirements.

---

By developing skills to critically engage with AI-generated database solutions, you can effectively integrate advanced relational databases into your analytics projects, optimizing for both performance and business relevance.