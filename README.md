# Agile Base Board

## Table of Contents
- [Introduction](#introduction)
- [How to Use](#how-to-use)
  - [Board Setup](#board-setup)
  - [Columns](#columns)
  - [Items](#items)
  - [Drag & Drop](#drag--drop)
  - [Export / Import](#export--import)
  - [Additional Features](#additional-features)
- [License and Attribution](#license-and-attribution)

## Introduction

**Agile Base Board** is a lightweight, web-based Kanban-style task management board designed to help you organize tasks efficiently.  
It allows you to create columns (e.g., To Do, In Progress, Done), add and edit items, reorder columns and items via drag-and-drop or touch, and manage your workflow visually.  
All changes are reflected in real-time, and the board can be exported or imported as a JSON file for backup, sharing, or migration purposes.

---

## How to Use

### Board Setup
1. **Board Title**  
   - Click on the board title to edit it.

### Columns
1. **Add Column**  
   - Click the **+ button** at the bottom-right corner.
   - Select **Column** from the menu.
   - A new column will appear, editable immediately.
2. **Edit Column Title**  
   - Click the column title to rename it.
3. **Delete Column**  
   - Click the trash can icon on a column header.
   - Confirm deletion in the modal. All items in that column will be removed.

### Items
1. **Add Item**  
   - Click the **+ button** and select **Item**, or double-click inside a column.
   - Type your task in the modal and click **Create**.
2. **Edit Item**  
   - Click on an item’s text to edit it inline.
3. **Delete Item**  
   - Click the trash can icon on the item.
   - Confirm deletion in the modal.

### Drag & Drop
- **Columns:** Drag a column header to reorder columns.
- **Items:** Drag items within or between columns to reorder or move tasks.
- **Touch support** is included for mobile and tablet users.

### Export / Import
1. **Export Board**  
   - Open the **sandwich menu** (top-left button).
   - Click **Export** to download your board as a JSON file.
   - The exported file preserves column order, item order, and board title.
2. **Import Board**  
   - Open the **sandwich menu** and click **Import**.
   - Select a previously exported JSON file.
   - The board will be rebuilt with all columns and items in the correct order.
3. **Import via GitHub raw url**
   - Add the *import* URL parameter e.g. www.agilebaseboard.com/?import = (raw URL to a JSON export file part of <u>publc github repo</u>)
   - Load the page with the parameter and this will import the JSON export.

### Additional Features
- **Help Button:** Opens the GitHub README for guidance.
- **GitHub Button:** Opens the project page on GitHub.
- **Responsive Design:** Works on desktop, tablet, and mobile devices.
- **Clear Button:** Clears all items and columns added from the user and resets the board to the inital load state. Note: if there is import via url parameter, the imported state is considered inital load state.

---

## License and Attribution

**Agile Base Board** is licensed under the [Apache 2.0 License](https://github.com/izapryanov/AgileBaseBoard/blob/main/LICENSE).  
Developed by [Ivan Zapryanov](https://www.linkedin.com/in/ivanzapryanov/).  

You are free to use, modify, and distribute this project in accordance with the terms of the license. Proper attribution to the original author is appreciated.