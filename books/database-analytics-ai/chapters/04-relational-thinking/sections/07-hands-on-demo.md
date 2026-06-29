---
title: Hands-on Demo
section: "4.7"
order: 7
slug: hands-on-demo
status: draft
learningObjectives:
  - Understand the role of relational databases in solving analytics problems
  - Sketch a realistic ERD for a business scenario
  - Identify how relational models apply to enterprise solutions
keywords:
  - relational databases
  - ERD
  - analytics
  - primary keys
  - foreign keys
estimatedReadingTime: 20 minutes
researchStreams:
  - relational modeling
  - enterprise analytics
  - database design
---

# Hands-on Demo

In this section, we will guide you through a practical lab exercise to reinforce your understanding of relational modeling by designing an Entity-Relationship Diagram (ERD) for a hypothetical company. This exercise will demonstrate how relational databases underpin the analytics processes at major enterprises like Amazon and Netflix.

## Scenario

Imagine you are tasked with designing a database schema for a fintech company, FinTech Analytics, that provides customer analytics, order management, and fraud detection services. Your goal is to create an ERD that captures the relationships between customers, their orders, and potential fraud alerts. 

Before we dive in, remember that the core of relational thinking is understanding how entities, attributes, and their relationships map to the business questions you are trying to answer.

## Lab Exercise

### Tools Required

For this hands-on demo, you will use **MySQL Workbench** to sketch and visualize your ERD. Ensure you have it installed and set up on your workstation. While SQL syntax is not the focus here, MySQL Workbench will help you visualize your relational design.

### Step-by-Step Guide

:::exercise
1. **Identify the Entities**
   - **Customers**: Each customer has unique identification, contact information, and a history of orders.
   - **Orders**: Each order is linked to a customer and has details like order date, amount, and status.
   - **Fraud Alerts**: Each alert is associated with an order and contains data on the type of alert, severity, and resolution status.

2. **Define Attributes for Each Entity**
   - **Customers**: CustomerID (Primary Key), Name, Email, Phone, Address
   - **Orders**: OrderID (Primary Key), OrderDate, OrderAmount, CustomerID (Foreign Key)
   - **Fraud Alerts**: AlertID (Primary Key), AlertType, Severity, OrderID (Foreign Key), ResolutionStatus

3. **Establish Relationships**
   - A **Customer** can have many **Orders** (1:N relationship).
   - An **Order** can generate zero or more **Fraud Alerts** (1:N relationship).

4. **Sketch the ERD**
   - Use MySQL Workbench to create a new model.
   - Add tables for **Customers**, **Orders**, and **Fraud Alerts**.
   - Define the primary keys and link the tables using foreign keys based on the relationships identified.
   - Ensure all business rules and constraints are reflected in your design.

5. **Annotate Your ERD**
   - Clearly label primary and foreign keys.
   - Use annotations to explain the relationships and any assumptions made in your design.

6. **Discuss Trade-offs**
   - Consider the implications of your design on data consistency and availability, especially in the context of CAP theorem.
   - Discuss how this relational design supports analytics queries, such as identifying top customers or detecting fraudulent patterns.

7. **Reflection**
   - Reflect on how this exercise mirrors real-world scenarios at companies like Amazon, where customer data and order integrity are critical for analytics and operational decisions.
:::

## Conclusion

This hands-on exercise aimed to demystify the process of designing a relational database schema tailored for analytics. Understanding how to model data using entities and relationships is essential for any analytics professional seeking to leverage relational databases effectively. By mastering these skills, you can ensure that your analytics solutions are robust, scalable, and aligned with business requirements.

As you progress to the next chapter, we will delve into SQL syntax, enabling you to transform these diagrams into actionable queries. Until then, continue exploring how relational thinking applies to various analytics problems and how enterprises use these principles to drive decision-making.

Remember, the strength of relational databases lies in their ability to model complex relationships while maintaining data integrity — a key asset in the age of AI-driven analytics.