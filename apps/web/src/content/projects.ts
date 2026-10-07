import type { Project } from '@portfolio/shared';

/** Resume-aligned projects; retained as the API's offline fallback. */
export const projectFixtures: Project[] = [
  {
    "title": "Budget Tracker",
    "status": "published",
    "sortOrder": 1,
    "summary": "ASP.NET MVC budget tracker with scaffolded CRUD screens, multi-column sorting, and delete confirmation dialogs.",
    "publishedAt": null,
    "slug": "budget-tracker",
    "tech": [
      "ASP.NET MVC",
      "Entity Framework Core",
      "SQLite",
      "JavaScript"
    ],
    "featured": true,
    "links": {},
    "coverImage": null,
    "body": "## Academic project · 2026\n\nA budget tracking application built with ASP.NET MVC, Entity Framework Core, and SQLite.\n\n## What I built\n\n- Scaffolded a data context and full create, read, update, and delete controller and views from an existing SQLite database using Entity Framework Core.\n- Added multi-column sorting on date, description, and amount.\n- Added JavaScript confirmation dialogs on delete actions.",
    "id": "0b8f4a3e-2222-4c01-9e1a-000000000001"
  },
  {
    "title": "Student Records Application",
    "status": "published",
    "sortOrder": 2,
    "summary": "Razor Pages application for student and academic records, with linked entities, sortable indexes, aggregate totals, and duplicate-key validation.",
    "publishedAt": null,
    "slug": "student-records",
    "tech": [
      "ASP.NET Razor Pages",
      "Entity Framework Core"
    ],
    "featured": true,
    "links": {},
    "coverImage": null,
    "body": "## Academic project · 2026\n\nA student records application built with ASP.NET Razor Pages and Entity Framework Core.\n\n## What I built\n\n- Built create, read, update, and delete pages for student and academic record entities, including a linked table joining the two.\n- Implemented sortable index pages with aggregate totals.\n- Added duplicate-key validation on entry forms.\n- Persisted sort state in the user session.",
    "id": "0b8f4a3e-2222-4c01-9e1a-000000000002"
  },
  {
    "title": "Task Manager",
    "status": "published",
    "sortOrder": 3,
    "summary": "Team-built Laravel and Livewire application with account access, personal task lists, due dates, priorities, and customisable list ordering and colour.",
    "publishedAt": null,
    "slug": "task-manager",
    "tech": [
      "Laravel",
      "Livewire",
      "Git",
      "GitHub"
    ],
    "featured": true,
    "links": {},
    "coverImage": null,
    "body": "## Academic team project · 2026\n\nA team-built task management application using Laravel and Livewire.\n\n## What we built\n\n- User registration and login, with each user able to see and edit only their own task lists.\n- Tasks with due dates and priority levels.\n- Customisable list ordering and colour.\n- Database migrations with seed data.\n\n## Collaboration\n\nWe collaborated through a shared private GitHub repository using branches and pull requests.",
    "id": "0b8f4a3e-2222-4c01-9e1a-000000000003"
  },
  {
    "title": "Invoice Manager",
    "status": "published",
    "sortOrder": 4,
    "summary": "PHP invoicing application extended with PDF upload, in-browser document viewing, live client-side search, and PDO prepared statements.",
    "publishedAt": null,
    "slug": "invoice-manager",
    "tech": [
      "PHP",
      "PDO",
      "MySQL"
    ],
    "featured": true,
    "links": {},
    "coverImage": null,
    "body": "## Academic project · 2025\n\nExtensions to an existing invoicing application built with PHP, PDO, and MySQL.\n\n## What I added\n\n- PDF document upload and in-browser viewing.\n- A live client-side search filter.\n- PDO prepared statements for all database access.",
    "id": "0b8f4a3e-2222-4c01-9e1a-000000000004"
  }
];
