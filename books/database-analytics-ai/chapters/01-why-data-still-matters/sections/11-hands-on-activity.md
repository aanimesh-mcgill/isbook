---
title: Hands-on Activity
section: "1.11"
order: 11
slug: hands-on-activity
status: published
learningObjectives:
  - Design and implement a database schema to support AI-driven customer personalization
  - Integrate disparate data sources into a unified data ecosystem
  - Evaluate the impact of data quality on AI model performance
keywords:
  - database integration
  - AI model performance
  - data quality
  - schema design
estimatedReadingTime: 60 minutes
researchStreams:
  - Enterprise Data Management
  - AI Integration
  - Data Quality
---

:::exercise

**Building a Unified Data Ecosystem for AI Personalization**

In this hands-on activity, you will step into the role of a data architect at Meridian Retail Group. Your task is to design and implement a database schema that supports the company's AI-driven customer personalization efforts. You'll integrate data from various sources, ensuring high quality and consistency to optimize AI model performance.

**Business Scenario:**

Meridian Retail Group aims to enhance its customer experience through personalized recommendations, powered by AI models. However, their current data ecosystem is fragmented, with customer data scattered across multiple databases. As the data architect, your challenge is to create a unified schema that consolidates this data, ensuring it is ready for AI processing.

**Data Sources:**

1. **Customer Transactions (MySQL):** Contains structured transactional data such as purchase history and payment details.
2. **Customer Feedback (MongoDB):** Stores unstructured data like reviews and comments.
3. **Sales Analytics (Snowflake):** Houses historical sales data for trend analysis.

**Your Task:**

1. **Design the Database Schema:**

   - **Schema Requirements:**
     - Consolidate customer data from MySQL and MongoDB into a unified structure.
     - Ensure compatibility with Snowflake to leverage historical sales data.
     - Include fields for customer ID, transaction details, feedback text, and sales metrics.

   - **Schema Design:**
     ```sql
     CREATE TABLE CustomerData (
       CustomerID INT PRIMARY KEY,
       TransactionID INT,
       PurchaseDate DATE,
       ProductID INT,
       Amount DECIMAL(10, 2),
       FeedbackText TEXT,
       SalesMetric DECIMAL(10, 2)
     );
     ```

2. **Integrate Data Sources:**

   - **Data Integration Strategy:**
     - Use ETL processes to extract data from MySQL and MongoDB, transform it to fit the new schema, and load it into a centralized data warehouse.
     - Ensure data consistency by standardizing formats and cleaning duplicate records.

   - **Sample ETL Steps:**
     ```sql
     -- Extract data from MySQL
     SELECT CustomerID, TransactionID, PurchaseDate, ProductID, Amount
     FROM MySQL_Transactions;

     -- Transform feedback data from MongoDB
     SELECT CustomerID, FeedbackText
     FROM MongoDB_Feedback
     WHERE FeedbackText IS NOT NULL;

     -- Load into CustomerData
     INSERT INTO CustomerData (CustomerID, TransactionID, PurchaseDate, ProductID, Amount, FeedbackText, SalesMetric)
     VALUES (?, ?, ?, ?, ?, ?, ?);
     ```

3. **Evaluate Data Quality:**

   - **Quality Assessment:**
     - Verify data accuracy by cross-checking with original sources.
     - Identify and resolve any inconsistencies or anomalies in the integrated data.

   - **Quality Check Example:**
     ```sql
     -- Check for duplicate Customer IDs
     SELECT CustomerID, COUNT(*)
     FROM CustomerData
     GROUP BY CustomerID
     HAVING COUNT(*) > 1;
     ```

4. **Reflect on AI Integration:**

   - **Reflection Questions:**
     - How does the new database schema improve data availability for AI models?
     - What challenges might arise from integrating unstructured feedback data?
     - How can data quality issues impact the effectiveness of AI-driven personalization?

**Deliverables:**

- A complete database schema design that integrates all customer-related data.
- A set of SQL queries demonstrating the ETL process and data quality checks.
- A reflection on the implications of your design for AI model performance.

By completing this exercise, you will gain practical experience in designing a data ecosystem that supports both traditional analytics and AI initiatives. This hands-on activity not only reinforces the concepts discussed in this chapter but also prepares you to tackle real-world data challenges in enterprise environments.

:::