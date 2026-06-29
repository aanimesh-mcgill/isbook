---
title: AI Copilot Exercise
section: "2.9"
order: 9
slug: ai-copilot-exercise
status: draft
learningObjectives:
  - Understand the capabilities and limitations of AI copilots in generating SQL queries and database schemas.
  - Critically evaluate AI-generated database solutions for structured and semi-structured data.
  - Identify improvements and optimize AI-generated content for specific business use cases.
keywords:
  - AI Copilot
  - SQL generation
  - Database schema
  - Data analytics
  - AI integration
estimatedReadingTime: 20 minutes
researchStreams:
  - AI in Data Management
  - Natural Language Processing in SQL generation
---

# AI Copilot Exercise

In this section, we will explore how AI copilots, such as ChatGPT, Cursor, and GitHub Copilot, can assist in generating SQL queries, database schemas, or architecture designs. Our focus will be on critiquing and improving AI-generated outputs to ensure they meet real-world business requirements effectively.

The exercise is designed to give you hands-on experience with AI tools and to develop your critical thinking skills when evaluating automated solutions. Consider this a step toward mastering the art of selecting the right technology for the right problem in data analytics.

## Exercise: AI-Generated SQL Query

Let’s begin with a scenario involving a company like Netflix, which needs to analyze user viewing habits to improve recommendations. Imagine you ask an AI copilot to generate an SQL query that retrieves the top 10 most-watched movies in the last month.

:::exercise
**Prompt:** "Generate an SQL query to find the top 10 most-watched movies on Netflix in the last month."

```sql
SELECT movie_title, COUNT(*) AS watch_count
FROM viewing_history
WHERE watch_date >= DATEADD(month, -1, GETDATE())
GROUP BY movie_title
ORDER BY watch_count DESC
LIMIT 10;
```
:::

### Critique and Improvement

At first glance, this query seems functional, but let's critique and enhance it:

- **Date Logic:** The use of `DATEADD` with `GETDATE()` assumes the current system date is accurate and doesn't account for time zones or daylight savings. Consider using `CURRENT_TIMESTAMP` for SQL standards compliance or explicitly handling time zones.
- **Performance Considerations:** For large datasets, ensure that `viewing_history` is indexed on `watch_date` and `movie_title` to optimize performance.
- **Business Logic:** Verify that the dataset excludes trials or promotional views if such differentiation exists. Adjust by adding conditions or joins as necessary.

Let's refine the query:

```sql
SELECT movie_title, COUNT(*) AS watch_count
FROM viewing_history
WHERE watch_date >= CURRENT_DATE - INTERVAL '1 month'
AND view_type = 'standard' -- Assuming 'view_type' differentiates between standard and promotional views
GROUP BY movie_title
ORDER BY watch_count DESC
LIMIT 10;
```

## Exercise: AI-Generated Database Schema

Now, consider a scenario where an AI copilot is tasked with generating a database schema for an IoT company like Amazon that collects sensor data from smart devices.

:::exercise
**Prompt:** "Generate a database schema for storing IoT sensor data."

```sql
CREATE TABLE sensors (
    sensor_id INT PRIMARY KEY,
    sensor_name VARCHAR(255),
    sensor_type VARCHAR(100)
);

CREATE TABLE sensor_data (
    data_id INT PRIMARY KEY,
    sensor_id INT,
    data_timestamp TIMESTAMP,
    data_value FLOAT,
    FOREIGN KEY (sensor_id) REFERENCES sensors(sensor_id)
);
```
:::

### Critique and Improvement

Let’s evaluate this schema for its adequacy and suggest improvements:

- **Scalability Concerns:** The schema needs to handle potentially billions of records. Consider partitioning `sensor_data` by time or sensor type.
- **Data Integrity:** Ensure that data types are appropriate; for example, `FLOAT` may not provide sufficient precision for all sensor readings. Consider `DECIMAL` or `DOUBLE PRECISION` based on use case.
- **Metadata and Context:** Add columns for metadata like `location_id` or `device_id` if sensors are part of larger systems.

Refined schema:

```sql
CREATE TABLE sensors (
    sensor_id INT PRIMARY KEY,
    sensor_name VARCHAR(255),
    sensor_type VARCHAR(100),
    location_id INT,
    device_id VARCHAR(100)
);

CREATE TABLE sensor_data (
    data_id BIGINT PRIMARY KEY,
    sensor_id INT,
    data_timestamp TIMESTAMP WITH TIME ZONE,
    data_value DECIMAL(10, 3),
    FOREIGN KEY (sensor_id) REFERENCES sensors(sensor_id)
) PARTITION BY RANGE (data_timestamp);
```

## Conclusion

Through these exercises, you have engaged with AI copilots to generate SQL queries and database schemas, critically assessed their output, and identified areas for improvement. This practice is essential in ensuring that AI-generated solutions align with specific business contexts and performance expectations. As AI technologies continue to evolve, your ability to evaluate and refine automated solutions will remain a critical skill in the data analytics landscape.