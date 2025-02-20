# About the project

Product Review App Complete <b> was inspired by </b> my habit of reviewing products for myself to better understand my
habits. In fact, I wrote my <b> BSc diploma work </b> about designing a product rating database server. This is the
underlying database structure that I am using for this application. I also wanted to build a complex project to
learn <b> React </b> and to showcase my skills in <i> Spring, relational database management systems and Java </i>.

## Underlying database structure functionality

The system in question allows for the evaluation of products based on various criteria, such as taste, packaging, color,
etc. Products can be food items, consumer goods, electronics, and so on.

The system maintains records of conceptual products, i.e., items that can be purchased as specific products in various
packaging options at stores. Each item has a brand and can be categorized, and the categories can be hierarchically
organized (main category and subcategories) up to a depth of 3. For example, a main category could be beverages, with
its subcategories being tea or coffee. Each category has characteristics (e.g., color, taste), and products belonging to
that category can have these characteristics. Additionally, every category can be evaluated based on certain criteria (
e.g., taste for the beverage category). Products belonging to a given category can be rated on a scale from 1 to 5 as
part of the product reviews, based on the criteria specific to the category, as well as inherited criteria from
higher-level categories. Product images can also be stored for each product. Each evaluation comes from an individual
and pertains to a specific product. Every data modification is logged in the system.

# Technical details

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Used technologies

The project uses React enhanced with Material UI, which allowed for the use of beautiful UI components, data-rich displays and an overall seamless user experience.