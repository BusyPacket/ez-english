CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text DEFAULT 'single' NOT NULL,
	`point_id` text NOT NULL,
	`point_title` text,
	`stem` text NOT NULL,
	`choices` text NOT NULL,
	`answer` text NOT NULL,
	`analysis` text,
	`created_at` text NOT NULL
);
