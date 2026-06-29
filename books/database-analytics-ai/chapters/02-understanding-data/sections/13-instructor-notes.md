---
title: Instructor Notes
section: "2.13"
order: 13
slug: instructor-notes
status: draft
learningObjectives:
  - Guide students to understand the diverse data types and their applications in analytics.
  - Identify common misconceptions about data types and their suitability for different analytics tasks.
  - Enhance student understanding of the trade-offs in selecting database technologies for AI-driven analytics.
keywords:
  - Structured Data
  - Semi-structured Data
  - Unstructured Data
  - AI in Analytics
  - Database Selection
estimatedReadingTime: 10 minutes
researchStreams:
  - Data Types in AI
  - CAP Theorem
  - Database Technologies
---

## Teaching Tips

When discussing data types in the AI era, emphasize the real-world applications and the considerations involved in selecting appropriate database technologies. Use examples from companies like Netflix and Amazon to illustrate how structured, semi-structured, and unstructured data play roles in their operations and analytics. 

### Lab Timing

Allocate approximately 60 minutes for the lab session. Start with a 15-minute overview of different data types and their characteristics. Follow this with a 30-minute hands-on exercise where students work with actual datasets — structured data in SQL databases, JSON documents in MongoDB, and unstructured data like images or text for AI applications. Conclude with a 15-minute discussion on the trade-offs in database technology selection.

### Common Student Misconceptions

- **Structured Data is Always Best:** Students often assume that structured data is the most reliable and versatile format for analytics. Clarify that while structured data is excellent for transactions and relational queries, semi-structured and unstructured data types can be more suitable for AI applications, such as natural language processing and image recognition.
  
- **One Database for All Needs:** Another misconception is that a single type of database can handle all types of data efficiently. Emphasize the importance of choosing the right database for the specific data type and analytics requirement. For example, MongoDB may be better for handling JSON-like documents, while Snowflake can efficiently process large-scale structured data for analytics.

- **AI Can Handle Any Data Without Preprocessing:** Students might believe that AI systems can directly consume any form of data without preprocessing. Highlight the importance of data cleaning, transformation, and integration steps in building effective AI models.

## Real World Examples

:::case
**Netflix:** Uses structured databases to manage subscriber data and semi-structured systems to handle user activity logs for personalized content recommendations.
:::

:::case
**OpenAI's GPT Models:** Rely on vast amounts of unstructured text data for training, requiring robust data preprocessing and vector databases to handle the complexity.
:::

## Checklist for Instructors

- [ ] Explain the characteristics and use cases of structured, semi-structured, and unstructured data.
- [ ] Provide industry examples to illustrate each data type.
- [ ] Discuss the CAP theorem and its implications in modern database systems.
- [ ] Highlight the importance of data preprocessing in AI applications.

## Recommended Exercises

:::exercise
**SQL Practice:** Have students write SQL queries to extract data from a relational database, illustrating the use of structured data in business analytics.
:::

:::exercise
**Document Store Exploration:** Assign a task where students use MongoDB to store and query JSON documents, simulating a real-world scenario of handling semi-structured data.
:::

## Conclusion

Instructing on the diversity of data types requires more than just technical knowledge; it demands an understanding of practical applications and the judicious selection of database technologies. By guiding students through these concepts with industry-relevant examples, you prepare them to make informed decisions in their analytics careers.