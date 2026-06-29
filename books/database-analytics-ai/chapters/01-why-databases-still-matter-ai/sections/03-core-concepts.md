---
title: Core Concepts
section: "1.3"
order: 3
slug: core-concepts
status: draft
learningObjectives:
  - Understand the role of databases in AI-driven analytics.
  - Differentiate between structured and unstructured data.
  - Recognize the trade-offs in database selection using CAP theorem.
keywords:
  - databases
  - AI
  - analytics
  - CAP theorem
  - structured data
  - unstructured data
estimatedReadingTime: 15 minutes
researchStreams:
  - database systems
  - AI in analytics
  - data management
---

## Core Concepts

In the age of AI, understanding core database concepts is essential to leveraging data for analytics. This section explores pivotal ideas that underpin the modern data ecosystem, emphasizing how databases remain integral to advanced analytics solutions.

### Data Structure: Structured vs. Unstructured

Data is the fuel of AI, but not all data is created equal. Structured data is organized in rows and columns, easily queried with SQL. Unstructured data, such as text, images, and videos, lacks a predefined format.

:::callout
**Insight:** Both types of data are crucial for analytics. Use structured data for traditional analytics and unstructured data to feed AI models like language models and image classifiers.
:::

Consider Netflix, which uses structured data to handle user accounts and billing, while its recommendation engine processes unstructured data from viewing patterns and user reviews.

### The CAP Theorem: Consistency, Availability, Partition Tolerance

The CAP theorem is a fundamental principle in distributed databases, stating you can achieve only two out of three guarantees at any time: Consistency, Availability, and Partition Tolerance.

- **Consistency:** Every read receives the most recent write.
- **Availability:** Every request receives a response, without guarantee it contains the most recent write.
- **Partition Tolerance:** The system continues to operate despite network partitions.

For example, Amazon DynamoDB prioritizes availability and partition tolerance, making it ideal for applications requiring high uptime.

:::callout
**Insight:** Choose your database based on the trade-offs you're willing to make. For high-transaction systems, prioritize availability. For financial systems, prioritize consistency.
:::

### AI and Vector Databases

AI applications, particularly those involving large language models (LLMs) like ChatGPT, often rely on vector databases. These databases store data as vectors, allowing efficient similarity searches crucial for AI-driven retrieval-augmented generation (RAG).

Imagine OpenAI using a vector database to quickly retrieve semantically similar documents, enhancing the capability of models like ChatGPT to provide relevant answers.

### SQL vs. NoSQL: Choosing the Right Tool

SQL databases excel at complex queries and transactions on structured data. NoSQL databases, such as MongoDB, offer flexibility with unstructured data and high scalability.

Here’s a simple SQL query to illustrate:

```sql
SELECT customer_name, total_orders
FROM orders
WHERE total_orders > 100;
```

This query efficiently retrieves structured data, a task less suited for NoSQL databases, which shine in scenarios requiring horizontal scaling and flexible schemas.

:::callout
**Insight:** Use SQL databases for structured, relational data and NoSQL databases for unstructured, rapidly changing data sets.
:::

### Evolution of the Data Ecosystem

The evolution from traditional files to relational databases, and now distributed and AI-native systems, reflects the changing landscape. Enterprises like Amazon use a diverse array of databases to meet various needs—DynamoDB for availability, Aurora for transactions, Redshift for analytics, and S3 for storage.

:::quote
"Choosing the right database is less about the technology itself, and more about understanding the problem it solves." — Analytics Professional
:::

As AI continues to shape the future of analytics, understanding these core concepts will empower you to select the right database solutions for your specific business challenges.