---
title: Instructor Notes
section: "1.13"
order: 13
slug: instructor-notes
status: draft
learningObjectives:
  - Understand the role of databases in supporting AI applications
  - Differentiate between structured and unstructured data in analytics
  - Apply the CAP theorem to real-world scenarios
keywords:
  - databases
  - AI
  - vector databases
  - CAP theorem
  - structured data
  - unstructured data
estimatedReadingTime: 15 minutes
researchStreams:
  - database systems
  - analytics
  - AI integration
---

## Instructor Notes

In this section, we provide guidance for instructors to effectively teach the importance of databases in the AI era, focusing on practical applications and real-world scenarios. This chapter aims to help students grasp why databases remain indispensable despite the rise of AI technologies like large language models (LLMs).

### Teaching Tips

- **Start with Real-world Cases:** Begin your lecture by discussing how Amazon leverages multiple databases — DynamoDB for high-velocity transactions, Aurora for relational data, and Redshift for analytical queries. This sets the stage for students to see the diversity and specificity of database applications in large enterprises.

- **Highlight Vector Databases with RAG:** Explain why ChatGPT utilizes vector databases for retrieval-augmented generation (RAG). Use this to illustrate how AI models require specialized databases to manage and retrieve unstructured data efficiently.

- **Structured vs. Unstructured Data:** Use practical examples to differentiate between structured and unstructured data. For example, transactional data from e-commerce is structured, whereas customer reviews are unstructured. Discuss how each type fits into an analytics pipeline.

- **Emphasize CAP Theorem:** Facilitate discussions on the trade-offs in distributed systems, particularly focusing on the CAP theorem. Use scenarios where consistency might be preferred over availability and vice versa, such as financial transactions vs. social media timelines.

### Lab Timing

- **Introduction to Databases (30 minutes):** Cover the evolution of enterprise data and the role of databases in modern AI applications.
  
- **Hands-on SQL Exercise (45 minutes):** Provide a SQL lab where students can query a mock database, focusing on structured data retrieval. Include a comparison with NoSQL operations for unstructured data.

- **CAP Theorem Workshop (45 minutes):** Conduct a workshop where students analyze different distributed systems through the lens of the CAP theorem. Use breakout sessions for group discussions.

### Common Student Misconceptions

- **"AI Will Replace Databases":** Some students may think AI models can supplant databases. Clarify that while AI can process vast datasets, databases are crucial for efficient data management, retrieval, and storage.

- **"One Database Fits All":** Students might assume a single type of database can handle all data needs. Use Amazon's database ecosystem to illustrate the importance of using the right tool for specific tasks.

- **"Unstructured Data Can't Be Queried":** Address the misconception that unstructured data cannot be queried effectively. Introduce technologies like Elasticsearch and vector databases that enable powerful querying capabilities.

:::exercise
**Exercise: Database Selection for AI Applications**

1. Present a hypothetical company scenario where the team needs to choose a database system for a new AI-driven analytics platform.
2. Have students work in groups to decide on a database strategy, considering factors like data type, query requirements, and scalability.
3. Each group presents their decision and reasoning, highlighting trade-offs they considered.
:::

Instructors should stress the continuing relevance of databases and guide students to understand the nuanced decisions involved in selecting the right database technology for specific AI and analytics tasks.