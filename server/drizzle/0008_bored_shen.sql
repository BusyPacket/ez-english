CREATE TABLE `favorites` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`point_id` text NOT NULL,
	`point_title` text,
	`type` text NOT NULL,
	`stem` text NOT NULL,
	`choices` text,
	`answer` text NOT NULL,
	`analysis` text,
	`created_at` text NOT NULL
);
