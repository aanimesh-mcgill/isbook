---
title: Discussion Questions
section: "4.11"
order: 11
slug: discussion-questions
status: draft
learningObjectives:
  - Analyze relational database design in real-world scenarios
  - Evaluate the trade-offs in relational modeling
  - Apply relational thinking to solve analytics problems
keywords:
  - relational databases
  - entity-relationship diagrams
  - primary keys
  - foreign keys
  - business constraints
estimatedReadingTime: 20 minutes
researchStreams:
  - relational modeling
  - database design
  - analytics architecture
---

# Discussion Questions

In this section, we present five questions designed to foster a deeper understanding of relational database design within the context of analytics. These questions are intended to provoke thought on the application of relational thinking to solve real-world problems, emphasizing the trade-offs and decisions analytics professionals face.

## Question 1: Understanding Relationships

Consider a fintech company that needs to model its customer interactions for enhanced fraud detection. Discuss the importance of understanding different types of relationships (1:1, 1:N, M:N) in the context of building a robust analytics database. How can these relationships help in identifying fraudulent patterns?

## Question 2: Keys and Constraints

Reflect on the role of primary keys, foreign keys, and composite keys in maintaining data integrity. How do these components enforce business rules and constraints in a database designed for customer analytics? Use examples from companies like Amazon or Netflix to illustrate your points.

## Question 3: Entity-Relationship Diagrams (ERD)

Sketch an ERD for a retail company that wants to analyze customer purchase behaviors and inventory levels. What entities, attributes, and relationships would you include? How does this visualization aid in translating business questions into an actionable database schema?

## Question 4: Mapping Business Questions

How would you map the following business question to a set of tables and joins in a relational database: "Which customers have the highest return rate and what products are most frequently returned?" Discuss the tables, keys, and relationships necessary to answer this question effectively.

:::exercise
**Exercise**: Design an ERD for a scenario where a bank wants to track loan applications and approvals. Consider how to represent the relationships between applicants, loans, and bank officers.
:::

## Question 5: Architecture Design

Discuss the architectural implications of choosing a relational database for analytics in a rapidly evolving AI landscape. How do trade-offs between consistency and availability (as outlined in the CAP theorem) impact the design of a database for a company like OpenAI? Consider the integration of AI technologies such as Retrieval-Augmented Generation (RAG) and vector databases.

:::ai
**AI Integration**: Explore how text-to-SQL technology can enhance the usability of relational databases for non-technical users in analytics roles. What are the potential benefits and limitations?
:::

By engaging with these questions, students will not only understand the theoretical aspects of relational database design but also appreciate its practical applications in solving real-world analytics problems. These discussions will prepare analytics professionals to make informed decisions on which database technology best fits their specific challenges.